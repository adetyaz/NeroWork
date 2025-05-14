<script lang='ts'>
import { getSigner, getAAWalletAddress } from '$lib/utils/aaUtils';

let isConnected = $state(false);
let userAddress = $state('');
let aaWalletAddress = $state('');
let isLoading = $state(false);
let isDropdownOpen = $state(false);

// Truncate address for display
function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Toggle Dropdown
async function toggleDropdown() {
  isDropdownOpen = !isDropdownOpen;
}


// Connect wallet
async function connectWallet() {
  try {
    isLoading = true;

    const signer = await getSigner();
    const address = await signer.getAddress();
    userAddress = address;

    
    const aaAddress = await getAAWalletAddress(signer);
    aaWalletAddress = aaAddress;

    isConnected = true;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    alert(error instanceof Error ? error.message : 'Failed to connect wallet');
  } finally {
    isLoading = false;
  }
}

// Disconnect wallet
function disconnectWallet() {
  isConnected = false;
  userAddress = '';
  aaWalletAddress = '';
  isDropdownOpen = false;
}

</script>

<div class="relative inline-block">
  <button
    class="wallet-button px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-gray-600 to-purple-500 hover:from-gray-700 hover:to-purple-600 disabled:from-gray-700 disabled:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px] text-center"
    onclick={isConnected ? toggleDropdown : connectWallet}
    disabled={isLoading}
    title={isConnected ? userAddress : 'Connect Wallet'}
  >
    {#if isLoading}
      Connecting...
    {:else if isConnected}
      {truncateAddress(userAddress)}
    {:else}
      Connect Wallet
    {/if}
  </button>

  {#if isDropdownOpen && isConnected}
    <div class="dropdown absolute top-full right-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg p-4 w-64 z-50 animate-slide-in">
      <div class="mb-2 text-sm break-all">
        <strong>EOA Address:</strong>
        <span>{truncateAddress(userAddress)}</span>
      </div>
      <div class="mb-2 text-sm break-all">
        <strong>AA Wallet Address:</strong>
        <span>{truncateAddress(aaWalletAddress)}</span>
      </div>
      <button
        class="w-full px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        onclick={disconnectWallet}
      >
        Disconnect
      </button>
    </div>
  {/if}
</div>


<style>
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-in {
    animation: slide-in 0.2s ease-out;
  }
</style>