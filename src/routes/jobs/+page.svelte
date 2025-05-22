<script>
  // Placeholder job data - replace with your actual data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "Remote",
      type: "Full-time",
      description: "We are looking for an experienced frontend developer proficient in modern JavaScript frameworks like React and Svelte. You will be responsible for leading the development of our user interface and ensuring a seamless user experience.",
      salary: "$120,000 - $150,000",
      postedDate: "2025-05-18",
      tags: ["React", "JavaScript", "Svelte", "UI/UX", "TypeScript"],
    },
    {
      id: 2,
      title: "Creative Graphic Designer",
      company: "Creative Solutions Ltd.",
      location: "Lagos, Nigeria",
      type: "Contract",
      description: "Seeking a talented and imaginative graphic designer to create compelling marketing materials across various platforms. Strong portfolio showcasing branding and digital design is required.",
      salary: "$30 - $50/hour",
      postedDate: "2025-05-17",
      tags: ["Adobe Photoshop", "Illustrator", "Figma", "Branding", "Digital Design"],
    },
    {
      id: 3,
      title: "SEO Content Writer",
      company: "Global Content Agency",
      location: "Remote",
      type: "Freelance",
      description: "We need a skilled and detail-oriented content writer with a strong understanding of SEO principles to produce high-quality blog posts and articles that drive organic traffic.",
      salary: "$0.10 - $0.15/word",
      postedDate: "2025-05-16",
      tags: ["SEO", "Content Marketing", "Blog Writing", "Keyword Research"],
    },
    {
      id: 4,
      title: "Junior Backend Developer",
      company: "Innovate Software",
      location: "New York, USA",
      type: "Full-time",
      description: "Exciting opportunity for a junior backend developer to join our growing team. You will work on building and maintaining our server-side applications using Node.js and Express.",
      salary: "$70,000 - $90,000",
      postedDate: "2025-05-15",
      tags: ["Node.js", "Express", "REST API", "Database"],
    },
  ];

  const categories = ["All", "Web Development", "Graphic Design", "Writing", "Marketing"];
  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  const locations = ["All", "Remote", "Lagos, Nigeria", "New York, USA"];

  let selectedCategory = "All";
  let selectedJobType = "All";
  let selectedLocation = "All";
  let searchQuery = "";

  $: filteredJobs = jobs.filter(job => {
    const categoryMatch = selectedCategory === "All" || job.tags.some(tag => categories.slice(1).includes(tag));
    const typeMatch = selectedJobType === "All" || job.type === selectedJobType;
    const locationMatch = selectedLocation === "All" || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const searchMatch = searchQuery === "" || job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && typeMatch && locationMatch && searchMatch;
  });

  const primaryBackgroundColor = 'oklch(21% 0.034 264.665)';
  const cardBackgroundColor = 'white'; // Using white for card background for better contrast
  const textColor = 'gray-900';
  const subtleTextColor = 'gray-700';
  const accentColor = 'indigo-500';
  const accentTextColor = 'indigo-700';
  const accentBackgroundColor = 'indigo-100';
  const borderColor = 'gray-300';
</script>

<div class="min-h-screen py-12" style={`background-color: ${primaryBackgroundColor}; color: ${textColor};`}>
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between mb-6">
      <h1 class="text-3xl font-bold text-{textColor}">Job Listings</h1>
      <div class="mt-3 md:mt-0">
        <input type="text" id="search" class={`shadow-sm focus:ring-${accentColor} focus:border-${accentColor} block w-full sm:w-64 rounded-md border-${borderColor} py-2 px-3`} placeholder="Search keywords..." bind:value={searchQuery}>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
    
      <aside class="md:col-span-1">
        <div class={`${cardBackgroundColor} rounded-lg shadow overflow-hidden`}>
          <div class="p-6">
            <h2 class="text-lg font-semibold text-{subtleTextColor} mb-4">Filter By</h2>

            <div class="mb-4">
              <label for="category" class="block text-sm font-medium text-{subtleTextColor}">Category</label>
              <select id="category" class={`mt-1 block w-full rounded-md border-${borderColor} shadow-sm focus:ring-${accentColor} focus:border-${accentColor} sm:text-sm`} bind:value={selectedCategory}>
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>

            <div class="mb-4">
              <label for="jobType" class="block text-sm font-medium text-{subtleTextColor}">Job Type</label>
              <select id="jobType" class={`mt-1 block w-full rounded-md border-${borderColor} shadow-sm focus:ring-${accentColor} focus:border-${accentColor} sm:text-sm`} bind:value={selectedJobType}>
                {#each jobTypes as type}
                  <option value={type}>{type}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-{subtleTextColor}">Location</label>
              <select id="location" class={`mt-1 block w-full rounded-md border-${borderColor} shadow-sm focus:ring-${accentColor} focus:border-${accentColor} sm:text-sm`} bind:value={selectedLocation}>
                {#each locations as location}
                  <option value={location}>{location}</option>
                {/each}
              </select>
            </div>

           
          </div>
        </div>
      </aside>

     
      <div class="md:col-span-3">
        {#if filteredJobs.length > 0}
          <ul class="space-y-4">
            {#each filteredJobs as job (job.id)}
              <li class={`${cardBackgroundColor} rounded-lg shadow overflow-hidden hover:shadow-md transition duration-200 border border-white`}>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-{textColor} mb-2">{job.title}</h3>
                  <p class={`text-${subtleTextColor} mb-1`}><span class="font-semibold">Company:</span> {job.company}</p>
                  <p class={`text-${subtleTextColor} mb-1`}><span class="font-semibold">Location:</span> {job.location}</p>
                  <p class={`text-${subtleTextColor} mb-2`}><span class="font-semibold">Type:</span> <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${accentBackgroundColor} text-${accentTextColor}`}>{job.type}</span></p>
                  <p class={`text-gray-600 text-sm line-clamp-3 mb-3`}>{job.description}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Posted on: {new Date(job.postedDate).toLocaleDateString()}</span>
                    <a href={`/job/${job.id}`} class={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-${accentTextColor} bg-${accentBackgroundColor} hover:bg-${accentBackgroundColor}-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}`}>
                      View Details
                      <svg class="-mr-1 ml-2 h-5 w-5 text-{accentColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </div>
                  {#if job.tags && job.tags.length > 0}
                    <div class="mt-3">
                      {#each job.tags as tag}
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 mr-2">{tag}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <div class={`${cardBackgroundColor} rounded-lg shadow p-6 text-center`}>
            <p class="text-gray-600">No jobs match your current filters.</p>
          </div>
        {/if}

        
        {#if jobs.length > 10}
          <div class="mt-8 flex justify-center">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-${borderColor} bg-${cardBackgroundColor} text-sm font-medium text-gray-500 hover:bg-gray-50`}>
                Previous
              </a>
              {#each Array(Math.ceil(jobs.length / 10)) as _, i}
                <a href="#" aria-current="page" class={`bg-${accentBackgroundColor} border-${accentColor} text-${accentTextColor} relative inline-flex items-center px-4 py-2 border text-sm font-medium`}>
                  {i + 1}
                </a>
              {/each}
              <a href="#" class={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-${borderColor} bg-${cardBackgroundColor} text-sm font-medium text-gray-500 hover:bg-gray-50`}>
                Next
              </a>
            </nav>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* You can still define custom colors here if needed */
</style>