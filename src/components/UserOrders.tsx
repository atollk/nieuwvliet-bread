import {JSX, useEffect, useState} from "react";
import {useLocation} from "wouter";
import {OrderItem} from "../backend/data.ts";
import {loadItemsFromCSV} from "../backend/static.ts";
import {getOrderData, putOrderData} from "../backend/supabase.ts";
import {DeepReadonly} from "ts-essentials";

type ChangeState = 'submitting' | 'unchanged' | 'changed'

export function UserOrders(userName: string): JSX.Element {
    const [changeState, setChangeState] = useState<ChangeState>("unchanged")
    const [items, setItems] = useState<DeepReadonly<ReadonlyArray<OrderItem>>>([])
    const [, navigate] = useLocation()

    const getItems = async (): Promise<void> => {
        let itemsTmp = await loadItemsFromCSV()
        const lastOrder = (await getOrderData()).get(userName)
        if (!lastOrder) {
            console.log("No previous order found. Defaulting to 0 for all.")
            itemsTmp = itemsTmp.map((item) => ({...item, orderAmount: 0}))
        } else {
            itemsTmp = itemsTmp.map((item) => ({...item, orderAmount: lastOrder[item.id - 1]}))
        }
        setItems(itemsTmp)
        return Promise.resolve()
    }

    function goBack(): void {
        navigate("/home")
    }

    async function sendOrder(): Promise<void> {
        const oldChangeState = changeState
        setChangeState("submitting")
        try {
            await putOrderData(userName, items.map((item) => item.orderAmount ?? 0))
            setChangeState("unchanged")
        } catch (error) {
            setChangeState(oldChangeState)
        }
    }

    function updateItem(newItem: OrderItem): void {
        setItems(items.map((item) => item.id == newItem.id ? newItem : item))
    }

    useEffect(() => {
        getItems().then()
    }, []);

    // https://github.com/molefrog/wouter/issues/39

    const headerFooter = (
        <div>
            <button onClick={goBack}>Zurück</button>
            <button onClick={sendOrder}>
                {
                    changeState === "submitting"
                        ? <img src="/loading.gif" alt="Loading"/>
                        : <span>Bestellung abschicken</span>
                }
            </button>
        </div>
    )

    return (
        <div>
            <h1>Meine Bestellung</h1>
            {headerFooter}
            {
                items.length == 0
                    ? <p>Bitte warten...</p>
                    : (
                        <div>
                            {
                                items.map((item) => <ItemOrder item={item} updateItem={updateItem}
                                                               setChangeState={setChangeState}/>)
                            }
                        </div>
                    )

            }
            {headerFooter}
        </div>
    )
}

function ItemOrder(props: {
    item: OrderItem,
    updateItem: (newItem: OrderItem) => void,
    setChangeState: (value: ChangeState) => void
}): JSX.Element {
    function decreaseOrder(item: OrderItem): void {
        if (item.orderAmount !== undefined) {
            props.updateItem({...item, orderAmount: item.orderAmount - 1})
            props.setChangeState("changed")
        }
    }

    // https://github.com/microsoft/TypeScript/pull/58296
    function increaseOrder(item: OrderItem): void {
        if (item.orderAmount !== undefined) {
            props.updateItem({...item, orderAmount: item.orderAmount + 1})
            props.setChangeState("changed")
        }
    }

    return (
        <div key={props.item.id}>
            <img src={props.item.image} alt={props.item.name}/>
            <div>
                <p>{props.item.name}</p>
                <div>
                    <button onClick={() => decreaseOrder(props.item)}>-</button>
                    {
                        props.item.orderAmount === undefined
                            ? <img src="/loading.gif" alt="Loading"/>
                            : <span>{props.item.orderAmount}</span>
                    }
                    <button onClick={() => increaseOrder(props.item)}>+</button>
                </div>
                <p>{props.item.description}</p>
            </div>
        </div>
    )
}