<script lang="ts">
    import { goto } from "$app/navigation"
    import type { Account, OrderItem } from "@/backend/types"
    import { getOrderData } from "@/backend/supabase"
    import { loadAccountsFromCsv, loadItemsFromCSV } from "@/backend/static"
    import { base } from "$app/paths"

    interface FetchData {
        orderData: Map<string, number[]>
        accounts: Account[]
        items: OrderItem[]
    }

    const getFetchData = async (): Promise<FetchData> => {
        return {
            orderData: await getOrderData(),
            accounts: await loadAccountsFromCsv(),
            items: await loadItemsFromCSV(),
        }
    }

    let fetchDataPromise = $state<Promise<FetchData>>(getFetchData())
    let hoveredItem = $state<OrderItem | undefined>()

    const getCellValue = (
        orderData: Map<string, number[]>,
        item?: OrderItem,
        account?: Account,
    ): number => {
        let total = 0
        for (const [k, v] of orderData.entries()) {
            if (account !== undefined && account.name !== k) continue
            if (item === undefined) {
                total += v.reduce((a, b) => a + b, 0)
            } else {
                total += v[item.id - 1]
            }
        }
        return total
    }

    const showImage = (item: OrderItem): void => {
        hoveredItem = item
    }

    const hideImage = (item: OrderItem): void => {
        if (hoveredItem?.id === item.id) hoveredItem = undefined
    }
</script>

<div class="flex flex-col flex-wrap items-center gap-8">
    <h1 class="h1 mt-8">Zusammenfassung der Bestellungen</h1>
    {#await fetchDataPromise}
        <img class="w-32" src="{base}/loading.gif" alt="Loading" />
    {:then fetchData}
        <div class="table-container w-[100vw] max-w-4xl overflow-auto">
            <table class="table-hover table">
                <thead>
                    <tr class="my-11">
                        <th>Ware</th>
                        <th>Summe</th>
                        <th class="w-16"></th>
                        {#each fetchData.accounts as account (account.id)}
                            <th>{account.name}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    <tr class="h-2"></tr>
                    <tr>
                        <td class="italic">Summe</td>
                        <td class="text-center"
                            >{getCellValue(fetchData.orderData, undefined, undefined)}</td
                        >
                        <td></td>
                        {#each fetchData.accounts as account (account.id)}
                            <td class="text-center"
                                >{getCellValue(fetchData.orderData, undefined, account)}</td
                            >
                        {/each}
                    </tr>
                    <tr class="h-2"></tr>
                    {#each fetchData.items as item (item.id)}
                        <tr>
                            <td
                                onmouseover={() => showImage(item)}
                                onfocus={() => showImage(item)}
                                onmouseout={() => hideImage(item)}
                                onblur={() => hideImage(item)}
                            >
                                <span>{item.name}</span>
                                {#if hoveredItem?.id === item.id}
                                    <img
                                        class="border-primary absolute h-auto w-32 rounded-xl border-2 shadow-2xl"
                                        src={item.image}
                                        alt={item.name}
                                    />
                                {/if}
                            </td>
                            <td class="text-center"
                                >{getCellValue(fetchData.orderData, item, undefined)}</td
                            >
                            <td></td>
                            {#each fetchData.accounts as account (account.id)}
                                <td class="text-center"
                                    >{getCellValue(fetchData.orderData, item, account)}</td
                                >
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:catch error}
        {error}
    {/await}
    <button class="btn btn-primary" onclick={() => goto(`${base}/home`)}>Zurück</button>
</div>
