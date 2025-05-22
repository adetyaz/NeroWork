<script>
	let { children } = $props();
	// Active menu item
	let activeMenuItem = $state('overview');

	// Dropdown state for job actions
</script>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<div class="flex w-64 flex-col border-r border-gray-200 bg-white">
		<div class="border-b border-gray-200 p-4">
			<h2 class="text-lg font-semibold text-gray-800">EMPLOYERS DASHBOARD</h2>
		</div>

		<div class="flex-1 overflow-y-auto py-4">
			<nav class="px-2">
				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'overview'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'overview')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="7" height="7"></rect>
						<rect x="14" y="3" width="7" height="7"></rect>
						<rect x="14" y="14" width="7" height="7"></rect>
						<rect x="3" y="14" width="7" height="7"></rect>
					</svg>
					Overview
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'profile'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'profile')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
					Employers Profile
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'post-job'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'post-job')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
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
					Post a Job
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'my-jobs'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'my-jobs')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
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
					My Jobs
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'saved-candidate'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'saved-candidate')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
					</svg>
					Saved Candidate
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'plans-billing'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'plans-billing')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
						<line x1="1" y1="10" x2="23" y2="10"></line>
					</svg>
					Plans & Billing
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'all-companies'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'all-companies')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
						<polyline points="9 22 9 12 15 12 15 22"></polyline>
					</svg>
					All Companies
				</button>

				<button
					class="flex w-full items-center rounded-md px-4 py-3 {activeMenuItem === 'settings'
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeMenuItem = 'settings')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="3"></circle>
						<path
							d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
						></path>
					</svg>
					Settings
				</button>
			</nav>
		</div>

		<div class="border-t border-gray-200 p-4">
			<button class="flex w-full items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-3 h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
					<polyline points="16 17 21 12 16 7"></polyline>
					<line x1="21" y1="12" x2="9" y2="12"></line>
				</svg>
				Log-out
			</button>
		</div>
	</div>
	{@render children()}
</div>
