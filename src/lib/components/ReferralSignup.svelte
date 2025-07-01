<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { ReferralService } from '$lib/services/referralService.js';
import { addNotification } from '$lib/utils/notifications';

let referralCode = $state('');
let isValidCode = $state(false);
let checkingCode = $state(false);
let referrerInfo = $state<{address: string, tier: string} | null>(null);

const referralService = ReferralService.getInstance();

onMount(() => {
  // Check if there's a referral code in URL
  const urlReferralCode = $page.url.searchParams.get('ref');
  if (urlReferralCode) {
    referralCode = urlReferralCode;
    validateReferralCode();
  }
});

async function validateReferralCode() {
  if (!referralCode.trim()) {
    isValidCode = false;
    referrerInfo = null;
    return;
  }

  try {
    checkingCode = true;
    
    // Basic format validation
    if (!referralService.isValidReferralCode(referralCode)) {
      isValidCode = false;
      referrerInfo = null;
      return;
    }

    // Check if code exists and is active
    const program = await referralService.getReferralProgramByCode(referralCode);
    
    if (program) {
      isValidCode = true;
      const stats = await referralService.getReferralStats(program.referrer_address);
      referrerInfo = {
        address: program.referrer_address,
        tier: stats.current_tier.name
      };
    } else {
      isValidCode = false;
      referrerInfo = null;
    }
  } catch (error) {
    console.error('Error validating referral code:', error);
    isValidCode = false;
    referrerInfo = null;
  } finally {
    checkingCode = false;
  }
}

function handleCodeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  referralCode = target.value.toUpperCase();
  
  // Debounce validation
  setTimeout(() => {
    if (referralCode === target.value.toUpperCase()) {
      validateReferralCode();
    }
  }, 500);
}

export function getReferralCode(): string {
  return isValidCode ? referralCode : '';
}

export function hasValidReferral(): boolean {
  return isValidCode;
}
</script>

<div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
  <div class="flex items-center mb-4">
    <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
    </svg>
    <h3 class="text-lg font-semibold text-gray-900">Referral Code</h3>
  </div>
  
  <p class="text-sm text-gray-600 mb-4">
    Do you have a referral code? Enter it below to give your referrer credit and unlock potential bonuses.
  </p>
  
  <div class="space-y-3">
    <div>
      <label for="referral-code" class="block text-sm font-medium text-gray-700 mb-1">
        Referral Code (Optional)
      </label>
      <div class="relative">
        <input
          id="referral-code"
          type="text"
          value={referralCode}
          oninput={handleCodeInput}
          placeholder="Enter referral code (e.g., NERO123ABC)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono uppercase"
          maxlength="12"
        />
        {#if checkingCode}
          <div class="absolute right-3 top-2.5">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          </div>
        {/if}
      </div>
    </div>
    
    {#if referralCode && !checkingCode}
      {#if isValidCode && referrerInfo}
        <div class="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-green-800">Valid referral code!</p>
            <p class="text-xs text-green-600">
              Referrer: {referrerInfo.tier} • {referrerInfo.address.slice(0, 6)}...{referrerInfo.address.slice(-4)}
            </p>
          </div>
        </div>
      {:else}
        <div class="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-sm font-medium text-red-800">Invalid or expired referral code</p>
        </div>
      {/if}
    {/if}
  </div>
  
  {#if isValidCode}
    <div class="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
      <h4 class="text-sm font-medium text-purple-900 mb-1">🎉 Referral Benefits</h4>
      <ul class="text-xs text-purple-700 space-y-1">
        <li>• Your referrer will earn rewards when you become active</li>
        <li>• You may receive welcome bonuses or special perks</li>
        <li>• Join the NeroWork referral community</li>
      </ul>
    </div>
  {/if}
</div>
