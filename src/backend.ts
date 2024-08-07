import {parse} from "csv-parse/browser/esm/sync";

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
    orderAmount: number;
}

export async function loadItemsFromCSV(): Promise<OrderItem[]> {
    try {
        const response = await fetch('/goods.csv');
        const csvText = await response.text();
        const rows: { i: number; name: string; description: string; }[] = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });

        return rows.map(({i, name, description}) => {
                return <OrderItem>{
                    id: i + 1,
                    image: `assets/goods/b${i}.png`,
                    name,
                    description,
                    orderAmount: 0
                };
            }
        );
    } catch (error) {
        console.error('Error loading CSV:', error);
        return Promise.reject('Error loading CSV:' + error);
    }
}