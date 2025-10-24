import { memDb } from '../../../../lib/db/memory';
import type { Project } from '../../../../types/database';

export const runtime = 'nodejs';

function withRelations(p: Project): Project {
  const client = p.client_id ? memDb.clients.find((c) => c.id === p.client_id) : undefined;
  return { ...p, client };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = memDb.projects.find((p) => p.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(withRelations(item));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const idx = memDb.projects.findIndex((p) => p.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const body = await req.json();
    const next: Project = { ...memDb.projects[idx], ...body, updated_at: new Date().toISOString() };
    memDb.projects[idx] = next;
    return Response.json(withRelations(next));
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const before = memDb.projects.length;
  memDb.projects = memDb.projects.filter((p) => p.id !== params.id);
  if (memDb.projects.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}
