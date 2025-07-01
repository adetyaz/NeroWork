<script lang="ts">
	import { onMount } from 'svelte';
	import { web3AuthStore, web3AuthService } from '$lib/stores/web3AuthStore';
	import { paymasterService } from '$lib/stores/paymasterStore';

	let { 
		mode = 'button', 
		size = 'md', 
		variant = 'primary' 
	}: {
		mode?: 'button' | 'modal';
		size?: 'sm' | 'md' | 'lg';
		variant?: 'primary' | 'secondary' | 'outline';
	} = $props();

	let isInitialized = $state(false);
	let initError = $state(false);

	onMount(async () => {
		try {
			await web3AuthService.init();
			isInitialized = true;
		} catch (error) {
			console.error('Failed to initialize Web3Auth:', error);
			initError = true;
			isInitialized = true; // Still show the button but in error state
		}
	});

	async function handleLogin() {
		try {
			await web3AuthService.login();
			
			// Check if user is first-time for paymaster eligibility
			const currentState = $web3AuthStore;
			if (currentState.address) {
				await paymasterService.checkFirstTimeUser(currentState.address);
				await paymasterService.getSponsorshipInfo(currentState.address);
			}
		} catch (error) {
			console.error('Login failed:', error);
		}
	}

	async function handleLogout() {
		try {
			await web3AuthService.logout();
			localStorage.removeItem('connectedWallet');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	function formatAddress(address: string): string {
		if (!address) return '';
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}

	const sizeClasses = $derived({
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	});

	const variantClasses = $derived({
		primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent',
		secondary: 'bg-gray-600 hover:bg-gray-700 text-white border border-transparent', 
		outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300'
	});
</script>

{#if !isInitialized}
	<div class="flex items-center gap-2 {sizeClasses[size]} {variantClasses[variant]} rounded-md">
		<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		Loading...
	</div>
{:else if $web3AuthStore.isLoading}
	<div class="flex items-center gap-2 {sizeClasses[size]} {variantClasses[variant]} rounded-md">
		<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		Connecting...
	</div>
{:else if $web3AuthStore.isConnected}
	<div class="flex items-center gap-3">
		{#if $web3AuthStore.user?.profileImage}
			<img 
				src={$web3AuthStore.user.profileImage} 
				alt="Profile" 
				class="w-8 h-8 rounded-full"
			/>
		{:else}
			<div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
				{$web3AuthStore.user?.name?.charAt(0) || 'U'}
			</div>
		{/if}
		
		<div class="flex flex-col">
			<span class="text-sm font-medium text-gray-900">
				{$web3AuthStore.user?.name || 'Anonymous'}
			</span>
			<span class="text-xs text-gray-500">
				{formatAddress($web3AuthStore.address)}
			</span>
		</div>
		
		<button
			onclick={handleLogout}
			class="ml-3 px-3 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
		>
			Disconnect
		</button>
	</div>
{:else}
	<button
		onclick={handleLogin}
		class="flex items-center gap-2 {sizeClasses[size]} {variantClasses[variant]} rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		disabled={$web3AuthStore.isLoading}
	>
		<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
			<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
			<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
			<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
		</svg>
		
		{#if mode === 'button'}
			Connect with Social
		{:else}
			Sign in
		{/if}
	</button>
{/if}

{#if $web3AuthStore.error}
	<div class="mt-2 text-sm text-red-600">
		{$web3AuthStore.error}
	</div>
{/if}
