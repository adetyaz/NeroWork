<script lang="ts">
  import type { PaymentOption } from '$lib/types/tokens';

  interface Props {
    invoiceAmount: number;
    selectedToken: PaymentOption | null;
    gasSponsorshipAvailable: boolean;
    platformWallet: string;
    feeWaived?: boolean; // New prop for favorite client fee waiver
    clientEmail?: string; // To show which client gets the waiver
  }

  let { invoiceAmount, selectedToken, gasSponsorshipAvailable, platformWallet, feeWaived = false, clientEmail }: Props = $props();

  function formatCurrency(amount: number) {
    if (selectedToken) {
      return `${amount} ${selectedToken.symbol}`;
    }
    return amount + ' NERO';
  }

  let totalAmount = $derived(feeWaived ? invoiceAmount : invoiceAmount + 0.2);
</script>

<!-- Payment Breakdown -->
<div class="border border-gray-200 rounded-lg p-4 mb-6">
  <div class="mb-2 flex justify-between">
    <span>Invoice Amount:</span>
    <span class="font-medium">{formatCurrency(invoiceAmount)}</span>
  </div>
  
  <!-- Platform Fee Section -->
  <div class="mb-2 flex justify-between">
    <span>Platform Fee:</span>
    {#if feeWaived}
      <div class="flex items-center gap-2">
        <span class="line-through text-gray-400">0.2 {selectedToken?.symbol || 'NERO'}</span>
        <span class="text-green-600 font-medium text-sm">WAIVED</span>
      </div>
    {:else}
      <span class="font-medium">0.2 {selectedToken?.symbol || 'NERO'}</span>
    {/if}
  </div>

  <!-- Fee Waiver Notice -->
  {#if feeWaived}
    <div class="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
      <div class="flex items-start">
        <svg class="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <div>
          <span class="font-medium">Your transaction is free this time!</span>
          <p class="text-green-600 text-xs mt-1">
            You're a favorite client - platform fee has been waived
            {#if clientEmail}
              <br>for <span class="font-medium">{clientEmail}</span>
            {/if}
          </p>
        </div>
      </div>
    </div>
  {/if}
  {#if gasSponsorshipAvailable}
    <div class="mb-2 flex justify-between text-sm text-green-600">
      <span>Network Gas Fee:</span>
      <span class="line-through text-gray-400">~0.001 {selectedToken?.symbol || 'NERO'}</span>
      <span class="ml-2 font-medium">SPONSORED</span>
    </div>
  {:else}
    <div class="mb-2 flex justify-between text-sm text-gray-600">
      <span>Network Gas Fee:</span>
      <span>~0.001 {selectedToken?.symbol || 'NERO'}</span>
    </div>
  {/if}
  <hr class="my-2">
  <div class="flex justify-between font-bold text-lg">
    <span>Total to Pay:</span>
    <span>{formatCurrency(totalAmount)}</span>
  </div>
  
  <!-- Additional Info -->
  <div class="mt-2 space-y-1">
    {#if gasSponsorshipAvailable}
      <div class="text-xs text-green-600">
        * Gas fees covered by freelancer
      </div>
    {/if}
    {#if feeWaived}
      <div class="text-xs text-green-600">
        * Platform fee waived for favorite client
      </div>
    {/if}
  </div>
</div>

<!-- Platform wallet info -->
<div class="mb-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
  <p class="mb-1">Platform fee will be sent to:</p>
  <span class="font-mono text-gray-700">{platformWallet}</span>
</div>
