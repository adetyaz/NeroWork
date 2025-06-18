<script lang="ts">

import { goto } from '$app/navigation';
let freelancerProfile: { full_name?: string; fullName?: string } | null = null;
let walletAddress = '';

$effect(() => {
	walletAddress = localStorage.getItem('connectedWallet') || '';
	if (!walletAddress) {
		goto('/');
	}
	const profile = localStorage.getItem('freelancerProfile');
	freelancerProfile = profile ? JSON.parse(profile) : null;
});
</script>

<div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
	<h1 class="mb-1 text-xl font-semibold">Hello, {freelancerProfile?.full_name || freelancerProfile?.fullName || (walletAddress ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : 'Freelancer')}</h1>
	<p class="text-sm text-gray-500">Create and track your invoices. Get paid instantly.</p>
	<div class="mt-6">
		<a
			href="/freelancer/dashboard/create-invoice"
			class="inline-block rounded bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition"
			>Create Invoice</a
		>
	</div>
</div>
<!-- You can add invoice stats, recent invoices, and badges here as needed -->
