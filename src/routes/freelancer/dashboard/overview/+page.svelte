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
let loading = $state(true);
let error = $state('');

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
    try {
      loading = true;
      error = '';
      
      console.log('Fetching invoices and stats...');
      
      // Always get wallet address from getSigner
      const signer = await getSigner();
      const address = await signer.getAddress();
      freelancerWallet = address;
      
      console.log('Freelancer wallet:', freelancerWallet);
      
      if (!address) return;
      
      console.log('Calling Supabase for stats...');
      // Fetch invoices from Supabase
      const { data, error: supabaseError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_address', address)
        .order('created_at', { ascending: false });
        
      console.log('Supabase stats response:', { data, supabaseError });
        
      if (supabaseError) {
        console.error('Supabase stats error:', supabaseError);
        throw new Error(supabaseError.message);
      }
      
      invoices = data && Array.isArray(data) ? data : [];
      console.log('Loaded stats invoices:', invoices.length);
      
      // Update stats
      stats[0].number = invoices.length;
      stats[2].number = invoices.filter((inv: any) => inv.status === 'paid').length;
    } catch (err) {
      console.error('Error loading data:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        error = 'Network error: Unable to connect to the database. Please check your internet connection and try again.';
      } else {
        error = 'Failed to load dashboard data. Please refresh the page.';
      }
    } finally {
      loading = false;
    }
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
    {#if error}
      <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-1">
        {#if loading}
          <div class="animate-pulse bg-gray-300 h-8 w-64 rounded"></div>
        {:else}
          Hello, {freelancerWallet.slice(0, 6)}...{freelancerWallet.slice(-4)}
        {/if}
      </h1>
      <p class="text-gray-600">Here is your invoice activity and rewards</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {#each stats as stat}
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              {#if loading}
                <div class="animate-pulse bg-gray-300 h-8 w-16 rounded mb-1"></div>
                <div class="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              {:else}
                <div class="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div class="text-gray-600 text-sm">{stat.label}</div>
              {/if}
            </div>
            <div class="{stat.bgColor} p-3 rounded-lg">
              <stat.icon class="w-6 h-6 {stat.iconColor}" />
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Quick Actions & Activity Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Quick Actions Widget -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p class="text-sm text-gray-600">Get things done faster</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <a href="/freelancer/dashboard/create-invoice" class="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors group">
              <div class="bg-blue-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <Briefcase class="w-5 h-5 text-white" />
              </div>
              <div>
                <div class="font-medium text-gray-900">New Invoice</div>
                <div class="text-xs text-gray-600">Create & send</div>
              </div>
            </a>
            
            <a href="/freelancer/dashboard/my-invoices" class="flex items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors group">
              <div class="bg-green-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <Eye class="w-5 h-5 text-white" />
              </div>
              <div>
                <div class="font-medium text-gray-900">View All</div>
                <div class="text-xs text-gray-600">Manage invoices</div>
              </div>
            </a>
            
            <a href="/freelancer/dashboard/reports" class="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors group">
              <div class="bg-purple-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <Calendar class="w-5 h-5 text-white" />
              </div>
              <div>
                <div class="font-medium text-gray-900">Reports</div>
                <div class="text-xs text-gray-600">Analytics & export</div>
              </div>
            </a>
            
            <div class="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors group">
              <div class="bg-orange-500 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                <Bookmark class="w-5 h-5 text-white" />
              </div>
              <div>
                <div class="font-medium text-gray-900">Badges</div>
                <div class="text-xs text-gray-600">{earnedBadges.length} earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Progress -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Achievement Progress</h2>
          <p class="text-sm text-gray-600">Your milestone journey</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            {#each milestones.slice(0, 4) as milestone}
              {@const isEarned = earnedBadges.includes(milestone.name)}
              {@const progress = Math.min((stats[0].number / milestone.count) * 100, 100)}
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full {isEarned ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center mr-3">
                    {#if isEarned}
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    {:else}
                      <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                    {/if}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{milestone.name}</div>
                    <div class="text-xs text-gray-600">{milestone.count} invoices</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium {isEarned ? 'text-green-600' : 'text-gray-600'}">
                    {isEarned ? 'Earned!' : `${stats[0].number}/${milestone.count}`}
                  </div>
                  {#if !isEarned}
                    <div class="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div class="h-2 bg-blue-500 rounded-full transition-all duration-300" style="width: {progress}%"></div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Earnings Summary -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold mb-2">Monthly Earnings</h2>
          <div class="flex items-baseline">
            {#if loading}
              <div class="animate-pulse bg-white/20 h-10 w-32 rounded mb-1"></div>
            {:else}
              {@const monthlyEarnings = invoices.filter(inv => 
                inv.status === 'paid' && 
                new Date(inv.created_at).getMonth() === new Date().getMonth()
              ).reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0)}
              <div class="text-3xl font-bold">{monthlyEarnings.toFixed(2)}</div>
              <div class="text-lg ml-2 opacity-90">NERO</div>
            {/if}
          </div>
          <div class="text-sm opacity-75 mt-1">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div class="text-right">
          <div class="bg-white/20 rounded-lg p-4">
            <div class="text-2xl mb-1">📈</div>
            <div class="text-sm opacity-75">+{stats[2].number} paid</div>
          </div>
        </div>
      </div>
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
        {#if loading}
          <div class="p-6 text-center">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading invoices...
            </div>
          </div>
        {:else if invoices.length === 0}
          <div class="p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M34 26H14a2 2 0 00-2 2v12a2 2 0 002 2h20a2 2 0 002-2V28a2 2 0 00-2-2zM24 8v6m0 0V8m0 6l-8-8m8 8l8-8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating your first invoice.</p>
            <div class="mt-6">
              <a 
                href="/freelancer/dashboard/create-invoice" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Create Invoice
              </a>
            </div>
          </div>
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
                    <div class="w-2 h-2 {inv.status === 'paid' ? 'bg-green-500' : inv.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} rounded-full"></div>
                    <span class="text-sm font-medium {inv.status === 'paid' ? 'text-green-600' : inv.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}">
                      {#if inv.status === 'pending' || inv.status === 'unpaid' || !inv.status}
                        pending
                      {:else}
                        {inv.status}
                      {/if}
                    </span>
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
