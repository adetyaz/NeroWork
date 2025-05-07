<script lang="ts">
  import AAWalletConnect from './AAWalletConnect.svelte';

  let isMenuOpen = $state(false);

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

</script>

<nav class="bg-gray-900 text-white px-6 py-4">
  <div class="flex justify-between items-center max-w-7xl mx-auto">
    <!-- Logo -->
    <div class="text-xl font-bold">
      <a href="/">
        <img src="/logo.png" alt="logo" class="size-10">
      </a>
    </div>

    <!-- Mobile -->
    <button
      class="md:hidden text-white focus:outline-none"
      on:click={toggleMenu}
      aria-label="Toggle menu"
    >
      {#if isMenuOpen}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      {/if}
    </button>

    <!-- Navigation Links and Wallet -->
    <div class="{isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-6 mt-4 md:mt-0">
      <a href="/" class="hover:underline">Home</a>
      <a href="/find-work" class="hover:underline">Find Work</a>
      <a href="/create-jobs" class="hover:underline">Create Jobs</a>
      <a href="/freelancers" class="hover:underline">Freelancers</a>
      <AAWalletConnect />
    </div>
  </div>
</nav>