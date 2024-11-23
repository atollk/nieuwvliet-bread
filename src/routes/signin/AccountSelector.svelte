<script lang="ts">

    import type {Account} from "@/backend/types";

    const props: {
        account: Account,
        onAccountSelected: (account: Account) => void,
    } = $props()
</script>

<button onclick={() => props.onAccountSelected(props.account)}>
    <span>{props.account.name}</span>
    <img src={props.account.picture} alt={props.account.name} class="profile-picture">
</button>