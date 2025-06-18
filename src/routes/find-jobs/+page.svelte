<script lang="ts">
	import JobCard from '$lib/components/ui/job-card.svelte';
	import type { PageProps } from './$types';

	let { data: jobs }: PageProps = $props();

	let viewMode = $state('grid');

	console.log('Jobs:', jobs);
</script>

<div class="min-h-screen bg-[#f1f2f4]">
	<!-- Main Content -->
	<main class="container mx-auto px-4 py-6">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-xl font-bold">Find Job</h1>
			<div class="flex items-center text-sm">
				<a href="/" class="text-gray-500 hover:text-gray-900"> Home </a>
				<span class="mx-2">/</span>
				<span class="text-gray-900">Find job</span>
			</div>
		</div>

		<!-- Search Section -->
		<div class="mb-6 rounded-lg bg-white p-4 shadow-sm">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
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
						placeholder="Job title, Keyword..."
						class="w-full rounded-md border py-2 pr-4 pl-10"
					/>
				</div>
			</div>
		</div>

		<!-- Job Listings -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Job Card 1 -->
			{#each jobs?.data ?? [] as job (job.id)}
				<JobCard
					id={job.id}
					title={job.title}
					status={job.status}
					budget={job.budget}
					job_role={job.job_role}
					description={job.description}
				/>
			{/each}
			<!-- More job cards would go here -->
		</div>

		<!-- Pagination -->
		<!-- <div class="mt-10 flex items-center justify-center">
			<button class="mr-2 rounded-full border border-gray-200 p-2">
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
					class="text-gray-400"
				>
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>
			<button class="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066ff] text-white"
				>01</button
			>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				02
			</button>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				03
			</button>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				04
			</button>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				05
			</button>
			<button class="ml-2 rounded-full border border-gray-200 p-2">
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
					class="text-gray-500"
				>
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>
		</div> -->
	</main>
</div>
