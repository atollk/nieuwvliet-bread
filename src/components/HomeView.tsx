import {JSX, useEffect, useState} from "react";
import {Account} from "../backend.ts";
import {Link, useLocation} from "wouter";
import Cookies from "js-cookie";

export function HomeView(): JSX.Element {
    const [user, setUser] = useState<Account>()
    const [, navigate] = useLocation()

    function logout(): void {
        Cookies.remove("selectedAccount")
        navigate("/")
    }

    useEffect(() => {
        const cookieValue = Cookies.get("selectedAccount")

        if (cookieValue) {
            setUser(JSON.parse(cookieValue))
        } else {
            navigate("/")
        }

        console.log(user)
    }, []);

    if (user === undefined)
        return <></>

    return (
        <div>
            <h1>Hallo, {user.name}!</h1>
            <nav>
                <Link to={`/orders/${user.name}`}>Meine Bestellung</Link>
                <Link to="/order-summary">Bestellübersicht</Link>
                <a href="#" onClick={logout}>Nutzer wechseln</a>
            </nav>
        </div>
    )
}