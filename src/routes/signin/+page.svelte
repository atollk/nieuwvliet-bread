<script lang="ts">
    import AccountSelector from "@/routes/signin/AccountSelector.svelte";
    import {type Account, loadAccountsFromCsv} from "@/backend";
    import Cookies from 'js-cookie'
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";

    let selectedAccountName = $state<string>()
    let accountsPromise = $state<Promise<Account[]>>(new Promise(() => []))

    const selectAccount = (account: Account) => {
        selectedAccountName = account.name
        Cookies.set("selectedAccount", JSON.stringify(account.name), {expires: 30})
        goto("/home")
    }

    onMount(() => {
        accountsPromise = loadAccountsFromCsv()
    })
</script>

<div class="login-page">
    <h1>Wer bist du?</h1>
    {#if !selectedAccountName}
        <div>
            <div class="account-grid">
                {#await accountsPromise then accounts}
                    {#each accounts as account (account.id)}
                        <AccountSelector account={account} onAccountSelected={selectAccount}/>
                    {/each}
                {/await}
            </div>
        </div>
    {:else}
        <div>
            <p>Logging in as {{selectedAccountName}}...</p>
        </div>
    {/if}
</div>