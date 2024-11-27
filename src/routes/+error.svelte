<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>

<a href="{base}/">Go home</a>
