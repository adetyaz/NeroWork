<script lang="ts">
import { Briefcase, Bookmark, Bell, MapPin, Calendar, Eye } from '@lucide/svelte';

import { getSigner } from '$lib/utils/aaUtils';
import { supabase } from '$lib/utils/supabaseClient.js';

let stats = $state([
  { number: 0, label: 'Created Invoices', icon: Briefcase, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { number: 0, label: 'Badges', icon: Bookmark, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { number: 0, label: 'Paid Invoices', icon: Bell, bgColor: 'bg-green-100', iconColor: 'text-green-600' }
]);

let invoices = $state<any[]>([]);
let freelancerWallet = $state('');
let earnedBadges: string[] = $state([]);
let badgeCount: number = $state(0);

// Define milestones at the top-level scope so it's accessible everywhere
const milestones = [
  { count: 1, name: 'First Invoice' },
  { count: 5, name: '5 Invoices' },
  { count: 10, name: '10 Invoices' },
  { count: 25, name: '25 Invoices' },
  { count: 50, name: '50 Invoices' },
  { count: 100, name: '100 Invoices' }
];

$effect(() => {
  async function updateStats() {
    // Get wallet address from signer
    const signer = await getSigner();
    const address = await signer.getAddress();
    freelancerWallet = address;
    // Fetch badges from Supabase
    const { data: badgeData } = await supabase
      .from('badges')
      .select('badge_name')
      .eq('user_address', address);
    earnedBadges = badgeData ? badgeData.map(b => b.badge_name) : [];
    stats[1].number = earnedBadges.length;
  }
  updateStats();
});

$effect(() => {
  async function fetchInvoicesAndStats() {
    // Always get wallet address from getSigner
    const signer = await getSigner();
    const address = await signer.getAddress();
    freelancerWallet = address;
    if (!address) return;
    // Fetch invoices from Supabase
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_address', address)
      .order('created_at', { ascending: false });
    invoices = data && Array.isArray(data) ? data : [];
    // Update stats
    stats[0].number = invoices.length;
    stats[2].number = invoices.filter((inv: any) => inv.status === 'paid').length;
  }
  fetchInvoicesAndStats();
});

async function loadBadges() {
  const signer = await getSigner();
  const address = await signer.getAddress();
  earnedBadges = milestones.filter(m => localStorage.getItem(`${address}-badge-${m.name}`) === 'minted').map(m => m.name);
  // Update badge count in stats
  stats[1].number = earnedBadges.length;
}

$effect(() => { loadBadges(); });


function handleViewDetails(invoiceId: string) {
  // Navigate to the invoice details page
  window.location.href = `/invoice/${invoiceId}`;
}

function handleViewAll() {
  // Navigate to the full invoices dashboard
  window.location.href = '/freelancer/dashboard/my-invoices';
}
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-1">Hello, {freelancerWallet.slice(0, 6)}...{freelancerWallet.slice(-4)}</h1>
      <p class="text-gray-600">Here is your invoice activity and rewards</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {#each stats as stat}
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div class="text-gray-600 text-sm">{stat.label}</div>
            </div>
            <div class="{stat.bgColor} p-3 rounded-lg">
              <stat.icon class="w-6 h-6 {stat.iconColor}" />
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Recently Created Invoices Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Recently Created Invoices</h2>
          <button 
            onclick={handleViewAll}
            class="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            View all →
          </button>
        </div>
      </div>

      <!-- Table Header -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 p-6 bg-gray-50 text-sm font-medium text-gray-600 border-b border-gray-200">
        <div class="col-span-4">Invoice</div>
        <div class="col-span-3">Created</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-3">Action</div>
      </div>

      <!-- Invoice Listings -->
      <div class="divide-y divide-gray-200">
        {#if invoices.length === 0}
          <div class="p-6 text-gray-500 text-center">No invoices found.</div>
        {:else}
          {#each invoices as inv}
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <!-- Invoice Info -->
                <div class="col-span-1 md:col-span-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {inv.project_name ? inv.project_name.charAt(0) : inv.title?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{inv.project_name || inv.title || 'Untitled'}</h3>
                      <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {inv.amount} NERO
                        </span>
                        <div class="flex items-center gap-1">
                          <MapPin class="w-3 h-3" />
                          {inv.client_name ? inv.client_name : (inv.clientWallet ? inv.clientWallet.slice(0, 6) + '...' + inv.clientWallet.slice(-4) : 'Client')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Created Date -->
                <div class="col-span-1 md:col-span-3">
                  <div class="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar class="w-4 h-4" />
                    {new Date(inv.created_at || inv.createdAt).toLocaleString()}
                  </div>
                </div>

                <!-- Status -->
                <div class="col-span-1 md:col-span-2">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 {inv.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full"></div>
                    <span class="text-sm font-medium {inv.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}">{inv.status}</span>
                  </div>
                </div>

                <!-- Action -->
                <div class="col-span-1 md:col-span-3">
                  <button 
                    onclick={() => handleViewDetails(inv.id)}
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye class="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
