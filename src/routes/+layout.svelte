<script lang="ts">
	import '../app.css';
	import Toaster from "$lib/Toaster.svelte";

	let { children } = $props();
</script>

<Toaster />
<div data-sveltekit-preload-data="false">
	{@render children()}
</div>
