import {JSX, useEffect, useState} from "react";
import {Account} from "../backend.ts";

export function HomeView(): JSX.Element {
    const [user, setUser] = useState<Account>()

    console.log("X")

    return (
        <div>
            <h1>Hallo, {user?.name}!</h1>
        </div>
    )
}

/*
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

<script lang="ts">
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
 */