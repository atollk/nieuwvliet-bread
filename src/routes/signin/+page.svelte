<script lang="ts">
	import Cookies from 'js-cookie';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Account } from '@/backend/types';
	import { loadAccountsFromCsv } from '@/backend/static';
	import { base } from '$app/paths';

	let accountSelected = $state<boolean>(false);
	let accountsPromise = $state<Promise<Account[]>>(new Promise(() => []));

	const selectAccount = (account: Account) => {
		accountSelected = true;
		Cookies.set('selectedAccount', JSON.stringify(account), { expires: 30 });
		goto(`${base}/home`);
	};

	onMount(() => {
		accountsPromise = loadAccountsFromCsv();
	});
</script>

<div>
	<h1 class="my-6 text-center text-3xl">Wer bist du?</h1>
	{#if !accountSelected}
		<div
			class="mx-auto grid max-w-screen-2xl grid-flow-dense auto-rows-fr grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4"
		>
			{#await accountsPromise then accounts}
				{#each accounts as account (account.id)}
					<div class="card-hover card flex justify-center px-8 py-4">
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
		<div>
			<p>Logging in...</p>
		</div>
	{/if}
</div>
