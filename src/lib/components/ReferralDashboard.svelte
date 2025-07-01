<script lang="ts">
import { onMount } from 'svelte';
import { ReferralService } from '$lib/services/referralService.js';
import { getSigner } from '$lib/utils/aaUtils';
import { addNotification } from '$lib/utils/notifications';
import type { ReferralStats, ReferralProgram, Referral, ReferralReward } from '$lib/types/referrals.js';

let userAddress = '';
let loading = $state(true);
let referralProgram: ReferralProgram | null = $state(null);
let referralStats: ReferralStats | null = $state(null);
let recentReferrals: Referral[] = $state([]);
let claimableRewards: ReferralReward[] = $state([]);
let showReferralLink = $state(false);
let copying = $state(false);
let claiming = $state(false);

const referralService = ReferralService.getInstance();

onMount(async () => {
  await loadReferralData();
});

async function loadReferralData() {
  try {
    loading = true;
    
    const signer = await getSigner();
    userAddress = await signer.getAddress();
    
    // Load all referral data
    const [program, stats, referrals, rewards] = await Promise.all([
      referralService.getOrCreateReferralProgram(userAddress),
      referralService.getReferralStats(userAddress),
      referralService.getUserReferrals(userAddress, 10),
      referralService.getClaimableRewards(userAddress)
    ]);
    
    referralProgram = program;
    referralStats = stats;
    recentReferrals = referrals;
    claimableRewards = rewards;
    
  } catch (error) {
    console.error('Error loading referral data:', error);
    addNotification({
      type: 'error',
      message: 'Failed to load referral data',
      userWallet: userAddress
    });
  } finally {
    loading = false;
  }
}

async function copyReferralLink() {
  if (!referralProgram) return;
  
  try {
    copying = true;
    const link = referralService.getReferralLink(referralProgram.referral_code);
    await navigator.clipboard.writeText(link);
    
    addNotification({
      type: 'success',
      message: 'Referral link copied to clipboard!',
      userWallet: userAddress
    });
  } catch (error) {
    console.error('Error copying link:', error);
    addNotification({
      type: 'error',
      message: 'Failed to copy referral link',
      userWallet: userAddress
    });
  } finally {
    copying = false;
  }
}

async function claimAllRewards() {
  if (!claimableRewards.length) return;
  
  try {
    claiming = true;
    const rewardIds = claimableRewards.map(r => r.id);
    const success = await referralService.claimRewards(userAddress, rewardIds);
    
    if (success) {
      addNotification({
        type: 'success',
        message: `Successfully claimed ${claimableRewards.length} reward${claimableRewards.length > 1 ? 's' : ''}!`,
        userWallet: userAddress
      });
      
      // Reload data
      await loadReferralData();
    } else {
      throw new Error('Failed to claim rewards');
    }
  } catch (error) {
    console.error('Error claiming rewards:', error);
    addNotification({
      type: 'error',
      message: 'Failed to claim rewards',
      userWallet: userAddress
    });
  } finally {
    claiming = false;
  }
}

function shareReferralLink() {
  if (!referralProgram) return;
  
  const link = referralService.getReferralLink(referralProgram.referral_code);
  const text = `Join NeroWork and start freelancing on the blockchain! Use my referral code: ${referralProgram.referral_code}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Join NeroWork',
      text,
      url: link
    });
  } else {
    // Fallback to copying
    copyReferralLink();
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getReferralStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'rewarded': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getProgressPercentage(): number {
  if (!referralStats?.next_tier) return 100;
  
  const current = referralStats.total_referrals;
  const needed = referralStats.next_tier.min_referrals;
  const previous = referralStats.current_tier.min_referrals;
  
  return Math.min(100, ((current - previous) / (needed - previous)) * 100);
}
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900">Referral Program</h1>
    <button 
      onclick={() => showReferralLink = !showReferralLink}
      class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      {showReferralLink ? 'Hide' : 'Share'} Referral Link
    </button>
  </div>

  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <p class="mt-2 text-gray-500">Loading referral data...</p>
    </div>
  {:else if referralProgram && referralStats}
    
    <!-- Referral Link Section -->
    {#if showReferralLink}
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Share Your Referral Link</h3>
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <div class="flex-1 p-3 bg-white border rounded-lg text-sm text-gray-600 font-mono">
              {referralService.getReferralLink(referralProgram.referral_code)}
            </div>
            <button 
              onclick={copyReferralLink}
              disabled={copying}
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
            >
              {copying ? 'Copying...' : 'Copy'}
            </button>
          </div>
          <div class="flex space-x-2">
            <button 
              onclick={shareReferralLink}
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Share Link
            </button>
            <div class="text-sm text-gray-600 py-2">
              Referral Code: <span class="font-mono font-semibold">{referralProgram.referral_code}</span>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Referrals</p>
            <p class="text-2xl font-bold text-gray-900">{referralStats.total_referrals}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Rewards Earned</p>
            <p class="text-2xl font-bold text-gray-900">{referralStats.total_rewards_earned} NERO</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Current Tier</p>
            <p class="text-lg font-bold text-gray-900">{referralStats.current_tier.name}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending Rewards</p>
            <p class="text-2xl font-bold text-gray-900">{claimableRewards.length}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier Progress -->
    {#if referralStats.next_tier}
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Progress to {referralStats.next_tier.name}</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-gray-600">
            <span>{referralStats.total_referrals} referrals</span>
            <span>{referralStats.next_tier.min_referrals} needed</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style="width: {getProgressPercentage()}%"
            ></div>
          </div>
          <p class="text-sm text-gray-600">
            {referralStats.referrals_to_next_tier} more referrals needed for next tier
          </p>
        </div>
        
        <!-- Next tier benefits -->
        <div class="mt-4 p-4 bg-purple-50 rounded-lg">
          <h4 class="font-medium text-purple-900 mb-2">Next Tier Benefits:</h4>
          <ul class="text-sm text-purple-700 space-y-1">
            {#each referralStats.next_tier.benefits as benefit}
              <li class="flex items-center">
                <svg class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                {benefit}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}

    <!-- Claimable Rewards -->
    {#if claimableRewards.length > 0}
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Claimable Rewards</h3>
          <button 
            onclick={claimAllRewards}
            disabled={claiming}
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {claiming ? 'Claiming...' : `Claim All (${claimableRewards.reduce((sum, r) => sum + r.amount, 0)} NERO)`}
          </button>
        </div>
        
        <div class="space-y-3">
          {#each claimableRewards as reward}
            <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{reward.amount} {reward.token}</p>
                <p class="text-sm text-gray-600">Created {formatDate(reward.created_at)}</p>
              </div>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Ready to claim
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Recent Referrals -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Recent Referrals</h3>
      </div>
      
      {#if recentReferrals.length === 0}
        <div class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-2">No referrals yet</h4>
          <p class="text-gray-500">Share your referral link to start earning rewards!</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referee
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each recentReferrals as referral}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {referral.referee_address.slice(0, 6)}...{referral.referee_address.slice(-4)}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getReferralStatusColor(referral.status)}">
                      {referral.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {referral.reward_amount} {referral.reward_token}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">
                      {formatDate(referral.created_at)}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}
</div>
