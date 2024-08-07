<template>
    <div class="my-orders">
        <h1>Meine Bestellung</h1>
        <div class="header">
            <button @click="goBack" class="back-button">Zurück</button>
            <button @click="sendOrder" class="send-order-button">
                <span v-if="changeState !== 'submitting'">Bestellung abschicken</span>
                <img v-else class="loading" src="/loading.gif" alt="Loading"/>
            </button>
        </div>
        <div class="item-list" v-if="items.length > 0">
            <div v-for="item in items" :key="item.id">
                <div class="item-outer">
                    <img :src="item.image" :alt="item.name" class="item-image">
                    <div class="item-inner">
                        <p class="item-name">{{ item.name }}</p>
                        <div class="item-order">
                            <button @click="decreaseOrder(item)"
                                    :disabled="item.orderAmount === undefined || item.orderAmount <= 0">-
                            </button>
                            <span v-if="item.orderAmount !== undefined">{{ item.orderAmount }}</span>
                            <img v-else class="loading" src="/loading.gif" alt="Loading"/>
                            <button @click="increaseOrder(item)" :disabled="item.orderAmount === undefined">+</button>
                        </div>
                        <p class="item-desc">{{ item.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p v-else>Bitte Warten...</p>
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

<style scoped>
.my-orders {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.item-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    gap: 10px;
}

.item-outer {
    display: flex;
    flex-direction: row;
    gap: 10px;

    border: 1px solid #ddd;
    background-color: #f2f2f2;
    padding: 12px;
}

.item-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item-image {
    width: 100%;
    max-width: 200px;
    height: auto;
    object-fit: contain;
}

.item-name {
    font-size: x-large;
}

.item-order {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: left;
    gap: 10px;
    white-space: nowrap;

    button {
        padding: 5px 10px;
        font-size: 16px;
    }

    span {
        font-size: larger;
    }
}

@media (max-width: 600px) {
    .item-desc {
        display: none;
    }
}

.loading {
    width: 24px;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 20px;
}

.footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.back-button, .send-order-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.back-button {
    background-color: #f2f2f2;
}

.send-order-button {
    background-color: #4CAF50;
    color: white;
}

</style>