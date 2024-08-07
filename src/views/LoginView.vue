<template>
  <div class="login-page">
      <h1>Wer bist du?</h1>
    <div v-if="!selectedAccountName">
      <div class="account-grid">
        <AccountSelector
            v-for="account in accounts"
            :key="account.id"
            :account="account"
            @select="selectAccount"
        />
      </div>
    </div>
    <div v-else>
      <p>Logging in as {{ selectedAccountName }}...</p>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import AccountSelector from "@/components/AccountSelector.vue";
import {type Account, loadAccountsFromCsv} from "@/backend";


export default {
  name: 'LoginPage',
  components: {
    AccountSelector
  },
  setup() {
    const router = useRouter()
    const accounts = ref<Account[]>([])
    const selectedAccountName = ref<string | null>(null)

    const getAccounts = async (): Promise<void> => {
      accounts.value = await loadAccountsFromCsv()
    }

    const selectAccount = (account: Account) => {
      selectedAccountName.value = account.name
      setCookie('selectedAccount', JSON.stringify(account.name), 30)
      redirectToHome()
    }

    const setCookie = (name: string, value: string, days: number) => {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      const expires = `expires=${date.toUTCString()}`
      document.cookie = `${name}=${value};${expires};path=/`
    }

    const getCookie = (name: string) => {
      const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(name))
      return cookieValue ? cookieValue.split('=')[1] : null
    }

    const redirectToHome = () => {
      // Assuming you have a route named 'home'
      router.push({name: 'home'})
    }

    onMounted(() => {
      const savedAccount = getCookie('selectedAccount')
      if (savedAccount) {
        selectedAccountName.value = JSON.parse(savedAccount)
        redirectToHome()
      } else {
        getAccounts()
      }
    })

    return {
      accounts,
      selectedAccountName,
      selectAccount,
    }
  }
}
</script>

<style scoped>
.login-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.account-grid {
  display: grid;
    grid-template-columns: repeat( auto-fill, minmax(250px, 1fr) );
  gap: 20px;
  margin-top: 20px;
}
</style>