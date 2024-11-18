import {JSX, useEffect, useState} from "react";
import {redirect, useNavigate} from "react-router-dom";
import {Account, loadAccountsFromCsv} from "../backend.ts";


export function LoginScreen(): JSX.Element {
    const [savedAccount, setSavedAccount] = useState<string | undefined>(undefined)
    const [_, setSelectedAccountName] = useState<string | undefined>(undefined)
    const [accounts, setAccounts] = useState<Account[]>([])
    const navigate = useNavigate()


    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        const expires = `expires=${date.toUTCString()}`
        document.cookie = `${name}=${value};${expires};path=/`
    }

    const selectAccount = (account: Account) => {
        setSelectedAccountName(account.name)
        setCookie('selectedAccount', JSON.stringify(account.name), 30)
        navigate("/home")
    }

    async function onMount(): Promise<void> {
        const cookieName = ""
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith(cookieName))
        setSavedAccount(cookieValue ? cookieValue.split('=')[1] : undefined)

        if (savedAccount) {
            setSelectedAccountName(JSON.parse(savedAccount))
            navigate("/home")
        } else {
            setAccounts(await loadAccountsFromCsv())
        }
    }

    useEffect(() => {
        onMount().then()
    })

    return (
        <div>
            <h1>Wer bist du?</h1>
            {
                accounts.map((account) =>
                    <AccountSelector key={account.id} account={account} onSelect={selectAccount}/>
                )
            }
        </div>
    )
}

function AccountSelector(props: { account: Account, onSelect: (account: Account) => void }): JSX.Element {
    return (
        <div onClick={_ => props.onSelect(props.account)}>
            <span>{props.account.name}</span>
            <img src={props.account.picture} alt={props.account.name}/>
        </div>
    )
}
