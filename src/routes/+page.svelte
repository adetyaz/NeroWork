<script lang="ts">
	import { Star, Users, DollarSign, Clock, Award, Briefcase, Shield, Zap, TrendingUp, CheckCircle, ArrowRight, Play, Twitter } from '@lucide/svelte';
	import AAWalletConnect from '$lib/components/AAWalletConnect.svelte';

	let walletConnected = $state(false);
	
	let features = $state([
		{ icon: Clock, title: 'Instant Payouts', description: 'Get paid instantly in NERO for your work', highlight: 'No delays' },
		{ icon: Award, title: 'NFT Badges', description: 'Earn reputation NFTs for milestones', highlight: 'Build reputation' },
		{ icon: DollarSign, title: 'Zero Fees', description: 'Keep 100% of your earnings', highlight: '0% platform fee' },
		{ icon: Briefcase, title: 'Professional Invoices', description: 'On-chain invoice management', highlight: 'Blockchain verified' },
		{ icon: Shield, title: 'Secure Payments', description: 'Transparent blockchain transactions', highlight: 'Trustless' },
		{ icon: Zap, title: 'Gasless Withdrawals', description: 'No gas fees when withdrawing', highlight: 'Powered by NERO' }
	]);

	let stats = $state([]);

	let howItWorks = $state([
		{
			step: 1,
			title: "Connect Wallet",
			description: "Connect your NERO wallet and set up your freelancer profile in seconds",
			icon: "🔗"
		},
		{
			step: 2,
			title: "Create Invoice",
			description: "Generate professional on-chain invoices with detailed project information",
			icon: "📄"
		},
		{
			step: 3,
			title: "Share Payment Link",
			description: "Send secure payment links to clients for instant review and payment",
			icon: "📤"
		},
		{
			step: 4,
			title: "Get Paid Instantly",
			description: "Receive NERO payments directly to your wallet with zero fees",
			icon: "💰"
		}
	]);
	
	$effect(() => {
		walletConnected = localStorage.getItem('connectedWallet') !== null;
		// Listen for wallet changes in other tabs/components
		const onStorage = (e: StorageEvent) => {
			if (e.key === 'connectedWallet') {
				walletConnected = e.newValue !== null;
			}
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	});
</script>

<main>
	<!-- Hero Section -->
	<section class="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
		<div class="absolute inset-0 bg-black opacity-50"></div>
		<div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
			<div class="text-center space-y-8">
				<div class="space-y-4">
					<div class="inline-flex items-center bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 text-blue-200 text-sm font-medium">
						<Zap class="w-4 h-4 mr-2" />
						Powered by NERO Chain • Zero Gas Fees
					</div>
					<h1 class="text-5xl md:text-7xl font-bold text-white leading-tight">
						The Future of
						<span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							Freelance Work
						</span>
					</h1>
					<p class="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
						Create professional on-chain invoices, get paid instantly in NERO, earn reputation NFTs, and build your freelance empire. 
						<span class="text-blue-400 font-semibold">No platform fees. No delays. Just results.</span>
					</p>
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					{#if walletConnected}
						<a
							href="/freelancer/dashboard/create-invoice"
							class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-2"
						>
							Create Your First Invoice
							<ArrowRight class="w-5 h-5" />
						</a>
					{:else}
						<AAWalletConnect bind:isConnected={walletConnected} />
					{/if}
					<button 
						onclick={() => document.getElementById('demo-video')?.scrollIntoView({behavior: 'smooth'})}
						class="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
					>
						<Play class="w-5 h-5" />
						Watch Demo
					</button>
				</div>

				<p class="text-gray-400 text-sm">
					💎 Join freelancers already earning on NeroWork
				</p>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="py-24 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
					How It Works
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Get started in minutes with our simple 4-step process
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each howItWorks as step}
					<div class="relative text-center group">
						<!-- Step connector line -->
						{#if step.step < 4}
							<div class="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-8"></div>
						{/if}
						
						<!-- Step circle -->
						<div class="relative z-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
							{step.step}
						</div>
						
						<!-- Step emoji -->
						<div class="text-4xl mb-4">{step.icon}</div>
						
						<!-- Step content -->
						<h3 class="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
						<p class="text-gray-600 leading-relaxed">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Demo Video Section -->
	<section id="demo-video" class="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
					See NeroWork in Action
				</h2>
				<p class="text-xl text-blue-100 max-w-3xl mx-auto">
					Watch how easy it is to create invoices, get paid, and build your reputation on the blockchain
				</p>
			</div>

			<div class="relative max-w-4xl mx-auto">
				<!-- Loom Video Embed -->
				<div class="relative rounded-2xl overflow-hidden shadow-2xl">
					<div style="position: relative; padding-bottom: 56.25%; height: 0;">
						<iframe 
							src="https://www.loom.com/embed/70d6c8a78fe64b06a66889febee3a1cf?sid=1d2adbfc-1639-4be1-8edf-734965cf9620" 
							frameborder="0" 
							allowfullscreen
							title="Demo: Complete Invoice Workflow"
							style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 0.75rem;"
						></iframe>
					</div>
					<div class="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
						<p class="text-white text-sm font-medium">Demo: Complete Invoice Workflow</p>
						<p class="text-blue-200 text-xs">3:45 minutes</p>
					</div>
				</div>
			</div>

				<!-- Demo features grid -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
					<div class="text-center">
						<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div class="text-4xl mb-3">🚀</div>
							<h3 class="text-white font-semibold mb-2">Quick Setup</h3>
							<p class="text-blue-100 text-sm">Connect wallet and start invoicing in under 2 minutes</p>
						</div>
					</div>
					<div class="text-center">
						<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div class="text-4xl mb-3">⚡</div>
							<h3 class="text-white font-semibold mb-2">Instant Payments</h3>
							<p class="text-blue-100 text-sm">See real-time payments with blockchain transparency</p>
						</div>
					</div>
					<div class="text-center">
						<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div class="text-4xl mb-3">🏆</div>
							<h3 class="text-white font-semibold mb-2">NFT Rewards</h3>
							<p class="text-blue-100 text-sm">Earn milestone badges and build your on-chain reputation</p>
						</div>
					</div>
				</div>
			</div>
	</section>

	<!-- Features Section -->
	<section class="py-24 bg-gray-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
					Why Choose NeroWork?
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					Built for the future of work, powered by blockchain technology
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each features as feature}
					<div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
						<div class="relative mb-6">
							<div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
								<feature.icon class="w-7 h-7 text-white" />
							</div>
							<span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
								{feature.highlight}
							</span>
						</div>
						<h3 class="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
						<p class="text-gray-600 leading-relaxed">{feature.description}</p>
					</div>
				{/each}
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
        {#if walletConnected}
          <a
            href="/freelancer/dashboard/create-invoice"
            class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started
          </a>
        {:else}
          <AAWalletConnect bind:isConnected={walletConnected} />
        {/if}
        <a
          href="#demo-video"
          class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
        >
          Learn More
        </a>
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
            <a href="https://x.com/@neroworkgigs" aria-label="Follow us on Twitter" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <div class="w-5 h-5 bg-blue-400 rounded">
<Twitter />
							</div>
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
        <p>&copy; 2025 NeroWork. All rights reserved.</p>
      </div>
    </div>
  </footer>
</main>


