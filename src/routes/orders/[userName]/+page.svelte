<script lang="ts">
    import {beforeNavigate, goto} from "$app/navigation";
    import {onMount} from "svelte";
    import {page} from '$app/stores';
    import type {OrderItem} from "@/backend/types";
    import {loadItemsFromCSV} from "@/backend/static";
    import {getOrderData, putOrderData} from "@/backend/supabase";
    import {base} from "$app/paths";

    const userName = $page.params.userName

    const getItems = async (): Promise<OrderItem[]> => {
        const items = await loadItemsFromCSV()
        const lastOrder = (await getOrderData()).get(userName)
        if (!lastOrder) {
            console.log("No previous order found. Defaulting to 0 for all.")
            for (let item of items)
                item.orderAmount = 0
        } else {
            for (let item of items)
                item.orderAmount = lastOrder[item.id - 1]
        }
        return items
    }

    const sendOrder = async (): Promise<void> => {
        const oldChangeState = changeState
        changeState = "submitting"
        try {
            await putOrderData(userName, items.map((item) => item.orderAmount ?? 0))
            changeState = "unchanged"
        } catch (error) {
            changeState = oldChangeState
        }
    }

    const increaseOrder = (item: OrderItem): void => {
        if (item.orderAmount !== undefined) {
            item.orderAmount++
            changeState = "changed"
        }
    }

    const decreaseOrder = (item: OrderItem): void => {
        if (item.orderAmount !== undefined && item.orderAmount > 0) {
            item.orderAmount--
            changeState = "changed"
        }
    }

    let items = $state<OrderItem[]>([])
    let changeState = $state<"unchanged" | "changed" | "submitting">("unchanged")

    onMount(() => {
        getItems().then((x) => items = x)
    })

    beforeNavigate((navigation) => {
        if (changeState !== "unchanged") {
            const answer = window.confirm("Du hast noch ungespeicherte Änderungen. Möchtest du die Seite wirklich verlassen?")
            if (!answer) return navigation.cancel()
        }
    })
</script>

{#snippet headerFooter()}
    <div class="flex justify-between w-full">
        <button class="btn variant-filled-primary mx-6" onclick={() => {goto(`${base}/home`)}}>Zurück</button>
        <button class="btn variant-filled-primary mx-6" onclick={sendOrder}>
            {#if changeState !== 'submitting'}
                <span>Bestellung abschicken</span>
            {:else}
                <img class="w-8 h-8" src="{base}/loading.gif" alt="Loading"/>
            {/if}
        </button>
    </div>
{/snippet}

<div class="flex flex-row justify-center items-center mb-8">
    <div class="flex flex-col items-center gap-8 max-w-4xl">
        <h1 class="text-4xl my-8">Meine Bestellung</h1>
        {@render headerFooter()}
        {#if items.length === 0}
            <p>Bitte Warten...</p>
        {:else}
            <div class="flex flex-col items-center gap-6">
                {#each items as item (item.id)}
                    <div class="card variant-soft-surface flex flex-row gap-6 items-center px-6">
                        <img class="w-32 h-fit" src={item.image} alt={item.name}>
                        <div class="flex flex-col gap-3 my-2">
                            <p class="font-bold">{item.name}</p>
                            <div class="flex flex-row items-center gap-2">
                                <button class="btn py-1 px-3 variant-soft" onclick={() => decreaseOrder(item)}
                                        disabled={item.orderAmount === undefined || item.orderAmount <= 0}>-
                                </button>
                                {#if item.orderAmount !== undefined}
                                    <span>{item.orderAmount}</span>
                                {:else}
                                    <img class="w-8 h-8" src="{base}/loading.gif" alt="Loading"/>
                                {/if}
                                <button class="btn py-1 px-3 variant-soft" onclick={() =>increaseOrder(item)}
                                        disabled={item.orderAmount === undefined}>+
                                </button>
                            </div>
                            <p>{item.description}</p>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
        {@render headerFooter()}
    </div>
</div>
