<script lang="ts">
    import "../app.css";
    import { base } from "$app/paths";
    import isTauri from "$lib/tauri";
    import { onMount } from "svelte";
    import { themeChange } from "theme-change";

    let x = $state(0);

    setInterval(() => {
        if (x > 0) x -= 1;
    }, 2000);

    onMount(() => {
        themeChange(false);
    });

    let { children } = $props();
</script>

<div data-sveltekit-preload-data="false">
    <div class="toast toast-center toast-top">
        {#each Array(x).keys() as i}
            <div class="alert alert-info">
                <span>{i}</span>
            </div>
        {/each}
    </div>
    <button onclick={() => (x += 1)}>XXX</button>
    {@render children()}
    <div class="flex justify-center gap-4 p-8">
        {#if !isTauri}
            <a href="{base}/android.apk">
                <img class="w-16" src="{base}/assets/android.svg" alt="Download Android App" />
            </a>
        {/if}
        <a href="https://github.com/atollk/nieuwvliet-bread">
            <img class="w-16" src="{base}/assets/github.svg" alt="" />
        </a>
    </div>
</div>
