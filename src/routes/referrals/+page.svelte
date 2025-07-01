<script lang="ts">
import ReferralDashboard from '$lib/components/ReferralDashboard.svelte';
import { onMount } from 'svelte';
import { getSigner } from '$lib/utils/aaUtils';
import { ReferralService } from '$lib/services/referralService.js';

let userConnected = $state(false);
let loading = $state(true);

const referralService = ReferralService.getInstance();

onMount(async () => {
  try {
    const signer = await getSigner();
    const address = await signer.getAddress();
    userConnected = !!address;
    
    // Auto-initialize referral program if user is connected
    if (userConnected) {
      await referralService.getOrCreateReferralProgram(address);
    }
  } catch (error) {
    console.error('Error checking user connection:', error);
    userConnected = false;
  } finally {
    loading = false;
  }
});
</script>

<svelte:head>
  <title>Referral Program - NeroWork</title>
  <meta name="description" content="Earn rewards by referring new freelancers to NeroWork. Join our referral program and build your network while earning NERO tokens." />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p class="mt-2 text-gray-500">Loading...</p>
      </div>
    {:else if !userConnected}
      <!-- Not Connected State -->
      <div class="text-center py-12">
        <div class="max-w-2xl mx-auto">
          <div class="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-900 mb-4">NeroWork Referral Program</h1>
          <p class="text-lg text-gray-600 mb-8">
            Earn rewards by bringing talented freelancers to the NeroWork ecosystem. 
            Share your unique referral link and earn NERO tokens for every successful referral!
          </p>
          
          <!-- Program Benefits -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <div class="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Earn NERO Tokens</h3>
              <p class="text-gray-600 text-sm">
                Get 50 NERO tokens for each successful referral, with tier-based multipliers up to 2x!
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <div class="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Tier System</h3>
              <p class="text-gray-600 text-sm">
                Unlock higher tiers with more referrals. Reach Platinum for 100% bonus rewards and exclusive perks!
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <div class="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Instant Tracking</h3>
              <p class="text-gray-600 text-sm">
                Real-time tracking of your referrals, rewards, and tier progress with detailed analytics.
              </p>
            </div>
          </div>
          
          <!-- Tier Breakdown -->
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Referral Tiers & Rewards</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals Needed</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Multiplier</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier Bonus</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-amber-600 rounded-full mr-2"></div>
                        <span class="text-sm font-medium text-gray-900">Bronze</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0+</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.0x (50 NERO)</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        <span class="text-sm font-medium text-gray-900">Silver</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5+</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.2x (60 NERO)</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">100 NERO</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span class="text-sm font-medium text-gray-900">Gold</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15+</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.5x (75 NERO)</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">300 NERO</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                        <span class="text-sm font-medium text-gray-900">Platinum</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30+</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.0x (100 NERO)</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">500 NERO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              <strong>Connect your wallet</strong> to access your referral dashboard, generate your unique referral link, and start earning rewards!
            </p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Connected State - Show Dashboard -->
      <ReferralDashboard />
    {/if}
  </div>
</div>
