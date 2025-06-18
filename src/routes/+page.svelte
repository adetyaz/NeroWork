<script lang="ts">
	
	let walletAddress = $state('');
	$effect(() => {
		walletAddress = localStorage.getItem('connectedWallet') || '';
	});
</script>

<main>
	<section class="bg-gray-900 px-6 py-20 text-white">
		<div class="mx-auto max-w-5xl text-center">
			<h1 class="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
				Get Paid Instantly as a <span class="text-purple-400">Freelancer</span>
			</h1>
			<p class="mx-auto mb-8 max-w-3xl text-lg leading-relaxed md:text-2xl">
				Create professional invoices, share payment links, and track payments on-chain. <span class="text-purple-400"
					>No platform fees</span
				>, instant crypto payouts, and a simple dashboard for all your freelance work.
			</p>
			{#if walletAddress}
				<a
					href="/freelancer/dashboard/create-invoice"
					class="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl"
				>
					Create Invoice
				</a>
			{:else}
				<p class="mt-6 text-lg text-purple-200">Connect your wallet to get started.</p>
			{/if}
		</div>
	</section>
</main>
