<script lang="ts">
    import AccountSelector from "@/routes/signin/AccountSelector.svelte";
    import Cookies from 'js-cookie'
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import type {Account} from "@/backend/types";
    import {loadAccountsFromCsv} from "@/backend/static";

    let accountSelected = $state<boolean>(false)
    let accountsPromise = $state<Promise<Account[]>>(new Promise(() => []))

    const selectAccount = (account: Account) => {
        accountSelected = true
        Cookies.set("selectedAccount", JSON.stringify(account), {expires: 30})
        goto("/home")
    }

    onMount(() => {
        accountsPromise = loadAccountsFromCsv()
    })
</script>

<div class="login-page">
    <h1>Wer bist du?</h1>
    {#if !accountSelected}
        <div>
            <div>
                {#await accountsPromise then accounts}
                    {#each accounts as account (account.id)}
                        <AccountSelector account={account} onAccountSelected={selectAccount}/>
                    {/each}
                {/await}
            </div>
        </div>
    {:else}
        <div>
            <p>Logging in...</p>
        </div>
    {/if}
</div>