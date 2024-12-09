<script lang="ts">
    import Cookies from "js-cookie"
    import { goto } from "$app/navigation"
    import { onMount } from "svelte"
    import type { Account } from "@/backend/types"
    import { loadAccountsFromCsv } from "@/backend/static"
    import { base } from "$app/paths"

    let accountSelected = $state<boolean>(false)
    let accountsPromise = $state<Promise<Account[]>>(new Promise(() => []))

    const selectAccount = (account: Account) => {
        accountSelected = true
        Cookies.set("selectedAccount", JSON.stringify(account), { expires: 30 })
        goto(`${base}/home`)
    }

    onMount(() => {
        accountsPromise = loadAccountsFromCsv()
    })
</script>

<div class="pb-16">
    {#if !accountSelected}
        <h1 class="h1 my-6 text-center">Wer bist du?</h1>
        <div
            class="max-w-(--breakpoint-2xl) mx-auto grid grid-flow-dense auto-rows-fr grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4"
        >
            {#await accountsPromise then accounts}
                {#each accounts as account (account.id)}
                    <div
                        class="bg-base-200 border-neutral flex transform justify-center rounded-xl border-2 px-8 py-4 transition hover:scale-105"
                    >
                        <button class="text-center text-2xl" onclick={() => selectAccount(account)}>
                            <span>{account.name}</span>
                            <img
                                src={account.picture}
                                alt={account.name}
                                class="w-full grayscale-[70%] hover:grayscale-0 hover-none:grayscale-0"
                            />
                        </button>
                    </div>
                {/each}
            {/await}
        </div>
    {:else}
        <div class="flex h-[100vh] items-center justify-center">
            <p class="h1">Logging in...</p>
        </div>
    {/if}
</div>
