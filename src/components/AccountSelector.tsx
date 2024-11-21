import {Account} from "../backend/data.ts";
import {defineComponent, PropType} from "vue";

interface AccountSelectorProps {
    account: Account
    onSelect: (account: Account) => void
}

export const A = defineComponent((props: { message: string }) => {
        return () => (
            <>props.message</>
        )
    }
)

export const AccountSelector = defineComponent({
    props: {
        account: {
            type: Object as PropType<Account>,
            required: true,
        },
        onSelect: Function as PropType<(account: Account) => void>
    },
    setup(props: AccountSelectorProps) {
        return () => (
            <div onClick={_ => props.onSelect(props.account)}>
                <span>{props.account.name}</span>
                <img src={props.account.picture} alt={props.account.name}/>
            </div>
        )
    }
})

