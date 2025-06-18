<script lang='ts'>
  import { supabase } from '$lib/utils/supabaseClient.js';
  import { page } from '$app/state';
  import Toast from '$lib/components/ui/toast.svelte';
  import Dialog from '$lib/components/ui/Dialog.svelte';
  import { getSigner } from '$lib/utils/aaUtils';
  import { addNotification } from '$lib/utils/notifications';
  import { ethers } from 'ethers';

  type Invoice = {
    id: string;
    project_name: string;
    user_address: string;
    client_name: string;
    client_email: string;
    created_at: string;
    project_description: string;
    amount: number;
    status: string;
  };
  
  let invoice = $state<Invoice | null>(null);
  let isPaying = $state(false);
  let toast = $state({ open: false, message: '', success: false });
  let showPayModal = $state(false);
  const PLATFORM_WALLET = '0x99BD4BDD7A9c22E2a35F09A6Bd17f038D5E5eB87';

  function formatCurrency(amount: number) {
    return amount + ' NERO';
  }

  function openPayModal() {
    showPayModal = true;
  }
  function closePayModal() {
    showPayModal = false;
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
      const signer = await getSigner();
      // Send native NERO (amount + 0.5 fee) to freelancer and platform
      const amountNero = ethers.utils.parseEther(invoice.amount.toString());
      const feeNero = ethers.utils.parseEther('0.5');
      // 1. Send to freelancer
      const tx1 = await signer.sendTransaction({
        to: invoice.user_address,
        value: amountNero
      });
      await tx1.wait();
      // 2. Send platform fee
      const tx2 = await signer.sendTransaction({
        to: PLATFORM_WALLET,
        value: feeNero
      });
      await tx2.wait();
      // 3. Update Supabase
      await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoice.id);
      // 4. Notify freelancer
      addNotification({
        userWallet: invoice.user_address,
        type: 'invoice_paid',
        message: `Invoice "${invoice.project_name}" was paid by client.`
      });
      // Update invoice status in-place
      invoice = { ...invoice, status: 'paid' };
      toast = { open: true, message: 'Payment successful! Funds sent.', success: true };
    } catch (err) {
      toast = { open: true, message: 'Payment failed: ' + (err), success: false };
    } finally {
      isPaying = false;
    }
  }

  async function loadInvoice() {
    const id = page.url.pathname.split('/').pop();
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    invoice = data ?? null;
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
          {:else}
            <button class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition" onclick={openPayModal} disabled={isPaying}>
              Pay Now
            </button>
          {/if}
        </div>
        <!-- Dialog for payment breakdown -->
        <Dialog open={showPayModal} onClose={closePayModal}>
          <div class="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Confirm Payment</h2>
            <div class="mb-2 flex justify-between"><span>Invoice Amount:</span><span>{formatCurrency(invoice.amount)}</span></div>
            <div class="mb-2 flex justify-between"><span>Platform Fee:</span><span>0.5 NERO</span></div>
            <div class="mb-4 flex justify-between font-bold text-lg"><span>Total to Pay:</span><span>{formatCurrency(invoice.amount + 0.5)}</span></div>
            <div class="mb-2 text-xs text-gray-500">0.5 NERO will be sent to platform wallet:<br><span class="font-mono">{PLATFORM_WALLET}</span></div>
            <div class="flex gap-4 mt-6">
              <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded" onclick={confirmPayNow} disabled={isPaying}>{isPaying ? 'Processing...' : 'Confirm & Pay'}</button>
              <button type="button" class="bg-gray-300 text-gray-800 px-4 py-2 rounded" onclick={closePayModal} disabled={isPaying}>Cancel</button>
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
  </div>
  <Toast open={toast.open} status={toast.message} success={toast.success} error={false} />
</div>
{:else}
  <div class="text-center text-white p-10">Invoice not found.</div>
{/if}
