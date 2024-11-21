import Cookies from "js-cookie";
import {Account} from "../backend/data.ts";
import {defineComponent, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {A, AccountSelector} from "../components/AccountSelector.tsx";

export const HomeView = defineComponent({
    setup() {
        const user = ref<Account>()
        const router = useRouter()

        const logout = async () => {
            Cookies.remove("selectedAccount")
            await router.replace("/")
        };

        onMounted(async () => {
            const cookieValue = Cookies.get("selectedAccount")

            if (cookieValue) {
                user.value = JSON.parse(cookieValue)
            } else {
                await router.replace("/")
            }
        })

        if (user === undefined)
            return <></>

        const account = {} as Account
        const selectAccount = () => {}

        return () => (
            <div>
                <h1>Hallo, {user.value?.name}!</h1>
                <nav>
                    <a href="#" onClick={logout}>Nutzer wechseln</a>
                </nav>
            </div>
        )
    }
})
