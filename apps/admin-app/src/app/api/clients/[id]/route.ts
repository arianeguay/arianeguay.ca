import { memDb } from '../../../../lib/db/memory';
import { getServiceSupabase } from '../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('clients').select('*').eq('id', params.id).single();
    if (error) return Response.json({ error: error.message }, { status: 404 });
    return Response.json(data);
  }
  const item = memDb.clients.find((c) => c.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const schema = z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional().or(z.literal('')).transform((v) => (v ? v : undefined)),
      phone: z.string().optional(),
      address: z.string().optional(),
      company_name: z.string().optional(),
      tax_number_tps: z.string().optional(),
      tax_number_tvq: z.string().optional(),
      notes: z.string().optional(),
    });
    const body = schema.parse(await req.json());
    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('clients')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', params.id)
        .select('*')
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    }
    const idx = memDb.clients.findIndex((c) => c.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const next = { ...memDb.clients[idx], ...body, updated_at: new Date().toISOString() };
    memDb.clients[idx] = next;
    return Response.json(next);
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from('clients').delete().eq('id', params.id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }
  const before = memDb.clients.length;
  memDb.clients = memDb.clients.filter((c) => c.id !== params.id);
  if (memDb.clients.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}

