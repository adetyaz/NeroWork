<script lang="ts">
	let { formData = $bindable() } = $props();

	function handleFileUpload(type: any, event: any) {
		const file = event.target.files[0];
		if (file) {
			formData[type] = file;
		}
	}
</script>

<div>
	<h2 class="mb-6 text-xl font-semibold">Logo</h2>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Logo Upload -->
		<div>
			<h3 class="mb-2 block text-sm font-medium text-gray-700">Upload document</h3>
			<div
				class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400"
			>
				<svg
					class="mx-auto mb-2 h-8 w-8 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					></path>
				</svg>
				<p class="mb-1 text-sm text-gray-600">
					<label class="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
						Browse photo
						<input
							type="file"
							class="hidden"
							accept="image/*"
							onchange={(e) => handleFileUpload('logo', e)}
						/>
					</label>
					or drop here
				</p>
				<p class="text-xs text-gray-500">
					A photo larger than 400 pixels work best. Max photo size 5 MB.
				</p>
			</div>
		</div>

		<!-- Banner Upload -->
		<div></div>
	</div>

	<!-- Company Name -->
	<div class="mb-6">
		<h3 class="mb-2 block text-sm font-medium text-gray-700">Company name</h3>
		<input
			type="text"
			placeholder="Enter company name"
			bind:value={formData.companyName}
			class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<!-- About Us -->
	<div class="mb-6">
		<h3 class="mb-2 block text-sm font-medium text-gray-700">About Us</h3>
		<textarea
			placeholder="Write down about your company here. Let the candidate know who you are..."
			bind:value={formData.aboutUs}
			class="resize-vertical min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
		></textarea>
	</div>
</div>
