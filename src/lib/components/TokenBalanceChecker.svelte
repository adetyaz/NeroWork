<script lang="ts">
  import { selectedPaymentToken } from '$lib/stores/tokenStore';
  import { getTokenBalance, checkSufficientBalance, getTokenPriceUSD } from '$lib/utils/tokenUtils';
  import type { PaymentOption } from '$lib/types/tokens';
  import { getSigner } from '$lib/utils/aaUtils';
  
  let { 
    amount = '0', 
    showUSDValue = true, 
    onBalanceUpdate = null 
  }: {
    amount?: string;
    showUSDValue?: boolean;
    onBalanceUpdate?: ((balance: string, sufficient: boolean) => void) | null;
  } = $props();
  
  let selectedToken = $derived($selectedPaymentToken);
  let balance = $state('0');
  let sufficient = $state(false);
  let loading = $state(false);
  let usdValue = $state('0');
  let error = $state('');
  
  // React to selected token changes
  $effect(() => {
    if (selectedToken) {
      updateBalance();
      updateUSDValue();
    }
  });
  
  async function updateBalance() {
    if (!selectedToken || !amount || parseFloat(amount) <= 0) {
      balance = '0';
      sufficient = false;
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const signer = await getSigner();
      const balanceCheck = await checkSufficientBalance(signer, selectedToken, amount);
      
      balance = balanceCheck.balance;
      sufficient = balanceCheck.sufficient;
      
      if (onBalanceUpdate) {
        onBalanceUpdate(balance, sufficient);
      }
    } catch (err: any) {
      console.error('Error checking balance:', err);
      error = err.message || 'Failed to check balance';
      balance = '0';
      sufficient = false;
    } finally {
      loading = false;
    }
  }
  
  async function updateUSDValue() {
    if (!selectedToken || !amount || parseFloat(amount) <= 0) {
      usdValue = '0';
      return;
    }
    
    try {
      const price = await getTokenPriceUSD(selectedToken);
      const amountNum = parseFloat(amount);
      const totalUSD = (amountNum + 0.2) * price; // Include platform fee
      usdValue = totalUSD.toFixed(2);
    } catch (err) {
      console.error('Error getting USD value:', err);
      usdValue = '0';
    }
  }
  
  // React to amount changes
  $effect(() => {
    if (amount) {
      updateBalance();
      updateUSDValue();
    }
  });
</script>

{#if selectedToken}
  <div class="token-balance-info space-y-2">
    <!-- Balance Display -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600">Your {selectedToken.symbol} balance:</span>
      <div class="text-right">
        {#if loading}
          <div class="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
        {:else if error}
          <span class="text-red-600">Error loading</span>
        {:else}
          <span class="font-medium">{parseFloat(balance).toFixed(6)} {selectedToken.symbol}</span>
        {/if}
      </div>
    </div>
    
    <!-- USD Value -->
    {#if showUSDValue && usdValue !== '0'}
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Total cost (incl. 0.2 {selectedToken.symbol} fee):</span>
        <span>≈ ${usdValue} USD</span>
      </div>
    {/if}
    
    <!-- Sufficiency Check -->
    {#if amount && parseFloat(amount) > 0}
      <div class="flex items-center justify-between text-sm">
        <span>Sufficient balance:</span>
        <div class="flex items-center">
          {#if loading}
            <div class="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          {:else if sufficient}
            <span class="flex items-center text-green-600 font-medium">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Yes
            </span>
          {:else}
            <span class="flex items-center text-red-600 font-medium">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              No
            </span>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Gasless Indicator -->
    {#if selectedToken.gasless}
      <div class="flex items-center text-sm text-green-600">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
        </svg>
        Gas fees sponsored by paymaster
      </div>
    {/if}
    
    <!-- Error Display -->
    {#if error}
      <div class="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
        {error}
      </div>
    {/if}
  </div>
{/if}

<style>
  .token-balance-info {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
  }
</style>
