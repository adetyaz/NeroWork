<div>
	<!-- Contact Info -->
	<div class="mb-8">
		<h2 class="mb-4 text-lg font-medium">Contact Info</h2>

		<div class="mb-6">
			<label class="mb-1 block text-sm font-medium text-gray-700">Map Location</label>
			<input
				type="text"
				placeholder="Enter your location"
				class="w-full rounded-md border px-4 py-2"
			/>
		</div>

		<div class="mb-6">
			<label class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
			<div class="flex">
				<div class="relative w-24">
					<select
						class="w-full appearance-none rounded-l-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0066ff] focus:outline-none"
					>
						<option value="+880">+880</option>
						<option value="+1">+1</option>
						<option value="+44">+44</option>
						<option value="+91">+91</option>
					</select>
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
						class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</div>
				<input
					type="text"
					placeholder="Phone number..."
					class="flex-1 rounded-l-none rounded-r-md border border-l-0 px-4 py-2"
				/>
			</div>
		</div>

		<div class="mb-6">
			<label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
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
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
					></path>
					<polyline points="22,6 12,13 2,6"></polyline>
				</svg>
				<input
					type="email"
					placeholder="Email address"
					class="w-full rounded-md border px-4 py-2 pl-10"
				/>
			</div>
		</div>

		<button class="rounded-md bg-[#0066ff] px-4 py-2 text-white hover:bg-[#0055dd]"
			>Save Changes</button
		>
	</div>

	<!-- Notification -->
	<div class="mb-8 border-t border-gray-100 pt-8">
		<h2 class="mb-4 text-lg font-medium">Notification</h2>

		<div class="space-y-4">
			<div class="flex items-center">
				<input
					type="checkbox"
					id="notify-shortlisted"
					checked
					class="h-4 w-4 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
				/>
				<label for="notify-shortlisted" class="ml-2 text-sm text-gray-700">
					Notify me when employers shortlisted me
				</label>
			</div>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="notify-applied-score"
					class="h-4 w-4 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
				/>
				<label for="notify-applied-score" class="ml-2 text-sm text-gray-700">
					Notify me when my applied jobs are score
				</label>
			</div>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="notify-job-alerts"
					checked
					class="h-4 w-4 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
				/>
				<label for="notify-job-alerts" class="ml-2 text-sm text-gray-700">
					Notify me when I have up to 5 job alerts
				</label>
			</div>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="notify-viewed"
					class="h-4 w-4 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
				/>
				<label for="notify-viewed" class="ml-2 text-sm text-gray-700">
					Notify me when employers viewed my profile
				</label>
			</div>

			<div class="flex items-center">
				<input
					type="checkbox"
					id="notify-rejected"
					checked
					class="h-4 w-4 rounded border-gray-300 text-[#0066ff] focus:ring-[#0066ff]"
				/>
				<label for="notify-rejected" class="ml-2 text-sm text-gray-700">
					Notify me when employers rejected me
				</label>
			</div>
		</div>
	</div>

	<!-- Job Alerts -->
	<div class="mb-8 border-t border-gray-100 pt-8">
		<h2 class="mb-4 text-lg font-medium">Job Alerts</h2>

		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700">Role</label>
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
						<rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
						<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
					</svg>
					<input
						type="text"
						placeholder="Your job roles"
						class="w-full rounded-md border px-4 py-2 pl-10"
					/>
				</div>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700">Location</label>
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
						placeholder="City, state, country name"
						class="w-full rounded-md border px-4 py-2 pl-10"
					/>
				</div>
			</div>
		</div>

		<button class="rounded-md bg-[#0066ff] px-4 py-2 text-white hover:bg-[#0055dd]"
			>Save Changes</button
		>
	</div>

	<!-- Privacy Settings -->
	<div class="mb-8 border-t border-gray-100 pt-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<h2 class="mb-4 text-lg font-medium">Profile Privacy</h2>
				<div class="flex items-center justify-between rounded-md border p-4">
					<div>
						<p class="text-sm font-medium text-gray-700">YES</p>
						<p class="text-xs text-gray-500">Your profile is public now</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" checked class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#0066ff] peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>
			</div>

			<div>
				<h2 class="mb-4 text-lg font-medium">Resume Privacy</h2>
				<div class="flex items-center justify-between rounded-md border p-4">
					<div>
						<p class="text-sm font-medium text-gray-700">NO</p>
						<p class="text-xs text-gray-500">Your resume is private now</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#0066ff] peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>
			</div>
		</div>
	</div>

	<!-- Change Password -->
	<div class="mb-8 border-t border-gray-100 pt-8">
		<h2 class="mb-4 text-lg font-medium">Change Password</h2>

		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
				<div class="relative">
					<input
						type="password"
						placeholder="Password"
						class="w-full rounded-md border px-4 py-2"
					/>
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
						class="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400"
					>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
						<circle cx="12" cy="12" r="3"></circle>
					</svg>
				</div>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700">New Password</label>
				<div class="relative">
					<input
						type="password"
						placeholder="Password"
						class="w-full rounded-md border px-4 py-2"
					/>
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
						class="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400"
					>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
						<circle cx="12" cy="12" r="3"></circle>
					</svg>
				</div>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
				<div class="relative">
					<input
						type="password"
						placeholder="Password"
						class="w-full rounded-md border px-4 py-2"
					/>
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
						class="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400"
					>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
						<circle cx="12" cy="12" r="3"></circle>
					</svg>
				</div>
			</div>
		</div>

		<button class="rounded-md bg-[#0066ff] px-4 py-2 text-white hover:bg-[#0055dd]"
			>Save Changes</button
		>
	</div>

	<!-- Delete Account -->
	<div class="border-t border-gray-100 pt-8">
		<h2 class="mb-4 text-lg font-medium">Delete Your Account</h2>

		<p class="mb-4 text-sm text-gray-500">
			If you delete your account, you will no longer be able to get information about the matched
			jobs, followed employers, and job alert, shortlisted jobs and more. You will be abandoned from
			all the services of jobster.com.
		</p>

		<button class="flex items-center rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
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
				<circle cx="12" cy="12" r="10" />
				<line x1="15" y1="9" x2="9" y2="15" />
				<line x1="9" y1="9" x2="15" y2="15" />
			</svg>
			Close Account
		</button>
	</div>
</div>
