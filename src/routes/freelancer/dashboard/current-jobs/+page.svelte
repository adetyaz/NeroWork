<script lang="ts">
	// Sample data for favorite jobs
	const favoriteJobs = [
		{
			id: 1,
			title: 'Technical Support Specialist',
			company: 'Google',
			logo: 'google',
			location: 'Idaho, USA',
			salary: '$15K-$20K',
			jobType: 'Full Time',
			status: 'expired',
			deadline: 'Job Expire'
		},
		{
			id: 2,
			title: 'UI/UX Designer',
			company: 'YouTube',
			logo: 'youtube',
			location: 'Minnesota, USA',
			salary: '$10K-$15K',
			jobType: 'Full Time',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 3,
			title: 'Senior UX Designer',
			company: 'Microsoft',
			logo: 'microsoft',
			location: 'United Kingdom of Great Britain',
			salary: '$30K-$35K',
			jobType: 'Full Time',
			status: 'active',
			deadline: '4 Days Remaining',
			highlighted: true
		},
		{
			id: 4,
			title: 'Junior Graphic Designer',
			company: 'Facebook',
			logo: 'facebook',
			location: 'Mymensingh, Bangladesh',
			salary: '$40K-$50K',
			jobType: 'Full Time',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 5,
			title: 'Technical Support Specialist',
			company: 'Google',
			logo: 'google',
			location: 'Idaho, USA',
			salary: '$15K-$20K',
			jobType: 'Full Time',
			status: 'expired',
			deadline: 'Job Expire'
		},
		{
			id: 6,
			title: 'Product Designer',
			company: 'Twitter',
			logo: 'twitter',
			location: 'Sivas, Turkey',
			salary: '$50K-$70K',
			jobType: 'Full Time',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 7,
			title: 'Project Manager',
			company: 'Figma',
			logo: 'figma',
			location: 'Ohio, USA',
			salary: '$50K-$80K',
			jobType: 'Full Time',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 8,
			title: 'Technical Support Specialist',
			company: 'Google',
			logo: 'google',
			location: 'Idaho, USA',
			salary: '$15K-$20K',
			jobType: 'Full Time',
			status: 'expired',
			deadline: 'Job Expire'
		},
		{
			id: 9,
			title: 'Technical Support Specialist',
			company: 'Google',
			logo: 'google',
			location: 'Idaho, USA',
			salary: '$15K-$20K',
			jobType: 'Full Time',
			status: 'expired',
			deadline: 'Job Expire'
		},
		{
			id: 10,
			title: 'Marketing Manager',
			company: 'Microsoft',
			logo: 'microsoft',
			location: 'Kenya, Turkey',
			salary: '$20K-$25K',
			jobType: 'Temporary',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 11,
			title: 'Visual Designer',
			company: 'Apple',
			logo: 'apple',
			location: 'Washington, USA',
			salary: '$10K-$15K',
			jobType: 'Part Time',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 12,
			title: 'Interaction Designer',
			company: 'Figma',
			logo: 'figma',
			location: 'Penn, USA',
			salary: '$35K-$40K',
			jobType: 'Remote',
			status: 'active',
			deadline: '4 Days Remaining'
		},
		{
			id: 13,
			title: 'Senior UX Designer',
			company: 'Upwork',
			logo: 'upwork',
			location: 'Sylhet, Bangladesh',
			salary: '$30K-$35K',
			jobType: 'Contract Base',
			status: 'active',
			deadline: '4 Days Remaining'
		}
	];

	// Current page state
	let currentPage = $state(1);
	let itemsPerPage = $state(10);

	// Get current jobs based on pagination
	let paginatedJobs = $derived(
		favoriteJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// Calculate total pages
	let totalPages = $derived(Math.ceil(favoriteJobs.length / itemsPerPage));

	// Function to get company logo
	function getCompanyLogo(logo: string) {
		switch (logo) {
			case 'google':
				return 'bg-gray-100';
			case 'youtube':
				return 'bg-red-600';
			case 'microsoft':
				return 'bg-blue-100';
			case 'facebook':
				return 'bg-blue-600';
			case 'twitter':
				return 'bg-blue-400';
			case 'figma':
				return 'bg-red-500';
			case 'apple':
				return 'bg-black';
			case 'upwork':
				return 'bg-green-500';
			default:
				return 'bg-gray-200';
		}
	}

	// Function to get company icon
	function getCompanyIcon(logo: string) {
		switch (logo) {
			case 'google':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>`;
			case 'youtube':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>`;
			case 'microsoft':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                  <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
                </svg>`;
			case 'facebook':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>`;
			case 'twitter':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>`;
			case 'figma':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/>
                </svg>`;
			case 'apple':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>`;
			case 'upwork':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                </svg>`;
			default:
				return '';
		}
	}
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="border-b border-gray-100 p-6">
		<h1 class="text-xl font-semibold">
			Favorite Jobs <span class="text-sm font-normal text-gray-500">(17)</span>
		</h1>
	</div>

	<div class="p-4">
		{#each paginatedJobs as job}
			<div class="mb-4 {job.highlighted ? 'rounded-lg border border-blue-500' : ''}">
				<div
					class="flex items-center justify-between rounded-lg bg-white p-4 {!job.highlighted
						? 'border border-gray-100'
						: ''}"
				>
					<div class="flex items-center space-x-4">
						<div
							class="h-12 w-12 {getCompanyLogo(job.logo)} flex items-center justify-center rounded"
						>
							{@html getCompanyIcon(job.logo)}
						</div>
						<div>
							<h3 class="font-medium">{job.title}</h3>
							<div class="mt-1 flex items-center text-sm text-gray-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="mr-1"
								>
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
								<span>{job.location}</span>
							</div>
						</div>
					</div>

					<div class="flex items-center space-x-2">
						<span class="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
							{job.jobType}
						</span>
					</div>

					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-1 text-gray-400"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
						</svg>
						<span class="text-sm text-gray-600">{job.salary}</span>
					</div>

					{#if job.status === 'expired'}
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-1 text-red-500"
							>
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
							<span class="text-sm text-red-500">{job.deadline}</span>
						</div>
					{:else}
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mr-1 text-gray-400"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="16" y1="2" x2="16" y2="6"></line>
								<line x1="8" y1="2" x2="8" y2="6"></line>
								<line x1="3" y1="10" x2="21" y2="10"></line>
							</svg>
							<span class="text-sm text-gray-600">{job.deadline}</span>
						</div>
					{/if}

					<button class="text-gray-400 hover:text-gray-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
						</svg>
					</button>

					{#if job.status === 'expired'}
						<div class="rounded-md bg-gray-100 px-4 py-2 text-gray-500">Deadline Expired</div>
					{:else}
						<a href="#" class="flex items-center rounded-md bg-blue-50 px-4 py-2 text-blue-600">
							Apply Now
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="ml-1"
							>
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="12 5 19 12 12 19"></polyline>
							</svg>
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<!-- Pagination -->
	<div class="flex items-center justify-center p-6">
		<button
			class="mr-2 rounded-full border border-gray-200 p-2 {currentPage === 1
				? 'text-gray-300'
				: 'text-gray-500'}"
			disabled={currentPage === 1}
			onclick={() => (currentPage = currentPage - 1)}
		>
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
			>
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
		</button>

		{#each Array(totalPages) as _, i}
			<button
				class="flex h-8 w-8 items-center justify-center rounded-full {currentPage === i + 1
					? 'bg-[#0066ff] text-white'
					: 'text-gray-500 hover:bg-gray-100'} mx-1"
				onclick={() => (currentPage = i + 1)}
			>
				{String(i + 1).padStart(2, '0')}
			</button>
		{/each}

		<button
			class="ml-2 rounded-full border border-gray-200 p-2 {currentPage === totalPages
				? 'text-gray-300'
				: 'text-gray-500'}"
			disabled={currentPage === totalPages}
			onclick={() => (currentPage = currentPage + 1)}
		>
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
			>
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</button>
	</div>
</div>
