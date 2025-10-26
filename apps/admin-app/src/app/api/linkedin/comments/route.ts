import { memDb } from '../../../../lib/db/memory';
import type { LinkedInComment } from '../../../../types/database';
import { getServiceSupabase } from '../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const post_id = url.searchParams.get('post_id') || undefined;
  const supabase = getServiceSupabase();
  if (supabase) {
    let q = supabase.from('linkedin_comments').select('*');
    if (post_id) q = q.eq('post_id', post_id);
    const { data, error } = await q.order('created_at', { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data ?? []);
  }
  const list = [...memDb.linkedin_comments]
    .filter((c) => (post_id ? c.post_id === post_id : true))
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return Response.json(list);
}

export async function POST(req: Request) {
  try {
    const schema = z.object({
      post_id: z.string(),
      tone: z.enum(['professional', 'friendly', 'playful']),
      content: z.string().min(1),
      used: z.boolean().optional(),
    });
    const body = schema.parse(await req.json());
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const comment: LinkedInComment = {
      id,
      post_id: body.post_id,
      tone: body.tone,
      content: body.content,
      used: body.used ?? false,
      created_at: now,
    };

    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('linkedin_comments').insert(comment as any).select('*').single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data, { status: 201 });
    }

    memDb.linkedin_comments.unshift(comment);
    return Response.json(comment, { status: 201 });
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}
