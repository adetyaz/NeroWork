<script lang='ts'>
  import { supabase } from '$lib/utils/supabaseClient.js';
  import { page } from '$app/state';
  import Toast from '$lib/components/ui/toast.svelte';
  import Dialog from '$lib/components/ui/Dialog.svelte';
  import TokenSelector from '$lib/components/TokenSelector.svelte';
  import TokenBalanceChecker from '$lib/components/TokenBalanceChecker.svelte';
  import GaslessIndicator from '$lib/components/GaslessIndicator.svelte';
  import { getSigner } from '$lib/utils/aaUtils';
  import { addNotification } from '$lib/utils/notifications.supabase';
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
  import { TokenSwapService } from '$lib/services/tokenSwapService.js';
  import { InvoicePaymentService } from '$lib/services/invoicePaymentService.js';
  import type { SwapQuote } from '$lib/services/tokenSwapService';
  import TokenConversionNotice from '$lib/components/TokenConversionNotice.svelte';
  import GasSponsorshipStatus from '$lib/components/GasSponsorshipStatus.svelte';
  import PaymentBreakdown from '$lib/components/PaymentBreakdown.svelte';
  import { API_KEY } from '$lib/config';
  import { onMount } from 'svelte';

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
    preferred_token?: string; // Token the freelancer prefers to receive
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
  let gasSponsorshipAvailable = $state(false);
  let currentClientAddress = $state('');
  let swapQuote = $state<SwapQuote | null>(null);
  let isLoadingQuote = $state(false);
  let isFavoriteClient = $state(false); // Track if client is a favorite (for fee waiver)
  let needsConversion = $derived(
    selectedToken && invoice?.preferred_token && 
    selectedToken.symbol !== invoice.preferred_token
  );
  const PLATFORM_WALLET = '0x99BD4BDD7A9c22E2a35F09A6Bd17f038D5E5eB87';
  
  const referralService = ReferralService.getInstance();
  const gasSponsorshipService = GasSponsorshipService.getInstance();
  const tokenSwapService = TokenSwapService.getInstance();
  const paymentService = InvoicePaymentService.getInstance();

  // Check gas sponsorship availability when client connects
  async function checkGasSponsorshipStatus() {
    try {
      if (!invoice || !currentClientAddress) return;
      
      const eligibility = await gasSponsorshipService.checkGasSponsorshipEligibility(
        invoice.user_address,
        currentClientAddress
      );
      
      gasSponsorshipAvailable = eligibility?.gas_sponsorship_enabled || false;
      console.log('Gas sponsorship available:', gasSponsorshipAvailable);
    } catch (error) {
      console.log('Could not check gas sponsorship:', error);
      gasSponsorshipAvailable = false;
    }
  }

  // Update current client address when wallet connects
  async function updateClientAddress() {
    try {
      const signer = await getSigner();
      currentClientAddress = await signer.getAddress();
      await checkGasSponsorshipStatus();
    } catch (error) {
      console.log('Could not get client address:', error);
      currentClientAddress = '';
      gasSponsorshipAvailable = false;
    }
  }

  // Get conversion quote when token selection changes
  async function updateConversionQuote() {
    if (!needsConversion || !selectedToken || !invoice?.preferred_token) {
      swapQuote = null;
      return;
    }

    isLoadingQuote = true;
    try {
      // Find the target token that the freelancer wants
      const { SUPPORTED_PAYMENT_TOKENS } = await import('$lib/types/tokens');
      const targetToken = SUPPORTED_PAYMENT_TOKENS.find(t => t.symbol === invoice?.preferred_token);
      
      if (!targetToken) {
        console.error('Target token not found:', invoice.preferred_token);
        swapQuote = null;
        return;
      }

      // Get swap quote
      const quote = await tokenSwapService.getSwapQuote(
        selectedToken,
        targetToken,
        invoice.amount.toString()
      );

      swapQuote = quote;
      console.log('Conversion quote:', quote);
    } catch (error) {
      console.error('Error getting conversion quote:', error);
      swapQuote = null;
    } finally {
      isLoadingQuote = false;
    }
  }

  // Watch for token selection changes to update conversion quote
  $effect(() => {
    updateConversionQuote();
  });
  
  // Load invoice data when component mounts
  onMount(async () => {
    await loadInvoice();
    console.log('Invoice loaded:', invoice);
  });

  function formatCurrency(amount: number) {
    if (selectedToken) {
      return `${amount} ${selectedToken.symbol}`;
    }
    return amount + ' NERO';
  }

  // Check if client is a favorite (for fee waiver)
  async function checkFavoriteClientStatus() {
    if (!invoice?.user_address || !invoice?.client_email) return false;
    
    try {
      console.log('Checking favorite client status:', {
        freelancerAddress: invoice.user_address,
        clientEmail: invoice.client_email
      });
      
      // Use the same check as the payment service uses
      const { data, error } = await supabase
        .from('favorite_clients')
        .select('*')
        .eq('freelancer_address', invoice.user_address.toLowerCase())
        .eq('client_email', invoice.client_email.toLowerCase().trim());
      
      if (error) {
        console.error('Error checking favorite client:', error);
        isFavoriteClient = false;
        return false;
      }
      
      if (data && data.length > 0) {
        console.log('Found favorite client match:', data[0]);
        isFavoriteClient = true;
        return true;
      } else {
        // Try with case-insensitive search
        const { data: fuzzyData } = await supabase
          .from('favorite_clients')
          .select('*')
          .eq('freelancer_address', invoice.user_address.toLowerCase())
          .ilike('client_email', `%${invoice.client_email.toLowerCase().trim()}%`);
        
        if (fuzzyData && fuzzyData.length > 0) {
          console.log('Found fuzzy match favorite client:', fuzzyData[0]);
          isFavoriteClient = true;
          return true;
        }
        
        console.log('No favorite client match found');
        isFavoriteClient = false;
        return false;
      }
    } catch (error) {
      console.error('Error in favorite client check:', error);
      isFavoriteClient = false;
      return false;
    }
  }

  async function openPayModal() {
    showPayModal = true;
    // Update client address and check gas sponsorship when opening payment modal
    await updateClientAddress();
    // Also check favorite client status
    await checkFavoriteClientStatus();
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

   
    isRejecting = true;

    try {
      if (!invoice) {
        toast = { open: true, message: 'Invoice data is missing.', success: false };
        return;
      }

      // Debug logging
      console.log('Rejecting invoice with reason:', rejectionReason.trim());
      console.log('Invoice ID:', invoice.id);

      // Prepare the clean reason string
      const cleanReason = rejectionReason.trim();

      // Update Supabase with rejection status - handle ID type properly
      console.log('Updating Supabase with rejection:', {
        id: invoice.id,
        id_type: typeof invoice.id,
        status: 'rejected',
        rejection_reason: cleanReason,
        reason_length: cleanReason.length
      });
      
      // Try to determine the correct ID type for the update query
      let updateQuery;
      const numericId = parseInt(invoice.id);
      if (!isNaN(numericId) && numericId.toString() === invoice.id.toString()) {
        console.log('Using numeric ID for update:', numericId);
        updateQuery = supabase.from('invoices').update({ 
          status: 'rejected',
          rejection_reason: cleanReason
        }).eq('id', numericId);
      } else {
        console.log('Using string ID for update:', invoice.id);
        updateQuery = supabase.from('invoices').update({ 
          status: 'rejected',
          rejection_reason: cleanReason
        }).eq('id', invoice.id);
      }
      
      const { data, error: supabaseError } = await updateQuery;

      console.log('Supabase update result:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('Detailed Supabase error:', supabaseError);
        throw new Error(`Failed to update invoice: ${supabaseError.message}`);
      }

      // Notify freelancer about rejection
      try {
        await addNotification({
          userWallet: invoice.user_address,
          type: 'invoice_rejected',
          message: `Invoice "${invoice.project_name}" was rejected by client. Reason: ${rejectionReason.trim()}`
        });
        console.log('Rejection notification sent to freelancer:', invoice.user_address);
      } catch (notificationError) {
        console.error('Failed to send rejection notification:', notificationError);
        // Don't fail the rejection for notification issues
      }

      // Update invoice status in-place with the cleaned reason
      invoice = { 
        ...invoice, 
        status: 'rejected', 
        rejection_reason: cleanReason
      };
      
      // Log the updated invoice object
      console.log('Updated invoice object with rejection reason:', {
        status: invoice.status,
        reason: invoice.rejection_reason,
        reason_length: invoice.rejection_reason?.length
      });
      
      // Reload invoice data from database to ensure we have the latest
      try {
        await loadInvoice();
        console.log('Invoice reloaded from DB after rejection:', {
          status: invoice?.status,
          reason: invoice?.rejection_reason,
          reason_length: invoice?.rejection_reason?.length  
        });
      } catch (reloadError) {
        console.error('Error reloading invoice:', reloadError);
      }
      
      toast = { open: true, message: 'Invoice has been rejected and freelancer has been notified.', success: true };
    } catch (err: any) {
      console.error('Rejection error:', err);
      toast = { open: true, message: 'Rejection failed: ' + (err.message || err), success: false };
    } finally {
       closeRejectModal();
      isRejecting = false;
    }
  }

  async function confirmPayNow() {
    closePayModal();
    isPaying = true;
    
    try {
      if (!invoice) {
        toast = { open: true, message: 'Invoice data is missing.', success: false };
        return;
      }

      if (!selectedToken) {
        toast = { open: true, message: 'Please select a payment token.', success: false };
        return;
      }

      // Check if token conversion is needed
      if (needsConversion) {
        console.log('Token conversion needed:', { from: selectedToken?.symbol, to: invoice.preferred_token });
        
        // Implement a fallback mechanism:
        // 1. Check if a valid swap quote is available
        if (swapQuote && swapQuote.valid) {
          console.log('Valid swap quote found, but swap functionality is not yet implemented');
        }
        
        // 2. Allow payment to proceed with the selected token as a fallback
        console.log('Using fallback payment method - direct payment without conversion');
        
        // 3. Set a warning toast but don't block the payment
        toast = { 
          open: true, 
          message: `Note: Paying with ${selectedToken.symbol} while freelancer prefers ${invoice.preferred_token}. Any conversion costs will be handled by the recipient.`, 
          success: true 
        };
        
        // Continue with payment process using the selected token
      }

      // Check favorite client status one more time
      const feeWaived = await checkFavoriteClientStatus();
      console.log(`Fee waiver for payment: ${feeWaived ? 'ENABLED' : 'DISABLED'}`);
      
      // Execute payment using the payment service
      const paymentResult = await paymentService.executePayment({
        invoice: {
          id: invoice.id,
          user_address: invoice.user_address,
          amount: invoice.amount,
          project_name: invoice.project_name,
          preferred_token: invoice.preferred_token,
          client_email: invoice.client_email // Include client email for favorite client check
        },
        selectedToken,
        platformWallet: PLATFORM_WALLET
      });

      if (paymentResult.success) {
        // Update invoice status in-place first
        invoice = { 
          ...invoice, 
          status: 'paid', 
          transaction_hash: paymentResult.transactionHash 
        };
        
        // Build a success message that includes token conversion info if needed
        let successMessage = `Payment successful! Paid with ${selectedToken.symbol}.`;
        
        // Add conversion message if needed
        if (needsConversion && invoice.preferred_token) {
          successMessage += ` The freelancer preferred ${invoice.preferred_token} and will handle any conversion.`;
        }
        
        // Add fee waiver message if applicable
        if (paymentResult.feeWaived) {
          successMessage += ' Platform fee was waived as you are a favorite client.';
        }
        
        // Add gas sponsorship message if applicable
        if (paymentResult.gasSponsorshipUsed) {
          successMessage += ' Gas fees were sponsored by the freelancer.';
        }
        
        toast = { 
          open: true, 
          message: successMessage, 
          success: true 
        };
        
        // Force reload the invoice from database to ensure we have the latest status
        try {
          await loadInvoice();
          console.log('Invoice reloaded after successful payment:', {
            status: invoice?.status,
            transaction_hash: invoice?.transaction_hash,
            paid_at: invoice?.paid_at
          });
        } catch (reloadError) {
          console.error('Error reloading invoice after payment:', reloadError);
        }
      } else {
        toast = { 
          open: true, 
          message: paymentResult.errorMessage || 'Payment failed', 
          success: false 
        };
      }

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
      toast = { open: true, message: 'No invoice ID provided', success: false };
      return;
    }

    try {
      console.log('Loading invoice with ID:', id);
      
      // Try to get the invoice by ID - use more detailed logging
      let invoiceData = null;
      let invoiceId: string | number = id;
      
      // Try to determine the correct ID type and query accordingly
      try {
        // Check if ID is numeric
        const numericId = parseInt(id);
        if (!isNaN(numericId) && numericId.toString() === id) {
          // Use integer ID
          console.log('Querying with integer ID:', numericId);
          const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', numericId)
            .single();
          
          if (error) {
            console.error('Error loading invoice with integer ID:', error);
          } else if (data) {
            console.log('Invoice loaded (as integer ID):', data);
            invoiceData = data;
          }
        } else {
          // Use string ID
          console.log('Querying with string ID:', id);
          const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            console.error('Error loading invoice with string ID:', error);
          } else if (data) {
            console.log('Invoice loaded (as string ID):', data);
            invoiceData = data;
          }
        }
      } catch (queryError) {
        console.error('Error in invoice query:', queryError);
      }
      
      // Process the loaded invoice data
      if (invoiceData) {
        invoice = invoiceData;
        
        // Load reminder history
        await loadReminderHistory(invoiceData.id);
        
        // Log rejection reason specifically if this is a rejected invoice
        if (invoiceData.status === 'rejected') {
          console.log('Rejection reason from DB:', {
            reason: invoiceData.rejection_reason,
            reason_length: invoiceData.rejection_reason?.length,
            reason_type: typeof invoiceData.rejection_reason
          });
          
          // Ensure the rejection_reason is properly set if it exists
          if (invoiceData.rejection_reason && invoice) {
            invoice.rejection_reason = invoiceData.rejection_reason.trim();
          }
        }
        
        return invoice;
      } else {
        console.error('No invoice data found with ID:', id);
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
    // Also update client address when component loads
    updateClientAddress();
  });

  onMount(() => {
    loadInvoice();
  });

  // Specialized function to just refresh the rejection reason
  async function refreshRejectionReason() {
    if (!invoice || !invoice.id) return;
    
    try {
      console.log('Refreshing rejection reason for invoice ID:', invoice.id);
      
      // Handle ID type properly for the query
      let query;
      const numericId = parseInt(invoice.id);
      if (!isNaN(numericId) && numericId.toString() === invoice.id.toString()) {
        console.log('Using numeric ID for refresh:', numericId);
        query = supabase
          .from('invoices')
          .select('rejection_reason, status')
          .eq('id', numericId)
          .single();
      } else {
        console.log('Using string ID for refresh:', invoice.id);
        query = supabase
          .from('invoices')
          .select('rejection_reason, status')
          .eq('id', invoice.id)
          .single();
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error refreshing rejection reason:', error);
        toast = { open: true, message: 'Failed to refresh rejection reason', success: false };
        return;
      }
      
      if (data) {
        console.log('Refreshed invoice data:', data);
        
        // Update the invoice object with fresh data (only if invoice exists)
        if (invoice) {
          invoice = {
            ...invoice,
            rejection_reason: data.rejection_reason,
            status: data.status
          };
        }
        
        if (data.rejection_reason) {
          toast = { open: true, message: 'Rejection reason updated', success: true };
        } else {
          toast = { open: true, message: 'No rejection reason found', success: false };
        }
      } else {
        console.log('No data returned from refresh query');
      }
    } catch (err) {
      console.error('Error in refreshRejectionReason:', err);
      toast = { open: true, message: 'Error refreshing rejection reason', success: false };
    }
  }
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
            
            <!-- Gas Sponsorship Status -->
            <GasSponsorshipStatus 
              {gasSponsorshipAvailable} 
              {currentClientAddress} 
            />
            
            <!-- Token Selection -->
            <div class="mb-6">
              <div class="block text-sm font-medium text-gray-700 mb-2">
                Payment Token
              </div>
              <TokenSelector />
              
              <!-- Token Conversion Notice -->
              <TokenConversionNotice 
                {selectedToken} 
                invoicePreferredToken={invoice?.preferred_token}
                {swapQuote}
                {isLoadingQuote}
              />
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
            <PaymentBreakdown 
              invoiceAmount={invoice.amount}
              {selectedToken}
              {gasSponsorshipAvailable}
              platformWallet={PLATFORM_WALLET}
              feeWaived={isFavoriteClient}
              clientEmail={invoice?.client_email}
            />

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
              {invoice.rejection_reason ? invoice.rejection_reason : 'No reason provided by the client.'}
            </p>
            {#if !invoice.rejection_reason}
              <div class="mt-2 text-xs text-red-600">
                <button 
                  class="underline hover:text-red-800" 
                  onclick={() => refreshRejectionReason()}
                >
                  Refresh to check for updated reason
                </button>
              </div>
            {/if}
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
