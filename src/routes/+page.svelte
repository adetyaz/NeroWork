<script>
	import NftMint from "$lib/components/NFTMint.svelte";
  import NavBar from "../lib/components/NavBar.svelte";
  
</script>
<main>
  <NavBar />
  <section class="bg-gray-900 text-white py-20 px-6">
    <div class="max-w-5xl mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
        Discover <span class="text-purple-400">Nerowork</span>
      </h1>
      <p class="text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
        Nerowork is the ultimate freelancer platform for <span class="text-purple-400">Web2 and Web3 jobs</span>. Find or post projects with ease and enjoy <span class="text-purple-400">gasless withdrawals</span> for seamless, cost-free payments.
      </p>
    </div>
  </section>
  <div>
    <NftMint />
  </div>

  <!-- Call to Action Section -->
  <section class="py-16 px-6 bg-gray-800 text-white">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">
        Get Started with Nerowork
      </h2>
      <p class="text-lg mb-10 max-w-xl mx-auto">
        Join as a freelancer to showcase your skills or as a job creator to hire top talent for your Web2 and Web3 projects.
      </p>
      <div class="flex flex-col md:flex-row justify-center gap-4">
        <a
          href="/freelancer"
          class="px-8 py-3 bg-gradient-to-r from-gray-600 to-purple-500 text-white rounded-lg text-lg font-semibold hover:from-gray-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Join as a Freelancer
        </a>
        <a
          href="/client"
          class="px-8 py-3 bg-gray-700 text-white rounded-lg text-lg font-semibold hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Join as a Job Creator
        </a>
      </div>
    </div>
  </section>
</main>