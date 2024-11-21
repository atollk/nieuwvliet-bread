import Cookies from 'js-cookie'
import {Account} from "../backend/data.ts";
import {loadAccountsFromCsv} from "../backend/static.ts";
import {defineComponent, onMounted, PropType, ref} from "vue";
import {useRouter} from "vue-router";
import {AccountSelector} from "../components/AccountSelector.tsx";

export const LoginScreenView = defineComponent({
    setup() {
        const selectedAccount = ref<Account>()
        const accounts = ref<Account[]>([])
        const router = useRouter()

        const selectAccount = async (account: Account) => {
            selectedAccount.value = account
            Cookies.set('selectedAccount', JSON.stringify(account), {expires: 30})
            await router.replace("/home")
        }

        onMounted(async () => {
            const cookieValue = Cookies.get("selectedAccount")

            if (cookieValue === undefined) {
                accounts.value = await loadAccountsFromCsv()
                return
            }

            try {
                selectedAccount.value = JSON.parse(cookieValue)
            } catch (e) {
                console.warn(e)
                accounts.value = await loadAccountsFromCsv()
                return
            }
            await router.replace("/home")
        })

        return () => (
            <div>
                <h1>Wer bist du?</h1>
                {
                    accounts.value.map((account) =>
                        <AccountSelector key={account.id} account={account} onSelect={selectAccount}/>
                    )
                }
            </div>
        )
    }
})

// https://github.com/vuejs/language-tools/discussions/592#discussioncomment-2163786