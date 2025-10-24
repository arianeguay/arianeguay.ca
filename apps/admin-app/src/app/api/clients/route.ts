import { memDb } from '../../../lib/db/memory';
import type { Client } from '../../../types/database';
import { z } from 'zod';
import { getServiceSupabase } from '../../../lib/db/supabase';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data ?? []);
  }
  return Response.json(memDb.clients);
}

export async function POST(req: Request) {
  try {
    const clientSchema = z.object({
      name: z.string().min(1),
      email: z
        .string()
        .email()
        .optional()
        .or(z.literal(''))
        .transform((v) => (v ? v : undefined)),
      phone: z.string().optional(),
      address: z.string().optional(),
      company_name: z.string().optional(),
      tax_number_tps: z.string().optional(),
      tax_number_tvq: z.string().optional(),
      notes: z.string().optional(),
    });
    const body = clientSchema.parse(await req.json());
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const supabase = getServiceSupabase();
    if (supabase) {
      const insert = { ...body, id, created_at: now, updated_at: now } as Client;
      const { data, error } = await supabase.from('clients').insert(insert).select().single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data, { status: 201 });
    }

    const client: Client = { id, ...body, created_at: now, updated_at: now } as Client;
    memDb.clients.unshift(client);
    return Response.json(client, { status: 201 });
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

