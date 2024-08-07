<template>
  <div class="order-summary">
    <div class="header">
      <h1>Order Summary</h1>
      <button @click="goBack" class="back-button">Back</button>
    </div>
    <table v-if="orderData">
      <thead>
      <tr>
        <th>Item</th>
        <th>Total</th>
        <th v-for="account in accounts" :key="account.id">{{ account.name }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td class="item-name" @mouseover="showImage(item)" @mouseout="hideImage">
          {{ item.name }}
          <div v-if="hoveredItem === item" class="item-image">
            <img :src="item.image" :alt="item.name">
          </div>
        </td>
        <td>{{ getTotalForItem(item) }}</td>
        <td v-for="account in accounts" :key="account.id">
          {{ getOrderAmountForAccount(item, account) }}
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>Loading order data...</p>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue';
import router from "@/router";
import {type Account, loadAccountsFromCsv, loadItemsFromCSV, type OrderItem} from "@/backend";

interface Order {
  [itemId: number]: number;
}

interface OrderData {
  [accountId: number]: Order;
}

export default defineComponent({
  name: 'OrderSummary',
  setup() {
    const orderData = ref<OrderData | null>(null);
    const hoveredItem = ref<OrderItem | null>(null);
    const accounts = ref<Account[]>([]);
    const items = ref<OrderItem[]>([]);

    const getAccountsAndItems = async (): Promise<void> => {
      accounts.value = await loadAccountsFromCsv()
      items.value = await loadItemsFromCSV()
    }

    const fetchOrderData = async (): Promise<void> => {
      // Stub function to simulate fetching order data from server
      orderData.value = {
        1: {1: 2, 2: 1, 3: 3},
        2: {1: 1, 2: 2, 3: 0},
        3: {1: 3, 2: 1, 3: 2},
      };
    };

    const getTotalForItem = (item: OrderItem): number => {
      if (!orderData.value) return 0;
      return Object.values(orderData.value).reduce((total, order) => {
        return total + (order[item.id] || 0);
      }, 0);
    };

    const getOrderAmountForAccount = (item: OrderItem, account: Account): number => {
      if (!orderData.value) return 0;
      return orderData.value[account.id]?.[item.id] || 0;
    };

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
      getTotalForItem,
      getOrderAmountForAccount,
      showImage,
      hideImage,
    };
  },
});
</script>

<style scoped>
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

.item-name {
  position: relative;
  cursor: pointer;
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
</style>