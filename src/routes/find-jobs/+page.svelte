<script>
	let viewMode = $state('grid');
</script>

<div class="min-h-screen bg-[#f1f2f4]">
	<!-- Main Content -->
	<main class="container mx-auto px-4 py-6">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-xl font-bold">Find Job</h1>
			<div class="flex items-center text-sm">
				<a href="/" class="text-gray-500 hover:text-gray-900"> Home </a>
				<span class="mx-2">/</span>
				<span class="text-gray-900">Find job</span>
			</div>
		</div>

		<!-- Search Section -->
		<div class="mb-6 rounded-lg bg-white p-4 shadow-sm">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
				<div class="relative">
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
						class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
					<input
						type="text"
						placeholder="Job title, Keyword..."
						class="w-full rounded-md border py-2 pr-4 pl-10"
					/>
				</div>
				<div class="relative">
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
						class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
					>
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
						<circle cx="12" cy="10" r="3"></circle>
					</svg>
					<input
						type="text"
						placeholder="Location"
						class="w-full rounded-md border py-2 pr-4 pl-10"
					/>
				</div>
				<div class="relative">
					<button
						class="flex w-full items-center justify-between rounded-md border bg-white px-4 py-2"
					>
						<span class="text-gray-500">Select Category</span>
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
							class="text-gray-400"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>
				</div>
				<div class="flex items-center space-x-2">
					<button class="flex items-center space-x-2 rounded-md border bg-white px-4 py-2">
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
							class="text-gray-500"
						>
							<line x1="4" y1="21" x2="4" y2="14"></line>
							<line x1="4" y1="10" x2="4" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12" y2="3"></line>
							<line x1="20" y1="21" x2="20" y2="16"></line>
							<line x1="20" y1="12" x2="20" y2="3"></line>
							<line x1="1" y1="14" x2="7" y2="14"></line>
							<line x1="9" y1="8" x2="15" y2="8"></line>
							<line x1="17" y1="16" x2="23" y2="16"></line>
						</svg>
						<span class="text-gray-700">Advance Filter</span>
					</button>
					<button class="rounded-md bg-[#0066ff] px-6 py-2 text-white hover:bg-[#0055dd]"
						>Find Job</button
					>
				</div>
			</div>
		</div>

		<!-- Filter Tags -->
		<div class="mb-6 flex flex-wrap items-center justify-between">
			<div class="flex flex-wrap items-center gap-2">
				<div class="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1">
					Design
					<button class="ml-1 text-gray-400 hover:text-gray-600">×</button>
				</div>
				<div class="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1">
					New York
					<button class="ml-1 text-gray-400 hover:text-gray-600">×</button>
				</div>
			</div>
			<div class="mt-4 flex items-center space-x-4 sm:mt-0">
				<div class="flex items-center space-x-2">
					<span class="text-sm text-gray-500">Latest</span>
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
						class="text-gray-400"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</div>
				<div class="flex items-center space-x-2">
					<span class="text-sm text-gray-500">12 per page</span>
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
						class="text-gray-400"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</div>
				<div class="flex items-center space-x-2">
					<button
						class="p-1 {viewMode === 'grid' ? 'bg-[#0066ff] text-white' : 'text-gray-400'} rounded"
						onclick={() => (viewMode = 'grid')}
						aria-label="switch to grid view"
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
							<rect x="3" y="3" width="7" height="7"></rect>
							<rect x="14" y="3" width="7" height="7"></rect>
							<rect x="14" y="14" width="7" height="7"></rect>
							<rect x="3" y="14" width="7" height="7"></rect>
						</svg>
					</button>
					<button
						class="p-1 {viewMode === 'list' ? 'bg-[#0066ff] text-white' : 'text-gray-400'} rounded"
						onclick={() => (viewMode = 'list')}
						aria-label="switch to list view"
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
							<line x1="8" y1="6" x2="21" y2="6"></line>
							<line x1="8" y1="12" x2="21" y2="12"></line>
							<line x1="8" y1="18" x2="21" y2="18"></line>
							<line x1="3" y1="6" x2="3.01" y2="6"></line>
							<line x1="3" y1="12" x2="3.01" y2="12"></line>
							<line x1="3" y1="18" x2="3.01" y2="18"></line>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Job Listings -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Job Card 1 -->
			<div class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-start justify-between">
					<div class="flex items-center">
						<div class="mr-3 flex h-12 w-12 items-center justify-center rounded-md bg-[#ffeded]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="#ff4500"
							>
								<path
									d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
								/>
								<circle cx="12" cy="12" r="3" fill="white" />
							</svg>
						</div>
						<div>
							<h3 class="font-medium">Reddit</h3>
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
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
								<span>United Kingdom of Great Britain</span>
							</div>
						</div>
					</div>
					<span class="rounded-md bg-[#ffeded] px-2 py-0.5 text-xs font-semibold text-[#ff4500]"
						>Featured</span
					>
				</div>
				<h2 class="mb-2 text-lg font-semibold">Marketing Officer</h2>
				<div class="mb-2 text-sm text-gray-500">
					<span>Full Time</span> • <span>$20k-$25k</span>
				</div>
			</div>

			<!-- More job cards would go here -->
		</div>

		<!-- Pagination -->
		<div class="mt-10 flex items-center justify-center">
			<button class="mr-2 rounded-full border border-gray-200 p-2">
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
					class="text-gray-400"
				>
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>
			<button class="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066ff] text-white"
				>01</button
			>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				02
			</button>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				03
			</button>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				04
			</button>
			<button
				class="mx-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
			>
				05
			</button>
			<button class="ml-2 rounded-full border border-gray-200 p-2">
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
					class="text-gray-500"
				>
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-8 border-t border-gray-200 bg-white py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-500">
			© 2024 MyJob - Job Portal. All Rights Reserved
		</div>
	</footer>
</div>
