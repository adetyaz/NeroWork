<script lang="ts">
	import { Wallet, CreditCard, ArrowRight, Check } from 'lucide-svelte';

	let currentStep = $state(1);
	let selectedToken = $state('USDC');
	let withdrawAmount = $state('');
	let isProcessing = $state(false);
	let isCompleted = $state(false);

	const tokens = ['USDC', 'ETH', 'NERO', 'DAI'];
	
	async function processWithdrawal() {
		if (!withdrawAmount || isProcessing) return;
		
		isProcessing = true;
		currentStep = 2;
		
		try {
			// Step 1: Prepare transaction
			await new Promise(resolve => setTimeout(resolve, 1000));
			currentStep = 3;
			
			// Step 2: Call API to process gasless withdrawal
			const response = await fetch('/demo/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'gasless_withdrawal',
					amount: withdrawAmount,
					token: selectedToken,
					walletAddress: '0x742d35Cc6129C6c32168e4c458C8EA75E2E27C7F' // Mock address
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				currentStep = 4;
				isCompleted = true;
			} else {
				// Handle error
				console.error('Withdrawal failed:', result.error);
			}
		} catch (error) {
			console.error('API call failed:', error);
		} finally {
			isProcessing = false;
		}
	}

	function resetDemo() {
		currentStep = 1;
		selectedToken = 'USDC';
		withdrawAmount = '';
		isProcessing = false;
		isCompleted = false;
	}
</script>

<div class="rounded-2xl bg-white/10 p-8 backdrop-blur-lg">
	<div class="mb-6 flex items-center">
		<Wallet class="mr-3 h-6 w-6 text-purple-400" />
		<h3 class="text-2xl font-bold text-white">Gasless Withdrawal Demo</h3>
	</div>

	<!-- Progress Steps -->
	<div class="mb-8 flex items-center justify-between">
		{#each [1, 2, 3, 4] as step}
			<div class="flex items-center">
				<div 
					class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
					class:bg-purple-500={currentStep >= step}
					class:text-white={currentStep >= step}
					class:bg-gray-600={currentStep < step}
					class:text-gray-400={currentStep < step}
				>
					{#if currentStep > step}
						<Check class="h-4 w-4" />
					{:else}
						{step}
					{/if}
				</div>
				{#if step < 4}
					<div 
						class="mx-2 h-1 w-8 transition-all duration-300"
						class:bg-purple-500={currentStep > step}
						class:bg-gray-600={currentStep <= step}
					></div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Step Content -->
	{#if currentStep === 1}
		<div class="space-y-6">
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-300">Select Token</label>
				<select 
					bind:value={selectedToken}
					class="w-full rounded-lg bg-gray-800 p-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
				>
					{#each tokens as token}
						<option value={token}>{token}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="mb-2 block text-sm font-medium text-gray-300">Amount</label>
				<input 
					type="number"
					bind:value={withdrawAmount}
					placeholder="Enter amount"
					class="w-full rounded-lg bg-gray-800 p-3 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
				/>
			</div>

			<button 
				onclick={processWithdrawal}
				disabled={!withdrawAmount || isProcessing}
				class="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-semibold transition-all duration-300 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
			>
				Start Gasless Withdrawal
				<ArrowRight class="ml-2 h-4 w-4" />
			</button>
		</div>

	{:else if currentStep === 2}
		<div class="text-center">
			<div class="mb-4 animate-spin">
				<Wallet class="mx-auto h-12 w-12 text-purple-400" />
			</div>
			<h4 class="text-xl font-semibold text-white">Preparing Transaction</h4>
			<p class="text-gray-300">Setting up your gasless withdrawal...</p>
		</div>

	{:else if currentStep === 3}
		<div class="text-center">
			<div class="mb-4 animate-pulse">
				<CreditCard class="mx-auto h-12 w-12 text-blue-400" />
			</div>
			<h4 class="text-xl font-semibold text-white">Processing via Paymaster</h4>
			<p class="text-gray-300">NERO Chain is sponsoring your gas fees...</p>
		</div>

	{:else if currentStep === 4}
		<div class="text-center">
			<div class="mb-4">
				<Check class="mx-auto h-12 w-12 text-green-400" />
			</div>
			<h4 class="text-xl font-semibold text-white">Withdrawal Complete!</h4>
			<p class="text-gray-300 mb-4">
				{withdrawAmount} {selectedToken} has been transferred to your wallet with zero gas fees!
			</p>
			
			<div class="rounded-lg bg-green-500/20 p-4 mb-4">
				<div class="flex justify-between text-sm">
					<span class="text-gray-300">Amount:</span>
					<span class="text-white font-semibold">{withdrawAmount} {selectedToken}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-gray-300">Gas Fees:</span>
					<span class="text-green-400 font-semibold">$0.00 (Sponsored by NERO)</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-gray-300">Net Received:</span>
					<span class="text-white font-semibold">{withdrawAmount} {selectedToken}</span>
				</div>
			</div>

			<button 
				onclick={resetDemo}
				class="w-full rounded-lg bg-gray-700 px-6 py-3 text-white font-semibold transition-colors hover:bg-gray-600"
			>
				Try Another Withdrawal
			</button>
		</div>
	{/if}
</div>
