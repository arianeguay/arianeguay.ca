import { memDb } from '../../../../lib/db/memory';
import type { LinkedInPost } from '../../../../types/database';

export const runtime = 'nodejs';

export async function GET() {
  const list = [...memDb.linkedin_posts].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return Response.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const post: LinkedInPost = {
      id,
      url: body.url ? String(body.url) : undefined,
      author: body.author ? String(body.author) : undefined,
      snippet: body.snippet ? String(body.snippet) : undefined,
      date: body.date ? String(body.date) : new Date().toISOString(),
      like_count: typeof body.like_count === 'number' ? body.like_count : 0,
      comment_count: typeof body.comment_count === 'number' ? body.comment_count : 0,
      engagement_score: typeof body.engagement_score === 'number' ? body.engagement_score : 0,
      status: (body.status as LinkedInPost['status']) || 'new',
      source: body.source ? String(body.source) : 'manual',
      created_at: now,
      updated_at: now,
    };

    memDb.linkedin_posts.unshift(post);
    return Response.json(post, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}
