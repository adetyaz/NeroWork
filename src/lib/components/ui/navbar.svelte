<script>
	import AaWalletConnect from "../AAWalletConnect.svelte";
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let walletAddress = $state(browser ? localStorage.getItem('connectedWallet') || '' : '');
</script>
<header class="border-b border-gray-200 bg-white">
	<div class="container mx-auto px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-8">
				<a href="/" class="flex items-center space-x-2">
					<img src="/logo.png" alt="NeroWork Logo" class='h-12' />
					<span class="text-xl  text-gray-500">Nerowork</span>
				</a>
				<nav class="hidden items-center space-x-6 md:flex">
					<a href="/" class="text-gray-500 hover:text-gray-900"> Home </a>
					{#if walletAddress}
						<a href="/freelancer/dashboard" class="font-medium text-[#0066ff]"> Dashboard </a>
						<a href="/freelancer/dashboard/create-invoice" class="text-gray-500 hover:text-gray-900">Create Invoice</a>
					{/if}
				</nav>
			</div>
			<AaWalletConnect />
		</div>
		<div class="mt-4 md:hidden">
			<div class="flex items-center space-x-4">
				<div class="flex-1">
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
						<input
							type="text"
							placeholder="Job title, keyword, company"
							class="w-full rounded-md border py-2 pr-4 pl-10"
						/>
					</div>
				</div>
			
			</div>
		</div>
	</div>
</header>
