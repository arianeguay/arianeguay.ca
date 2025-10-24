import { memDb } from '../../../lib/db/memory';
import type { Project, Client } from '../../../types/database';
import { z } from 'zod';
import { getServiceSupabase } from '../../../lib/db/supabase';

export const runtime = 'nodejs';

function withRelations(p: Project): Project {
  const client = p.client_id ? memDb.clients.find((c) => c.id === p.client_id) : undefined;
  return { ...p, client };
}

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, client:clients(*)')
      .order('created_at', { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    // Coerce to our Project type; 'client' already attached by alias
    return Response.json((data as any[]) ?? []);
  }
  return Response.json(memDb.projects.map(withRelations));
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

