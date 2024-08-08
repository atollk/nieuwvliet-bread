import {parse} from "csv-parse/browser/esm/sync";
import axios from 'axios';
import {createClient} from '@supabase/supabase-js'


export  type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

export interface Account {
    id: number;
    name: string;
    picture: string;
}

export async function loadAccountsFromCsv(): Promise<Account[]> {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}/users.csv`);
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
        const response = await fetch(`${import.meta.env.BASE_URL}/goods.csv`);
        const csvText = await response.text();
        const rows: { i: string; name: string; description: string; }[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });

        return rows.map(({i, name, description}) => {
                return <OrderItem>{
                    id: parseInt(i),
                    image: `${import.meta.env.BASE_URL}/assets/goods/b${i}.png`,
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

const SUPABASE_URL = "https://mnauaygcjzxfyvwlwlxa.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYXVheWdjanp4Znl2d2x3bHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNDkxNTUsImV4cCI6MjAzODYyNTE1NX0.LkRwBV5O0N64uipXuL2NdW6EWm7zYqw8NZ6fhaqoPOc"
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getOrderData(): Promise<Map<string, number[]>> {
    const response = await supabase.from("orders").select("userName, itemId, count")
    if (response.data === null)
        return Promise.reject("response is null")
    const result = new Map<string, number[]>()
    for (const row of response.data) {
        if (!result.has(row.userName))
            result.set(row.userName, [])
        const order = result.get(row.userName)!
        while (order.length <= row.itemId - 1)
            order.push(0)
        order[row.itemId - 1] = row.count
        result.set(row.userName, order)
    }
    return result
}

export async function putOrderData(userName: string, orderAmounts: number[]): Promise<void> {
    const rows = []
    for (let i = 0; i < orderAmounts.length; i++) {
        rows.push({userName, itemId: i + 1, count: orderAmounts[i]})
    }
    await Promise.all(rows.map((row) => supabase.from("orders").upsert(row)))
}