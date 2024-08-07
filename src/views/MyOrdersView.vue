<template>
  <div class="my-orders">
    <h1>My Orders</h1>
    <div class="header">
      <button @click="goBack" class="back-button">Back</button>
      <button @click="sendOrder" class="send-order-button">Send Order</button>
    </div>
    <table v-if="items.length > 0">
      <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Description</th>
        <th>Order</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td><img :src="item.image" :alt="item.name" class="item-image"></td>
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td class="order-column">
          <div class="order-column-content">
            <button @click="increaseOrder(item)">+</button>
            <span>{{ item.orderAmount }}</span>
            <button @click="decreaseOrder(item)" :disabled="item.orderAmount <= 0">-</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>Loading items...</p>
    <div class="footer">
      <button @click="goBack" class="back-button">Back</button>
      <button @click="sendOrder" class="send-order-button">Send Order</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {loadItemsFromCSV, type OrderItem} from "@/backend";

export default defineComponent({
  name: 'MyOrders',
  setup() {
    const router = useRouter()
    const items = ref<OrderItem[]>([])

    const getItems = async (): Promise<void> => {
      items.value = await loadItemsFromCSV()
    }

    const sendOrder = async (): Promise<void> => {
      console.log('Sending order to server...')
      console.log(items.value.map(item => ({id: item.id, amount: item.orderAmount})))
      // Here you would typically make an API call to send the order
    }

    const increaseOrder = (item: OrderItem): void => {
      item.orderAmount++
    }

    const decreaseOrder = (item: OrderItem): void => {
      if (item.orderAmount > 0) {
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
      goBack
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