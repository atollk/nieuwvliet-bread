import {parse} from "csv-parse/browser/esm/sync";
import axios from 'axios';

export  type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

export interface Account {
    id: number;
    name: string;
    picture: string;
}

export async function loadAccountsFromCsv(): Promise<Account[]> {
    try {
        const response = await fetch('/users.csv');
        const csvText = await response.text();
        const rows: { i: number; name: string; picture: string; }[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });

        return rows.map(({i, name, picture}) => {
                return {
                    id: i + 1,
                    name,
                    picture: `assets/users/${picture}`,
                };
            }
        );
    } catch (error) {
        console.error('Error loading CSV:', error);
        return Promise.reject('Error loading CSV:' + error)
    }
}


export interface OrderItem {
    id: number;
    image: string;
    name: string;
    description: string;
    orderAmount?: number;
}

export async function loadItemsFromCSV(): Promise<OrderItem[]> {
    try {
        const response = await fetch('/goods.csv');
        const csvText = await response.text();
        const rows: { i: string; name: string; description: string; }[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });

        return rows.map(({i, name, description}) => {
                return <OrderItem>{
                    id: parseInt(i),
                    image: `/assets/goods/b${i}.png`,
                    name,
                    description,
                    orderAmount: undefined,
                };
            }
        );
    } catch (error) {
        console.error('Error loading CSV:', error);
        return Promise.reject('Error loading CSV:' + error);
    }
}

export interface PantryBasket {
    userOrders: { [key: string]: PantryBasketUser }
}

interface PantryBasketUser {
    userName: string;
    orderAmounts: number[];
}

const PANTRY_ID = "db23437e-debe-4373-adf0-25579ef53034"
const PANTRY_BASKET_NAME = "ordersv2"
const PANTRY_BASKET_API_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${PANTRY_BASKET_NAME}`

export async function getOrderData(): Promise<Map<string, number[]>> {
    const response = (await axios.get<PantryBasket>(PANTRY_BASKET_API_URL)).data
    const result = new Map<string, number[]>()
    for (const userName in response.userOrders) {
        result.set(userName, response.userOrders[userName].orderAmounts)
    }
    return result
}

export async function putOrderData(userName: string, orderAmounts: number[]): Promise<Map<string, number[]>> {
    const request = <PantryBasket>{userOrders: {[userName]: {userName, orderAmounts}}}
    const response = (await axios.put<PantryBasket>(PANTRY_BASKET_API_URL, request)).data
    const result = new Map<string, number[]>()
    for (const userName in response.userOrders) {
        result.set(userName, response.userOrders[userName].orderAmounts)
    }
    return result
}