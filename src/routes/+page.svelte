<script lang="ts">
	import { Menu, X, Star, Users, DollarSign, Clock, Award, Briefcase } from '@lucide/svelte';

	let walletAddress = $state('');
	
	let features = $state([
		{ icon: Clock, title: 'Instant Payouts', description: 'Get paid instantly in NERO for your work' },
		{ icon: Award, title: 'On-Chain Badges', description: 'Earn NFT badges for your freelance milestones' },
		{ icon: DollarSign, title: 'No Platform Fees', description: 'Keep 100% of your earnings' },
		{ icon: Briefcase, title: 'Professional Invoices', description: 'Mint and share on-chain invoices' },
		{ icon: Users, title: 'Freelancer Community', description: 'Join top NERO freelancers' },
		{ icon: Star, title: 'Reputation', description: 'Showcase your achievements and badges' }
	]);

	
	$effect(() => {
		walletAddress = localStorage.getItem('connectedWallet') || '';
	});


</script>

<main>
	<section class="bg-gray-900 px-6 py-20 text-white">
		<div class="mx-auto max-w-5xl text-center">
			<h1 class="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
				Get Paid Instantly as a <span class="text-purple-400">Freelancer</span>
			</h1>
			<p class="mx-auto mb-8 max-w-3xl text-lg leading-relaxed md:text-2xl">
				Create professional invoices, share payment links, and track payments on-chain. <span class="text-purple-400"
					>No platform fees</span
				>, instant crypto payouts, and a simple dashboard for all your freelance work.
			</p>
			{#if walletAddress}
				<a
					href="/freelancer/dashboard/create-invoice"
					class="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl"
				>
					Create Invoice
				</a>
			{:else}
				<p class="mt-6 text-lg text-purple-200">Connect your wallet to get started.</p>
			{/if}
		</div>
	</section>
	<section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Left Content -->
      <div class="space-y-8">
        <div>
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            On-Chain Freelancing,
            <span class="text-blue-600">Powered by NeroWork</span>
          </h1>
          <p class="text-xl text-gray-600 mt-6 leading-relaxed">
            Create, share, and track professional invoices on-chain. Get paid instantly in NERO, earn NFT milestone badges, and build your reputation in the leading web3 freelance community. No platform fees, just pure earning power.
          </p>
        </div>

        <!-- Feature Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          {#each features as feature}
            <div class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-blue-100 p-3 rounded-full mb-3">
                <feature.icon class="h-6 w-6 text-blue-600" />
              </div>
              <h3 class="font-semibold text-gray-900 text-sm">{feature.title}</h3>
            </div>
          {/each}
        </div>

        <button 
         
          class="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started Today
        </button>
      </div>

      <!-- Right Image -->
      <div class="relative">
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <img 
            src="/placeholder.svg?height=400&width=600" 
            alt="Team collaboration" 
            class="w-full h-96 object-cover"
          />
        </div>
        <!-- Floating elements -->
        <div class="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          ⭐ Top Rated
        </div>
        <div class="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          💼 1000+ Projects
        </div>
      </div>
    </div>
  </div>
</section>

  <!-- CTA Section -->
  <section class="bg-gradient-to-r from-blue-600 to-purple-700 py-20">
    <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 class="text-4xl font-bold text-white mb-6">
        Ready to transform your freelance journey?
      </h2>
      <p class="text-xl text-blue-100 mb-8">
        Be part of the freelance community shaping the future of work
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
  
          class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Get Started
        </button>
        <button 
         
          class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
        >
          Learn More
        </button>
      </div>
      <p class="text-blue-200 text-sm mt-6">
        Connect with top-tier professionals worldwide
      </p>
    </div>
  </section>



  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="space-y-4">
          <div class="text-2xl font-bold text-blue-400">NeroWork</div>
          <p class="text-gray-400 text-sm leading-relaxed">
            On-chain freelance invoicing, instant NERO payouts, and NFT badge rewards. Join the future of work with NeroWork.
          </p>
          <div class="text-gray-400 text-sm">
            <p>📧 info@nerowork.com</p>
            <p>📞 +1 (555) 123-4567</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="/faq" class="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="/terms" class="hover:text-white transition-colors">Terms & Conditions</a></li>
            <li><a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="/support" class="hover:text-white transition-colors">Support</a></li>
          </ul>
        </div>

        <!-- Follow Us -->
        <div>
          <h4 class="font-semibold mb-4">Follow Us</h4>
          <div class="flex space-x-4">
            <a href="/" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <div class="w-5 h-5 bg-blue-400 rounded"></div>
            </a>
            <a href="/" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <div class="w-5 h-5 bg-pink-400 rounded"></div>
            </a>
            <a href="/" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <div class="w-5 h-5 bg-blue-600 rounded"></div>
            </a>
          </div>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="font-semibold mb-4">Stay Updated</h4>
          <div class="space-y-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; 2024 NeroWork. All rights reserved.</p>
      </div>
    </div>
  </footer>
</main>
