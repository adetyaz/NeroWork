<script lang="ts">
import { onMount } from 'svelte';
import { GasSponsorshipService } from '$lib/services/gasSponsorshipService.js';
import { getSigner } from '$lib/utils/aaUtils';
import { addNotification } from '$lib/utils/notifications';
import type { 
  GasSponsorshipProgram, 
  FavoriteClient, 
  GasSponsorshipStats,
  GasSponsorshipSettings 
} from '$lib/types/gasSponsorship.js';
import { GAS_SPONSORSHIP_CONFIG } from '$lib/types/gasSponsorship.js';

let userAddress = '';
let loading = $state(true);
let gasSponsorshipProgram: GasSponsorshipProgram | null = $state(null);
let gasSponsorshipStats: GasSponsorshipStats | null = $state(null);
let favoriteClients: FavoriteClient[] = $state([]);
let settings: GasSponsorshipSettings | null = $state(null);
let showSetupModal = $state(false);
let showTopUpModal = $state(false);
let showAddClientModal = $state(false);
let showSettingsModal = $state(false);

// Setup form
let setupBudget = $state(10);
let topUpAmount = $state(5);
let processing = $state(false);

// Add client form
let newClientEmail = $state('');
let newClientName = $state('');
let newClientMaxGas = $state(0.01);

const gasSponsorshipService = GasSponsorshipService.getInstance();

onMount(async () => {
  await loadGasSponsorshipData();
});

async function loadGasSponsorshipData() {
  try {
    loading = true;
    
    const signer = await getSigner();
    userAddress = await signer.getAddress();
    
    // Load all gas sponsorship data
    const [program, clients, settingsData] = await Promise.all([
      gasSponsorshipService.getGasSponsorshipProgram(userAddress),
      gasSponsorshipService.getFavoriteClients(userAddress),
      gasSponsorshipService.getGasSponsorshipSettings(userAddress)
    ]);
    
    gasSponsorshipProgram = program;
    favoriteClients = clients;
    settings = settingsData;
    
    if (program) {
      const stats = await gasSponsorshipService.getGasSponsorshipStats(userAddress);
      gasSponsorshipStats = stats;
    }
    
    // Auto-add favorite clients if enabled
    if (program && settingsData.auto_add_favorites) {
      await gasSponsorshipService.autoAddFavoriteClients(userAddress);
      // Reload clients after auto-add
      favoriteClients = await gasSponsorshipService.getFavoriteClients(userAddress);
    }
    
  } catch (error) {
    console.error('Error loading gas sponsorship data:', error);
    addNotification({
      type: 'error',
      message: 'Failed to load gas sponsorship data',
      userWallet: userAddress
    });
  } finally {
    loading = false;
  }
}

async function setupGasSponsorship() {
  try {
    processing = true;
    
    const program = await gasSponsorshipService.initializeGasSponsorshipProgram(
      userAddress,
      setupBudget,
      'NERO'
    );
    
    gasSponsorshipProgram = program;
    showSetupModal = false;
    
    addNotification({
      type: 'success',
      message: `Gas sponsorship program initialized with ${setupBudget} NERO budget!`,
      userWallet: userAddress
    });
    
    // Reload data
    await loadGasSponsorshipData();
    
  } catch (error) {
    console.error('Error setting up gas sponsorship:', error);
    addNotification({
      type: 'error',
      message: 'Failed to setup gas sponsorship program',
      userWallet: userAddress
    });
  } finally {
    processing = false;
  }
}

async function topUpBudget() {
  try {
    processing = true;
    
    const success = await gasSponsorshipService.topUpBudget(userAddress, topUpAmount);
    
    if (success) {
      showTopUpModal = false;
      addNotification({
        type: 'success',
        message: `Successfully topped up budget by ${topUpAmount} NERO!`,
        userWallet: userAddress
      });
      
      // Reload data
      await loadGasSponsorshipData();
    } else {
      throw new Error('Top-up failed');
    }
    
  } catch (error) {
    console.error('Error topping up budget:', error);
    addNotification({
      type: 'error',
      message: 'Failed to top up budget',
      userWallet: userAddress
    });
  } finally {
    processing = false;
  }
}

async function addFavoriteClient() {
  try {
    processing = true;
    
    await gasSponsorshipService.addFavoriteClient(
      userAddress,
      newClientEmail, // Using email as address for now
      newClientEmail,
      newClientName
    );
    
    showAddClientModal = false;
    newClientEmail = '';
    newClientName = '';
    newClientMaxGas = 0.01;
    
    addNotification({
      type: 'success',
      message: 'Client added to favorites with gas sponsorship enabled!',
      userWallet: userAddress
    });
    
    // Reload data
    await loadGasSponsorshipData();
    
  } catch (error) {
    console.error('Error adding favorite client:', error);
    addNotification({
      type: 'error',
      message: 'Failed to add favorite client',
      userWallet: userAddress
    });
  } finally {
    processing = false;
  }
}

async function toggleClientSponsorship(client: FavoriteClient) {
  try {
    await gasSponsorshipService.updateClientGasSponsorship(
      userAddress,
      client.client_address,
      !client.gas_sponsorship_enabled
    );
    
    client.gas_sponsorship_enabled = !client.gas_sponsorship_enabled;
    favoriteClients = [...favoriteClients];
    
    addNotification({
      type: 'success',
      message: `Gas sponsorship ${client.gas_sponsorship_enabled ? 'enabled' : 'disabled'} for ${client.client_name || client.client_email}`,
      userWallet: userAddress
    });
    
  } catch (error) {
    console.error('Error toggling client sponsorship:', error);
    addNotification({
      type: 'error',
      message: 'Failed to update client sponsorship',
      userWallet: userAddress
    });
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getBudgetStatusColor(percentage: number): string {
  if (percentage >= 50) return 'text-green-600';
  if (percentage >= 20) return 'text-yellow-600';
  return 'text-red-600';
}

function getBudgetBarColor(percentage: number): string {
  if (percentage >= 50) return 'bg-green-500';
  if (percentage >= 20) return 'bg-yellow-500';
  return 'bg-red-500';
}
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900">Gas Sponsorship</h1>
    {#if gasSponsorshipProgram}
      <div class="flex space-x-2">
        <button 
          onclick={() => showTopUpModal = true}
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Top Up Budget
        </button>
        <button 
          onclick={() => showAddClientModal = true}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Favorite Client
        </button>
      </div>
    {/if}
  </div>

  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p class="mt-2 text-gray-500">Loading gas sponsorship data...</p>
    </div>
  {:else if !gasSponsorshipProgram}
    <!-- Setup Gas Sponsorship -->
    <div class="text-center py-12">
      <div class="max-w-2xl mx-auto">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Gas Sponsorship Program</h2>
        <p class="text-lg text-gray-600 mb-8">
          Sponsor gas fees for your favorite clients to improve their experience and build stronger relationships.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Client Loyalty</h3>
            <p class="text-gray-600 text-sm">
              Show appreciation to your best clients by covering their transaction costs.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Better Experience</h3>
            <p class="text-gray-600 text-sm">
              Remove friction from payments and encourage repeat business.
            </p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm border">
            <div class="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Controlled Spending</h3>
            <p class="text-gray-600 text-sm">
              Set budgets and limits to control your gas sponsorship costs.
            </p>
          </div>
        </div>
        
        <button 
          onclick={() => showSetupModal = true}
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-lg"
        >
          Setup Gas Sponsorship
        </button>
      </div>
    </div>
  {:else if gasSponsorshipStats}
    <!-- Gas Sponsorship Dashboard -->
    
    <!-- Budget Overview -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <p class="text-sm font-medium text-gray-500">Total Budget</p>
          <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.total_budget} NERO</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Remaining</p>
          <p class="text-2xl font-bold {getBudgetStatusColor(gasSponsorshipStats.budget_utilization_percent)}">
            {gasSponsorshipStats.remaining_budget} NERO
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Utilization</p>
          <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.budget_utilization_percent.toFixed(1)}%</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Monthly Spending</p>
          <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.monthly_spending} NERO</p>
        </div>
      </div>
      
      <!-- Budget Progress Bar -->
      <div class="mt-4">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Budget Used</span>
          <span>{(gasSponsorshipStats.total_budget - gasSponsorshipStats.remaining_budget).toFixed(2)} / {gasSponsorshipStats.total_budget} NERO</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="{getBudgetBarColor(100 - gasSponsorshipStats.budget_utilization_percent)} h-3 rounded-full transition-all duration-500"
            style="width: {gasSponsorshipStats.budget_utilization_percent}%"
          ></div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Favorite Clients</p>
            <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.favorite_clients_count}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Sponsorships</p>
            <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.active_sponsorships_count}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Sponsored</p>
            <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.total_sponsored_transactions}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Avg. Sponsorship</p>
            <p class="text-2xl font-bold text-gray-900">{gasSponsorshipStats.average_sponsorship_amount.toFixed(4)} NERO</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Favorite Clients -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Favorite Clients</h3>
      </div>
      
      {#if favoriteClients.length === 0}
        <div class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-2">No favorite clients yet</h4>
          <p class="text-gray-500 mb-4">Add your loyal clients to start sponsoring their gas fees.</p>
          <button 
            onclick={() => showAddClientModal = true}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add First Client
          </button>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gas Sponsored
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each favoriteClients as client}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {client.client_name || 'Unknown Client'}
                      </div>
                      <div class="text-sm text-gray-500">
                        {client.client_email || client.client_address}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {client.total_invoices} invoices
                    </div>
                    <div class="text-sm text-gray-500">
                      {client.total_paid_amount} NERO total
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {client.sponsored_transactions_count} transactions
                    </div>
                    <div class="text-sm text-gray-500">
                      {client.total_sponsored_gas} NERO total
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {client.gas_sponsorship_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                      {client.gas_sponsorship_enabled ? 'Sponsorship Active' : 'Sponsorship Disabled'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onclick={() => toggleClientSponsorship(client)}
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      {client.gas_sponsorship_enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button class="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <!-- Recent Sponsorships -->
    {#if gasSponsorshipStats.recent_sponsorships.length > 0}
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Recent Sponsorships</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each gasSponsorshipStats.recent_sponsorships as sponsorship}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sponsorship.sponsored_at)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {sponsorship.client_address.slice(0, 6)}...{sponsorship.client_address.slice(-4)}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {sponsorship.sponsored_amount} {sponsorship.gas_token}
                    </div>
                    <div class="text-xs text-gray-500">
                      of {sponsorship.original_gas_fee} {sponsorship.gas_token}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a 
                      href="#" 
                      class="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      {sponsorship.transaction_hash.slice(0, 10)}...
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- Setup Modal -->
{#if showSetupModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Setup Gas Sponsorship</h3>
      
      <div class="space-y-4">
        <div>
          <label for="setup-budget" class="block text-sm font-medium text-gray-700 mb-1">
            Initial Budget (NERO)
          </label>
          <input
            id="setup-budget"
            type="number"
            bind:value={setupBudget}
            min={GAS_SPONSORSHIP_CONFIG.MIN_BUDGET}
            max={GAS_SPONSORSHIP_CONFIG.MAX_BUDGET}
            step="0.1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">
            Minimum: {GAS_SPONSORSHIP_CONFIG.MIN_BUDGET} NERO, Maximum: {GAS_SPONSORSHIP_CONFIG.MAX_BUDGET} NERO
          </p>
        </div>
      </div>
      
      <div class="flex space-x-3 mt-6">
        <button 
          onclick={() => showSetupModal = false}
          class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button 
          onclick={setupGasSponsorship}
          disabled={processing}
          class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {processing ? 'Setting up...' : 'Setup'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Top Up Modal -->
{#if showTopUpModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Up Budget</h3>
      
      <div class="space-y-4">
        <div>
          <label for="topup-amount" class="block text-sm font-medium text-gray-700 mb-1">
            Amount to Add (NERO)
          </label>
          <input
            id="topup-amount"
            type="number"
            bind:value={topUpAmount}
            min="1"
            step="0.1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <!-- Quick amounts -->
        <div>
          <p class="text-sm font-medium text-gray-700 mb-2">Quick amounts:</p>
          <div class="flex space-x-2 flex-wrap">
            {#each GAS_SPONSORSHIP_CONFIG.BUDGET_TOP_UP_AMOUNTS as amount}
              <button 
                onclick={() => topUpAmount = amount}
                class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                {amount} NERO
              </button>
            {/each}
          </div>
        </div>
      </div>
      
      <div class="flex space-x-3 mt-6">
        <button 
          onclick={() => showTopUpModal = false}
          class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button 
          onclick={topUpBudget}
          disabled={processing}
          class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Add ${topUpAmount} NERO`}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add Client Modal -->
{#if showAddClientModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Favorite Client</h3>
      
      <div class="space-y-4">
        <div>
          <label for="client-email" class="block text-sm font-medium text-gray-700 mb-1">
            Client Email *
          </label>
          <input
            id="client-email"
            type="email"
            bind:value={newClientEmail}
            placeholder="client@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label for="client-name" class="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            id="client-name"
            type="text"
            bind:value={newClientName}
            placeholder="John Doe"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label for="client-max-gas" class="block text-sm font-medium text-gray-700 mb-1">
            Max Gas Per Transaction (NERO)
          </label>
          <input
            id="client-max-gas"
            type="number"
            bind:value={newClientMaxGas}
            min={GAS_SPONSORSHIP_CONFIG.MIN_GAS_PER_TX}
            max={GAS_SPONSORSHIP_CONFIG.MAX_GAS_PER_TX}
            step="0.001"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">
            Range: {GAS_SPONSORSHIP_CONFIG.MIN_GAS_PER_TX} - {GAS_SPONSORSHIP_CONFIG.MAX_GAS_PER_TX} NERO
          </p>
        </div>
      </div>
      
      <div class="flex space-x-3 mt-6">
        <button 
          onclick={() => showAddClientModal = false}
          class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button 
          onclick={addFavoriteClient}
          disabled={processing || !newClientEmail}
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {processing ? 'Adding...' : 'Add Client'}
        </button>
      </div>
    </div>
  </div>
{/if}
