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
    <table v-if="items.length > 0">
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td><img :src="item.image" :alt="item.name" class="item-image"></td>
        <td>{{ item.name }}</td>
        <td class="order-column">
          <div class="order-column-content">
            <button @click="increaseOrder(item)" :disabled="item.orderAmount === undefined">+</button>
            <span v-if="item.orderAmount !== undefined">{{ item.orderAmount }}</span>
            <img v-else class="loading" src="/loading.gif" alt="Loading"/>
            <button @click="decreaseOrder(item)" :disabled="item.orderAmount === undefined || item.orderAmount <= 0">-
            </button>
          </div>
        </td>
        <td>{{ item.description }}</td>
      </tr>
      </tbody>
    </table>
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
import {useRouter} from 'vue-router'
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
      console.log(lastOrder)
      items.value = items.value.map((orderItem) => {
        return {...orderItem, orderAmount: lastOrder[orderItem.id - 1]}
      })
      console.log(items.value)
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
      if (item.orderAmount !== undefined)
        item.orderAmount++
    }

    const decreaseOrder = (item: OrderItem): void => {
      if (item.orderAmount !== undefined && item.orderAmount > 0) {
        item.orderAmount--
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  height: 100%;
}

th {
  background-color: #f2f2f2;
}

.item-image {
  width: 200px;
  height: auto;
  object-fit: cover;
}

.order-column {
  display: table-cell;
}

.order-column-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  white-space: nowrap;

  button {
    padding: 5px 10px;
    font-size: 16px;
  }

  span {
    font-size: larger;
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