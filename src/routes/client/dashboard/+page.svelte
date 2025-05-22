<script lang="ts">
	let openDropdownId = $state('');

	const recentJobs = [
		{
			id: 1,
			title: 'UI/UX Designer',
			type: 'Full Time',
			status: 'active',
			timeRemaining: '27 days remaining',
			applications: 798,
			highlighted: false
		},
		{
			id: 2,
			title: 'Senior UX Designer',
			type: 'Internship',
			status: 'active',
			timeRemaining: '8 days remaining',
			applications: 185,
			highlighted: false
		},
		{
			id: 3,
			title: 'Technical Support Specialist',
			type: 'Part Time',
			status: 'active',
			timeRemaining: '4 days remaining',
			applications: 556,
			highlighted: true
		},
		{
			id: 4,
			title: 'Junior Graphic Designer',
			type: 'Full Time',
			status: 'active',
			timeRemaining: '24 days remaining',
			applications: 583,
			highlighted: false
		},
		{
			id: 5,
			title: 'Front End Developer',
			type: 'Full Time',
			status: 'expired',
			timeRemaining: 'Dec 7, 2019',
			applications: 740,
			highlighted: false
		}
	];

	// Toggle dropdown
	function toggleDropdown(id: string) {
		if (openDropdownId === id) {
			openDropdownId = '';
		} else {
			openDropdownId = id;
		}
	}

	// Close dropdown when clicking outside
	// function handleClickOutside(event: MouseEvent) {
	//   if (event.target && !event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-trigger')) {
	//     openDropdownId = '';
	//   }
	// }
</script>

<div class="flex-1 overflow-y-auto">
	<div class="p-8">
		<h1 class="text-2xl font-semibold text-gray-800">Hello, Instagram</h1>
		<p class="mt-1 text-gray-500">Here is your daily activities and applications</p>

		<!-- Stats Cards -->
		<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
				<div>
					<h3 class="text-3xl font-bold text-gray-800">589</h3>
					<p class="text-gray-500">Open Jobs</p>
				</div>
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-blue-600"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
						<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
					</svg>
				</div>
			</div>

			<div class="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
				<div>
					<h3 class="text-3xl font-bold text-gray-800">2,517</h3>
					<p class="text-gray-500">Saved Candidates</p>
				</div>
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-yellow-600"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
						<circle cx="9" cy="7" r="4"></circle>
						<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
						<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
					</svg>
				</div>
			</div>
		</div>

		<!-- Recently Posted Jobs -->
		<div class="mt-8">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-800">Recently Posted Jobs</h2>
				<a href="#" class="flex items-center text-sm text-blue-600 hover:text-blue-800">
					View all
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="ml-1 h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</a>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 text-left">
							<tr>
								<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Jobs</th
								>
								<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Status</th
								>
								<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Applications</th
								>
								<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Actions</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each recentJobs as job}
								<tr class={job.highlighted ? 'bg-blue-50' : ''}>
									<td class="px-6 py-4">
										<div>
											<div class="font-medium text-gray-900">{job.title}</div>
											<div class="mt-1 text-sm text-gray-500">
												{job.type} • {job.timeRemaining}
											</div>
										</div>
									</td>
									<td class="px-6 py-4">
										{#if job.status === 'active'}
											<div class="flex items-center">
												<div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
												<span class="text-sm text-gray-700">Active</span>
											</div>
										{:else}
											<div class="flex items-center">
												<div class="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
												<span class="text-sm text-gray-700">Expire</span>
											</div>
										{/if}
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="mr-2 h-5 w-5 text-gray-400"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
												<circle cx="9" cy="7" r="4"></circle>
												<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
												<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
											</svg>
											<span class="text-sm text-gray-700">{job.applications} Applications</span>
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center">
											<a
												href="#"
												class="{job.highlighted
													? 'bg-blue-600 text-white'
													: 'bg-blue-50 text-blue-600'} rounded-md px-4 py-2 text-sm font-medium"
											>
												View Applications
											</a>
											<div class="relative ml-2">
												<button
													class="dropdown-trigger rounded-md p-2 hover:bg-gray-100"
													onclick={() => toggleDropdown(String(job.id))}
													aria-label="Toggle Dropdown"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-5 w-5 text-gray-500"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<circle cx="12" cy="12" r="1"></circle>
														<circle cx="12" cy="5" r="1"></circle>
														<circle cx="12" cy="19" r="1"></circle>
													</svg>
												</button>

												{#if openDropdownId === String(job.id)}
													<div
														class="dropdown-menu absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg"
													>
														<div class="py-1">
															<a
																href="#"
																class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="mr-2 h-4 w-4 text-gray-500"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																>
																	<circle cx="12" cy="12" r="10"></circle>
																	<line x1="12" y1="8" x2="12" y2="16"></line>
																	<line x1="8" y1="12" x2="16" y2="12"></line>
																</svg>
																Promote Job
															</a>
															<a
																href="#"
																class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="mr-2 h-4 w-4 text-gray-500"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																>
																	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
																	<circle cx="12" cy="12" r="3"></circle>
																</svg>
																View Detail
															</a>
															<a
																href="#"
																class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="mr-2 h-4 w-4 text-gray-500"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	stroke-width="2"
																	stroke-linecap="round"
																	stroke-linejoin="round"
																>
																	<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
																	<line x1="16" y1="2" x2="16" y2="6"></line>
																	<line x1="8" y1="2" x2="8" y2="6"></line>
																	<line x1="3" y1="10" x2="21" y2="10"></line>
																</svg>
																Mark as expired
															</a>
														</div>
													</div>
												{/if}
											</div>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
