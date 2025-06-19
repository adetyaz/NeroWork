<script lang='ts'>
import { getSigner, getAAWalletAddress } from '$lib/utils/aaUtils';
import Toast from './ui/toast.svelte';
import { onMount } from 'svelte';
import NotificationsList from './ui/NotificationsList.svelte';
import { getNotifications as getNotificationsFromSupabase } from '$lib/utils/notifications.supabase';
import { supabase } from '$lib/utils/supabaseClient';

let isConnected = $state(false);
let userAddress = $state('');
let aaWalletAddress = $state('');
let isLoading = $state(false);
let isDropdownOpen = $state(false);
let showToast = $state(false);
let toastMessage = $state('');
let toastError = $state(false);
let toastSuccess = $state(false);
let showNotifications = $state(false);

let notifications = $state<any[]>([]);

const truncatedUserAddress = $derived(truncateAddress(userAddress));
const truncatedAAAddress = $derived(truncateAddress(aaWalletAddress));

// Truncate address for display
function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Toggle Dropdown
async function toggleDropdown() {
  isDropdownOpen = !isDropdownOpen;
}

// On mount, check for existing wallet connection in localStorage
onMount(() => {
  const savedAddress = localStorage.getItem('connectedWallet');
  const savedAA = localStorage.getItem('connectedAAWallet');
  if (savedAddress) {
    userAddress = savedAddress;
    isConnected = true;
  }
  if (savedAA) {
    aaWalletAddress = savedAA;
  }
});

// Connect wallet
async function connectWallet() {
  try {
    isLoading = true;
    const signer = await getSigner();
    const address = await signer.getAddress();
    userAddress = address;
    localStorage.setItem('connectedWallet', address);
    const aaAddress = await getAAWalletAddress(signer);
    aaWalletAddress = aaAddress;
    localStorage.setItem('connectedAAWallet', aaAddress);
    isConnected = true;
    showToast = true;
    toastSuccess = true;
    toastMessage = 'Wallet connected successfully!';
    setTimeout(() => {
      showToast = false;
    }, 3000); // Hide toast after 3 seconds

  } catch (error) {
    console.error('Error connecting wallet:', error);
    showToast = true;
    toastMessage = 'Failed to connect wallet'
    toastError = true;

    setTimeout(() => {
      showToast = false;
    }, 3000); // Hide toast after 3 seconds
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
  localStorage.removeItem('connectedWallet');
  localStorage.removeItem('connectedAAWallet');
}

$effect(() => {
  if (userAddress) {
    fetchNotifications();
  }
});

async function fetchNotifications() {
  notifications = await getNotificationsFromSupabase(userAddress);
}

function toggleNotifications() {
  showNotifications = !showNotifications;
}

// BADGE/AVATAR LOGIC
const badgeMilestones = [
  { count: 1, name: 'First Invoice', imageUrl: '/first-invoice.png.png' },
  { count: 5, name: '5 Invoices', imageUrl: '/five-invoices.png.png' },
  { count: 10, name: '10 Invoices', imageUrl: '/ten-invoices.png.jpg' },
  { count: 25, name: '25 Invoices', imageUrl: '/twentyfive-invoices.png.jpg' },
  { count: 50, name: '50 Invoices', imageUrl: '/fifty-invoices.png.jpg' },
  { count: 100, name: '100 Invoices', imageUrl: '/hundred-invoices.png.jpg' }
];
const defaultAvatar = '/freelancer.png'; // fallback avatar in static/design-images/

let badgeImage = $state(defaultAvatar);

async function fetchUserBadges(address: string) {
  if (!address) {
    badgeImage = defaultAvatar;
    return;
  }
  // Fetch badges from Supabase
  const { data: badgeData, error } = await supabase
    .from('badges')
    .select('badge_name')
    .eq('user_address', address);
  if (error) {
    badgeImage = defaultAvatar;
    return;
  }
  // Find the highest milestone badge the user has
  let latestBadge = null;
  for (let i = badgeMilestones.length - 1; i >= 0; i--) {
    const badge = badgeMilestones[i];
    if (badgeData && badgeData.some(b => b.badge_name === badge.name)) {
      latestBadge = badge;
      break;
    }
  }
  badgeImage = latestBadge ? latestBadge.imageUrl : defaultAvatar;
}

$effect(() => {
  if (userAddress) {
    fetchUserBadges(userAddress);
  } else {
    badgeImage = defaultAvatar;
  }
});
</script>

<div class="relative">
  {#if !isConnected}
    <!-- Initial State: Connect Button -->
    <button
      onclick={connectWallet}
      class="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-200 ease-in-out flex items-center justify-center {isLoading ? 'opacity-70 cursor-not-allowed' : ''}"
      disabled={isLoading}
    >
      {#if isLoading}
        <!-- Loading Spinner -->
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connecting...
      {:else}
        Connect Wallet
      {/if}
    </button>
  {:else}
    <!-- Connected State: Notifications, Profile Image, and Dropdown Trigger -->
    <div class="flex items-center space-x-6">
      <div class="flex items-center space-x-3">
        <!-- Notifications Button with badge -->
        <button class="relative rounded-full bg-[#f1f2f4] p-1.5" aria-label="notifications" onclick={toggleNotifications}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {#if notifications && notifications.filter(n => !n.read).length > 0}
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 border border-white">{notifications.filter(n => !n.read).length}</span>
          {/if}
        </button>
        {#if showNotifications}
          <div class="absolute right-0 top-12 z-50">
            <NotificationsList />
          </div>
        {/if}
        <!-- Styled truncated wallet address -->
        <span class="px-3 py-1 bg-gray-100 rounded-full font-mono text-xs text-gray-700 border border-gray-300">{truncatedUserAddress}</span>
        <!-- Profile Image (Dropdown Trigger) -->
        <button onclick={toggleDropdown} class="h-9 w-9 overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <img src={badgeImage} alt="Profile" width="36" height="36" />
        </button>
      </div>
    </div>

    <!-- Dropdown Menu -->
    {#if isDropdownOpen}
      <div class="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <!-- Wallet Address Display -->
          <div class="block px-4 py-2 text-sm text-gray-700">
            <p class="font-semibold">Wallet Address:</p>
            <p class="text-gray-500 text-xs">{truncatedUserAddress}</p>
          </div>
          <!-- EOA Address Display -->
          <div class="block px-4 py-2 text-sm text-gray-700">
            <p class="font-semibold">AA Address:</p>
            <p class="text-gray-500 text-xs">{truncatedAAAddress}</p>
          </div>
          <div class="border-t border-gray-100 my-1"></div>
          <!-- Disconnect Option -->
          <button onclick={disconnectWallet} class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700" role="menuitem">
            Disconnect
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>


<Toast
    open={showToast}
    status={toastMessage}
    success={toastSuccess}
    error={toastError}
/>


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