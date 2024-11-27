<script lang="ts">
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import type {Account} from "@/backend/types";
    import {base} from "$app/paths";

    let user = $state<Account>()

    const logout = () => {
        Cookies.remove("selectedAccount")
        goto(`${base}/`)
    }

    const getUserFromCookie = () => {
        const cookieValue = Cookies.get("selectedAccount")
        if (cookieValue) {
            user = JSON.parse(cookieValue)
        } else {
            goto(`${base}/`)
        }
    }

    onMount(() => {
        getUserFromCookie()
    })
</script>


<div class="flex flex-col items-center justify-center h-screen gap-4">
    <h1 class="text-2xl">Hallo, {user?.name}!</h1>
    {#if user}
        <nav class="flex flex-col sm:flex-row content-center gap-2">
            <a href="{base}/orders/{user.name}">Meine Bestellung</a>
            <a href="{base}/order-summary">Bestellübersicht</a>
            <a href="#0" onclick={logout}>Nutzer wechseln</a>
        </nav>
    {/if}
</div>