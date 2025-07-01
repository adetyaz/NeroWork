<script lang='ts'>
  import { supabase } from '$lib/utils/supabaseClient.js';
  import { page } from '$app/state';
  import Toast from '$lib/components/ui/toast.svelte';
  import Dialog from '$lib/components/ui/Dialog.svelte';
  import TokenSelector from '$lib/components/TokenSelector.svelte';
  import TokenBalanceChecker from '$lib/components/TokenBalanceChecker.svelte';
  import GaslessIndicator from '$lib/components/GaslessIndicator.svelte';
  import { getSigner } from '$lib/utils/aaUtils';
  import { addNotification } from '$lib/utils/notifications';
  import { selectedPaymentToken } from '$lib/stores/tokenStore';
  import { web3AuthStore } from '$lib/stores/web3AuthStore';
  import { paymasterService, paymasterStore } from '$lib/stores/paymasterStore';
  import { paymentReminderService } from '$lib/services/paymentReminderService';
  import type { PaymentOption } from '$lib/types/tokens';
  import type { PaymentReminder } from '$lib/types/reminders';
  import { ethers } from 'ethers';
  import jsPDF from 'jspdf';
  import { ReferralService } from '$lib/services/referralService.js';
  import { GasSponsorshipService } from '$lib/services/gasSponsorshipService.js';

  type Invoice = {
    id: string;
    project_name: string;
    user_address: string;
    client_name: string;
    client_email: string;
    created_at: string;
    project_description: string;
    amount: number;
    status: string; // 'pending', 'paid', 'rejected'
    transaction_hash?: string;
    paid_at?: string;
    rejected_at?: string;
    rejection_reason?: string;
    due_date?: string;
    reminder_enabled?: boolean;
    reminder_count?: number;
    last_reminder_sent?: string;
  };
  
  let invoice = $state<Invoice | null>(null);
  let reminderHistory = $state<PaymentReminder[]>([]);
  let showReminderHistory = $state(false);
  let isPaying = $state(false);
  let isRejecting = $state(false);
  let toast = $state({ open: false, message: '', success: false });
  let showPayModal = $state(false);
  let showRejectModal = $state(false);
  let rejectionReason = $state('');
  let selectedToken = $derived($selectedPaymentToken);
  const PLATFORM_WALLET = '0x99BD4BDD7A9c22E2a35F09A6Bd17f038D5E5eB87';
  
  const referralService = ReferralService.getInstance();
  const gasSponsorshipService = GasSponsorshipService.getInstance();

  function formatCurrency(amount: number) {
    if (selectedToken) {
      return `${amount} ${selectedToken.symbol}`;
    }
    return amount + ' NERO';
  }

  function openPayModal() {
    showPayModal = true;
  }
  function closePayModal() {
    showPayModal = false;
  }

  function openRejectModal() {
    showRejectModal = true;
    rejectionReason = '';
  }
  function closeRejectModal() {
    showRejectModal = false;
    rejectionReason = '';
  }

  async function confirmRejectInvoice() {
    if (!rejectionReason.trim()) {
      toast = { open: true, message: 'Please provide a reason for rejection.', success: false };
      return;
    }

    closeRejectModal();
    isRejecting = true;

    try {
      if (!invoice) {
        toast = { open: true, message: 'Invoice data is missing.', success: false };
        return;
      }

      // Debug logging
      console.log('Rejecting invoice with reason:', rejectionReason.trim());
      console.log('Invoice ID:', invoice.id);

      // Update Supabase with rejection status
      const { data, error: supabaseError } = await supabase.from('invoices').update({ 
        status: 'rejected',
        rejection_reason: rejectionReason.trim()
      }).eq('id', invoice.id);

      console.log('Supabase update result:', { data, error: supabaseError });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Notify freelancer about rejection
      addNotification({
        userWallet: invoice.user_address,
        type: 'invoice_rejected',
        message: `Invoice "${invoice.project_name}" was rejected by client. Reason: ${rejectionReason.trim()}`
      });

      // Update invoice status in-place
      invoice = { 
        ...invoice, 
        status: 'rejected', 
        rejection_reason: rejectionReason.trim()
      };
      
      toast = { open: true, message: 'Invoice has been rejected and freelancer has been notified.', success: true };
    } catch (err: any) {
      console.error('Rejection error:', err);
      toast = { open: true, message: 'Rejection failed: ' + (err.message || err), success: false };
    } finally {
      isRejecting = false;
    }
  }

  async function confirmPayNow() {
    closePayModal();
    isPaying = true;
    try {
      if (!invoice) {
        toast = { open: true, message: 'Invoice data is missing.', success: false };
        isPaying = false;
        return;
      }

      if (!selectedToken) {
        toast = { open: true, message: 'Please select a payment token.', success: false };
        isPaying = false;
        return;
      }

      const signer = await getSigner();
      let transactionHash = '';

      // Import token utilities
      const { checkSufficientBalance, checkAndApproveToken, ERC20_ABI } = await import('$lib/utils/tokenUtils');

      // 1. Check sufficient balance
      const balanceCheck = await checkSufficientBalance(signer, selectedToken, invoice.amount.toString());
      if (!balanceCheck.sufficient) {
        throw new Error(`Insufficient ${selectedToken.symbol} balance. You have ${balanceCheck.balance}, but need ${balanceCheck.required}`);
      }

      if (selectedToken.isNative) {
        // Native NERO payment
        const amountNero = ethers.utils.parseEther(invoice.amount.toString());
        const feeNero = ethers.utils.parseEther('0.2');
        
        // 1. Send to freelancer
        const tx1 = await signer.sendTransaction({
          to: invoice.user_address,
          value: amountNero
        });
        const receipt1 = await tx1.wait();
        transactionHash = receipt1.transactionHash;
        
        // 2. Send platform fee
        const tx2 = await signer.sendTransaction({
          to: PLATFORM_WALLET,
          value: feeNero
        });
        await tx2.wait();
      } else {
        // ERC-20 token payment
        if (!selectedToken.contractAddress) {
          throw new Error(`Missing contract address for ${selectedToken.symbol}`);
        }

        const tokenContract = new ethers.Contract(
          selectedToken.contractAddress,
          ERC20_ABI,
          signer
        );

        // Get token decimals
        const decimals = await tokenContract.decimals();
        const amount = ethers.utils.parseUnits(invoice.amount.toString(), decimals);
        const fee = ethers.utils.parseUnits('0.2', decimals); // Platform fee

        // 2. Check and approve token spending if needed
        const totalAmount = ethers.utils.formatUnits(amount.add(fee), decimals);
        await checkAndApproveToken(signer, selectedToken, await signer.getAddress(), totalAmount);

        // 3. Send to freelancer
        const tx1 = await tokenContract.transfer(invoice.user_address, amount);
        const receipt1 = await tx1.wait();
        transactionHash = receipt1.transactionHash;
        
        const tx2 = await tokenContract.transfer(PLATFORM_WALLET, fee);
        await tx2.wait();
      }

      // Update Supabase with payment status and transaction hash
      await supabase.from('invoices').update({ 
        status: 'paid',
        transaction_hash: transactionHash,
        paid_at: new Date().toISOString()
      }).eq('id', invoice.id);

      // Check and sponsor gas for client (if enabled by freelancer)
      try {
        const signerAddress = await signer.getAddress();
        // Estimate gas fee for this transaction (approximate)
        const estimatedGasFee = 0.001; // Rough estimate in NERO
        
        const gasSponsored = await gasSponsorshipService.sponsorGas(
          invoice.user_address, // freelancer (sponsor)
          signerAddress,       // client (being sponsored)
          transactionHash,
          estimatedGasFee,
          invoice.id
        );
        
        if (gasSponsored) {
          console.log('✅ Gas was sponsored by freelancer for this payment');
        }
      } catch (gasSponsorshipError) {
        console.log('Note: Gas sponsorship failed:', gasSponsorshipError);
        // Don't fail the payment for gas sponsorship issues
      }

      // Check and complete referrals for the freelancer (if they were referred)
      try {
        await referralService.checkAndCompleteReferrals(invoice.user_address);
      } catch (referralError) {
        console.log('Note: Referral check failed:', referralError);
        // Don't fail the payment for referral issues
      }

      // 4. Notify freelancer
      addNotification({
        userWallet: invoice.user_address,
        type: 'invoice_paid',
        message: `Invoice "${invoice.project_name}" was paid with ${selectedToken.symbol} by client.`
      });

      // Update invoice status in-place
      invoice = { ...invoice, status: 'paid', transaction_hash: transactionHash };
      toast = { open: true, message: `Payment successful! Paid with ${selectedToken.symbol}.`, success: true };
    } catch (err: any) {
      console.error('Payment error:', err);
      toast = { open: true, message: 'Payment failed: ' + (err.message || err), success: false };
    } finally {
      isPaying = false;
    }
  }

  async function loadInvoice() {
    const id = page.params.id;
    
    if (!id) {
      return;
    }

    try {
      // Try to get the invoice by ID
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', parseInt(id)) // Try parsing as integer first
        .single();
      
      if (data) {
        invoice = data;
        // Load reminder history for this invoice
        await loadReminderHistory(data.id);
        return;
      }
      
      // If that fails, try as string
      const { data: data2, error: error2 } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data2) {
        invoice = data2;
        // Load reminder history for this invoice
        await loadReminderHistory(data2.id);
      }
    } catch (err) {
      // Silent fail - just don't load the invoice
    }
  }

  async function loadReminderHistory(invoiceId: string) {
    try {
      reminderHistory = await paymentReminderService.getReminderHistory(invoiceId);
    } catch (error) {
      console.error('Error loading reminder history:', error);
      reminderHistory = [];
    }
  }

  function getReminderTypeLabel(type: string): string {
    switch (type) {
      case 'first': return 'First Reminder';
      case 'second': return 'Second Reminder'; 
      case 'final': return 'Final Notice';
      default: return 'Reminder';
    }
  }

  function getReminderTypeColor(type: string): string {
    switch (type) {
      case 'first': return 'bg-blue-100 text-blue-800';
      case 'second': return 'bg-yellow-100 text-yellow-800';
      case 'final': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function isOverdue(): boolean {
    if (!invoice?.due_date) return false;
    const now = new Date();
    const dueDate = new Date(invoice.due_date);
    return now > dueDate && invoice.status === 'pending';
  }

  function getDaysOverdue(): number {
    if (!invoice?.due_date) return 0;
    const now = new Date();
    const dueDate = new Date(invoice.due_date);
    return Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
  }

  async function exportToPDF() {
    if (!invoice) return;
    
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('INVOICE', 105, 30, { align: 'center' });
    
    // Add invoice details
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${invoice.id}`, 20, 50);
    pdf.text(`Project: ${invoice.project_name}`, 20, 60);
    pdf.text(`Client: ${invoice.client_name}`, 20, 70);
    pdf.text(`Client Email: ${invoice.client_email}`, 20, 80);
    pdf.text(`Amount: ${formatCurrency(invoice.amount)}`, 20, 90);
    pdf.text(`Status: ${invoice.status.toUpperCase()}`, 20, 100);
    pdf.text(`Created: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 110);
    
    if (invoice.paid_at) {
      pdf.text(`Paid: ${new Date(invoice.paid_at).toLocaleDateString()}`, 20, 120);
    }
    
    if (invoice.transaction_hash) {
      pdf.text(`Transaction Hash:`, 20, 130);
      pdf.setFontSize(10);
      pdf.text(invoice.transaction_hash, 20, 140);
      pdf.setFontSize(12);
    }
    
    // Add description
    pdf.text('Description:', 20, 160);
    pdf.setFontSize(10);
    const splitDescription = pdf.splitTextToSize(invoice.project_description, 170);
    pdf.text(splitDescription, 20, 170);
    
    // Add footer
    pdf.setFontSize(8);
    pdf.text('Generated by NeroWork - Web3 Freelance Platform', 105, 280, { align: 'center' });
    
    // Save the PDF
    pdf.save(`invoice-${invoice.project_name.replace(/\s+/g, '-').toLowerCase()}-${invoice.id.slice(0, 8)}.pdf`);
  }

  $effect(() => {
    loadInvoice();
  });
</script>

{#if invoice}
<div class="min-h-screen bg-gray-900 text-white p-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header Section -->
    <div class="flex justify-between items-start mb-12">
      <!-- Payment Section -->
      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-300 mb-2">Pay online</p>
          {#if invoice.status === 'paid'}
            <span class="text-green-400 font-bold">Paid</span>
            {#if invoice.transaction_hash}
              <div class="mt-2">
                <p class="text-xs text-gray-400 mb-1">Transaction:</p>
                <a 
                  href="https://testnet.neroscan.io/tx/{invoice.transaction_hash}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-400 hover:text-blue-300 text-xs underline break-all"
                >
                  {invoice.transaction_hash}
                </a>
              </div>
            {/if}
          {:else if invoice.status === 'rejected'}
            <span class="text-red-400 font-bold">Rejected</span>
            {#if invoice.rejected_at}
              <div class="mt-2">
                <p class="text-xs text-gray-400 mb-1">Rejected on:</p>
                <p class="text-xs text-gray-300">{new Date(invoice.rejected_at).toLocaleDateString()}</p>
                {#if invoice.rejection_reason}
                  <p class="text-xs text-gray-400 mb-1 mt-2">Reason:</p>
                  <p class="text-xs text-gray-300 italic">"{invoice.rejection_reason}"</p>
                {/if}
              </div>
            {/if}
          {:else}
            <div class="flex gap-3">
              <button 
                class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition" 
                onclick={openPayModal} 
                disabled={isPaying || isRejecting}
              >
                Pay Now
              </button>
              <button 
                class="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition" 
                onclick={openRejectModal} 
                disabled={isPaying || isRejecting}
              >
                Reject
              </button>
            </div>
          {/if}
        </div>
        <!-- PDF Export Button -->
        <div>
          <button class="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition flex items-center gap-2" onclick={exportToPDF}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Export PDF
          </button>
        </div>
        <!-- Dialog for payment breakdown -->
        <Dialog open={showPayModal} onClose={closePayModal}>
          <div class="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-6">Confirm Payment</h2>
            
            <!-- Gasless Status Indicator -->
            <div class="mb-4">
              <GaslessIndicator compact={false} showDetails={true} />
            </div>
            
            <!-- Token Selection -->
            <div class="mb-6">
              <div class="block text-sm font-medium text-gray-700 mb-2">
                Payment Token
              </div>
              <TokenSelector />
              {#if selectedToken?.gasless || $paymasterStore.isEnabled}
                <div class="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-green-800">Gasless transaction enabled!</p>
                      <p class="text-xs text-green-600">
                        {#if $paymasterStore.isFirstTimeUser}
                          First-time user bonus - no network fees
                        {:else if $paymasterStore.sponsorMode === 'FREE_GAS'}
                          Platform-sponsored transaction
                        {:else}
                          Gas fee paid with {$paymasterStore.selectedPaymentToken}
                        {/if}
                      </p>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Token Balance Check -->
            {#if selectedToken}
              <div class="mb-6">
                <TokenBalanceChecker 
                  amount={invoice.amount.toString()} 
                  onBalanceUpdate={(balance, sufficient) => {
                    // Could store this in state if needed for form validation
                  }}
                />
              </div>
            {/if}

            <!-- Payment Breakdown -->
            <div class="border border-gray-200 rounded-lg p-4 mb-6">
              <div class="mb-2 flex justify-between">
                <span>Invoice Amount:</span>
                <span class="font-medium">{formatCurrency(invoice.amount)}</span>
              </div>
              <div class="mb-2 flex justify-between">
                <span>Platform Fee:</span>
                <span class="font-medium">0.2 {selectedToken?.symbol || 'NERO'}</span>
              </div>
              {#if !($paymasterStore.isEnabled && $paymasterStore.sponsorMode === 'FREE_GAS')}
                <div class="mb-2 flex justify-between text-sm text-gray-600">
                  <span>Network Gas Fee:</span>
                  <span>~0.001 {selectedToken?.symbol || 'NERO'}</span>
                </div>
              {:else}
                <div class="mb-2 flex justify-between text-sm text-green-600">
                  <span>Network Gas Fee:</span>
                  <span class="line-through">~0.001 {selectedToken?.symbol || 'NERO'}</span>
                  <span class="ml-2 font-medium">FREE</span>
                </div>
              {/if}
              <hr class="my-2">
              <div class="flex justify-between font-bold text-lg">
                <span>Total to Pay:</span>
                <span>{formatCurrency(invoice.amount + 0.2)}</span>
              </div>
            </div>

            <!-- Platform wallet info -->
            <div class="mb-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p class="mb-1">Platform fee will be sent to:</p>
              <span class="font-mono text-gray-700">{PLATFORM_WALLET}</span>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-4">
              <button 
                type="button" 
                class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                onclick={confirmPayNow} 
                disabled={isPaying || !selectedToken}
              >
                {#if isPaying}
                  <div class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                {:else}
                  Confirm & Pay {selectedToken?.symbol || 'NERO'}
                {/if}
              </button>
              <button 
                type="button" 
                class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50" 
                onclick={closePayModal} 
                disabled={isPaying}
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
        
        <!-- Rejection Modal -->
        <Dialog open={showRejectModal} onClose={closeRejectModal}>
          <div class="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-6 text-red-600">Reject Invoice</h2>
            
            <div class="mb-6">
              <p class="text-sm text-gray-600 mb-4">
                You are about to reject this invoice. The freelancer will be notified and this action cannot be undone.
              </p>
              
              <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div class="text-sm text-gray-700">
                  <strong>Invoice:</strong> {invoice.project_name}
                </div>
                <div class="text-sm text-gray-700">
                  <strong>Amount:</strong> {formatCurrency(invoice.amount)}
                </div>
                <div class="text-sm text-gray-700">
                  <strong>Freelancer:</strong> {invoice.user_address.slice(0, 6)}...{invoice.user_address.slice(-4)}
                </div>
              </div>
              
              <label for="rejectionReason" class="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="rejectionReason"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                bind:value={rejectionReason}
                rows="4"
                placeholder="Please explain why you're rejecting this invoice (e.g., work not completed as agreed, quality issues, etc.)"
                disabled={isRejecting}
              ></textarea>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-4">
              <button 
                type="button" 
                class="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                onclick={confirmRejectInvoice} 
                disabled={isRejecting || !rejectionReason.trim()}
              >
                {#if isRejecting}
                  <div class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Rejecting...
                  </div>
                {:else}
                  Confirm Rejection
                {/if}
              </button>
              <button 
                type="button" 
                class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50" 
                onclick={closeRejectModal} 
                disabled={isRejecting}
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
      </div>
      <!-- Company Info -->
      <div class="text-right space-y-2">
        <h1 class="text-xl font-bold">{invoice.project_name}</h1>
        <p class="text-sm text-gray-300">{invoice.user_address}</p>
      </div>
    </div>
    <!-- Invoice Title and Number -->
    <div class="flex justify-between items-end mb-12">
      <h2 class="text-6xl font-light">Invoice</h2>
      <div class="text-right">
        <p class="text-2xl font-medium">{invoice.project_name}</p>
      </div>
    </div>
    <!-- Client and Invoice Details -->
    <div class="flex justify-between mb-12">
      <!-- Client Info -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">{invoice.client_name}</h3>
        <p class="text-sm text-gray-300">{invoice.client_email}</p>
      </div>
      <!-- Invoice Dates -->
      <div class="text-right space-y-2">
        <div>
          <span class="text-sm text-gray-300">INVOICE DATE:</span>
          <span class="ml-4">{new Date(invoice.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
    <!-- Invoice Items List -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-2">Invoice Details</h3>
      <ul class="divide-y divide-gray-700">
        <li class="py-2 flex justify-between items-center">
          <span class="flex-1">{invoice.project_description}</span>
          <span class="w-24 text-right font-bold">Amount: {formatCurrency(invoice.amount)}</span>
        </li>
      </ul>
    </div>
    <!-- Totals Section -->
    <div class="space-y-4">
      <div class="flex justify-end">
        <div class="w-80 space-y-3">
          <div class="flex justify-between py-2">
            <span class="text-gray-300">Sub total:</span>
            <span class="font-medium">{formatCurrency(invoice.amount)}</span>
          </div>
          <div class="flex justify-between py-4 border-t border-gray-700 text-lg font-semibold">
            <span>Amount due:</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status and Due Date Info -->
    {#if invoice.due_date}
      <div class="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Payment Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-400">Due Date:</span>
            <div class="text-white font-medium">{new Date(invoice.due_date).toLocaleDateString()}</div>
          </div>
          <div>
            <span class="text-gray-400">Status:</span>
            <div class="text-white font-medium">
              {#if isOverdue()}
                <span class="text-red-400">Overdue ({getDaysOverdue()} days)</span>
              {:else if invoice.status === 'paid'}
                <span class="text-green-400">Paid</span>
              {:else if invoice.status === 'rejected'}
                <span class="text-red-400">Rejected</span>
              {:else}
                <span class="text-yellow-400">Pending</span>
              {/if}
            </div>
          </div>
          <div>
            <span class="text-gray-400">Reminders:</span>
            <div class="text-white font-medium">
              {#if invoice.reminder_enabled}
                <span class="text-green-400">Enabled</span>
                {#if invoice.reminder_count && invoice.reminder_count > 0}
                  <span class="text-gray-400">({invoice.reminder_count} sent)</span>
                {/if}
              {:else}
                <span class="text-gray-400">Disabled</span>
              {/if}
            </div>
          </div>
        </div>

        <!-- Show rejection reason if invoice was rejected -->
        {#if invoice.status === 'rejected'}
          <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 class="text-sm font-medium text-red-800 mb-2">Rejection Reason</h4>
            <p class="text-sm text-red-700">
              {invoice.rejection_reason || 'No reason provided by the client.'}
            </p>
          </div>
        {/if}

        <!-- Reminder History Toggle -->
        {#if reminderHistory.length > 0}
          <div class="mt-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              class="text-blue-400 hover:text-blue-300 text-sm font-medium"
              onclick={() => showReminderHistory = !showReminderHistory}
            >
              {showReminderHistory ? 'Hide' : 'Show'} Reminder History ({reminderHistory.length})
            </button>
          </div>

          {#if showReminderHistory}
            <div class="mt-4 space-y-3">
              {#each reminderHistory as reminder}
                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="inline-flex px-2 py-1 rounded-full text-xs font-medium {getReminderTypeColor(reminder.reminder_type)}">
                      {getReminderTypeLabel(reminder.reminder_type)}
                    </span>
                    <span class="text-xs text-gray-400">
                      {new Date(reminder.sent_at).toLocaleDateString()} at {new Date(reminder.sent_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div class="text-sm text-gray-300">
                    <div class="font-medium mb-1">Subject: {reminder.subject}</div>
                    <div class="text-xs text-gray-400">Sent to: {reminder.email_sent_to}</div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>
  <Toast open={toast.open} status={toast.message} success={toast.success} error={false} />
</div>
{:else}
  <div class="text-center text-white p-10">Invoice not found.</div>
{/if}
