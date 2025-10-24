import { memDb } from '../../../../lib/db/memory';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = memDb.clients.find((c) => c.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const idx = memDb.clients.findIndex((c) => c.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const body = await req.json();
    const next = { ...memDb.clients[idx], ...body, updated_at: new Date().toISOString() };
    memDb.clients[idx] = next;
    return Response.json(next);
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const before = memDb.clients.length;
  memDb.clients = memDb.clients.filter((c) => c.id !== params.id);
  if (memDb.clients.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}
