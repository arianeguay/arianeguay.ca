import { memDb } from '../../../../../lib/db/memory';
import type { LinkedInPost } from '../../../../../types/database';
import { getServiceSupabase } from '../../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('linkedin_posts').select('*').eq('id', p.id).single();
    if (error) return Response.json({ error: error.message }, { status: 404 });
    return Response.json(data);
  }
  const item = memDb.linkedin_posts.find((pp) => pp.id === p.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const p = await params;
    const schema = z.object({
      url: z.string().url().optional(),
      author: z.string().optional(),
      snippet: z.string().optional(),
      date: z.string().optional(),
      like_count: z.number().int().nonnegative().optional(),
      comment_count: z.number().int().nonnegative().optional(),
      engagement_score: z.number().int().nonnegative().optional(),
      status: z.enum(['new', 'queued', 'commented', 'skipped']).optional(),
      source: z.string().optional(),
    });
    const body = schema.parse(await req.json());
    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', p.id)
        .select('*')
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    }
    const idx = memDb.linkedin_posts.findIndex((pp) => pp.id === p.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const next: LinkedInPost = { ...memDb.linkedin_posts[idx], ...body, updated_at: new Date().toISOString() };
    memDb.linkedin_posts[idx] = next;
    return Response.json(next);
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from('linkedin_posts').delete().eq('id', p.id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }
  const before = memDb.linkedin_posts.length;
  memDb.linkedin_posts = memDb.linkedin_posts.filter((pp) => pp.id !== p.id);
  if (memDb.linkedin_posts.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}

