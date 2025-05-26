<script lang="ts">
	// Selected plan
	let selectedPlan = $state('standard');

	// Plans data
	const plans = [
		{
			id: 'basic',
			name: 'BASIC',
			price: '$19',
			interval: '/Monthly',
			description: 'Praesent eget pulvinar orci. Duis ut pellentesque ligula convallis.',
			features: [
				'Post 1 Job',
				'Urgents & Featured Jobs',
				'Highlights Job with Colors',
				'Access & Saved 5 Candidates',
				'10 Days Resume Visibility',
				'24/7 Critical Support'
			]
		},
		{
			id: 'standard',
			name: 'STANDARD',
			price: '$39',
			interval: '/Monthly',
			description: 'Praesent eget pulvinar orci. Duis ut pellentesque ligula convallis.',
			features: [
				'3 Active Jobs',
				'Urgents & Featured Jobs',
				'Highlights Job with Colors',
				'Access & Saved 10 Candidates',
				'20 Days Resume Visibility',
				'24/7 Critical Support'
			],
			recommended: true
		},
		{
			id: 'premium',
			name: 'PREMIUM',
			price: '$59',
			interval: '/Monthly',
			description: 'Praesent eget pulvinar orci. Duis ut pellentesque ligula convallis.',
			features: [
				'6 Active Jobs',
				'Urgents & Featured Jobs',
				'Highlights Job with Colors',
				'Access & Saved 20 Candidates',
				'30 Days Resume Visibility',
				'24/7 Critical Support'
			]
		}
	];

	// Handle plan selection
	function selectPlan(planId: string) {
		selectedPlan = planId;
	}

	// Handle subscription
	function subscribe() {
		alert(`You have selected the ${selectedPlan.toUpperCase()} plan`);
		// In a real application, you would redirect. to a payment page or open a payment modal
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-3xl font-bold text-gray-900">Buy Premium Subscription to Post a Job</h1>
		<p class="mx-auto max-w-2xl text-gray-500">
			Donec eu dui ut dolor commodo ornare. Sed arcu libero, malesuada quis justo sit amet, varius
			tempus neque. Quisque ultricies mi sed lorem condimentum, vel tempus lectus ultricies.
		</p>
	</div>

	<div class="mb-12 flex flex-col items-stretch justify-center gap-6 md:flex-row">
		<img
			src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-21%20191631-BoQzmhlHMRvlgEye8rkOhGUFDGTzBb.png"
			alt="Job posting illustration"
			class="w-full object-contain md:w-1/3"
		/>

		<div class="grid w-full grid-cols-1 gap-6 md:w-2/3 md:grid-cols-3">
			{#each plans as plan}
				<div
					class="overflow-hidden rounded-lg border {plan.recommended
						? 'border-blue-500'
						: 'border-gray-200'} {selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}"
				>
					{#if plan.recommended}
						<div class="bg-blue-600 py-1 text-center text-sm font-medium text-white">
							Recommendation
						</div>
					{/if}

					<div class="p-6">
						<h3 class="text-lg font-bold text-gray-900">{plan.name}</h3>
						<p class="mt-1 mb-4 text-sm text-gray-500">{plan.description}</p>

						<div class="mb-6 flex items-baseline">
							<span class="text-3xl font-bold text-gray-900">{plan.price}</span>
							<span class="ml-1 text-gray-500">{plan.interval}</span>
						</div>

						<ul class="mb-6 space-y-3">
							{#each plan.features as feature}
								<li class="flex items-start">
									<svg
										class="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
									<span class="text-sm text-gray-600">{feature}</span>
								</li>
							{/each}
						</ul>

						<button
							class="flex w-full items-center justify-center rounded-md px-4 py-2 {selectedPlan ===
							plan.id
								? 'bg-blue-600 text-white'
								: 'border border-blue-600 text-blue-600 hover:bg-blue-50'}"
							onclick={() => selectPlan(plan.id)}
						>
							Choose Plan
							<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								></path>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	{#if selectedPlan}
		<div class="text-center">
			<button
				class="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				onclick={subscribe}
			>
				Subscribe to {selectedPlan.toUpperCase()} Plan
				<svg class="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					></path>
				</svg>
			</button>
		</div>
	{/if}
</div>
