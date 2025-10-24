import { memDb } from '../../../lib/db/memory';
import type { Project, Client } from '../../../types/database';

export const runtime = 'nodejs';

function withRelations(p: Project): Project {
  const client = p.client_id ? memDb.clients.find((c) => c.id === p.client_id) : undefined;
  return { ...p, client };
}

export async function GET() {
  return Response.json(memDb.projects.map(withRelations));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const project: Project = {
      id,
      client_id: body.client_id?.toString(),
      name: (body.name ?? '').toString(),
      status: (body.status ?? 'draft') as Project['status'],
      budget: typeof body.budget === 'number' ? body.budget : undefined,
      currency: (body.currency ?? 'CAD').toString(),
      deadline: body.deadline?.toString(),
      description: body.description?.toString(),
      tags: Array.isArray(body.tags) ? body.tags.map((t: unknown) => String(t)) : [],
      created_at: now,
      updated_at: now,
    };

    if (!project.name) {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    memDb.projects.unshift(project);
    return Response.json(withRelations(project), { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}
