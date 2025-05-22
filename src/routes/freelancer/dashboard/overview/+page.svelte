<div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
	<h1 class="mb-1 text-xl font-semibold">Hello, Esther Howard</h1>
	<p class="text-sm text-gray-500">Here is your daily activities and job alerts</p>

	<div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="rounded-lg border border-gray-100 bg-[#f8fafc] p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-bold">589</h3>
					<p class="text-sm text-gray-500">Applied jobs</p>
				</div>
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7f0fa]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#0066ff"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
						<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
					</svg>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-100 bg-[#fffaf1] p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-bold">238</h3>
					<p class="text-sm text-gray-500">Favorite jobs</p>
				</div>
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff7e6]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#f59e0b"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
					</svg>
				</div>
			</div>
		</div>

		<div class="rounded-lg border border-gray-100 bg-[#f0fdf4] p-4">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-bold">574</h3>
					<p class="text-sm text-gray-500">Job Alerts</p>
				</div>
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dcfce7]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#22c55e"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
						<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
					</svg>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Profile Alert -->
<div class="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="bg-[#f44336] p-6 text-white">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<div class="mr-4 h-12 w-12 overflow-hidden rounded-full border-2 border-white">
					<img
						src="/placeholder.svg?height=48&width=48"
						alt="Profile"
						width="48"
						height="48"
						class="bg-gray-800"
					/>
				</div>
				<div>
					<h3 class="font-medium">Your profile editing is not completed.</h3>
					<p class="mt-1 text-sm text-red-100">
						Complete your profile editing & build your custom Resume
					</p>
				</div>
			</div>
			<button
				class="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-[#f44336]"
			>
				Edit Profile
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
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>
		</div>
	</div>
</div>

<!-- Recently Applied -->
<div class="overflow-hidden rounded-lg bg-white shadow-sm">
	<div class="flex items-center justify-between border-b border-gray-100 p-6">
		<h2 class="text-lg font-semibold">Recently Applied</h2>
		<a href="/dashboard/applied-jobs" class="flex items-center text-sm font-medium text-[#0066ff]">
			View all
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
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</a>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50 text-left">
				<tr>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Job</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
						Date Applied
					</th>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Status</th
					>
					<th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Action</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				<tr>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#e7f0fa]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#6fda44"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M6 15c0 1.66 1.34 3 3 3s3-1.34 3-3v-3H6v3zm0-6h6V6c0-1.66-1.34-3-3-3S6 4.34 6 6v3zm9 6c0 1.66 1.34 3 3 3s3-1.34 3-3v-3h-6v3zm0-6h6V6c0-1.66-1.34-3-3-3s-3 1.34-3 3v3z"
									/>
								</svg>
							</div>
							<div>
								<div class="flex items-center font-medium">
									Networking Engineer
									<span
										class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600"
									>
										Remote
									</span>
								</div>
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
									<span>Washington</span>
									<span class="mx-2">•</span>
									<span>$50k-60k/month</span>
								</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4 text-sm text-gray-500">Feb 2, 2019 10:28</td>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-sm text-gray-700">Active</span>
						</div>
					</td>
					<td class="px-6 py-4">
						<button class="flex items-center text-sm font-medium text-[#0066ff]"
							>View Details</button
						>
					</td>
				</tr>

				<tr>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#f1f2f4]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#f1511b"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M11.5 3v8.5H3V3h8.5zm0 18H3v-8.5h8.5V21zm1-18H21v8.5h-8.5V3zm8.5 9.5V21h-8.5v-8.5H21z"
									/>
								</svg>
							</div>
							<div>
								<div class="flex items-center font-medium">
									Product Designer
									<span
										class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600"
									>
										Full Time
									</span>
								</div>
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
									<span>China</span>
									<span class="mx-2">•</span>
									<span>$50k-60k/month</span>
								</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4 text-sm text-gray-500">Dec 7, 2019 23:26</td>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-sm text-gray-700">Active</span>
						</div>
					</td>
					<td class="px-6 py-4">
						<button class="flex items-center text-sm font-medium text-[#0066ff]"
							>View Details</button
						>
					</td>
				</tr>

				<tr>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#f1f2f4]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#000000"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
									/>
								</svg>
							</div>
							<div>
								<div class="flex items-center font-medium">
									Junior Graphic Designer
									<span
										class="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-600"
									>
										Temporary
									</span>
								</div>
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
									<span>Brazil</span>
									<span class="mx-2">•</span>
									<span>$50k-60k/month</span>
								</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4 text-sm text-gray-500">Feb 2, 2019 10:28</td>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-sm text-gray-700">Active</span>
						</div>
					</td>
					<td class="px-6 py-4">
						<button class="flex items-center text-sm font-medium text-[#0066ff]"
							>View Details</button
						>
					</td>
				</tr>

				<tr>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#f1f2f4]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#f1511b"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M11.5 3v8.5H3V3h8.5zm0 18H3v-8.5h8.5V21zm1-18H21v8.5h-8.5V3zm8.5 9.5V21h-8.5v-8.5H21z"
									/>
								</svg>
							</div>
							<div>
								<div class="flex items-center font-medium">
									Visual Designer
									<span
										class="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-600"
									>
										Contract base
									</span>
								</div>
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
									<span>Wisconsin</span>
									<span class="mx-2">•</span>
									<span>$50k-60k/month</span>
								</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4 text-sm text-gray-500">Dec 7, 2019 23:26</td>
					<td class="px-6 py-4">
						<div class="flex items-center">
							<div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-sm text-gray-700">Active</span>
						</div>
					</td>
					<td class="px-6 py-4">
						<button
							class="flex items-center rounded bg-[#0066ff] px-3 py-1.5 text-sm font-medium text-white"
						>
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
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
								<circle cx="12" cy="12" r="3"></circle>
							</svg>
							View Details
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
