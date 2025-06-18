<script lang="ts">
import { Briefcase, Bookmark, Bell, MapPin, DollarSign, Calendar, Eye } from '@lucide/svelte';
import { onMount } from 'svelte';

let stats = $state([
  { number: 0, label: 'Created Invoices', icon: Briefcase, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { number: 0, label: 'Badges', icon: Bookmark, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { number: 0, label: 'Paid Invoices', icon: Bell, bgColor: 'bg-green-100', iconColor: 'text-green-600' }
]);

let invoices = $state<any[]>([]);
let freelancerWallet = $state('');

$effect(() => {
  const profile = localStorage.getItem('freelancerProfile');
  if (profile) {
    const parsed = JSON.parse(profile);
    freelancerWallet = parsed.walletAddress || parsed.wallet;
  }
  const allInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
  invoices = allInvoices.filter((inv: any) => inv.clientWallet !== freelancerWallet);
  // Update stats
  stats[0].number = invoices.length;
  stats[2].number = invoices.filter((inv: any) => inv.status === 'paid').length;
  // Placeholder for badges
  stats[1].number = Math.floor(invoices.length / 5);
});

function handleEditProfile() {
  // TODO: Implement profile editing
}

function handleViewDetails(invoiceId: string) {
  // TODO: Implement invoice details view
}

function handleViewAll() {
  // TODO: Implement view all invoices
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

    <!-- Profile Completion Banner -->
    <div class="bg-red-500 rounded-lg p-6 mb-8 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
          <div>
            <h3 class="font-semibold mb-1">Your profile editing is not completed.</h3>
            <p class="text-red-100 text-sm">Complete your profile editing & build your custom Resume</p>
          </div>
        </div>
        <button 
          onclick={handleEditProfile}
          class="bg-white text-red-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Edit Profile →
        </button>
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
        {#each invoices as inv}
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <!-- Invoice Info -->
              <div class="col-span-1 md:col-span-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {inv.title.charAt(0)}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{inv.title}</h3>
                    <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {inv.amount} ETH
                      </span>
                      <div class="flex items-center gap-1">
                        <MapPin class="w-3 h-3" />
                        {inv.clientWallet.slice(0, 6)}...{inv.clientWallet.slice(-4)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Created Date -->
              <div class="col-span-1 md:col-span-3">
                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar class="w-4 h-4" />
                  {new Date(inv.createdAt).toLocaleString()}
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
      </div>
    </div>
  </div>
</div>
