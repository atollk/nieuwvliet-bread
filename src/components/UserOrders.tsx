import {JSX, useEffect, useState} from "react";
import {getOrderData, loadItemsFromCSV, OrderItem} from "../backend.ts";
import {useLocation} from "wouter";

type ChangeState = 'submitting' | 'unchanged'

export function UserOrders(userName: string): JSX.Element {
    const [changeState,] = useState<ChangeState>("unchanged")
    const [items, setItems] = useState<OrderItem[]>([])
    const [,navigate] = useLocation()

    const getItems = async (): Promise<void> => {
        setItems(await loadItemsFromCSV())
        const lastOrder = (await getOrderData()).get(userName)
        if (!lastOrder) {
            console.log("No previous order found. Defaulting to 0 for all.")
            setItems(items.map((item) => ({...item, orderAmount: 0})))
            return Promise.resolve()
        }
        setItems(items.map((item) => ({...item, orderAmount: lastOrder[item.id - 1]})))
    }

    function goBack(): void {
        navigate("/home")
    }

    function sendOrder(): void {
        // TODO
    }

    function decreaseOrder(item: OrderItem): void {
        // TODO
    }

    function increaseOrder(item: OrderItem): void {
        // TODO
    }

    useEffect(() => {
        getItems().then()
    }, []);

    // https://github.com/molefrog/wouter/issues/39

    const headerFooter = (
        <div>
            <button onClick={goBack}>Zurück</button>
            <button onClick={sendOrder}>
                {
                    changeState === "submitting"
                        ? <img src="/loading.gif" alt="Loading"/>
                        : <span>Bestellung abschicken</span>
                }
            </button>
        </div>
    )

    return (
        <div>
            <h1>Meine Bestellung</h1>
            {headerFooter}
            {
                items.length == 0
                    ? <p>Bitte warten...</p>
                    : (
                        <div>
                            {
                                items.map((item) =>
                                    <div>
                                        <img src={item.image} alt={item.name}/>
                                        <div>
                                            <p>{item.name}</p>
                                            <div>
                                                <button onClick={() => decreaseOrder(item)}>-</button>
                                                {
                                                    item.orderAmount === undefined
                                                        ? <img src="/loading.gif" alt="Loading"/>
                                                        : <span>{item.orderAmount}</span>
                                                }
                                                <button onClick={() => increaseOrder(item)}>+</button>
                                            </div>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )

            }
            {headerFooter}
        </div>
    )
}

/*
<template>
    <div class="my-orders">
        <div class="footer">
            <button @click="goBack" class="back-button">Zurück</button>
            <button @click="sendOrder" class="send-order-button">
                <span v-if="changeState !== 'submitting'">Bestellung abschicken</span>
                <img v-else class="loading" src="/loading.gif" alt="Loading"/>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, type PropType} from 'vue'
import {onBeforeRouteLeave, useRouter} from 'vue-router'
import {getOrderData, loadItemsFromCSV, type OrderItem, putOrderData} from "@/backend";

export default defineComponent({
    name: 'MyOrders',
    props: {
        userName: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const items = ref<OrderItem[]>([])
        const changeState = ref("unchanged")

        onBeforeRouteLeave((to, from) => {
            if (changeState.value !== "unchanged") {
                const answer = window.confirm("Du hast noch ungespeicherte Änderungen. Möchtest du die Seite wirklich verlassen?")
                if (!answer) return false
            }
        })

        const getItems = async (): Promise<void> => {
            items.value = await loadItemsFromCSV()
            const lastOrder = (await getOrderData()).get(props.userName)
            if (!lastOrder) {
                console.log("No previous order found. Defaulting to 0 for all.")
                items.value = items.value.map((orderItem) => {
                    return {...orderItem, orderAmount: 0}
                })
                return Promise.resolve()
            }
            items.value = items.value.map((orderItem) => {
                return {...orderItem, orderAmount: lastOrder[orderItem.id - 1]}
            })
        }

        const sendOrder = async (): Promise<void> => {
            const oldChangeState = changeState.value
            changeState.value = "submitting"
            try {
                await putOrderData(props.userName, items.value.map((item) => item.orderAmount ?? 0))
                changeState.value = "unchanged"
            } catch (error) {
                changeState.value = oldChangeState
            }
        }

        const increaseOrder = (item: OrderItem): void => {
            if (item.orderAmount !== undefined) {
                item.orderAmount++
                changeState.value = "changed"
            }
        }

        const decreaseOrder = (item: OrderItem): void => {
            if (item.orderAmount !== undefined && item.orderAmount > 0) {
                item.orderAmount--
                changeState.value = "changed"
            }
        }

        const goBack = (): void => {
            router.push('/')
        }

        onMounted(() => {
            getItems()
        })

        return {
            items,
            increaseOrder,
            decreaseOrder,
            sendOrder,
            goBack,
            changeState,
        }
    }
})
</script>
 */