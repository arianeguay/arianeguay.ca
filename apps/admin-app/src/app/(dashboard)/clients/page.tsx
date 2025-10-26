import type { Client } from "../../../types/database";
import ClientsList from "./ClientsList";
import { getServiceSupabase } from "../../../lib/db/supabase";
import { memDb } from "../../../lib/db/memory";


export default async function ClientsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = getServiceSupabase();
  let clients: Client[] = [];
  const query = (searchParams?.query as string) || '';
  const page = Math.max(1, parseInt((searchParams?.page as string) || '1', 10));
  const pageSize = Math.max(1, Math.min(100, parseInt((searchParams?.page_size as string) || '20', 10)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  if (supabase) {
    let q = supabase.from('clients').select('*').order('created_at', { ascending: false }).range(from, to);
    if (query) q = q.or(`name.ilike.%${query}%,company_name.ilike.%${query}%`);
    const { data } = await q;
    clients = (data as any[]) ?? [];
  } else {
    let list = memDb.clients.slice();
    if (query) {
      const qq = query.toLowerCase();
      list = list.filter((c) => (c.name || '').toLowerCase().includes(qq) || (c.company_name || '').toLowerCase().includes(qq));
    }
    clients = list.slice(from, to + 1);
  }
  return <ClientsList initialClients={clients} />;
}
