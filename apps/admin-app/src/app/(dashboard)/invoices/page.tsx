import InvoicesListView from "./InvoicesList";
import type { Invoice, Client, Project } from "../../../types/database";
import { getServiceSupabase } from "../../../lib/db/supabase";
import { memDb } from "../../../lib/db/memory";

export default async function InvoicesPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = getServiceSupabase();
  let invoices: Invoice[] = [];
  let clients: Client[] = [];
  let projects: Project[] = [];
  const status = (searchParams?.status as string) || undefined;
  const client_id = (searchParams?.client_id as string) || undefined;
  const project_id = (searchParams?.project_id as string) || undefined;
  const page = Math.max(1, parseInt((searchParams?.page as string) || '1', 10));
  const pageSize = Math.max(1, Math.min(100, parseInt((searchParams?.page_size as string) || '20', 10)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  if (supabase) {
    let q = supabase.from('invoices').select('*, client:clients(*), project:projects(*)').order('created_at', { ascending: false }).range(from, to);
    if (status) q = q.eq('status', status);
    if (client_id) q = q.eq('client_id', client_id);
    if (project_id) q = q.eq('project_id', project_id);
    const [iRes, cRes, pRes] = await Promise.all([
      q,
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ]);
    invoices = (iRes.data as any[]) ?? [];
    clients = (cRes.data as any[]) ?? [];
    projects = (pRes.data as any[]) ?? [];
  } else {
    let list = memDb.invoices.slice();
    if (status) list = list.filter((i) => i.status === (status as any));
    if (client_id) list = list.filter((i) => i.client_id === client_id);
    if (project_id) list = list.filter((i) => i.project_id === project_id);
    invoices = list.slice(from, to + 1).map((inv) => {
      const client = inv.client_id ? memDb.clients.find((c) => c.id === inv.client_id) : undefined;
      const project = inv.project_id ? memDb.projects.find((p) => p.id === inv.project_id) : undefined;
      return { ...inv, client, project } as Invoice;
    });
    clients = memDb.clients.slice();
    projects = memDb.projects.slice();
  }
  return <InvoicesListView initialInvoices={invoices} initialClients={clients} initialProjects={projects} />;
}
