import { createClient } from '@supabase/supabase-js';

/*
create table
  public.orders (
    "userName" character varying not null,
    "itemId" smallint not null,
    count smallint null default '0'::smallint,
    constraint orders_pkey primary key ("userName", "itemId")
  ) tablespace pg_default;
 */

const SUPABASE_URL = 'https://gazcevboyqfixhlvrgnz.supabase.co';
const SUPABASE_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhemNldmJveXFmaXhobHZyZ256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMjc1MDQsImV4cCI6MjA0NzYwMzUwNH0.-_sGao6yKoJT6-Gr1VyWatlBed0rQrG7r9wTg-m2x_k';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getOrderData(): Promise<Map<string, number[]>> {
	const response = await supabase.from('orders').select('userName, itemId, count');
	if (response.data === null) return Promise.reject('response is null');
	const result = new Map<string, number[]>();
	for (const row of response.data) {
		if (!result.has(row.userName)) result.set(row.userName, []);
		const order = result.get(row.userName)!;
		while (order.length <= row.itemId - 1) order.push(0);
		order[row.itemId - 1] = row.count;
		result.set(row.userName, order);
	}
	return result;
}

export async function putOrderData(userName: string, orderAmounts: number[]): Promise<void> {
	const rows = [];
	for (let i = 0; i < orderAmounts.length; i++) {
		rows.push({ userName, itemId: i + 1, count: orderAmounts[i] });
	}
	await Promise.all(rows.map((row) => supabase.from('orders').upsert(row)));
}
