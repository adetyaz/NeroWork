<script lang="ts">
	import { goto } from '$app/navigation';
	import FreelancerInfo from '$lib/components/ui/freelancer-info.svelte';
	import FreelancerExperience from '$lib/components/ui/freelancer-experience.svelte';
	import FreelancerSocial from '$lib/components/ui/freelancer-social.svelte';
	import FreelancerContact from '$lib/components/ui/freelancer-contact.svelte';
	import Toast from '$lib/components/ui/toast.svelte';
	import { getSigner } from '$lib/utils/aaUtils';
	import { supabase } from '$lib/utils/supabaseClient';
	// import { PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	// const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

	let currentStep = $state(1);
	let formData = $state({
		walletAddress: '',
		fullName: '',
		title: '',
		experience: '',
		personalWebsite: '',
		biography: '',
		socialLinks: [
			{ platform: 'facebook', url: '' },
			{ platform: 'twitter', url: '' },
			{ platform: 'instagram', url: '' },
			{ platform: 'youtube', url: '' }
		],
		email: '',
		address: '',
		phone: '',
		phoneCountry: '+880',
		image: null as File | null,
		resume: null as File | null,
		nameOfResume: ''
	});

	let toast = $state({ open: false, message: '', success: false });
	let isSubmitting = $state(false);

	const steps = [
		{ id: 1, label: 'Personal Info' },
		{ id: 2, label: 'Experience' },
		{ id: 3, label: 'Social Media' },
		{ id: 4, label: 'Contact' }
	];

	const stepProgress = $derived(Math.round((currentStep / steps.length) * 100));

	async function getWalletAddress() {
		const signer = await getSigner();
		const address = await signer.getAddress();
		formData.walletAddress = address;
	}

	$effect(() => {
		if (formData.walletAddress === '') {
			getWalletAddress();
		}
	});

	function handleNext() {
		if (currentStep < steps.length) currentStep += 1;
	}

	function handlePrevious() {
		if (currentStep > 1) currentStep -= 1;
	}

	async function handleFinish() {
		if (!formData.walletAddress) {
			toast = { open: true, message: 'Please connect your wallet.', success: false };

			return;
		}
		if (!formData.fullName) {
			toast = { open: true, message: 'Full name is required.', success: false };
			return;
		}

		console.log(formData.walletAddress);

		isSubmitting = true;
		try {
			// Verify wallet via Edge Function
			const signer = await getSigner();
			const message = `Verify wallet for profile creation: ${formData.walletAddress}`;
			const signature = await signer.signMessage(message);

			// Skipping Supabase and Edge Function for now
			// const response = await fetch(...)
			// if (!response.ok) throw new Error('Wallet verification failed');

			// Upload image and resume logic can be skipped or mocked for local testing
			let imageUrl: string | null = null;
			let resumeUrl: string | null = null;

			const profileData = {
				walletAddress: formData.walletAddress,
				full_name: formData.fullName,
				title: formData.title || null,
				experience: formData.experience || null,
				personal_website: formData.personalWebsite || null,
				resume_file: resumeUrl,
				name_of_resume_file: formData.nameOfResume || null,
				biography: formData.biography || null,
				social_links: formData.socialLinks,
				email: formData.email || null,
				address: formData.address || null,
				phone: formData.phone ? `${formData.phoneCountry}${formData.phone}` : null,
				role: 'freelancer',
				image: imageUrl
			};

			// Always save to localStorage for testing
			try {
				localStorage.setItem('freelancerProfile', JSON.stringify(profileData));
				console.log('Freelancer profile saved to localStorage:', profileData);
			} catch (e) {
				console.warn('Could not save freelancer profile to localStorage:', e);
			}

			toast = { open: true, message: 'Freelancer profile saved successfully!', success: true };
			setTimeout(() => goto('/'), 2000);
		} catch (error: any) {
			console.error('Error saving profile:', error);
			toast = { open: true, message: error.message || 'Failed to save profile.', success: false };
		} finally {
			isSubmitting = false;
		}
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
</script>

<div class="min-h-screen bg-gray-50">
	<header>
		<div class="container mx-auto px-4 py-2">
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

	<div class="container mx-auto px-4 py-4">
		<div class="mx-auto max-w-4xl">
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

			<div class="rounded-lg bg-white p-8 shadow-sm">
				{#if currentStep === 1}
					<FreelancerInfo bind:formData />
				{:else if currentStep === 2}
					<FreelancerExperience bind:formData />
				{:else if currentStep === 3}
					<FreelancerSocial bind:formData {addSocialLink} {removeSocialLink} {updateSocialLink} />
				{:else if currentStep === 4}
					<FreelancerContact bind:formData />
				{/if}

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
							disabled={isSubmitting}
							class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
						>
							{isSubmitting ? 'Saving...' : 'Finish Editing →'}
						</button>
					{:else}
						<button
							onclick={handleNext}
							class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
						>
							Save & Next →
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<Toast status={toast.message} success={toast.success} error={!toast.success} open={toast.open} />
