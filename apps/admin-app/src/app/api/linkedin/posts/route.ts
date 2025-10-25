import { memDb } from '../../../../lib/db/memory';
import type { LinkedInPost } from '../../../../types/database';
import { getServiceSupabase } from '../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('linkedin_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data ?? []);
  }
  const list = [...memDb.linkedin_posts].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return Response.json(list);
}

export async function POST(req: Request) {
  try {
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
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const post: LinkedInPost = {
      id,
      url: body.url,
      author: body.author,
      snippet: body.snippet,
      date: body.date ?? new Date().toISOString(),
      like_count: body.like_count ?? 0,
      comment_count: body.comment_count ?? 0,
      engagement_score: body.engagement_score ?? 0,
      status: (body.status as LinkedInPost['status']) ?? 'new',
      source: body.source ?? 'manual',
      created_at: now,
      updated_at: now,
    };

    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('linkedin_posts').insert(post as any).select('*').single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data, { status: 201 });
    }

    memDb.linkedin_posts.unshift(post);
    return Response.json(post, { status: 201 });
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

