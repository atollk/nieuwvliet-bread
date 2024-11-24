import {parse} from "csv-parse/browser/esm/sync";
import type {Account, OrderItem} from "@/backend/types";

export async function loadAccountsFromCsv(): Promise<Account[]> {
    try {
        const response = await fetch(`/users.csv`);
        const csvText = await response.text();
        const rows: { i: number; name: string; picture: string; }[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });

        return rows.map(({i, name, picture}) => {
                return {
                    id: i + 1,
                    name,
                    picture: `/assets/users/${picture}`,
                };
            }
        );
    } catch (error) {
        console.error('Error loading CSV:', error);
        return Promise.reject('Error loading CSV:' + error)
    }
}

export async function loadItemsFromCSV(): Promise<OrderItem[]> {
    try {
        const response = await fetch(`/goods.csv`);
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