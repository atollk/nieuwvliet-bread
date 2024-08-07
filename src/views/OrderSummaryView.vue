<template>
  <div class="order-summary">
    <div class="header">
      <h1>Zusammenfassung der Bestellungen</h1>
      <button @click="goBack" class="back-button">Back</button>
    </div>
    <table v-if="orderData">
      <thead>
      <tr>
        <th>Ware</th>
        <th class="bold">Summe</th>
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
        <td class="bold">{{ getTotalForItem(item) }}</td>
        <td v-for="account in accounts" :key="account.id">
          {{ getOrderAmountForAccount(item, account) }}
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

interface Order {
  [itemId: number]: number;
}

interface OrderData {
  [accountId: number]: Order;
}

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

    const getTotalForItem = (item: OrderItem): number => {
      if (!orderData.value) return 0;
      let total = 0
      for (const order of orderData.value.values()) {
        total += (order[item.id - 1] || 0)
      }
      return total
    };

    const getOrderAmountForAccount = (item: OrderItem, account: Account): number => {
      if (!orderData.value) return 0;
      return orderData.value.get(account.name)?.[item.id - 1] || 0;
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

.bold {
  font-weight: bolder;
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

.loading {
  max-width: 300px;
}
</style>