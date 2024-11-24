<script lang="ts">
    import '../app.css';
    import {autoModeWatcher, initializeStores, Toast} from "@skeletonlabs/skeleton";
    import {onMount} from "svelte";

    let {children} = $props();

    initializeStores()

    onMount(() => {
        autoModeWatcher();
    })
</script>

<div data-sveltekit-preload-data="false">
    <Toast/>
    {@render children()}
</div>