<script lang="ts">
    import {getToasts} from "$lib/ToastProviderUtils.svelte.js";

    const toasts = getToasts()
</script>

<div class="toast toast-end">
    {#each toasts as toast}
        <div class="alert">
            <span>{toast}</span>
        </div>
    {/each}
</div>