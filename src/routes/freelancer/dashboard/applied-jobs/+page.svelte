<script lang="ts">
	// Sample data for applied jobs
	const appliedJobs = [
		{
			id: 1,
			title: 'Networking Engineer',
			company: 'Upwork',
			logo: 'upwork',
			location: 'Washington',
			salary: '$50K-80K/month',
			jobType: 'Remote',
			dateApplied: 'Feb 2, 2019 19:28',
			status: 'Active',
			highlighted: false
		},
		{
			id: 2,
			title: 'Product Designer',
			company: 'Dribbble',
			logo: 'dribbble',
			location: 'Dhaka',
			salary: '$50K-80K/month',
			jobType: 'Full Time',
			dateApplied: 'Dec 7, 2019 23:26',
			status: 'Active',
			highlighted: false
		},
		{
			id: 3,
			title: 'Junior Graphic Designer',
			company: 'Apple',
			logo: 'apple',
			location: 'Brazil',
			salary: '$50K-80K/month',
			jobType: 'Temporary',
			dateApplied: 'Feb 2, 2019 19:28',
			status: 'Active',
			highlighted: false
		},
		{
			id: 4,
			title: 'Visual Designer',
			company: 'Microsoft',
			logo: 'microsoft',
			location: 'Wisconsin',
			salary: '$50K-80K/month',
			jobType: 'Contract Base',
			dateApplied: 'Dec 7, 2019 23:26',
			status: 'Active',
			highlighted: true
		},
		{
			id: 5,
			title: 'Marketing Officer',
			company: 'Twitter',
			logo: 'twitter',
			location: 'United States',
			salary: '$50K-80K/month',
			jobType: 'Full Time',
			dateApplied: 'Dec 4, 2019 21:42',
			status: 'Active',
			highlighted: false
		},
		{
			id: 6,
			title: 'UI/UX Designer',
			company: 'Facebook',
			logo: 'facebook',
			location: 'North Dakota',
			salary: '$50K-80K/month',
			jobType: 'Full Time',
			dateApplied: 'Dec 30, 2019 07:52',
			status: 'Active',
			highlighted: false
		},
		{
			id: 7,
			title: 'Software Engineer',
			company: 'Microsoft',
			logo: 'microsoft',
			location: 'New York',
			salary: '$50K-80K/month',
			jobType: 'Full Time',
			dateApplied: 'Dec 30, 2019 05:18',
			status: 'Active',
			highlighted: false
		},
		{
			id: 8,
			title: 'Front End Developer',
			company: 'Reddit',
			logo: 'reddit',
			location: 'Michigan',
			salary: '$50K-80K/month',
			jobType: 'Full Time',
			dateApplied: 'Mar 20, 2019 23:14',
			status: 'Active',
			highlighted: false
		}
	];

	// Current page state
	let currentPage = $state(1);
	let itemsPerPage = $state(8);

	// Get current jobs based on pagination
	let paginatedJobs = $derived(
		appliedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// Calculate total pages
	let totalPages = $derived(Math.ceil(appliedJobs.length / itemsPerPage));

	// Function to get company logo
	function getCompanyLogo(logo: string) {
		switch (logo) {
			case 'upwork':
				return 'bg-green-500';
			case 'dribbble':
				return 'bg-pink-500';
			case 'apple':
				return 'bg-black';
			case 'microsoft':
				return 'bg-blue-100';
			case 'twitter':
				return 'bg-blue-400';
			case 'facebook':
				return 'bg-blue-600';
			case 'reddit':
				return 'bg-orange-500';
			default:
				return 'bg-gray-200';
		}
	}

	// Function to get company icon
	function getCompanyIcon(logo: string) {
		switch (logo) {
			case 'upwork':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                </svg>`;
			case 'dribbble':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
                </svg>`;
			case 'apple':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>`;
			case 'microsoft':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                  <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
                </svg>`;
			case 'twitter':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>`;
			case 'facebook':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>`;
			case 'reddit':
				return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>`;
			default:
				return '';
		}
	}
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="border-b border-gray-100 p-6">
		<h1 class="text-xl font-semibold">
			Applied Jobs <span class="text-sm font-normal text-gray-500">(589)</span>
		</h1>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Jobs</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Date Applied</th
					>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Status</th
					>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Action</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each paginatedJobs as job}
					<tr class={job.highlighted ? 'bg-blue-50' : ''}>
						<td class="px-6 py-4">
							<div class="flex items-center">
								<div
									class="h-10 w-10 {getCompanyLogo(
										job.logo
									)} mr-3 flex items-center justify-center rounded-md"
								>
									{@html getCompanyIcon(job.logo)}
								</div>
								<div>
									<div class="font-medium">{job.title}</div>
									<div class="mt-1 flex items-center text-sm text-gray-500">
										<span class="mr-2 rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
											{job.jobType}
										</span>
									</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-sm text-gray-500">{job.location}</div>
							<div class="mt-1 flex items-center text-sm text-gray-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="mr-1"
								>
									<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
								</svg>
								<span>{job.salary}</span>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-sm text-gray-500">{job.dateApplied}</div>
							<div class="mt-1 flex items-center">
								<div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
								<span class="text-sm text-gray-700">{job.status}</span>
							</div>
						</td>
						<td class="px-6 py-4">
							<a
								href="#"
								class="{job.highlighted
									? 'bg-blue-600 text-white'
									: 'text-blue-600'} flex items-center rounded-md px-4 py-2 text-sm font-medium {job.highlighted
									? ''
									: 'w-fit'}"
							>
								View Details
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
