import {parse} from "csv-parse/browser/esm/sync";

export interface Account {
    id: number;
    name: string;
    picture: string;
}

export async function loadAccountsFromCsv(): Promise<Account[]> {
    try {
        //const response = await fetch(`${import.meta.env.BASE_URL}/users.csv`);
        const response = await fetch(`users.csv`);
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