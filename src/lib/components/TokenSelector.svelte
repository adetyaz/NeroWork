<script lang="ts">
  import { selectedPaymentToken, availableTokens } from '$lib/stores/tokenStore';
  import type { PaymentOption } from '$lib/types/tokens';
  
  let { disabled = false, showGaslessIndicator = true }: {
    disabled?: boolean;
    showGaslessIndicator?: boolean;
  } = $props();
  
  let isOpen = $state(false);
  let selectedToken = $derived($selectedPaymentToken);
  let tokens = $derived($availableTokens);
  
  function selectToken(token: PaymentOption) {
    selectedPaymentToken.set(token);
    isOpen = false;
  }
  
  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.token-selector')) {
      isOpen = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="token-selector relative">
  <button
    type="button"
    class="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
    class:cursor-not-allowed={disabled}
    onclick={toggleDropdown}
    {disabled}
  >
    <div class="flex items-center">
      {#if selectedToken}
        <img 
          src={selectedToken.icon} 
          alt={selectedToken.symbol}
          class="w-6 h-6 mr-3 rounded-full"
          onerror={(e) => {
            const target = e.target as HTMLImageElement;
            if (target) target.src = '/tokens/default.svg';
          }}
        />
        <div>
          <div class="font-medium text-gray-900">{selectedToken.symbol}</div>
          <div class="text-sm text-gray-500">{selectedToken.name}</div>
        </div>
        {#if showGaslessIndicator && selectedToken.gasless}
          <span class="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Gasless
          </span>
        {/if}
      {:else}
        <div class="text-gray-500">Select token</div>
      {/if}
    </div>
    
    <svg 
      class="w-5 h-5 text-gray-400 transition-transform duration-200"
      class:rotate-180={isOpen}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>
  
  {#if isOpen && !disabled}
    <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
      {#each tokens as token}
        <button
          type="button"
          class="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
          class:bg-blue-50={selectedToken?.id === token.id}
          onclick={() => selectToken(token)}
        >
          <img 
            src={token.icon} 
            alt={token.symbol}
            class="w-6 h-6 mr-3 rounded-full"
            onerror={(e) => {
              const target = e.target as HTMLImageElement;
              if (target) target.src = '/tokens/default.svg';
            }}
          />
          <div class="flex-1">
            <div class="font-medium text-gray-900">{token.symbol}</div>
            <div class="text-sm text-gray-500">{token.name}</div>
          </div>
          {#if showGaslessIndicator && token.gasless}
            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Gasless
            </span>
          {/if}
          {#if selectedToken?.id === token.id}
            <svg class="w-5 h-5 text-blue-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
