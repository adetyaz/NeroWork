<script lang="ts">
import GasSponsorshipDashboard from '$lib/components/GasSponsorshipDashboard.svelte';
import { onMount } from 'svelte';
import { getSigner } from '$lib/utils/aaUtils';

let userConnected = $state(false);
let loading = $state(true);

onMount(async () => {
  try {
    const signer = await getSigner();
    const address = await signer.getAddress();
    userConnected = !!address;
  } catch (error) {
    console.error('Error checking user connection:', error);
    userConnected = false;
  } finally {
    loading = false;
  }
});
</script>

<svelte:head>
  <title>Gas Sponsorship - NeroWork</title>
  <meta name="description" content="Sponsor gas fees for your favorite clients and build stronger relationships. Manage your gas sponsorship budget and settings on NeroWork." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-500">Loading...</p>
      </div>
    {:else if !userConnected}
      <!-- Not Connected State -->
      <div class="text-center py-12">
        <div class="max-w-2xl mx-auto">
          <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Gas Sponsorship Program</h1>
          <p class="text-lg text-gray-600 mb-8">
            Sponsor gas fees for your favorite clients to improve their experience and strengthen your business relationships.
          </p>
          
          <!-- Program Benefits -->
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
          
          <!-- How it Works -->
          <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">How Gas Sponsorship Works</h3>
            <div class="space-y-4 text-left">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Set Your Budget</h4>
                  <p class="text-sm text-gray-600">Allocate NERO tokens for gas sponsorship with customizable limits.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Add Favorite Clients</h4>
                  <p class="text-sm text-gray-600">Select clients you want to sponsor and set individual gas limits.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Automatic Sponsorship</h4>
                  <p class="text-sm text-gray-600">Gas fees are automatically covered when favorite clients pay invoices.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-semibold text-blue-600">4</span>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Track & Manage</h4>
                  <p class="text-sm text-gray-600">Monitor spending, view analytics, and adjust settings as needed.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Features -->
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Key Features</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Customizable budget limits</span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Per-client gas limits</span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Automatic client detection</span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Real-time spending tracking</span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Budget alerts & notifications</span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Detailed analytics</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              <strong>Connect your wallet</strong> to start sponsoring gas fees for your favorite clients and enhance their payment experience!
            </p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Connected State - Show Dashboard -->
      <GasSponsorshipDashboard />
    {/if}
  </div>
</div>
