<script lang="ts">
	import { supabase } from '$lib/utils/supabaseClient.js';
	import { getSigner, executeOperation } from '$lib/utils/aaUtils';
	import { API_KEY } from '$lib/config';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import TokenSelector from '$lib/components/TokenSelector.svelte';
	import { selectedPaymentToken } from '$lib/stores/tokenStore';
	import { DUE_DATE_OPTIONS } from '$lib/types/reminders';

	let walletAddress = $state('');
	let projectName = $state('');
	let clientName = $state('');
	let clientEmail = $state('');
	let projectDescription = $state('');
	let amount = $state('');
	let dueDateDays = $state(30); // Default 30 days
	let reminderEnabled = $state(true);
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);

	// Get the wallet address using the same method as my-invoices
	$effect(() => {
		async function getWalletAddress() {
			try {
				const signer = await getSigner();
				const address = await signer.getAddress();
				walletAddress = address; // Keep original case from wallet
			} catch (err) {
				walletAddress = '';
			}
		}
		
		if (browser) {
			getWalletAddress();
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		error = '';
		success = false;

		try {
			// Validate form data
			if (!projectName.trim()) throw new Error('Project name is required');
			if (!clientName.trim()) throw new Error('Client name is required');
			if (!clientEmail.trim()) throw new Error('Client email is required');
			if (!projectDescription.trim()) throw new Error('Project description is required');
			if (!amount || parseFloat(amount) <= 0) throw new Error('Amount must be greater than 0');

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(clientEmail.trim())) {
				throw new Error('Please enter a valid email address');
			}

			// Mint invoice on-chain
			const signer = await getSigner();
			const zeroAddress = '0x0000000000000000000000000000000000000000';
			const NeroInvoiceABI = [
				"function createInvoice(address client, string clientEmail, string title, string description, uint256 amount) external"
			];
			
			const result = await executeOperation(
				signer,
				'0x6da24cb091a69bc3026b233dbdd146ceb3b72727',
				NeroInvoiceABI as any,
				'createInvoice',
				[zeroAddress, clientEmail.trim(), projectName.trim(), projectDescription.trim(), amount],
				0,
				'',
				{ apiKey: API_KEY }
			);

			// Calculate due date
			const dueDate = new Date();
			dueDate.setDate(dueDate.getDate() + dueDateDays);

			// Save to Supabase
			const invoiceData = {
				project_name: projectName.trim(),
				client_name: clientName.trim(),
				client_email: clientEmail.trim(),
				project_description: projectDescription.trim(),
				amount: parseFloat(amount),
				chain_tx_hash: result.transactionHash,
				user_address: walletAddress, // Keep original case from wallet
				status: 'pending', // Set default status to pending
				due_date: dueDate.toISOString(),
				reminder_enabled: reminderEnabled,
				reminder_count: 0
			};

			console.log('Creating invoice with wallet address:', walletAddress);
			console.log('Invoice data to insert:', invoiceData);

			const { data: insertedData, error: supabaseError } = await supabase.from('invoices').insert([invoiceData]).select();

			if (supabaseError) {
				console.error('Supabase insert error:', supabaseError);
				throw new Error(supabaseError.message);
			}
			
			console.log('Invoice created successfully:', insertedData);

			success = true;
			setTimeout(() => {
				goto('/freelancer/dashboard/my-invoices');
			}, 2000);

		} catch (err: any) {
			console.error('Error creating invoice:', err);
			error = err.message || 'Failed to create invoice. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if !walletAddress}
	<div class="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-sm text-center border border-gray-200">
		<div class="mb-4">
			<svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
				<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>
		<h1 class="mb-4 text-2xl font-bold text-gray-900">Connect Your Wallet</h1>
		<p class="mb-6 text-gray-600">Please connect your NERO wallet to create and manage invoices.</p>
		<a 
			href="/"
			class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
		>
			Go to Home Page
		</a>
	</div>
{:else}
	<div class="mx-auto max-w-3xl">
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="border-b border-gray-200 p-6">
				<h1 class="text-2xl font-bold text-gray-900">Create New Invoice</h1>
				<p class="mt-1 text-gray-600">Generate a professional on-chain invoice for your client</p>
			</div>

			{#if success}
				<div class="p-6">
					<div class="rounded-md bg-green-50 p-4 border border-green-200">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-green-800">Invoice created successfully!</h3>
								<p class="mt-1 text-sm text-green-700">Redirecting to your invoices page...</p>
							</div>
						</div>
					</div>
				</div>
			{:else}
				{#if error}
					<div class="p-6 pb-0">
						<div class="rounded-md bg-red-50 p-4 border border-red-200">
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
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="p-6 space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
							<input 
								id="projectName"
								type="text" 
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								bind:value={projectName} 
								required 
								disabled={isSubmitting}
								placeholder="e.g., Website Redesign"
							/>
						</div>
						
						<div>
							<label for="amount" class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
							<input 
								id="amount"
								type="number" 
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								bind:value={amount} 
								required 
								min="0" 
								step="0.01"
								disabled={isSubmitting}
								placeholder="1000"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label for="clientName" class="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
							<input 
								id="clientName"
								type="text" 
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								bind:value={clientName} 
								required 
								disabled={isSubmitting}
								placeholder="John Doe"
							/>
						</div>

						<div>
							<label for="clientEmail" class="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
							<input 
								id="clientEmail"
								type="email" 
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								bind:value={clientEmail} 
								required 
								disabled={isSubmitting}
								placeholder="john@company.com"
							/>
						</div>
					</div>

					<div>
						<label id="token-selector-label" class="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Token</label>
						<div aria-labelledby="token-selector-label">
							<TokenSelector />
						</div>
						<p class="mt-1 text-xs text-gray-500">Clients can pay with any supported token, but this shows your preference</p>
					</div>

					<div>
						<label for="projectDescription" class="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
						<textarea 
							id="projectDescription"
							class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							bind:value={projectDescription} 
							required 
							rows="4"
							disabled={isSubmitting}
							placeholder="Describe the work completed, deliverables, and any additional details..."
						></textarea>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label for="dueDateDays" class="block text-sm font-medium text-gray-700 mb-2">Payment Due In</label>
							<select 
								id="dueDateDays"
								class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								bind:value={dueDateDays}
								disabled={isSubmitting}
							>
								{#each DUE_DATE_OPTIONS as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
							<p class="mt-1 text-xs text-gray-500">How many days the client has to pay after receiving the invoice</p>
						</div>

						<div>
							<label for="reminderEnabled" class="block text-sm font-medium text-gray-700 mb-2">Payment Reminders</label>
							<div class="flex items-center space-x-3">
								<input 
									id="reminderEnabled"
									type="checkbox" 
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
									bind:checked={reminderEnabled}
									disabled={isSubmitting}
								/>
								<label for="reminderEnabled" class="text-sm text-gray-700">
									Send automatic payment reminders
								</label>
							</div>
							<p class="mt-1 text-xs text-gray-500">Automatically remind clients about overdue payments (7, 14, 30 days)</p>
						</div>
					</div>

					<div class="flex items-center justify-between pt-4 border-t border-gray-200">
						<a 
							href="/freelancer/dashboard/my-invoices"
							class="text-gray-600 hover:text-gray-800 font-medium"
						>
							← Back to Invoices
						</a>
						
						<button 
							type="submit" 
							class="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Creating Invoice...
							{:else}
								Create Invoice
							{/if}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
