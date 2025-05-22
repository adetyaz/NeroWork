<script>
	// Form data
	let jobTitle = $state('');
	let tags = $state('');
	let minSalary = $state('');
	let maxSalary = $state('');
	let expirationDate = $state('');
	let description = $state('');
	let responsibilities = $state('');
	let applicationMethod = $state('jobpilot');

	// Dropdown options
	const educationOptions = ['High School', 'Bachelor Degree', 'Master Degree', 'PhD'];
	const experienceOptions = ['1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'];
	const jobTypeOptions = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];
	const jobLevelOptions = ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director'];
	const jobRoleOptions = [
		'UI/UX Designer',
		'Frontend Developer',
		'Backend Developer',
		'Full Stack Developer',
		'Product Manager'
	];
	const salaryTypeOptions = ['Monthly', 'Yearly', 'Hourly', 'Project Based'];
	const vacanciesOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

	// Handle form submission
	function handleSubmit() {
		// Form validation and submission logic would go here
		console.log({
			jobTitle: jobTitle,
			tags: tags,
			minSalary: minSalary,
			maxSalary: maxSalary,
			expirationDate: expirationDate,
			description: description,
			responsibilities: responsibilities,
			applicationMethod: applicationMethod
		});

		// In a real application, you would send this data to your backend
		alert('Job posted successfully!');
	}
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm">
	<h1 class="mb-6 border-b border-gray-200 pb-2 text-2xl font-bold">Post a Job</h1>

	<form onsubmit={handleSubmit}>
		<!-- Job Title -->
		<div class="mb-6">
			<label for="jobTitle" class="mb-1 block text-sm font-medium text-gray-700">Job Title</label>
			<input
				type="text"
				id="jobTitle"
				placeholder="Add job title, role, vacancies etc"
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={jobTitle}
			/>
		</div>

		<!-- Tags and Job Role -->
		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="tags" class="mb-1 block text-sm font-medium text-gray-700">Tags</label>
				<input
					type="text"
					id="tags"
					placeholder="Job keyword, tags etc..."
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={tags}
				/>
			</div>
			<div>
				<label for="jobRole" class="mb-1 block text-sm font-medium text-gray-700">Job Role</label>
				<div class="relative">
					<select
						id="jobRole"
						class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						<option value="" disabled selected>Select...</option>
						{#each jobRoleOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
					<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Salary Section -->
		<div class="mb-6">
			<h2 class="mb-3 text-lg font-medium">Salary</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div>
					<label for="minSalary" class="mb-1 block text-sm font-medium text-gray-700"
						>Min Salary</label
					>
					<div class="flex">
						<input
							type="text"
							id="minSalary"
							placeholder="Minimum salary..."
							class="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							bind:value={minSalary}
						/>
						<span
							class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
						>
							USD
						</span>
					</div>
				</div>
				<div>
					<label for="maxSalary" class="mb-1 block text-sm font-medium text-gray-700"
						>Max Salary</label
					>
					<div class="flex">
						<input
							type="text"
							id="maxSalary"
							placeholder="Maximum salary..."
							class="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							bind:value={maxSalary}
						/>
						<span
							class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
						>
							USD
						</span>
					</div>
				</div>
				<div>
					<label for="salaryType" class="mb-1 block text-sm font-medium text-gray-700"
						>Salary Type</label
					>
					<div class="relative">
						<select
							id="salaryType"
							class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="" disabled selected>Select...</option>
							{#each salaryTypeOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Advance Information -->
		<div class="mb-6">
			<h2 class="mb-3 text-lg font-medium">Advance Information</h2>
			<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
				<div>
					<label for="education" class="mb-1 block text-sm font-medium text-gray-700"
						>Education</label
					>
					<div class="relative">
						<select
							id="education"
							class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="" disabled selected>Select...</option>
							{#each educationOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>
				<div>
					<label for="experience" class="mb-1 block text-sm font-medium text-gray-700"
						>Experience</label
					>
					<div class="relative">
						<select
							id="experience"
							class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="" disabled selected>Select...</option>
							{#each experienceOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>
				<div>
					<label for="jobType" class="mb-1 block text-sm font-medium text-gray-700">Job Type</label>
					<div class="relative">
						<select
							id="jobType"
							class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="" disabled selected>Select...</option>
							{#each jobTypeOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div>
					<label for="vacancies" class="mb-1 block text-sm font-medium text-gray-700"
						>Vacancies</label
					>
					<div class="relative">
						<select
							id="vacancies"
							class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="" disabled selected>Select...</option>
							{#each vacanciesOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>
				<div>
					<label for="expirationDate" class="mb-1 block text-sm font-medium text-gray-700"
						>Expiration Date</label
					>
					<input
						type="text"
						id="expirationDate"
						placeholder="DD/MM/YYYY"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						bind:value={expirationDate}
					/>
				</div>
				<div>
					<label for="jobLevel" class="mb-1 block text-sm font-medium text-gray-700"
						>Job Level</label
					>
					<div class="relative">
						<select
							id="jobLevel"
							class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<option value="" disabled selected>Select...</option>
							{#each jobLevelOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Apply Job on -->
		<div class="mb-6 rounded-lg bg-gray-50 p-5">
			<h2 class="mb-4 text-lg font-medium">Apply Job on:</h2>
			<div class="space-y-4">
				<label class="flex items-start">
					<input
						type="radio"
						name="applicationMethod"
						value="jobpilot"
						class="mt-1 h-4 w-4 text-blue-600"
						checked={applicationMethod === 'jobpilot'}
						onchange={() => (applicationMethod = 'jobpilot')}
					/>
					<div class="ml-3">
						<span class="block font-medium">On Jobpilot</span>
						<span class="block text-sm text-gray-500"
							>Candidate will apply job using jobpilot & all application will show on your
							dashboard.</span
						>
					</div>
				</label>

				<label class="flex items-start">
					<input
						type="radio"
						name="applicationMethod"
						value="external"
						class="mt-1 h-4 w-4 text-blue-600"
						checked={applicationMethod === 'external'}
						onchange={() => (applicationMethod = 'external')}
					/>
					<div class="ml-3">
						<span class="block font-medium">External Platform</span>
						<span class="block text-sm text-gray-500"
							>Candidate apply job on your website, all application on your own website.</span
						>
					</div>
				</label>

				<label class="flex items-start">
					<input
						type="radio"
						name="applicationMethod"
						value="email"
						class="mt-1 h-4 w-4 text-blue-600"
						checked={applicationMethod === 'email'}
						onchange={() => (applicationMethod = 'email')}
					/>
					<div class="ml-3">
						<span class="block font-medium">On Your Email</span>
						<span class="block text-sm text-gray-500"
							>Candidate apply job on your email address, and all application in your email.</span
						>
					</div>
				</label>
			</div>
		</div>

		<!-- Description & Responsibility -->
		<div class="mb-6">
			<h2 class="mb-3 text-lg font-medium">Description & Responsibility</h2>

			<div class="mb-4">
				<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
					>Description</label
				>
				<div class="overflow-hidden rounded-md border border-gray-300">
					<textarea
						id="description"
						rows="6"
						placeholder="Add your job description..."
						class="w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						bind:value={description}
					></textarea>
					<div class="flex items-center space-x-2 border-t border-gray-300 bg-gray-50 px-3 py-2">
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 12h12M6 18h12M6 6h12"
								></path>
							</svg>
						</button>
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16m-7 6h7"
								></path>
							</svg>
						</button>
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
								></path>
							</svg>
						</button>
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div>
				<label for="responsibilities" class="mb-1 block text-sm font-medium text-gray-700"
					>Responsibilities</label
				>
				<div class="overflow-hidden rounded-md border border-gray-300">
					<textarea
						id="responsibilities"
						rows="6"
						placeholder="Add your job responsibilities..."
						class="w-full px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						bind:value={responsibilities}
					></textarea>
					<div class="flex items-center space-x-2 border-t border-gray-300 bg-gray-50 px-3 py-2">
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 12h12M6 18h12M6 6h12"
								></path>
							</svg>
						</button>
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16m-7 6h7"
								></path>
							</svg>
						</button>
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
								></path>
							</svg>
						</button>
						<button type="button" class="p-1 text-gray-500 hover:text-gray-700">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
								></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div>
			<button
				type="submit"
				class="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Post Job
				<svg class="-mr-1 ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					></path>
				</svg>
			</button>
		</div>
	</form>
</div>
