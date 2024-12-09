<script lang="ts">
    import IconoirWarningCircle from "virtual:icons/iconoir/warning-circle"
    import IconoirXmarkCircle from "virtual:icons/iconoir/xmark-circle"
    import IconoirInfoCircle from "virtual:icons/iconoir/info-circle"
    import IconoirCheckCircle from "virtual:icons/iconoir/check-circle"
    import IconoirXmarkCircleSolid from "virtual:icons/iconoir/xmark-circle-solid"

    export interface ToastOptions {
        type: "info" | "success" | "warning" | "error"
        text: string
        duration: number
        hasCloseButton: boolean
        onClose: () => void
    }

    const { options }: { options: ToastOptions } = $props()

    const alertClass = $derived(
        options.type === "info"
            ? "alert-info"
            : options.type === "success"
              ? "alert-success"
              : options.type === "warning"
                ? "alert-warning"
                : "alert-error",
    )

    const Icon =
        options.type == "info"
            ? IconoirInfoCircle
            : options.type == "success"
              ? IconoirCheckCircle
              : options.type == "warning"
                ? IconoirWarningCircle
                : IconoirXmarkCircle

    if (options.duration > 0) {
        setTimeout(options.onClose, options.duration)
    }
</script>

<div role="alert" class="alert {alertClass} flex w-fit">
    <Icon />
    <span>{options.text}</span>
    {#if options.hasCloseButton}
        <button onclick={options.onClose}>
            <IconoirXmarkCircleSolid />
        </button>
    {/if}
</div>
