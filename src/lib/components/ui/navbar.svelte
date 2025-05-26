<header class="border-b border-gray-200 bg-white">
	<div class="container mx-auto px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-8">
				<a href="/" class="flex items-center space-x-2">
					<div class="flex h-8 w-8 items-center justify-center rounded bg-[#0066ff]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
							<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
						</svg>
					</div>
				</a>
				<nav class="hidden items-center space-x-6 md:flex">
					<a href="/" class="text-gray-500 hover:text-gray-900"> Home </a>
					<a href="/find-jobs" class="text-gray-500 hover:text-gray-900"> Find Job </a>
					<a href="/find-candidates" class="text-gray-500 hover:text-gray-900"> Find Candidates </a>
					<a href="/dashboard" class="font-medium text-[#0066ff]"> Dashboard </a>
				</nav>
			</div>
			<div class="flex items-center space-x-6">
				<div class="flex items-center space-x-3">
					<button class="rounded-full bg-[#f1f2f4] p-1.5" aria-label="notifications">
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
							<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
							<path d="M13.73 21a2 2 0 0 1-3.46 0" />
						</svg>
					</button>
					<div class="h-9 w-9 overflow-hidden rounded-full">
						<img src="/placeholder.svg?height=36&width=36" alt="Profile" width="36" height="36" />
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4 md:hidden">
			<div class="flex items-center space-x-4">
				<div class="flex-1">
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
							placeholder="Job title, keyword, company"
							class="w-full rounded-md border py-2 pr-4 pl-10"
						/>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<div class="flex items-center space-x-1">
						<img
							src="/placeholder.svg?height=20&width=30"
							alt="India Flag"
							width="20"
							height="15"
						/>
						<span class="text-sm">India</span>
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
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
