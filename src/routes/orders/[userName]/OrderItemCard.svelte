<script lang="ts">
    import { base } from "$app/paths"
    import type { OrderItem } from "@/backend/types"

    export interface OrderItemCardProps {
        item: OrderItem
        changeOrder: (n: number) => void
    }

    const { item, changeOrder }: OrderItemCardProps = $props()
</script>

<div
    class="flex transform flex-row items-center justify-center gap-4 rounded-xl border-2 border-neutral bg-base-200 px-4 py-2 transition"
>
    <img class="h-fit w-32" src={item.image} alt={item.name} />
    <div class="my-2 flex flex-col gap-3">
        <p class="font-bold text-lg">{item.name}</p>
        <div class="flex flex-row items-center gap-4">
            <button
                class="btn btn-circle btn-primary btn-sm"
                onclick={() => changeOrder(-1)}
                disabled={item.orderAmount === undefined || item.orderAmount <= 0}
            >
                -
            </button>
            {#if item.orderAmount !== undefined}
                <span>{item.orderAmount}</span>
            {:else}
                <img class="h-8 w-8" src="{base}/loading.gif" alt="Loading" />
            {/if}
            <button
                class="btn btn-circle btn-primary btn-sm px-3 py-1"
                onclick={() => changeOrder(1)}
                disabled={item.orderAmount === undefined}
            >
                +
            </button>
        </div>
        <p class="prose text-sm sm:text-base">{item.description}</p>
    </div>
</div>
