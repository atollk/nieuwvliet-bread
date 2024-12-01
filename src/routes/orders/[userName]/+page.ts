import type { EntryGenerator } from "./$types";
import { parse } from "csv-parse/browser/esm/sync";
import * as fs from "fs";

export const entries: EntryGenerator = () => {
    const csvText = fs.readFileSync("./static/users.csv");
    const rows: { i: number; name: string; picture: string }[] = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
    });
    return rows.map((row) => ({
        userName: row.name,
    }));
};
