<script lang="ts">
	let searchQuery = $state('');
	let selectedLocation = $state('');
	let selectedCategory = $state('');
	let sortBy = $state('latest');
	let viewMode = $state('grid');
	let showFilters = $state(false);

	// Filter state
	let filters = $state({
		locationRadius: 50,
		candidateLevel: {
			entryLevel: false,
			midLevel: true,
			expertLevel: false
		},
		experience: {
			freshers: false,
			oneToThree: true,
			threeToFive: false,
			fiveToSeven: false,
			sevenToTen: false,
			tenToFifteen: false,
			fifteenPlus: false
		},
		education: {
			certificate: false,
			highSchool: false,
			intermediate: true,
			graduation: true,
			masterDegree: false,
			bachelorDegree: false
		},
		gender: {
			male: true,
			female: false,
			other: false
		}
	});

	// Sample employers data
	const employers = [
		{
			id: 1,
			name: 'Cody Fisher',
			role: 'Marketing Officer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 2,
			name: 'Darrell Steward',
			role: 'Interaction Designer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: true
		},
		{
			id: 3,
			name: 'Guy Hawkins',
			role: 'Senior Graphic Designer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: true
		},
		{
			id: 4,
			name: 'Jane Cooper',
			role: 'Product UI Designer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 5,
			name: 'Theresa Webb',
			role: 'Front End Developer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 6,
			name: 'Kathryn Murphy',
			role: 'Technical Support Specialist',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: true
		},
		{
			id: 7,
			name: 'Marvin McKinney',
			role: 'UI/UX Designer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 8,
			name: 'Jenny Wilson',
			role: 'Business Manager',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 9,
			name: 'Leslie Alexander',
			role: 'Project Manager',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 10,
			name: 'Wade Warren',
			role: 'Software Engineer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: false
		},
		{
			id: 11,
			name: 'Courtney Henry',
			role: 'Visual Designer',
			location: 'New York',
			experience: '3 Years experience',
			avatar: '/placeholder.svg?height=64&width=64',
			bookmarked: true
		}
	];

	function findJobs() {
		alert(`Searching for: ${searchQuery} in ${selectedLocation} - ${selectedCategory}`);
	}

	function toggleFilters() {
		showFilters = !showFilters;
	}

	function toggleBookmark(employerId: any) {
		const employer = employers.find((e) => e.id === employerId);
		if (employer) {
			employer.bookmarked = !employer.bookmarked;
		}
	}

	function viewProfile(employerId: any) {
		alert(`Viewing profile for employer ${employerId}`);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Breadcrumb -->
	<div class="border-b bg-white">
		<div class="mx-auto max-w-7xl px-6 py-4">
			<nav class="flex text-sm text-gray-500">
				<a href="/" class="hover:text-blue-600">Home</a>
				<span class="mx-2">/</span>
				<span class="font-medium text-blue-600">Find Employers</span>
			</nav>
		</div>
	</div>

	<!-- Search Header -->
	<div class="border-b bg-white">
		<div class="mx-auto max-w-7xl px-6 py-6">
			<div class="flex flex-col gap-4 md:flex-row">
				<div class="relative flex-1">
					<svg
						class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
					<input
						type="text"
						placeholder="Job Title, Keyword..."
						class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						bind:value={searchQuery}
					/>
				</div>

				<div class="relative flex-1">
					<svg
						class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
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
					<input
						type="text"
						placeholder="Location"
						class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						bind:value={selectedLocation}
					/>
				</div>

				<div class="relative flex-1">
					<svg
						class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						></path>
					</svg>
					<select
						class="w-full appearance-none rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						bind:value={selectedCategory}
					>
						<option value="">Select Category</option>
						<option value="design">Design</option>
						<option value="development">Development</option>
						<option value="marketing">Marketing</option>
						<option value="sales">Sales</option>
					</select>
				</div>

				<button
					onclick={findJobs}
					class="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Find Job
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-6 py-8">
		<div class="flex gap-8">
			<!-- Filters Sidebar -->
			<div class="w-80 space-y-6">
				<button
					onclick={toggleFilters}
					class="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-left md:hidden"
				>
					<span>Filters</span>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
						></path>
					</svg>
				</button>

				<div class="space-y-6 {showFilters ? 'block' : 'hidden md:block'}">
					<!-- Location Radius -->
					<div class="rounded-lg bg-white p-4">
						<h3 class="mb-3 flex items-center justify-between font-medium">
							Location Radius: {filters.locationRadius} miles
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</h3>
						<input
							type="range"
							min="5"
							max="100"
							bind:value={filters.locationRadius}
							class="w-full"
						/>
					</div>

					<!-- Candidate Level -->
					<div class="rounded-lg bg-white p-4">
						<h3 class="mb-3 flex items-center justify-between font-medium">
							Candidate Level
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</h3>
						<div class="space-y-2">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.candidateLevel.entryLevel}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Entry Level</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.candidateLevel.midLevel}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Mid Level</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.candidateLevel.expertLevel}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Expert Level</span>
							</label>
						</div>
					</div>

					<!-- Experience -->
					<div class="rounded-lg bg-white p-4">
						<h3 class="mb-3 flex items-center justify-between font-medium">
							Experiences
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</h3>
						<div class="space-y-2">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.freshers}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Freshers</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.oneToThree}
									class="mr-2 rounded"
								/>
								<span class="text-sm">1 - 3 Years</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.threeToFive}
									class="mr-2 rounded"
								/>
								<span class="text-sm">3 - 5 Years</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.fiveToSeven}
									class="mr-2 rounded"
								/>
								<span class="text-sm">5 - 7 Years</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.sevenToTen}
									class="mr-2 rounded"
								/>
								<span class="text-sm">7 - 10 Years</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.tenToFifteen}
									class="mr-2 rounded"
								/>
								<span class="text-sm">10 - 15 Years</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.experience.fifteenPlus}
									class="mr-2 rounded"
								/>
								<span class="text-sm">15+ Years</span>
							</label>
						</div>
					</div>

					<!-- Education -->
					<div class="rounded-lg bg-white p-4">
						<h3 class="mb-3 flex items-center justify-between font-medium">
							Education
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</h3>
						<div class="space-y-2">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.education.certificate}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Certificate</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.education.highSchool}
									class="mr-2 rounded"
								/>
								<span class="text-sm">High School</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.education.intermediate}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Intermediate</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.education.graduation}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Graduation</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.education.masterDegree}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Master Degree</span>
							</label>
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={filters.education.bachelorDegree}
									class="mr-2 rounded"
								/>
								<span class="text-sm">Bachelor Degree</span>
							</label>
						</div>
					</div>

					<!-- Gender -->
					<div class="rounded-lg bg-white p-4">
						<h3 class="mb-3 flex items-center justify-between font-medium">
							Gender
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</h3>
						<div class="space-y-2">
							<label class="flex items-center">
								<input type="checkbox" bind:checked={filters.gender.male} class="mr-2 rounded" />
								<span class="text-sm">Male</span>
							</label>
							<label class="flex items-center">
								<input type="checkbox" bind:checked={filters.gender.female} class="mr-2 rounded" />
								<span class="text-sm">Female</span>
							</label>
							<label class="flex items-center">
								<input type="checkbox" bind:checked={filters.gender.other} class="mr-2 rounded" />
								<span class="text-sm">Other</span>
							</label>
						</div>
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="flex-1">
				<!-- Results Header -->
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<select bind:value={sortBy} class="rounded-lg border border-gray-300 px-4 py-2 text-sm">
							<option value="latest">Latest</option>
							<option value="oldest">Oldest</option>
							<option value="popular">Most Popular</option>
						</select>
						<span class="text-sm text-gray-500">12 per page</span>
					</div>

					<div class="flex items-center space-x-2">
						<button
							onclick={() => (viewMode = 'grid')}
							class="rounded p-2 {viewMode === 'grid'
								? 'bg-blue-100 text-blue-600'
								: 'text-gray-400'}"
							aria-label="Grid View"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
								></path>
							</svg>
						</button>
						<button
							onclick={() => (viewMode = 'list')}
							class="rounded p-2 {viewMode === 'list'
								? 'bg-blue-100 text-blue-600'
								: 'text-gray-400'}"
							aria-label="List View"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 10h16M4 14h16M4 18h16"
								></path>
							</svg>
						</button>
					</div>
				</div>

				<!-- Employers Grid/List -->
				<div
					class="grid {viewMode === 'grid'
						? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
						: 'grid-cols-1'} gap-6"
				>
					{#each employers as employer}
						<div class="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
							<div class="mb-4 flex items-start justify-between">
								<div class="flex items-center">
									<img
										src={employer.avatar || '/placeholder.svg'}
										alt={employer.name}
										class="mr-4 h-16 w-16 rounded-lg"
									/>
									<div>
										<h3 class="text-lg font-semibold">{employer.name}</h3>
										<p class="text-gray-600">{employer.role}</p>
									</div>
								</div>
								<button
									onclick={() => toggleBookmark(employer.id)}
									class="rounded-lg p-2 hover:bg-gray-100 {employer.bookmarked
										? 'text-yellow-500'
										: 'text-gray-400'}"
									aria-label="Bookmark"
								>
									<svg
										class="h-5 w-5"
										fill={employer.bookmarked ? 'currentColor' : 'none'}
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
										></path>
									</svg>
								</button>
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
									{employer.location}
								</p>
								<p class="flex items-center">
									<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
										></path>
									</svg>
									{employer.experience}
								</p>
							</div>

							<button
								onclick={() => viewProfile(employer.id)}
								class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
								aria-label="View Profile"
							>
								View Profile
							</button>
						</div>
					{/each}
				</div>

				<!-- Pagination -->
				<div class="mt-12 flex items-center justify-center">
					<nav class="flex items-center space-x-2">
						<button
							class="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 hover:bg-gray-50"
							aria-label="Previous Page"
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
						<button class="rounded-lg bg-blue-600 px-4 py-2 text-white" aria-label="Page 1"
							>01</button
						>
						<button
							class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							aria-label="Page 2">02</button
						>
						<button
							class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							aria-label="Page 3">03</button
						>
						<button
							class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							aria-label="Page 4">04</button
						>
						<span class="px-2">...</span>
						<button
							class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
							aria-label="Page 40">40</button
						>
						<button
							class="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 hover:bg-gray-50"
							aria-label="Next Page"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								></path>
							</svg>
						</button>
					</nav>
				</div>
			</div>
		</div>
	</div>
</div>
