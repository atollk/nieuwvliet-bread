<script lang="ts">
    import {beforeNavigate, goto} from "$app/navigation";
    import {onMount} from "svelte";
    import { page } from '$app/stores';
    import type {OrderItem} from "@/backend/types";
    import {loadItemsFromCSV} from "@/backend/static";
    import {getOrderData, putOrderData} from "@/backend/supabase";

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
    <div>
        <button onclick={() => {goto("/home")}}>Zurück
        </button>
        <button onclick={sendOrder}>
            {#if changeState !== 'submitting'}
                <span>Bestellung abschicken</span>
            {:else}
                <img src="/loading.gif" alt="Loading"/>
            {/if}
        </button>
    </div>
{/snippet}

<div class="my-orders">
    <h1>Meine Bestellung</h1>
    {@render headerFooter()}
    {#if items.length === 0}
        <p>Bitte Warten...</p>
    {:else}
        <div>
            {#each items as item (item.id)}
                <div>
                    <div>
                        <img src={item.image} alt={item.name}>
                        <div>
                            <p>{item.name}</p>
                            <div>
                                <button onclick={() => decreaseOrder(item)}
                                        disabled={item.orderAmount === undefined || item.orderAmount <= 0}>-
                                </button>
                                {#if item.orderAmount !== undefined}
                                    <span>{item.orderAmount}</span>
                                {:else}
                                    <img src="/loading.gif" alt="Loading"/>
                                {/if}
                                <button onclick={() =>increaseOrder(item)} disabled={item.orderAmount === undefined}>+
                                </button>
                            </div>
                            <p class="item-desc">{item.description}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    {@render headerFooter()}
</div>