<script>
	let { formData = $bindable() } = $props();
</script>

<div>
	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Organization Type -->
		<div>
			<h3 class="mb-2 block text-sm font-medium text-gray-700">Organization Type</h3>
			<div class="relative">
				<select
					bind:value={formData.organizationType}
					class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select...</option>
					<option value="private">Private Company</option>
					<option value="public">Public Company</option>
					<option value="nonprofit">Non-Profit</option>
					<option value="government">Government</option>
					<option value="startup">Startup</option>
				</select>
				<svg
					class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</div>
		</div>

		<!-- Industry Types -->
		<div>
			<h3 class="mb-2 block text-sm font-medium text-gray-700">Industry Types</h3>
			<div class="relative">
				<select
					bind:value={formData.industryType}
					class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select...</option>
					<option value="technology">Technology</option>
					<option value="healthcare">Healthcare</option>
					<option value="finance">Finance</option>
					<option value="education">Education</option>
					<option value="retail">Retail</option>
					<option value="manufacturing">Manufacturing</option>
				</select>
				<svg
					class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</div>
		</div>

		<!-- Team Size -->
		<div>
			<h3 class="mb-2 block text-sm font-medium text-gray-700">Team Size</h3>
			<div class="relative">
				<select
					bind:value={formData.teamSize}
					class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select...</option>
					<option value="1-10">1-10 employees</option>
					<option value="11-50">11-50 employees</option>
					<option value="51-200">51-200 employees</option>
					<option value="201-500">201-500 employees</option>
					<option value="500+">500+ employees</option>
				</select>
				<svg
					class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</div>
		</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Year of Establishment -->
		<div>
			<h3 class="mb-2 block text-sm font-medium text-gray-700">Year of Establishment</h3>
			<div class="relative">
				<input
					type="date"
					placeholder="dd/mm/yyyy"
					bind:value={formData.establishmentYear}
					class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>

		<!-- Company Website -->
		<div>
			<h3 class="mb-2 block text-sm font-medium text-gray-700">Company Website</h3>
			<div class="relative">
				<input
					type="url"
					placeholder="Website url..."
					bind:value={formData.companyWebsite}
					class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>
	</div>

	<!-- Company Vision -->
	<div class="mb-6">
		<h3 class="mb-2 block text-sm font-medium text-gray-700">Company Vision</h3>
		<textarea
			placeholder="Tell us about your company vision..."
			bind:value={formData.companyVision}
			class="resize-vertical min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
		></textarea>
	</div>
</div>
