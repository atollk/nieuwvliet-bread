<script lang="ts">
	import '../app.css';
	import { autoModeWatcher, initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import isTauri from '$lib/tauri';

	let { children } = $props();

	initializeStores();

	onMount(() => {
		autoModeWatcher();
	});
</script>

<div data-sveltekit-preload-data="false">
	<Toast />
	{@render children()}
	<div class="flex justify-center gap-4 p-8">
		{#if isTauri}
			<a class="btn" href="{base}/android.apk">
				<img class="w-16" src="{base}/assets/android.svg" alt="Download Android App" />
			</a>
		{/if}
		<a class="btn" href="https://github.com/atollk/nieuwvliet-bread">
			<img class="w-16" src="{base}/assets/github.svg" alt="" />
		</a>
	</div>
</div>
