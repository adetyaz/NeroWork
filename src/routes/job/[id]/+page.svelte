<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	// Sample job data\
	let { data: job }: PageProps = $props();

	console.log(job.job);

	const jobs = {
		title: 'Senior UX Designer',
		company: 'Instagram',
		companyLogo: '/placeholder.svg?height=64&width=64',
		featured: true,
		fullTime: true,
		posted: '19 June, 2021',
		deadline: '18 July, 2021',
		location: 'New York, USA',
		salary: '$50k-$80k/month',
		experience: 'Full Time',
		qualification: 'Graduation',
		description: `Integer pharetra pretium consequat. Donec et sapien ut leo accumsan pellentesque eget maximus massa. Duis ut rhoncus risus, vitae cursus lorem. Donec in suscipit dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed lobortis augue quis turpis auctor, eget cursus lorem condimentum. Vivamus ut amet ipsum ullamcorper. Quisque eget lorem lorem. Donec in suscipit dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed lobortis augue quis turpis auctor, eget cursus lorem condimentum. Vivamus ut amet ipsum ullamcorper. Quisque eget lorem lorem. Donec in suscipit dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed lobortis augue quis turpis auctor, eget cursus lorem condimentum. Vivamus ut amet ipsum ullamcorper. Quisque eget lorem lorem.`,
		responsibilities: [
			'Quisque semper gravida est et consectetur',
			'Curabitur blandit lorem et velit pretium, vitae pretium lorem placerat',
			'Vestibulum tempus, odio quis ullamcorper bibendum, nulla imperdiet ex amet',
			'Sed molestie ex velit, vitae pretium lorem placerat',
			'Cras molestie ex velit, vitae pretium lorem placerat',
			'Sed molestie ex velit, vitae pretium lorem placerat',
			'Cras molestie ex velit, vitae pretium lorem placerat'
		]
	};

	const relatedJobs = [
		{
			title: 'Visual Designer',
			company: 'Facebook',
			logo: '/placeholder.svg?height=48&width=48',
			location: 'New York',
			type: 'Full Time',
			salary: '$50k-$80k',
			featured: true
		},
		{
			title: 'Front End Developer',
			company: 'Instagram',
			logo: '/placeholder.svg?height=48&width=48',
			location: 'New York',
			type: 'Full Time',
			salary: '$40k-$60k'
		},
		{
			title: 'Technical Support Specialist',
			company: 'Upwork',
			logo: '/placeholder.svg?height=48&width=48',
			location: 'New York',
			type: 'Full Time',
			salary: '$30k-$50k'
		},
		{
			title: 'Software Engineer',
			company: 'Facebook',
			logo: '/placeholder.svg?height=48&width=48',
			location: 'New York',
			type: 'Part Time',
			salary: '$50k-$80k'
		},
		{
			title: 'Product Designer',
			company: 'Microsoft',
			logo: '/placeholder.svg?height=48&width=48',
			location: 'New York',
			type: 'Full Time',
			salary: '$40k-$60k'
		},
		{
			title: 'Interaction Designer',
			company: 'Youtube',
			logo: '/placeholder.svg?height=48&width=48',
			location: 'New York',
			type: 'Full Time',
			salary: '$30k-$50k'
		}
	];

	// Modal state
	let showApplyModal = $state(false)
	let coverLetter = $state('')
	let applyError = $state('')
	let applySuccess = $state(false)
	type FreelancerProfile = {
		wallet: string;
		// add other properties as needed
		[key: string]: any;
	};
	let freelancerProfile = $state<FreelancerProfile | null>(null)

	onMount(() => {
		const profile = localStorage.getItem('freelancerProfile')
		if (profile) {
			freelancerProfile = JSON.parse(profile)
		}
	})

	function openApplyModal() {
		showApplyModal = true
		coverLetter = ''
		applyError = ''
		applySuccess = false
	}

	function closeApplyModal() {
		showApplyModal = false
	}

	function submitApplication() {
		if (!coverLetter.trim()) {
			applyError = 'Please enter a cover letter.';
			return;
		}
		if (!freelancerProfile) {
			applyError = 'Please complete your freelancer profile first.';
			return;
		}
		const jobId = job.job.id;
		const applications = JSON.parse(localStorage.getItem('jobApplications') || '{}');
		if (!applications[jobId]) applications[jobId] = [];
		// Prevent duplicate applications by wallet address
		const alreadyApplied = freelancerProfile && applications[jobId].some((app: { wallet: string }) => app.wallet === (freelancerProfile ? freelancerProfile.wallet : ''));
		if (alreadyApplied) {
			applyError = 'You have already applied for this job.';
			return;
		}
		applications[jobId].push({
			freelancer: freelancerProfile,
			coverLetter,
			wallet: freelancerProfile.wallet,
			appliedAt: new Date().toISOString()
		});
		localStorage.setItem('jobApplications', JSON.stringify(applications));
		applySuccess = true;
		setTimeout(() => {
			showApplyModal = false;
			// Redirect to freelancer dashboard after applying
			window.location.href = '/freelancer/dashboard/my-invoices';
		}, 1200);
	}

	function shareJob(platform: any) {
		alert(`Sharing job on ${platform}`);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-6xl px-6 py-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="lg:col-span-2">
				<!-- Job Header -->
				<div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
					<div class="mb-4 flex items-start justify-between">
						<div class="flex items-center">
							<img
								src={job.job.client.logo_image}
								alt={job.job.client.company_name}
								class="mr-4 h-16 w-16 rounded-lg"
							/>
							<div>
								<div class="mb-1 flex items-center gap-2">
									<h1 class="text-2xl font-bold">{job.job.title}</h1>
									{#if jobs.featured}
										<span
											class="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600"
											>Featured</span
										>
									{/if}
									{#if jobs.fullTime}
										<span class="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600"
											>Full Time</span
										>
									{/if}
								</div>
								<p class="text-gray-600">at {job.job.client.company_name}</p>
							</div>
						</div>
						<button onclick={openApplyModal} class="flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
							Apply Now
							<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
							</svg>
						</button>
					</div>
				</div>

				<!-- Job Description -->
				<div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">Job Description</h2>
					<div class="prose leading-relaxed text-gray-600">
						<p>{job.job.description}</p>
					</div>
				</div>

				<!-- Responsibilities -->
				<div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">Responsibilities</h2>

					<div>
						{job.job.responsibilities}
					</div>
				</div>

				<!-- Share this Job -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">Share this Job</h2>
					<div class="flex space-x-3">
						<button
							onclick={() => shareJob('Facebook')}
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
							aria-label="Share on Facebook"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
								/>
							</svg>
						</button>
						<button
							onclick={() => shareJob('Twitter')}
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400 text-white hover:bg-blue-500"
							aria-label="Share on Twitter"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
								/>
							</svg>
						</button>
						<button
							onclick={() => shareJob('LinkedIn')}
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800"
							aria-label="Share on LinkedIn"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
								/>
							</svg>
						</button>
						<button
							onclick={() => shareJob('Pinterest')}
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700"
							aria-label="Share on Pinterest"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.099.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Job Overview -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-semibold">Job Overview</h3>
					<div class="space-y-4">
						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg
									class="h-5 w-5 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">JOB POSTED</p>
								<p class="font-medium">
									{new Date(job.job.created_at).toLocaleDateString('en-US', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</p>
							</div>
						</div>

						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
								<svg
									class="h-5 w-5 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">JOB EXPIRE IN</p>
								<p class="font-medium">
									{new Date(job.job.deadline).toLocaleDateString('en-US', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</p>
							</div>
						</div>

						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
								<svg
									class="h-5 w-5 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">LOCATION</p>
								<p class="font-medium">{jobs.location}</p>
							</div>
						</div>

						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
								<svg
									class="h-5 w-5 text-yellow-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">Budget</p>
								<p class="font-medium">{job.job.budget}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Related Jobs
		<div class="mt-12">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold">Related Jobs</h2>
				<div class="flex space-x-2">
					<button
						class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
						aria-label="Previous"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							></path>
						</svg>
					</button>
					<button
						class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
						aria-label="Next"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each relatedJobs as relatedJob}
					<div class="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
						<div class="mb-4 flex items-center">
							<img
								src={relatedJob.logo || '/placeholder.svg'}
								alt={relatedJob.company}
								class="mr-3 h-12 w-12 rounded-lg"
							/>
							<div>
								<h3 class="font-semibold">{relatedJob.title}</h3>
								<p class="text-sm text-gray-500">{relatedJob.company}</p>
							</div>
						</div>
						<div class="mb-4 space-y-2 text-sm text-gray-600">
							<p class="flex items-center">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
								{relatedJob.location}
							</p>
							<p class="flex items-center">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								{relatedJob.type}
							</p>
							<p class="flex items-center">
								<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									></path>
								</svg>
								{relatedJob.salary}
							</p>
						</div>
						{#if relatedJob.featured}
							<span
								class="mb-3 inline-block rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600"
								>Featured</span
							>
						{/if}
					</div>
				{/each}
			</div>
		</div> -->
	</div>

	{#if showApplyModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
				<button onclick={closeApplyModal} class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
				<h2 class="text-xl font-bold mb-4">Apply for {job.job.title}</h2>
				<textarea
					class="w-full border rounded-lg p-2 mb-2"
					placeholder="Write your cover letter here..."
					oninput={e => { if (e.target) coverLetter = (e.target as HTMLTextAreaElement).value; }}
					value={coverLetter}
					rows="5"
				></textarea>
				{#if applyError}
					<p class="text-red-500 mb-2">{applyError}</p>
				{/if}
				{#if applySuccess}
					<p class="text-green-600 mb-2">Application submitted!</p>
				{/if}
				<div class="flex justify-end gap-2">
					<button onclick={closeApplyModal} class="px-4 py-2 rounded bg-gray-200">Cancel</button>
					<button onclick={submitApplication} class="px-4 py-2 rounded bg-blue-600 text-white">Submit</button>
				</div>
			</div>
		</div>
	{/if}
</div>
