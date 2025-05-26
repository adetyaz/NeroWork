<script>
	// Sample candidate data
	const candidate = {
		name: 'Esther Howard',
		role: 'Website Designer (UX/UI)',
		avatar: '/placeholder.svg?height=80&width=80',
		joinDate: '14 June, 2021',
		location: 'Bangladesh',
		biography: `I've been passionate about graphic design and digital art from an early age. I'm a self-taught designer with experience in both print and digital media. I can create high-quality and aesthetically pleasing designs. I have experience in Logo Design, Business Card Design, Letterhead Design, Poster Design, Flyer Design, Banner Design, Photo Editing, Photo Retouching, and much more. I'm always eager to take on new challenges and learn new skills. I have experience in Adobe Photoshop, Illustrator, XD and Figma. I'm also familiar with HTML, CSS, and JavaScript. I'm always looking for new opportunities to grow and develop my skills. I'm a hard worker and I'm always willing to go the extra mile to ensure that my clients are satisfied with my work. I'm also a good communicator and I'm always willing to listen to feedback and make changes as needed. I'm confident that I can be a valuable asset to any team, and I'm excited to see what the future holds.`,
		coverLetter: `I am writing to express my interest in the fourth grade instructional position that is currently available in the Wayne Community College District. As a licensed teacher with a Master's degree in Elementary Education and have successfully completed Physics and Physics II, I am confident that my academic background and curriculum development skills make me an ideal candidate for this position. During my student teaching experience, I developed and created a three-week curriculum sequence on animal science and animal habitats that was used by my mentor teacher and culminated in a field trip to the Indianapolis Zoo Animal Research Unit.`,
		contactInfo: {
			website: 'www.estherhoward.com',
			email: 'esther.howard@gmail.com',
			phone: '+1-202-555-0178',
			address: 'Beverly Hills, California 90210'
		}
	};

	function sendMail() {
		window.location.href = `mailto:${candidate.contactInfo.email}`;
	}

	function downloadResume() {
		// In a real app, this would download the actual resume file
		alert('Downloading resume...');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header with background -->
	<div class="relative h-48 bg-gradient-to-r from-purple-600 to-purple-800">
		<div class="bg-opacity-20 absolute inset-0 bg-black"></div>
		<div class="relative mx-auto max-w-6xl px-6 py-8">
			<div class="flex items-center justify-between text-white">
				<div class="flex items-center space-x-4">
					<img
						src={candidate.avatar || '/placeholder.svg'}
						alt={candidate.name}
						class="h-20 w-20 rounded-full border-4 border-white"
					/>
					<div>
						<h1 class="text-2xl font-bold">{candidate.name}</h1>
						<p class="text-purple-100">{candidate.role}</p>
					</div>
				</div>
				<button
					onclick={sendMail}
					class="rounded-lg bg-blue-600 px-6 py-2 font-medium transition-colors hover:bg-blue-700"
				>
					Send Mail
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-6xl px-6 py-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left Column - Main Content -->
			<div class="space-y-8 lg:col-span-2">
				<!-- Biography -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">BIOGRAPHY</h2>
					<p class="leading-relaxed text-gray-600">{candidate.biography}</p>
				</div>

				<!-- Cover Letter -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">COVER LETTER</h2>
					<h3 class="mb-3 font-medium">Dear Sir,</h3>
					<p class="mb-4 leading-relaxed text-gray-600">{candidate.coverLetter}</p>
					<p class="text-gray-600">Sincerely,</p>
					<p class="font-medium text-gray-600">{candidate.name}</p>
				</div>

				<!-- Social Media -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-xl font-semibold">Follow me Social Media</h2>
					<div class="flex space-x-4">
						<a
							href="https://twitter.com"
							aria-label="Twitter"
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
								/>
							</svg>
						</a>
						<a
							href="https://facebook.com"
							aria-label="Facebook"
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-800 text-white hover:bg-blue-900"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
								/>
							</svg>
						</a>
						<a
							href="https://pinterest.com"
							aria-label="Pinterest"
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600 text-white hover:bg-pink-700"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.099.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
								/>
							</svg>
						</a>
						<a
							href="https://linkedin.com"
							aria-label="LinkedIn"
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			<!-- Right Column - Sidebar -->
			<div class="space-y-6">
				<!-- Quick Stats -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<div class="grid grid-cols-2 gap-4 text-center">
						<div>
							<div
								class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100"
							>
								<svg
									class="h-6 w-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									></path>
								</svg>
							</div>
							<p class="text-sm text-gray-500">Join Date</p>
							<p class="font-medium">{candidate.joinDate}</p>
						</div>
						<div>
							<div
								class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100"
							>
								<svg
									class="h-6 w-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
							</div>
							<p class="text-sm text-gray-500">Location</p>
							<p class="font-medium">{candidate.location}</p>
						</div>
					</div>
				</div>

				<!-- Download Resume -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h3 class="mb-4 font-semibold">Download My Resume</h3>
					<button
						onclick={downloadResume}
						class="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
					>
						<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
						PDF
					</button>
				</div>

				<!-- Contact Information -->
				<div class="rounded-lg bg-white p-6 shadow-sm">
					<h3 class="mb-4 font-semibold">Contact Information</h3>
					<div class="space-y-4">
						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg
									class="h-5 w-5 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">WEBSITE</p>
								<p class="font-medium">{candidate.contactInfo.website}</p>
							</div>
						</div>

						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
								<svg
									class="h-5 w-5 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">EMAIL ADDRESS</p>
								<p class="font-medium">{candidate.contactInfo.email}</p>
							</div>
						</div>

						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
								<svg
									class="h-5 w-5 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">PHONE</p>
								<p class="font-medium">{candidate.contactInfo.phone}</p>
							</div>
						</div>

						<div class="flex items-center">
							<div class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
								<svg
									class="h-5 w-5 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">LOCATION</p>
								<p class="font-medium">{candidate.contactInfo.address}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
