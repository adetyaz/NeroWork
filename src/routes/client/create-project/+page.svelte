<script lang="ts">
    import { supabase } from '$lib/utils/supabaseClient';
    import NavBar from '$lib/components/NavBar.svelte'
    import { getSigner, mintEscrow } from '$lib/utils/aaUtils';
    import { NERO_CHAIN_CONFIG } from '$lib/config';

    const API_KEY = process.env.ETHERSCAN_API_KEY;
    
  // Form data
  let formData = $state({
    name: '',
    description: '',
    expectations: '',
    category: '',
    deadline: '',
    budget: ''
  });

  let isSubmitting = $state(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let errorMessage = $state('');
  let txHash = $state('');
  txHash = '';


  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSubmitting = true;
    errorMessage = '';

    try {
      const signer = await getSigner();
      const userAddress = await signer.getAddress();

      // Execute mintEscrow with budget
      const budgetNumber = parseFloat(formData.budget);
      if (isNaN(budgetNumber) || budgetNumber <= 0) {
        throw new Error('Invalid budget amount.');
      }

      const result = await mintEscrow(
        signer,
        userAddress,
        budgetNumber.toString(),
        { apiKey: API_KEY }
      );


      // Prepare data for submission
      const jobData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        expectations: formData.expectations,
        deadline: formData.deadline,
        budget: parseFloat(formData.budget),
        // client_id: user.id
      };

      // Insert into Supabase
      const { error } = await supabase.from('jobs').insert([jobData]);

      if (error) {
        throw new Error(error.message);
      }

      
      txHash = result.transactionHash;
      alert('Escrow minted and job posted successfully!');

      alert('Job posted successfully!');
      // Reset form
      formData = {
        name: '',
        description: '',
        expectations: '',
        category: '',
        deadline: '',
        budget: ''
      };
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to post job.';
    } finally {
      isSubmitting = false;
    }
  }

</script>

<main>
  <NavBar />

  <section class="bg-gray-900 text-white py-16 px-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center">
        Create a New Job
      </h1>

      <form onsubmit={handleSubmit} class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium mb-2">Job Name</label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            required
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Build a Web3 Marketplace"
          />
        </div>
        <div>
          <label for="category" class="block text-sm font-medium mb-2">Category</label>
          <select
            id="category"
            bind:value={formData.category}
            required
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>Select a category</option>
            <option value="web2">Web2 Development</option>
            <option value="web3">Web3 Development</option>
            <option value="design">UI/UX Design</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium mb-2">Description</label>
          <textarea
            id="description"
            bind:value={formData.description}
            required
            rows="5"
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe the job in detail..."
          ></textarea>
        </div>

        <div>
          <label for="expectations" class="block text-sm font-medium mb-2">Expectations</label>
          <textarea
            id="expectations"
            bind:value={formData.expectations}
            required
            rows="4"
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Deliverables, skills required, communication frequency..."
          ></textarea>
        </div>

        <div>
          <label for="deadline" class="block text-sm font-medium mb-2">Deadline</label>
          <input
            type="date"
            id="deadline"
            bind:value={formData.deadline}
            required
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label for="budget" class="block text-sm font-medium mb-2">Project Budget (USD)</label>
          <input
            type="number"
            id="budget"
            bind:value={formData.budget}
            required
            min="0"
            step="1"
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., 1000"
          />
        </div>

        <div class="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            class="px-8 py-3 bg-gradient-to-r from-gray-600 to-purple-500 text-white rounded-lg text-lg font-semibold hover:from-gray-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Post Job & Mint Escrow'}
          </button>
        </div>
      </form>
      {#if txHash}
        <div class="mt-6 text-center text-white">
          <p>Transaction successful!</p>
          <a
            href="{NERO_CHAIN_CONFIG.explorer}/tx/{txHash}"
            target="_blank"
            rel="noopener noreferrer"
            class="text-purple-400 hover:underline"
          >
            View on Explorer
          </a>
        </div>
      {/if}
    </div>
  </section>
</main>