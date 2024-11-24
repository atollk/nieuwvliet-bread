<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div data-sveltekit-preload-data="false">
    {@render children()}
</div>