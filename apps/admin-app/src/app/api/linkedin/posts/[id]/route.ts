import { memDb } from '../../../../../lib/db/memory';
import type { LinkedInPost } from '../../../../../types/database';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = memDb.linkedin_posts.find((p) => p.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const idx = memDb.linkedin_posts.findIndex((p) => p.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const body = await req.json();
    const next: LinkedInPost = { ...memDb.linkedin_posts[idx], ...body, updated_at: new Date().toISOString() };
    memDb.linkedin_posts[idx] = next;
    return Response.json(next);
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const before = memDb.linkedin_posts.length;
  memDb.linkedin_posts = memDb.linkedin_posts.filter((p) => p.id !== params.id);
  if (memDb.linkedin_posts.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}
