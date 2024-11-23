<script lang="ts">
    import {type Account} from "@/backend";

    const props: {
        account: Account,
        onAccountSelected: (account: Account) => void,
    } = $props()
</script>

<button class="account-selector" onclick={() => props.onAccountSelected(props.account)}>
    <span class="account-name">{props.account.name}</span>
    <img src={props.account.picture} alt={props.account.name} class="profile-picture">
</button>