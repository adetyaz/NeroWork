<script lang="ts">
  import type { PaymentOption } from '$lib/types/tokens';
  import type { SwapQuote } from '$lib/services/tokenSwapService';

  interface Props {
    selectedToken: PaymentOption | null;
    invoicePreferredToken?: string;
    swapQuote: SwapQuote | null;
    isLoadingQuote: boolean;
  }

  let { selectedToken, invoicePreferredToken, swapQuote, isLoadingQuote }: Props = $props();
  
  let needsConversion = $derived(
    selectedToken && invoicePreferredToken && 
    selectedToken.symbol !== invoicePreferredToken
  );
</script>

{#if needsConversion && selectedToken && invoicePreferredToken}
  <div class="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-yellow-800">Token Conversion Required</h3>
        <div class="mt-2 text-sm text-yellow-700">
          <p>The freelancer prefers to receive <strong>{invoicePreferredToken}</strong>, but you're paying with <strong>{selectedToken.symbol}</strong>.</p>
          
          {#if isLoadingQuote}
            <div class="mt-2 flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting conversion quote...
            </div>
          {:else if swapQuote && swapQuote.valid}
            <div class="mt-2 p-3 bg-white rounded border">
              <div class="text-xs text-gray-600 mb-1">Conversion Rate:</div>
              <div class="font-medium text-gray-900">
                {swapQuote.fromAmount} {swapQuote.fromToken.symbol} → {swapQuote.toAmount} {swapQuote.toToken.symbol}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                Price Impact: {swapQuote.priceImpact.toFixed(2)}% | Slippage: {swapQuote.slippage}%
              </div>
            </div>
            <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p class="text-xs text-red-700">
                <strong>Note:</strong> Token swapping is not yet available on NERO Chain. Please select <strong>{invoicePreferredToken}</strong> as your payment token instead.
              </p>
            </div>
          {:else if swapQuote && !swapQuote.valid}
            <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p class="text-xs text-red-700">{swapQuote.errorMessage || 'Conversion not available'}</p>
              <p class="text-xs text-red-600 mt-1">Please select <strong>{invoicePreferredToken}</strong> for payment.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
