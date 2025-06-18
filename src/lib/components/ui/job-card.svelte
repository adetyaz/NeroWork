<script>
	let { title, status, job_role, budget, description, id } = $props();
</script>

<a
	class="cursor-pointer rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
	href={`/job/${id}`}
	data-sveltekit-preload-data="false"
>
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
					<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
					<circle cx="12" cy="12" r="3" fill="white" />
				</svg>
			</div>
			<div>
				<h3 class="font-medium">Reddit</h3>
				<div class="mt-1 flex items-center text-sm text-gray-500">
					<span>{title}</span>
				</div>
			</div>
		</div>
		<span class="rounded-md bg-[#ffeded] px-2 py-0.5 text-xs font-semibold text-[#ff4500]"
			>Featured</span
		>
	</div>
	<h2 class="mb-2 text-lg font-semibold">{job_role}</h2>
	<div class="py-4">
		<p>{description}</p>
	</div>
	<div class="flex items-center justify-between">
		<div class="mb-2 text-sm text-gray-500">
			<span>Full Time</span> • <span>${budget}k</span>
		</div>
		<div class="bg-green-300/50 px-2 py-1 text-green-600">
			<p>{status}</p>
		</div>
	</div>
</a>
