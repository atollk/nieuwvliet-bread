import {Account, OrderItem} from "./data.ts";
import {parse} from "csv-parse/browser/esm/sync";

export async function loadItemsFromCSV(): Promise<OrderItem[]> {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}goods.csv`);
        const csvText = await response.text();
        const rows: { i: string; name: string; description: string; }[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });
        const result = rows.map(({i, name, description}) => {
                return <OrderItem>{
                    id: parseInt(i),
                    image: `${import.meta.env.BASE_URL}assets/goods/b${i}.png`,
                    name,
                    description,
                    orderAmount: undefined,
                };
            }
        )

        return result;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return Promise.reject('Error loading CSV:' + error);
    }
}

export async function loadAccountsFromCsv(): Promise<Account[]> {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}users.csv`);
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