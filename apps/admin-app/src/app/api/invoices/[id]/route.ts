import { memDb } from '../../../../lib/db/memory';
import type { Invoice, InvoiceItem } from '../../../../types/database';
import { getServiceSupabase } from '../../../../lib/db/supabase';
import { z } from 'zod';

export const runtime = 'nodejs';

function withRelations(inv: Invoice): Invoice {
  const client = inv.client_id ? memDb.clients.find((c) => c.id === inv.client_id) : undefined;
  const project = inv.project_id ? memDb.projects.find((p) => p.id === inv.project_id) : undefined;
  return { ...inv, client, project };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, client:clients(*), project:projects(*)')
      .eq('id', p.id)
      .single();
    if (error) return Response.json({ error: error.message }, { status: 404 });
    return Response.json(data);
  }
  const item = memDb.invoices.find((i) => i.id === p.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(withRelations(item));
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const p = await params;
    const itemSchema = z.object({ desc: z.string().min(1), qty: z.number().positive(), unitPrice: z.number().nonnegative() });
    const schema = z.object({
      number: z.string().min(1).optional(),
      client_id: z.string().optional(),
      project_id: z.string().optional(),
      issue_date: z.string().optional(),
      due_date: z.string().optional(),
      status: z
        .enum(['draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled'])
        .optional(),
      items: z.array(itemSchema).optional(),
      currency: z.string().min(1).optional(),
      notes: z.string().optional(),
    });
    const body = schema.parse(await req.json());

    const recalc = (prev: Invoice, items?: InvoiceItem[]) => {
      const useItems = items ?? prev.items;
      const subtotal = useItems.reduce((s, it) => s + it.qty * it.unitPrice, 0);
      const tax_tps = +(subtotal * 0.05).toFixed(2);
      const tax_tvq = +(subtotal * 0.09975).toFixed(2);
      const total = +(subtotal + tax_tps + tax_tvq).toFixed(2);
      return { subtotal, tax_tps, tax_tvq, total, items: useItems };
    };

    const supabase = getServiceSupabase();
    if (supabase) {
      // Fetch current for totals if needed
      const currResp = await supabase.from('invoices').select('*').eq('id', p.id).single();
      if (currResp.error) return Response.json({ error: currResp.error.message }, { status: 404 });
      const current = currResp.data as Invoice;
      const items = body.items ? body.items.map((it) => ({ desc: it.desc, qty: it.qty, unitPrice: it.unitPrice })) : undefined;
      const totals = recalc(current, items);
      const update = { ...body, ...totals, updated_at: new Date().toISOString() } as Partial<Invoice>;
      const { data, error } = await supabase
        .from('invoices')
        .update(update as any)
        .eq('id', p.id)
        .select('*, client:clients(*), project:projects(*)')
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    }

    const idx = memDb.invoices.findIndex((i) => i.id === p.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const current = memDb.invoices[idx];
    const nextBase: Invoice = { ...current, ...body } as Invoice;
    const items = body.items ? body.items as InvoiceItem[] : undefined;
    const totals = recalc(current, items);
    const next: Invoice = { ...nextBase, ...totals, updated_at: new Date().toISOString() };
    memDb.invoices[idx] = next;
    return Response.json(withRelations(next));
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from('invoices').delete().eq('id', p.id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  }
  const before = memDb.invoices.length;
  memDb.invoices = memDb.invoices.filter((i) => i.id !== p.id);
  if (memDb.invoices.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}

