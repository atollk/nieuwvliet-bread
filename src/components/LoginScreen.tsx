import {JSX, useEffect, useState} from "react";
import {Account, loadAccountsFromCsv} from "../backend.ts";
import {useLocation} from "wouter";
import Cookies from 'js-cookie'

export function LoginScreen(): JSX.Element {
    const [, setSelectedAccountName] = useState<string | undefined>(undefined)
    const [accounts, setAccounts] = useState<Account[]>([])
    const [, navigate] = useLocation()

    const selectAccount = (account: Account) => {
        setSelectedAccountName(account.name)
        Cookies.set('selectedAccount', JSON.stringify(account), {expires: 30})
        navigate("/home")
    }

    async function onMount(): Promise<void> {
        console.log("onMount")
        const cookieValue = Cookies.get("selectedAccount")

        if (cookieValue === undefined) {
            setAccounts(await loadAccountsFromCsv())
            return
        }

        let selectedAccountName
        try {
            selectedAccountName = JSON.parse(cookieValue)
        } catch (e) {
            console.warn(e)
            setAccounts(await loadAccountsFromCsv())
            return
        }
        setSelectedAccountName(selectedAccountName)
        navigate("/home")
    }

    useEffect(() => {
        onMount().then()
    }, [])

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
