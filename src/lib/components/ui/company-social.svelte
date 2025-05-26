<script lang="ts">
	let { formData = $bindable(), addSocialLink, removeSocialLink, updateSocialLink } = $props();

	const platformOptions = [
		{ value: 'facebook', label: 'Facebook' },
		{ value: 'twitter', label: 'Twitter' },
		{ value: 'instagram', label: 'Instagram' },
		{ value: 'youtube', label: 'YouTube' },
		{ value: 'linkedin', label: 'LinkedIn' }
	];
</script>

<div>
	{#each formData.socialLinks as link, index}
		<div class="mb-6 border-b border-dashed border-gray-200 pb-6">
			<h3 class="mb-3 text-sm font-medium text-gray-700">Social Link {index + 1}</h3>
			<div class="flex items-center space-x-3">
				<div class="relative w-40">
					<select
						bind:value={link.platform}
						onchange={(e) =>
							updateSocialLink(index, 'platform', (e.target as HTMLSelectElement).value)}
						class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					>
						{#each platformOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
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
				<div class="relative flex-1">
					<input
						type="url"
						placeholder="Profile link/url..."
						bind:value={link.url}
						oninput={(e) => updateSocialLink(index, 'url', (e.target as HTMLInputElement).value)}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					/>
					{#if formData.socialLinks.length > 1}
						<button
							onclick={() => removeSocialLink(index)}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
							aria-label="remove social link"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/each}

	<div class="mb-6 border-b border-dashed border-gray-200 pb-6">
		<button
			onclick={addSocialLink}
			class="flex items-center font-medium text-blue-600 hover:text-blue-500"
		>
			<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6v6m0 0v6m0-6h6m-6 0H6"
				></path>
			</svg>
			Add New Social Link
		</button>
	</div>
</div>
