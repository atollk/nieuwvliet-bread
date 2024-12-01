<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import isTauri from '$lib/tauri';

	let x = 0;

	let { children } = $props();
</script>

<div data-sveltekit-preload-data="false">
	<div class="toast toast-top toast-center">
		{#each { length: x } as i}
			<div class="alert alert-info">
				<span>{i}</span>
			</div>
		{/each}
	</div>
	<button onclick={() => (x += 1)}>XXX</button>
	{@render children()}
	<div class="flex justify-center gap-4 p-8">
		{#if !isTauri}
			<a class="btn" href="{base}/android.apk">
				<img class="w-16" src="{base}/assets/android.svg" alt="Download Android App" />
			</a>
		{/if}
		<a class="btn" href="https://github.com/atollk/nieuwvliet-bread">
			<img class="w-16" src="{base}/assets/github.svg" alt="" />
		</a>
	</div>
</div>
