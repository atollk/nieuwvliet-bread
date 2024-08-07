<template>
  <div class="home-page">
    <h1>Hallo, {{ user.name }}!</h1>
    <nav>
      <router-link :to="{ name: 'orders', params: { userName: user.name } }" class="nav-link">Meine Bestellung
      </router-link>
      <router-link to="/order-summary" class="nav-link">Bestell-Übersicht</router-link>
      <a href="#" @click.prevent="logout" class="nav-link">Nutzer wechseln</a>
    </nav>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    // TODO: dummy value?
    const user = ref({name: 'foo'})

    const logout = () => {
      // Remove the login cookie
      document.cookie = 'selectedAccount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      // Redirect to login page
      router.push('/')
    }

    const getUserFromCookie = () => {
      const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('selectedAccount'))
      if (cookieValue) {
        const accountData = JSON.parse(cookieValue.split('=')[1])
        user.value = {name: accountData}
      } else {
        // If no cookie found, redirect to login
        router.push("/")
      }
    }

    onMounted(() => {
      getUserFromCookie()
    })

    return {
      user,
      logout
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

nav {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 10px;
}

.nav-link {
  padding: 10px 20px;
  background-color: #4CAF5010;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #45a049;
}
</style>