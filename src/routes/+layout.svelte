<script lang="ts">
	import '../app.css';
    import {autoModeWatcher} from "@skeletonlabs/skeleton";
    import {onMount} from "svelte";
	let { children } = $props();

    onMount(() => {
        autoModeWatcher();
})
</script>

<div data-sveltekit-preload-data="false">
    {@render children()}
</div>