<script lang="ts">
	import { Star, Users, DollarSign, Clock, Award, Briefcase, Shield, Zap, TrendingUp, CheckCircle, ArrowRight, Play } from '@lucide/svelte';
	import AAWalletConnect from '$lib/components/AAWalletConnect.svelte';

	let walletAddress = $state('');
	
	let features = $state([
		{ icon: Clock, title: 'Instant Payouts', description: 'Get paid instantly in NERO for your work', highlight: 'No delays' },
		{ icon: Award, title: 'NFT Badges', description: 'Earn reputation NFTs for milestones', highlight: 'Build reputation' },
		{ icon: DollarSign, title: 'Zero Fees', description: 'Keep 100% of your earnings', highlight: '0% platform fee' },
		{ icon: Briefcase, title: 'Professional Invoices', description: 'On-chain invoice management', highlight: 'Blockchain verified' },
		{ icon: Shield, title: 'Secure Payments', description: 'Transparent blockchain transactions', highlight: 'Trustless' },
		{ icon: Zap, title: 'Gasless Withdrawals', description: 'No gas fees when withdrawing', highlight: 'Powered by NERO' }
	]);

	let testimonials = $state([
		{
			name: "Sarah Chen",
			role: "Web3 Developer",
			avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
			content: "NeroWork has transformed how I handle client payments. Instant NERO payouts and zero platform fees mean I keep more of what I earn.",
			rating: 5
		},
		{
			name: "Marcus Rodriguez",
			role: "Blockchain Designer",
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			content: "The NFT badge system is genius. My reputation NFTs have helped me land bigger projects and showcase my expertise to clients.",
			rating: 5
		},
		{
			name: "Alex Thompson",
			role: "Smart Contract Auditor",
			avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			content: "Professional invoicing on-chain with transaction transparency. Clients love the accountability and I love the efficiency.",
			rating: 5
		}
	]);

	let stats = $state([
		{ number: "10K+", label: "Invoices Created", icon: Briefcase },
		{ number: "500+", label: "Active Freelancers", icon: Users },
		{ number: "₦2.5M", label: "Total Paid Out", icon: DollarSign },
		{ number: "99.9%", label: "Uptime", icon: TrendingUp }
	]);

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
		walletAddress = localStorage.getItem('connectedWallet') || '';
		// Listen for wallet changes in other tabs/components
		const onStorage = (e: StorageEvent) => {
			if (e.key === 'connectedWallet') {
				walletAddress = e.newValue || '';
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

				<!-- Stats -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
					{#each stats as stat}
						<div class="text-center">
							<div class="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
							<div class="text-gray-400 text-sm">{stat.label}</div>
						</div>
					{/each}
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					{#if walletAddress}
						<a
							href="/freelancer/dashboard/create-invoice"
							class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-2"
						>
							Create Your First Invoice
							<ArrowRight class="w-5 h-5" />
						</a>
					{:else}
						<div class="wallet-connect-wrapper">
							<AAWalletConnect />
						</div>
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
					💎 Join 500+ freelancers already earning on NeroWork
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
				<!-- Video placeholder with play button -->
				<div class="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl aspect-video">
					<div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<button class="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-6 hover:bg-white/30 transition-all duration-300 group">
							<Play class="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
						</button>
					</div>
					<div class="absolute bottom-6 left-6">
						<div class="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
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

	<!-- Testimonials Section -->
	<section class="py-24 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
					Loved by Freelancers
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto">
					See what our community is saying about their NeroWork experience
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#each testimonials as testimonial}
					<div class="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
						<!-- Rating -->
						<div class="flex mb-4">
							{#each Array(testimonial.rating) as _}
								<Star class="w-5 h-5 text-yellow-400 fill-current" />
							{/each}
						</div>
						
						<!-- Content -->
						<blockquote class="text-gray-700 mb-6 leading-relaxed">
							"{testimonial.content}"
						</blockquote>
						
						<!-- Author -->
						<div class="flex items-center">
							<img 
								src={testimonial.avatar} 
								alt={testimonial.name}
								class="w-12 h-12 rounded-full mr-4 object-cover"
							/>
							<div>
								<div class="font-semibold text-gray-900">{testimonial.name}</div>
								<div class="text-gray-600 text-sm">{testimonial.role}</div>
							</div>
						</div>
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
        {#if walletAddress}
          <a
            href="/freelancer/dashboard/create-invoice"
            class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started
          </a>
        {:else}
          <div class="wallet-connect-wrapper">
            <AAWalletConnect />
          </div>
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
            <a href="/" aria-label="Follow us on Twitter" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <div class="w-5 h-5 bg-blue-400 rounded"></div>
            </a>
            <a href="/" aria-label="Follow us on Instagram" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <div class="w-5 h-5 bg-pink-400 rounded"></div>
            </a>
            <a href="/" aria-label="Follow us on LinkedIn" class="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
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

<style>
  :global(.wallet-connect-wrapper button) {
    background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: none;
    cursor: pointer;
  }
  
  :global(.wallet-connect-wrapper button:hover) {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
  }
  
  :global(.wallet-connect-wrapper .connect-button) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
