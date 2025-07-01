<script lang="ts">
	import { paymasterStore } from '$lib/stores/paymasterStore';
	import { web3AuthStore } from '$lib/stores/web3AuthStore';

	let { compact = false, showDetails = true }: {
		compact?: boolean;
		showDetails?: boolean;
	} = $props();

	const gaslessAvailable = $derived($paymasterStore.isFirstTimeUser || $paymasterStore.sponsorshipInfo.freeGasAvailable);
	const isConnected = $derived($web3AuthStore.isConnected);
</script>

{#if isConnected}
	<div class="flex items-center gap-2 {compact ? 'text-xs' : 'text-sm'}">
		{#if gaslessAvailable}
			<div class="flex items-center gap-1 text-green-600">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
				<span class="font-medium">Gasless</span>
			</div>
			
			{#if showDetails && !compact}
				<span class="text-gray-500">
					{#if $paymasterStore.isFirstTimeUser}
						First-time user bonus
					{:else}
						{$paymasterStore.sponsorshipInfo.usedToday}/{$paymasterStore.sponsorshipInfo.dailyLimit} today
					{/if}
				</span>
			{/if}
		{:else if $paymasterStore.sponsorMode === 'TOKEN_PAYMENT'}
			<div class="flex items-center gap-1 text-blue-600">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
				</svg>
				<span class="font-medium">Pay with {$paymasterStore.selectedPaymentToken}</span>
			</div>
		{:else}
			<div class="flex items-center gap-1 text-gray-600">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<span class="font-medium">Pay Gas</span>
			</div>
		{/if}
		
		{#if !compact && showDetails}
			<button
				class="text-xs text-blue-600 hover:text-blue-800 underline"
				onclick={() => {
					// Toggle paymaster settings modal
				}}
			>
				Settings
			</button>
		{/if}
	</div>
{/if}
