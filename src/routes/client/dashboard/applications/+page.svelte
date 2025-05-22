<script lang="ts">
	// Sample data for applications
	const allApplications = [
		{
			id: 1,
			name: 'Ronald Richards',
			position: 'UI/UX Designer',
			experience: '7 Years Experience',
			education: 'Education: Master Degree',
			applied: 'Applied: Jan 23, 2022',
			avatar: '/placeholder.svg?height=48&width=48'
		},
		{
			id: 2,
			name: 'Theresa Webb',
			position: 'Product Designer',
			experience: '7 Years Experience',
			education: 'Education: High School Degree',
			applied: 'Applied: Jan 23, 2022',
			avatar: '/placeholder.svg?height=48&width=48'
		},
		{
			id: 3,
			name: 'Devon Lane',
			position: 'User Experience Designer',
			experience: '7 Years Experience',
			education: 'Education: Master Degree',
			applied: 'Applied: Jan 23, 2022',
			avatar: '/placeholder.svg?height=48&width=48'
		}
	];

	const shortlistedApplications = [
		{
			id: 4,
			name: 'Darrell Steward',
			position: 'UI/UX Designer',
			experience: '7 Years Experience',
			education: 'Education: Intermediate Degree',
			applied: 'Applied: Jan 23, 2022',
			avatar: '/placeholder.svg?height=48&width=48'
		},
		{
			id: 5,
			name: 'Jenny Wilson',
			position: 'UI Designer',
			experience: '7 Years Experience',
			education: 'Education: Bachelor Degree',
			applied: 'Applied: Jan 23, 2022',
			avatar: '/placeholder.svg?height=48&width=48'
		}
	];

	// State for sort dropdown
	let sortDropdownOpen = $state(false);
	let sortOption = $state('newest');

	// Toggle sort dropdown
	function toggleSortDropdown() {
		sortDropdownOpen = !sortDropdownOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (
			event.target instanceof HTMLElement &&
			!event.target.closest('.sort-dropdown') &&
			!event.target.closest('.sort-button')
		) {
			sortDropdownOpen = false;
		}
	}

	// Function to download CV
	function downloadCV(candidateName: string) {
		alert(`Downloading CV for ${candidateName}`);
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="mx-auto max-w-7xl bg-white p-6">
	<!-- Breadcrumb -->
	<div class="mb-6 flex items-center text-sm text-gray-500">
		<a href="/" class="hover:text-blue-600">Home</a>
		<span class="mx-2">/</span>
		<a href="/jobs" class="hover:text-blue-600">Job</a>
		<span class="mx-2">/</span>
		<a href="/jobs/senior-ui-ux-designer" class="hover:text-blue-600">Senior UI/UX Designer</a>
		<span class="mx-2">/</span>
		<span class="text-gray-900">Applications</span>
	</div>

	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Job Applications</h1>

		<div class="flex items-center space-x-2">
			<button
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
			>
				Filter
			</button>

			<div class="relative">
				<button
					class="sort-button rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
					onclick={toggleSortDropdown}
				>
					Sort
				</button>

				{#if sortDropdownOpen}
					<div
						class="sort-dropdown absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg"
					>
						<div
							class="border-b border-gray-200 px-2 py-1 text-xs font-medium text-gray-500 uppercase"
						>
							Sort Application
						</div>
						<div class="py-1">
							<label class="flex items-center px-4 py-2 text-sm">
								<input
									type="radio"
									name="sortOption"
									value="newest"
									checked={sortOption === 'newest'}
									onchange={() => (sortOption = 'newest')}
									class="mr-2"
								/>
								Newest
							</label>
							<label class="flex items-center px-4 py-2 text-sm">
								<input
									type="radio"
									name="sortOption"
									value="oldest"
									checked={sortOption === 'oldest'}
									onchange={() => (sortOption = 'oldest')}
									class="mr-2"
								/>
								Oldest
							</label>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Application Columns -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- All Applications -->
		<div class="rounded-lg bg-gray-50 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-medium">All Application (213)</h2>
				<button class="text-gray-500 hover:text-gray-700">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
						></path>
					</svg>
				</button>
			</div>

			<div class="space-y-4">
				{#each allApplications as application}
					<div class="rounded-lg bg-white p-4 shadow-sm">
						<div class="mb-3 flex items-start">
							<img
								src={application.avatar || '/placeholder.svg'}
								alt={application.name}
								class="mr-3 h-12 w-12 rounded-full bg-gray-300"
							/>
							<div>
								<h3 class="font-medium">{application.name}</h3>
								<p class="text-sm text-gray-500">{application.position}</p>
							</div>
						</div>

						<div class="mb-3 space-y-1 text-sm text-gray-600">
							<p>• {application.experience}</p>
							<p>• {application.education}</p>
							<p>• {application.applied}</p>
						</div>

						<button
							class="flex items-center text-sm text-blue-600"
							onclick={() => downloadCV(application.name)}
						>
							<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								></path>
							</svg>
							Download CV
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Shortlisted -->
		<div class="rounded-lg bg-gray-50 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-medium">Shortlisted (2)</h2>
				<div class="flex items-center space-x-2">
					<button class="text-gray-500 hover:text-gray-700">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							></path>
						</svg>
					</button>
					<button class="text-gray-500 hover:text-gray-700">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							></path>
						</svg>
					</button>
				</div>
			</div>

			<div class="space-y-4">
				{#each shortlistedApplications as application}
					<div class="rounded-lg bg-white p-4 shadow-sm">
						<div class="mb-3 flex items-start">
							<img
								src={application.avatar || '/placeholder.svg'}
								alt={application.name}
								class="mr-3 h-12 w-12 rounded-full bg-gray-300"
							/>
							<div>
								<h3 class="font-medium">{application.name}</h3>
								<p class="text-sm text-gray-500">{application.position}</p>
							</div>
						</div>

						<div class="mb-3 space-y-1 text-sm text-gray-600">
							<p>• {application.experience}</p>
							<p>• {application.education}</p>
							<p>• {application.applied}</p>
						</div>

						<button
							class="flex items-center text-sm text-blue-600"
							onclick={() => downloadCV(application.name)}
						>
							<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								></path>
							</svg>
							Download CV
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Create New Column -->
		<div
			class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
		>
			<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
				<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					></path>
				</svg>
			</div>
			<h3 class="mb-1 font-medium text-gray-900">Create New Column</h3>
			<p class="text-center text-sm text-gray-500">
				Add a new column to manage your recruitment process
			</p>
		</div>
	</div>
</div>
