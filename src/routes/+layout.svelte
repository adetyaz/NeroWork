<script lang="ts">
	import Navbar from '$lib/components/ui/navbar.svelte';
	import '../app.css';
	import '@fontsource-variable/dm-sans';

	let { children } = $props();
</script>

<Navbar />
{@render children()}
