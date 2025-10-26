import ProjectsListView from "./ProjectsList";
import { getServiceSupabase } from "../../../lib/db/supabase";
import { memDb } from "../../../lib/db/memory";
import type { Project, Client } from "../../../types/database";

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = getServiceSupabase();
  let projects: Project[] = [];
  let clients: Client[] = [];
  const sp = (await searchParams) ?? {};
  const status = (sp.status as string) || undefined;
  const client_id = (sp.client_id as string) || undefined;
  const page = Math.max(1, parseInt((sp.page as string) || '1', 10));
  const pageSize = Math.max(1, Math.min(100, parseInt((sp.page_size as string) || '20', 10)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  if (supabase) {
    let q = supabase.from('projects').select('*, client:clients(*)').order('created_at', { ascending: false }).range(from, to);
    if (status) q = q.eq('status', status);
    if (client_id) q = q.eq('client_id', client_id);
    const [pRes, cRes] = await Promise.all([
      q,
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
    ]);
    projects = (pRes.data as any[]) ?? [];
    clients = (cRes.data as any[]) ?? [];
  } else {
    let list = memDb.projects.slice();
    if (status) list = list.filter((p) => p.status === (status as any));
    if (client_id) list = list.filter((p) => p.client_id === client_id);
    projects = list.slice(from, to + 1).map((p) => {
      const client = p.client_id ? memDb.clients.find((c) => c.id === p.client_id) : undefined;
      return { ...p, client } as Project;
    });
    clients = memDb.clients.slice();
  }
  return <ProjectsListView initialProjects={projects} initialClients={clients} />;
}
