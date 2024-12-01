<script lang="ts" module>
    import { SvelteMap } from "svelte/reactivity"
    import type { ToastOptions as ComponentOptions } from "./Toast.svelte"

    let toastsCounter = 0
    const toasts = $state(new SvelteMap<number, ComponentOptions>())

    interface ToastOptions {
        type: "info" | "success" | "warning" | "error"
        text: string
        duration: number
        hasCloseButton: boolean
    }

    const addToastOptionsDefault: ToastOptions = {
        type: "info",
        text: "",
        duration: 0,
        hasCloseButton: false,
    }

    export function addToast(options: Partial<ToastOptions>): void {
        const id = toastsCounter
        const optionsComplete = {
            ...addToastOptionsDefault,
            ...options,
            onClose: () => {
                toasts.delete(id)
            },
        } satisfies ComponentOptions
        toastsCounter += 1
        toasts.set(id, optionsComplete)
    }
</script>

<script lang="ts">
    import Toast from "$lib/Toast.svelte"
</script>

<div class="toast toast-end z-10 items-end">
    {#each toasts.values() as toastOptions}
        <Toast options={toastOptions} />
    {/each}
</div>
