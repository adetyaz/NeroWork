<script lang="ts">
	import '@fontsource-variable/dm-sans';

	let { children } = $props();
</script>

<!-- No navbar for invoice pages -->
{@render children()}
