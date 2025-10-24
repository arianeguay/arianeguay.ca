import { memDb } from '../../../../lib/db/memory';
import type { Project } from '../../../../types/database';
import { getServiceSupabase } from '../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

function withRelations(p: Project): Project {
  const client = p.client_id ? memDb.clients.find((c) => c.id === p.client_id) : undefined;
  return { ...p, client };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, client:clients(*)')
      .eq('id', params.id)
      .single();
    if (error) return Response.json({ error: error.message }, { status: 404 });
    return Response.json(data);
  }
  const item = memDb.projects.find((p) => p.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(withRelations(item));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const schema = z.object({
      client_id: z.string().optional(),
      name: z.string().min(1).optional(),
      status: z.enum(['draft', 'in_progress', 'completed', 'cancelled']).optional(),
      budget: z.number().optional(),
      currency: z.string().optional(),
      deadline: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
    });
    const body = schema.parse(await req.json());
    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', params.id)
        .select('*, client:clients(*)')
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    }
    const idx = memDb.projects.findIndex((p) => p.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const next: Project = { ...memDb.projects[idx], ...body, updated_at: new Date().toISOString() };
    memDb.projects[idx] = next;
    return Response.json(withRelations(next));
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', params.id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }
  const before = memDb.projects.length;
  memDb.projects = memDb.projects.filter((p) => p.id !== params.id);
  if (memDb.projects.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}

