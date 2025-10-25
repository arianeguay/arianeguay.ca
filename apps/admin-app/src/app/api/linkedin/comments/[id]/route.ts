import { memDb } from '../../../../../lib/db/memory';
import type { LinkedInComment } from '../../../../../types/database';
import { getServiceSupabase } from '../../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('linkedin_comments').select('*').eq('id', params.id).single();
    if (error) return Response.json({ error: error.message }, { status: 404 });
    return Response.json(data);
  }
  const item = memDb.linkedin_comments.find((c: LinkedInComment) => c.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const schema = z.object({
      tone: z.enum(['professional', 'friendly', 'playful']).optional(),
      content: z.string().min(1).optional(),
      used: z.boolean().optional(),
    });
    const body = schema.parse(await req.json());
    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('linkedin_comments')
        .update({ ...body })
        .eq('id', params.id)
        .select('*')
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    }
    const idx = memDb.linkedin_comments.findIndex((c: LinkedInComment) => c.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const next: LinkedInComment = { ...memDb.linkedin_comments[idx], ...body };
    memDb.linkedin_comments[idx] = next;
    return Response.json(next);
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from('linkedin_comments').delete().eq('id', params.id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }
  const before = memDb.linkedin_comments.length;
  memDb.linkedin_comments = memDb.linkedin_comments.filter((c: LinkedInComment) => c.id !== params.id);
  if (memDb.linkedin_comments.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}
