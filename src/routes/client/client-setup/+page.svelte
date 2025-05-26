<script lang="ts">
	import { goto } from '$app/navigation';
	import CompanyContact from '$lib/components/ui/company-contact.svelte';
	import CompanyFoundingInfo from '$lib/components/ui/company-founding-info.svelte';
	import CompanyInfo from '$lib/components/ui/company-info.svelte';
	import CompanySocial from '$lib/components/ui/company-social.svelte';

	let currentStep = $state(1);
	let formData = $state({
		// Company Info
		organizationType: '',
		industryType: '',
		teamSize: '',
		establishmentYear: '',
		companyWebsite: '',
		companyVision: '',
		companyName: '',
		aboutUs: '',

		// Contact Info
		mapLocation: '',
		phoneCountry: '+880',
		phoneNumber: '',
		email: '',

		// Social Links
		socialLinks: [
			{ platform: 'facebook', url: '' },
			{ platform: 'twitter', url: '' },
			{ platform: 'instagram', url: '' },
			{ platform: 'youtube', url: '' }
		],

		// Files
		logo: null,
		banner: null
	});

	const steps = [
		{ id: 1, label: 'Company Info' },
		{ id: 2, label: 'Founding Info' },
		{ id: 3, label: 'Social Media' },
		{ id: 4, label: 'Contact' }
	];

	// Define a type for formData that includes an index signature
	type FormData = typeof formData & { [key: string]: any };

	const stepProgress = $derived(Math.round((currentStep / steps.length) * 100));

	function handleNext() {
		if (currentStep < steps.length) {
			currentStep = currentStep + 1;
		}
	}

	function handlePrevious() {
		if (currentStep > 1) {
			currentStep = currentStep - 1;
		}
	}

	function handleFinish() {
		console.log('Form submitted:', formData);
		alert('Registration completed successfully!');
		goto('/client/dashboard');
	}

	function addSocialLink() {
		formData.socialLinks = [...formData.socialLinks, { platform: 'facebook', url: '' }];
	}

	function removeSocialLink(index: number) {
		formData.socialLinks = formData.socialLinks.filter((_, i) => i !== index);
	}

	function updateSocialLink(index: number, field: 'platform' | 'url', value: string) {
		formData.socialLinks[index][field] = value;
	}

	function handleFileUpload(type: 'logo' | 'banner', event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			const file = files[0];
			// formData[type] = file;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header>
		<div class="container mx-auto px-4 py-3">
			<div class="my-8 flex w-full items-center justify-end">
				<div class="flex items-center space-x-4">
					<span class="text-sm text-gray-500">Setup Progress</span>
					<div class="flex items-center space-x-2">
						<div class="h-2 w-32 rounded-full bg-gray-200">
							<div
								class="h-2 rounded-full bg-blue-600 transition-all duration-300"
								style="width: {stepProgress}%"
							></div>
						</div>
						<span class="text-sm font-medium text-blue-600">{stepProgress}% Completed</span>
					</div>
				</div>
			</div>
		</div>
	</header>

	<div class="container mx-auto px-4 py-8">
		<div class="mx-auto max-w-4xl">
			<!-- Step Navigation -->
			<div class="mb-8 flex items-center justify-center">
				{#each steps as step, index}
					<div class="flex items-center">
						<div class="flex items-center">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium {currentStep ===
								step.id
									? 'bg-blue-600 text-white'
									: currentStep > step.id
										? 'bg-green-500 text-white'
										: 'bg-gray-200 text-gray-500'}"
							>
								{#if currentStep > step.id}
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
								{:else}
									{step.id}
								{/if}
							</div>
							<span
								class="ml-2 text-sm font-medium {currentStep === step.id
									? 'text-blue-600'
									: 'text-gray-500'}"
							>
								{step.label}
							</span>
						</div>
						{#if index < steps.length - 1}
							<div class="mx-4 h-0.5 w-16 bg-gray-200"></div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Form Content -->
			<div class="rounded-lg bg-white p-8 shadow-sm">
				{#if currentStep === 1}
					<CompanyInfo bind:formData />
				{:else if currentStep === 2}
					<CompanyFoundingInfo bind:formData />
				{:else if currentStep === 3}
					<CompanySocial bind:formData {addSocialLink} {removeSocialLink} {updateSocialLink} />
				{:else if currentStep === 4}
					<CompanyContact bind:formData />
				{/if}

				<!-- Navigation Buttons -->
				<div class="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
					<button
						onclick={handlePrevious}
						disabled={currentStep === 1}
						class="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</button>

					{#if currentStep === steps.length}
						<button
							onclick={handleFinish}
							class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
						>
							Finish Editing →
						</button>
					{:else}
						<button
							onclick={handleNext}
							class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
						>
							Save & Next →
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
