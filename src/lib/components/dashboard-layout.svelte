<script>
	let { children, active } = $props();
</script>

<div class="min-h-screen bg-[#f1f2f4]">
	<!-- Header -->

	<!-- Main Content -->
	<div class="container mx-auto px-4 py-6">
		<div class="flex flex-col gap-6 md:flex-row">
			<!-- Sidebar -->
			<div class="w-full rounded-lg bg-white shadow-sm md:w-64">
				<div class="rounded-t-lg border-b border-gray-100 bg-gray-50 p-4">
					<h2 class="text-xs font-semibold tracking-wider text-gray-500 uppercase">
						CANDIDATE DASHBOARD
					</h2>
				</div>
				<div class="p-2">
					<nav>
						<a
							href="/dashboard"
							class="flex items-center rounded-md px-3 py-2.5 text-sm font-medium {active ===
							'overview'
								? 'bg-[#e7f0fa] text-[#0066ff]'
								: 'text-gray-700 hover:bg-gray-50'}"
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
								class="mr-3"
							>
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
								<polyline points="9 22 9 12 15 12 15 22"></polyline>
							</svg>
							Overview
						</a>
						<a
							href="/dashboard/my-invoices"
							class="flex items-center rounded-md px-3 py-2.5 text-sm font-medium {active ===
							'my-invoices'
								? 'bg-[#e7f0fa] text-[#0066ff]'
								: 'text-gray-700 hover:bg-gray-50'}"
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
								class="mr-3"
							>
								<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
								<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
							</svg>
							My Invoices
						</a>
						<a
							href="/dashboard/favorite-jobs"
							class="flex items-center rounded-md px-3 py-2.5 text-sm font-medium {active ===
							'favorite-jobs'
								? 'bg-[#e7f0fa] text-[#0066ff]'
								: 'text-gray-700 hover:bg-gray-50'}"
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
								class="mr-3"
							>
								<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
							</svg>
							Favorite Jobs
						</a>
						<a
							href="/dashboard/badges"
							class="flex items-center rounded-md px-3 py-2.5 text-sm font-medium {active ===
							'badges'
								? 'bg-[#e7f0fa] text-[#0066ff]'
								: 'text-gray-700 hover:bg-gray-50'}"
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
								class="mr-3"
							>
								<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
							</svg>
							Badges
						</a>
						<a
							href="/dashboard/settings"
							class="flex items-center rounded-md px-3 py-2.5 text-sm font-medium {active ===
							'settings'
								? 'bg-[#e7f0fa] text-[#0066ff]'
								: 'text-gray-700 hover:bg-gray-50'}"
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
								class="mr-3"
							>
								<circle cx="12" cy="12" r="3"></circle>
								<path
									d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
								></path>
							</svg>
							Settings
						</a>
					</nav>
				</div>
			</div>

			<!-- Main Content -->
			<div class="flex-1">
				{@render children()}

				<!-- Log Out Button -->
				<div class="mt-6 flex">
					<button class="flex items-center text-gray-500 hover:text-gray-700">
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
							class="mr-2"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
						<span>Log-out</span>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<footer class="mt-8 border-t border-gray-200 bg-white py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-500">
			© 2024 MyJob - Job Portal. All Rights Reserved
		</div>
	</footer>
</div>
