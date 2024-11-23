<script lang="ts">
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import type {Account} from "@/backend/types";

    let user = $state<Account>()

    const logout = () => {
        Cookies.remove("selectedAccount")
        goto("/")
    }

    const getUserFromCookie = () => {
        const cookieValue = Cookies.get("selectedAccount")
        if (cookieValue) {
            user = JSON.parse(cookieValue)
        } else {
            goto("/")
        }
    }

    onMount(() => {
        getUserFromCookie()
    })
</script>


<div class="home-page">
    <h1>Hallo, {user?.name}!</h1>
    {#if user}
        <nav>
            <a href="/orders/{user.name}">Meine Bestellung</a>
            <a href="/order-summary">Bestellübersicht</a>
            <a href="#0" onclick={logout}>Nutzer wechseln</a>
        </nav>
    {/if}
</div>