<script lang="ts">
    import {goto} from "$app/navigation";
    import type {Account, OrderItem} from "@/backend/types";
    import {getOrderData} from "@/backend/supabase";
    import {loadAccountsFromCsv, loadItemsFromCSV} from "@/backend/static";

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
    let hoveredItem = $state<OrderItem | undefined>();

    const getCellValue = (orderData: Map<string, number[]>, item?: OrderItem, account?: Account): number => {
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
        hoveredItem = item;
    }

    const hideImage = (): void => {
        hoveredItem = undefined;
    }
</script>

<div>
    <div>
        <h1>Zusammenfassung der Bestellungen</h1>
        <button onclick={() => goto("/home")}>Zurück</button>
    </div>
    {#await fetchDataPromise}
        <img src="/loading.gif" alt="Loading"/>
    {:then fetchData}
        <table>
            <thead>
            <tr>
                <th>Ware</th>
                <th>Summe</th>
                {#each fetchData.accounts as account (account.id)}
                    <th>{account.name}</th>
                {/each}
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Summe</td>
                <td>{getCellValue(fetchData.orderData, undefined, undefined)}</td>
                {#each fetchData.accounts as account (account.id)}
                    <td>{getCellValue(fetchData.orderData, undefined, account)}</td>
                {/each}
            </tr>
            {#each fetchData.items as item (item.id)}
                <tr>
                    <td onmouseover={() => showImage(item)} onfocus={() => showImage(item)} onmouseout={hideImage}
                        onblur={hideImage}>
                        <span>{item.name}</span>
                        {#if hoveredItem?.id === item.id}
                            <div>
                                <img src={item.image} alt={item.name}>
                            </div>
                        {/if}
                    </td>
                    <td>{getCellValue(fetchData.orderData, item, undefined)}</td>
                    {#each fetchData.accounts as account (account.id)}
                        <td>{getCellValue(fetchData.orderData, item, account)}</td>
                    {/each}
                </tr>
            {/each}
            </tbody>
        </table>
    {:catch error}
        {error}
    {/await}
</div>