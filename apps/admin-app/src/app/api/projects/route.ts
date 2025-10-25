import { memDb } from '../../../lib/db/memory';
import type { Project, Client } from '../../../types/database';
import { z } from 'zod';
import { getServiceSupabase } from '../../../lib/db/supabase';

export const runtime = 'nodejs';

function withRelations(p: Project): Project {
  const client = p.client_id ? memDb.clients.find((c) => c.id === p.client_id) : undefined;
  return { ...p, client };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const client_id = url.searchParams.get('client_id') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const supabase = getServiceSupabase();
  if (supabase) {
    let q = supabase
      .from('projects')
      .select('*, client:clients(*)')
      .order('created_at', { ascending: false });
    if (client_id) q = q.eq('client_id', client_id);
    if (status) q = q.eq('status', status);
    const { data, error } = await q;
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json((data as any[]) ?? []);
  }
  let list = memDb.projects.slice();
  if (client_id) list = list.filter((p) => p.client_id === client_id);
  if (status) list = list.filter((p) => p.status === (status as any));
  return Response.json(list.map(withRelations));
}

export async function POST(req: Request) {
  try {
    const projectSchema = z.object({
      client_id: z.string().optional(),
      name: z.string().min(1),
      status: z.enum(['draft', 'in_progress', 'completed', 'cancelled']).default('draft'),
      budget: z.number().optional(),
      currency: z.string().min(1).default('CAD'),
      deadline: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
    });
    const body = projectSchema.parse(await req.json());
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const supabase = getServiceSupabase();
    if (supabase) {
      const insert = { ...body, id, created_at: now, updated_at: now } as Project;
      const { data, error } = await supabase
        .from('projects')
        .insert(insert)
        .select('*, client:clients(*)')
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data, { status: 201 });
    }

    const project: Project = { id, ...body, created_at: now, updated_at: now } as Project;
    memDb.projects.unshift(project);
    return Response.json(withRelations(project), { status: 201 });
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

