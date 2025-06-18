<script lang='ts'>
  import { onMount } from 'svelte';
  import Toast from '$lib/components/ui/toast.svelte';
  import { goto } from '$app/navigation';

  type InvoiceItem = {
    description: string;
    qty: number;
    price: number;
  };

  type Invoice = {
    id: string;
    title: string;
    status: string;
    freelancerName: string;
    freelancerAddress: string;
    freelancerWallet: string;
    clientName: string;
    clientEmail: string;
    createdAt: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    updatedAt?: string;
  };

  let invoiceData = $state<Invoice | null>(null);
  let isPaying = $state(false);
  let toast = $state({ open: false, message: '', success: false });
  let showPayModal = $state(false);
  const PLATFORM_WALLET = '0x99BD4BDD7A9c22E2a35F09A6Bd17f038D5E5eB87';

  onMount(() => {
    // Load invoice by ID from localStorage
    const id = window.location.pathname.split('/').pop();
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoiceData = invoices.find((inv: any) => inv.id === id);
  });

  function formatCurrency(amount: number) {
    return amount + ' NERO';
  }
  function formatNumber(amount: number) {
    return Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function payNow() {
    isPaying = true;
    // Simulate transaction delay
    setTimeout(() => {
      // Mark invoice as paid in localStorage
      if (!invoiceData) {
        toast = { open: true, message: 'Invoice data not found.', success: false };
        isPaying = false;
        return;
      }
      const id = invoiceData.id;
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const idx = invoices.findIndex((inv: any) => inv.id === id);
      if (idx !== -1) {
        invoices[idx].status = 'paid';
        invoices[idx].updatedAt = new Date().toISOString();
        localStorage.setItem('invoices', JSON.stringify(invoices));
        // Add notification for freelancer
        const notifs = JSON.parse(localStorage.getItem('freelancerNotifications') || '[]');
        notifs.push({
          id: Date.now().toString(),
          invoiceId: id,
          message: `Invoice ${invoiceData.title} has been paid by client.`,
          createdAt: new Date().toISOString(),
          read: false
        });
        localStorage.setItem('freelancerNotifications', JSON.stringify(notifs));
      }
      toast = { open: true, message: 'Payment successful! Invoice marked as paid.', success: true };
      isPaying = false;
      // Optionally reload or redirect
      setTimeout(() => window.location.reload(), 1200);
    }, 2000);
  }

  function openPayModal() {
    showPayModal = true;
  }
  function closePayModal() {
    showPayModal = false;
  }
  async function confirmPayNow() {
    closePayModal();
    await payNow();
  }
</script>

{#if invoiceData}
<div class="min-h-screen bg-gray-900 text-white p-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header Section -->
    <div class="flex justify-between items-start mb-12">
      <!-- Payment Section -->
      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-300 mb-2">Pay online</p>
          {#if invoiceData.status === 'paid'}
            <span class="text-green-400 font-bold">Paid</span>
          {:else}
            <button class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition" on:click={openPayModal} disabled={isPaying}>
              Pay Now
            </button>
          {/if}
        </div>
        <!-- Modal for payment breakdown -->
        {#if showPayModal}
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div class="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Confirm Payment</h2>
            <div class="mb-2 flex justify-between"><span>Invoice Amount:</span><span>{formatCurrency(invoiceData.subtotal)}</span></div>
            <div class="mb-2 flex justify-between"><span>Platform Fee:</span><span>0.5 NERO</span></div>
            <div class="mb-4 flex justify-between font-bold text-lg"><span>Total to Pay:</span><span>{formatCurrency(invoiceData.subtotal + 0.5)}</span></div>
            <div class="mb-2 text-xs text-gray-500">0.5 NERO will be sent to platform wallet:<br><span class="font-mono">{PLATFORM_WALLET}</span></div>
            <div class="flex gap-4 mt-6">
              <button class="bg-blue-600 text-white px-4 py-2 rounded" on:click={confirmPayNow} disabled={isPaying}>{isPaying ? 'Processing...' : 'Confirm & Pay'}</button>
              <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded" on:click={closePayModal} disabled={isPaying}>Cancel</button>
            </div>
          </div>
        </div>
        {/if}
        <!-- QR Code Placeholder -->
        <div class="w-24 h-24 bg-white p-2 rounded">
          <div class="w-full h-full bg-black flex items-center justify-center text-white text-xs">
            QR CODE
          </div>
        </div>
      </div>
      <!-- Company Info -->
      <div class="text-right space-y-2">
        <h1 class="text-xl font-bold">{invoiceData.freelancerName}</h1>
        <p class="text-sm text-gray-300">{invoiceData.freelancerAddress}</p>
        <p class="text-sm text-gray-300">{invoiceData.freelancerWallet}</p>
      </div>
    </div>
    <!-- Invoice Title and Number -->
    <div class="flex justify-between items-end mb-12">
      <h2 class="text-6xl font-light">Invoice</h2>
      <div class="text-right">
        <p class="text-2xl font-medium">{invoiceData.title}</p>
      </div>
    </div>
    <!-- Client and Invoice Details -->
    <div class="flex justify-between mb-12">
      <!-- Client Info -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">{invoiceData.clientName}</h3>
        <p class="text-sm text-gray-300">{invoiceData.clientEmail}</p>
      </div>
      <!-- Invoice Dates -->
      <div class="text-right space-y-2">
        <div>
          <span class="text-sm text-gray-300">INVOICE DATE:</span>
          <span class="ml-4">{new Date(invoiceData.createdAt).toLocaleDateString()}</span>
        </div>
        <div>
          <span class="text-sm text-gray-300">DUE:</span>
          <span class="ml-4">{invoiceData.dueDate}</span>
        </div>
      </div>
    </div>
    <!-- Invoice Items List -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-2">Invoice Items</h3>
      <ul class="divide-y divide-gray-700">
        {#each invoiceData.items as item}
          <li class="py-2 flex justify-between items-center">
            <span class="flex-1">{item.description}</span>
            <span class="w-16 text-center">Qty: {item.qty}</span>
            <span class="w-24 text-right">Price: {formatNumber(item.price)} NERO</span>
            <span class="w-28 text-right font-bold">Amount: {formatNumber(item.qty * item.price)} NERO</span>
          </li>
        {/each}
      </ul>
    </div>
    <!-- Totals Section -->
    <div class="space-y-4">
      <div class="flex justify-end">
        <div class="w-80 space-y-3">
          <div class="flex justify-between py-2">
            <span class="text-gray-300">Sub total:</span>
            <span class="font-medium">{formatCurrency(invoiceData.subtotal)}</span>
          </div>
          <div class="flex justify-between py-4 border-t border-gray-700 text-lg font-semibold">
            <span>Amount due on {invoiceData.dueDate}:</span>
            <span>{formatCurrency(invoiceData.subtotal)}</span>
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
