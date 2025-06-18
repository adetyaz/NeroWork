<script lang="ts">
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/ui/toast.svelte';
	import { onMount } from 'svelte';

	let walletAddress = $state('');
	let freelancerName = $state('');
	let freelancerAddress = $state('');
	let clientName = $state('');
	let clientAddress = $state('');
	let invoiceTitle = $state('');
	let dueDate = $state('');
	let items = $state([{ description: '', qty: 1, price: 0 }]);
	let isSubmitting = $state(false);
	let toast = $state({ open: false, message: '', success: false });

	onMount(() => {
		walletAddress = localStorage.getItem('connectedWallet') || '';
		const profile = localStorage.getItem('freelancerProfile');
		if (profile) {
			const parsed = JSON.parse(profile);
			freelancerName = parsed.full_name || parsed.fullName || '';
			freelancerAddress = parsed.address || '';
		}
	});

	function addItem() {
		items = [...items, { description: '', qty: 1, price: 0 }];
	}
	function removeItem(idx: number) {
		if (items.length > 1) items = items.filter((_, i) => i !== idx);
	}
	function handleItemChange(idx: number, field: string, value: any) {
		items = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
	}

	// Handle invoice creation
	function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;
		try {
			if (!invoiceTitle || !clientName || !clientAddress || !dueDate || items.some(i => !i.description || !i.qty || !i.price)) {
				throw new Error('All fields are required.');
			}
			const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
			const newInvoice = {
				id: Date.now().toString(),
				title: invoiceTitle,
				clientName,
				clientAddress,
				items,
				dueDate,
				status: 'unpaid',
				createdAt: new Date().toISOString(),
				freelancerWallet: walletAddress,
				freelancerName,
				freelancerAddress,
				subtotal,
				currency: 'NERO'
			};
			const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
			invoices.push(newInvoice);
			localStorage.setItem('invoices', JSON.stringify(invoices));
			toast = { open: true, message: 'Invoice created!', success: true };
			setTimeout(() => goto('/freelancer/dashboard/my-invoices'), 1200);
		} catch (error: any) {
			toast = { open: true, message: error.message || 'Failed to create invoice.', success: false };
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
				<label for="invoiceTitle" class="block text-sm font-medium mb-1">Invoice Title</label>
				<input id="invoiceTitle" type="text" class="w-full border rounded px-3 py-2" bind:value={invoiceTitle} required />
			</div>
			<div class="mb-4">
				<label for="clientName" class="block text-sm font-medium mb-1">Client Name</label>
				<input id="clientName" type="text" class="w-full border rounded px-3 py-2" bind:value={clientName} required />
			</div>
			<div class="mb-4">
				<label for="clientAddress" class="block text-sm font-medium mb-1">Client Address</label>
				<input id="clientAddress" type="text" class="w-full border rounded px-3 py-2" bind:value={clientAddress} required />
			</div>
			<div class="mb-4">
				<label for="dueDate" class="block text-sm font-medium mb-1">Due Date</label>
				<input id="dueDate" type="date" class="w-full border rounded px-3 py-2" bind:value={dueDate} required />
			</div>
			<div class="mb-4">
				<label class="block text-sm font-medium mb-1">Invoice Items</label>
				{#each items as item, idx}
					<div class="flex gap-2 mb-2">
						<input type="text" class="flex-1 border rounded px-2 py-1" placeholder="Description" bind:value={item.description} oninput={e => handleItemChange(idx, 'description', (e.target as HTMLInputElement).value)} required />
						<input type="number" class="w-20 border rounded px-2 py-1" placeholder="Qty" min="1" bind:value={item.qty} oninput={e => handleItemChange(idx, 'qty', +(e.target as HTMLInputElement).value)} required />
						<input type="number" class="w-28 border rounded px-2 py-1" placeholder="Price (NERO)" min="0" step="any" bind:value={item.price} oninput={e => handleItemChange(idx, 'price', +(e.target as HTMLInputElement).value)} required />
						<button type="button" class="text-red-500" onclick={() => removeItem(idx)} disabled={items.length === 1}>✕</button>
					</div>
				{/each}
				<button type="button" class="mt-2 px-3 py-1 bg-gray-200 rounded" onclick={addItem}>Add Item</button>
			</div>
			<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
				{isSubmitting ? 'Creating...' : 'Create Invoice'}
			</button>
		</form>
		<Toast open={toast.open} status={toast.message} success={toast.success} error={false} />
	</div>
{/if}
