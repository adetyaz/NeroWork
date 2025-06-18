<script lang="ts">
	import { supabase } from '$lib/utils/supabaseClient.js';
	import { getSigner, executeOperation } from '$lib/utils/aaUtils';
	import { API_KEY } from '$lib/config';
	import { goto } from '$app/navigation';

	let walletAddress = localStorage.getItem('connectedWallet') || '';
	let projectName = '';
	let clientName = '';
	let clientEmail = '';
	let projectDescription = '';
	let amount = '';
	let isSubmitting = false;

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		try {
			if (!projectName || !clientName || !clientEmail || !projectDescription || !amount) {
				throw new Error('All fields are required.');
			}
			// Mint invoice on-chain
			const signer = await getSigner();
			const zeroAddress = '0x0000000000000000000000000000000000000000';
			const NeroInvoiceABI = [
				"function createInvoice(address client, string clientEmail, string title, string description, uint256 amount) external"
			];
			const result = await executeOperation(
				signer,
				// Set your deployed NeroInvoice contract address here:
				'0x6da24cb091a69bc3026b233dbdd146ceb3b72727',
				NeroInvoiceABI as any,
				'createInvoice',
				[zeroAddress, clientEmail, projectName, projectDescription, amount],
				0,
				'',
				{ apiKey: API_KEY }
			);
			// Save to Supabase
			const { error } = await supabase.from('invoices').insert([
				{
					project_name: projectName,
					client_name: clientName,
					client_email: clientEmail,
					project_description: projectDescription,
					amount,
					chain_tx_hash: result.transactionHash,
					user_address: walletAddress
				}
			]);
			if (error) throw error;
			// Optionally show a toast or redirect here
			// For now, just redirect to my-invoices
			goto('/freelancer/dashboard/my-invoices');
		} catch (error: any) {
			// Optionally show a toast for error
			alert(error.message || error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if !walletAddress}
	<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm text-center">
		<h1 class="mb-4 text-2xl font-bold">Connect Wallet</h1>
		<p class="mb-2 text-gray-600">Please connect your wallet to create an invoice.</p>
	</div>
{:else}
	<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
		<h1 class="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Create Invoice</h1>
		<form onsubmit={handleSubmit}>
			<div class="mb-4">
				<label class="block text-sm font-medium mb-1">Project Name</label>
				<input type="text" class="w-full border rounded px-3 py-2" bind:value={projectName} required />
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium mb-1">Client Name</label>
				<input type="text" class="w-full border rounded px-3 py-2" bind:value={clientName} required />
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium mb-1">Client Email</label>
				<input type="email" class="w-full border rounded px-3 py-2" bind:value={clientEmail} required />
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium mb-1">Project Description</label>
				<textarea class="w-full border rounded px-3 py-2" bind:value={projectDescription} required></textarea>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium mb-1">Amount (NERO, smallest unit)</label>
				<input type="number" class="w-full border rounded px-3 py-2" bind:value={amount} required min="0" />
			</div>
			<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
				{isSubmitting ? 'Creating...' : 'Create Invoice'}
			</button>
		</form>
	</div>
{/if}
