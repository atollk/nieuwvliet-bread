import {JSX, useEffect, useState} from "react";
import {Account, OrderItem} from "../backend/data.ts";
import {useLocation} from "wouter";
import {loadAccountsFromCsv, loadItemsFromCSV} from "../backend/static.ts";
import {getOrderData} from "../backend/supabase.ts";


export function OrderSummary(): JSX.Element {
    const [orderData, setOrderData] = useState<Map<string, number[]> | undefined>()
    const [accounts, setAccounts] = useState<Account[]>([])
    const [items, setItems] = useState<OrderItem[]>([])
    const [hoveredItem, ]

    const [, navigate] = useLocation()

    const getCellValue = (item?: OrderItem, account?: Account): number => {
        if (!orderData) return 0;
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
        //hoveredItem.value = item;
    };

    const hideImage = (): void => {
        //hoveredItem.value = null;
    };

    function goBack(): void {
        navigate("/home")
    }

    async function onMount(): Promise<void> {
        setAccounts(await loadAccountsFromCsv())
        setItems(await loadItemsFromCSV())
        setOrderData(await getOrderData())
    }

    useEffect(() => {
        onMount().then()
    }, []);


    return (
        <>
            <div>
                <h1>Zusammenfassung der Bestellungen</h1>
                <button onClick={goBack}>Zurück</button>
            </div>
            {
                orderData === undefined
                    ? <img src="/loading.gif" alt="Loading"/>
                    : (
                        <table>
                            <thead>
                            <tr>
                                <th>Ware</th>
                                <th>Summe</th>
                                {accounts.map((account) => <th key={account.id}>{account.name}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Summe</td>
                                <td>{getCellValue(undefined, undefined)}</td>
                                {accounts.map((account) => <td key={account.id}>{getCellValue(undefined, account)}</td>)}
                            </tr>
                            {items.map((item) =>
                                <tr key={item.id}>
                                    <td onMouseOver={() => showImage(item)} onMouseOut={hideImage}>
                                        <span>{item.name}</span>
                                        <div>
                                            <img src={item.image} alt={item.name}/>
                                        </div>
                                    </td>
                                    <td>{getCellValue(item, undefined)}</td>
                                    {accounts.map((account) =>
                                        <td key={account.id}>{getCellValue(item, account)}</td>
                                    )}
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )
            }
        </>
    )
}

/*
<template>
    <div class="order-summary">
        <div class="header">
            <h1>Zusammenfassung der Bestellungen</h1>
            <button @click="goBack" class="back-button">Zurück</button>
        </div>
        <table v-if="orderData">
            <tr v-for="item in items" :key="item.id">
                <td class="item-name" @mouseover="showImage(item)" @mouseout="hideImage">
                    <span>{{ item.name }}</span>
                    <div v-if="hoveredItem === item" class="item-image">
                        <img :src="item.image" :alt="item.name">
                    </div>
                </td>
                <td class="bold">{{ getCellValue(item, undefined) }}</td>
                <td v-for="account in accounts" :key="account.id">
                    {{ getCellValue(item, account) }}
                </td>
            </tr>
            </tbody>
        </table>
        <img class="loading" v-else src="/loading.gif" alt="Loading"/>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue';
import router from "@/router";
import {type Account, getOrderData, loadAccountsFromCsv, loadItemsFromCSV, type OrderItem} from "@/backend";

export default defineComponent({
    name: 'OrderSummary',
    setup() {
        const orderData = ref<Map<string, number[]> | null>(null);
        const hoveredItem = ref<OrderItem | null>(null);
        const accounts = ref<Account[]>([]);
        const items = ref<OrderItem[]>([]);

        const getAccountsAndItems = async (): Promise<void> => {
            accounts.value = await loadAccountsFromCsv()
            items.value = await loadItemsFromCSV()
        }

        const fetchOrderData = async (): Promise<void> => {
            orderData.value = await getOrderData()
        };

        const getCellValue = (item?: OrderItem, account?: Account): number => {
            if (!orderData.value) return 0;
            let total = 0
            for (const [k, v] of orderData.value.entries()) {
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
            hoveredItem.value = item;
        };

        const hideImage = (): void => {
            hoveredItem.value = null;
        };

        const goBack = (): void => {
            router.push('/')
        }

        onMounted(() => {
            fetchOrderData()
            getAccountsAndItems()
        });

        return {
            goBack,
            orderData,
            accounts,
            items,
            hoveredItem,
            getCellValue,
            showImage,
            hideImage,
        };
    },
});
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
}

.order-summary {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.bold {
    font-weight: bolder;
}

.item-name {
    position: relative;
    cursor: pointer;

    span {
        border-bottom: 1px dotted;
    }
}

.item-image {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.item-image img {
    max-width: 100px;
    max-height: 100px;
}

.back-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #f2f2f2;
}

.loading {
    max-width: 300px;
}
</style>
 */