import Cookies from "js-cookie";
import {Account} from "../backend/data.ts";
import {onMounted, ref} from "vue";

export function HomeView(): JSX.Element {
    const user = ref<Account>()
    const [, navigate] = useLocation()

    const logout = (): void => {
        Cookies.remove("selectedAccount")
        navigate("/")
    };

    onMounted(() => {
        const cookieValue = Cookies.get("selectedAccount")

        if (cookieValue) {
            user.value = JSON.parse(cookieValue)
        } else {
            navigate("/")
        }
    })

    if (user === undefined)
        return <></>

    return (
        <div>
            <h1>Hallo, {user.value?.name}!</h1>
            <nav>
                <Link to={`/orders/${user.name}`}>Meine Bestellung</Link>
                <Link to="/order-summary">Bestellübersicht</Link>
                <a href="#" onClick={logout}>Nutzer wechseln</a>
            </nav>
        </div>
    )
}