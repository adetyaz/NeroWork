<script lang="ts">
	import { onMount } from 'svelte';

	// Load invoices for this freelancer
	let invoices = $state<any[]>([]);
	let freelancerWallet = $state('');

	$effect(() => {
		const profile = localStorage.getItem('freelancerProfile');
		if (profile) {
			const parsed = JSON.parse(profile);
			freelancerWallet = parsed.walletAddress || parsed.wallet;
		}
		const allInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
		invoices = allInvoices.filter((inv: any) => inv.clientWallet !== freelancerWallet);
	});

	function markAsPaid(id: string) {
		const allInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
		const idx = allInvoices.findIndex((inv: any) => inv.id === id);
		if (idx !== -1) {
			allInvoices[idx].status = 'paid';
			localStorage.setItem('invoices', JSON.stringify(allInvoices));
			invoices = allInvoices.filter((inv: any) => inv.freelancerWallet === freelancerWallet);
		}
	}
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="border-b border-gray-100 p-6">
		<h1 class="text-xl font-semibold">Created Invoices</h1>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Title</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Client</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Freelancer Address</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Share Link</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Amount</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Created</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each invoices as inv}
					<tr>
						<td class="px-6 py-4">{inv.title}</td>
						<td class="px-6 py-4">{inv.clientName}</td>
						<td class="px-6 py-4 font-mono text-xs">{inv.freelancerWallet}</td>
						<td class="px-6 py-4">
							<input class="w-48 px-2 py-1 border rounded text-xs" readonly value={window.location.origin + '/invoice/' + inv.id} />
							<button class="ml-2 px-2 py-1 bg-gray-200 rounded text-xs" on:click={() => navigator.clipboard.writeText(window.location.origin + '/invoice/' + inv.id)}>Copy</button>
						</td>
						<td class="px-6 py-4">{inv.amount}</td>
						<td class="px-6 py-4">
							{#if inv.status === 'unpaid'}
								<button class="px-2 py-1 bg-green-500 text-white rounded text-xs" on:click={() => markAsPaid(inv.id)}>Mark as Paid</button>
							{:else}
								<span class="text-green-600 font-semibold">Paid</span>
							{/if}
						</td>
						<td class="px-6 py-4">{new Date(inv.createdAt).toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if invoices.length === 0}
			<div class="p-6 text-gray-500">No invoices created yet.</div>
		{/if}
	</div>
</div>
