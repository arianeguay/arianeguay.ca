import { memDb } from '../../../lib/db/memory';
import type { Invoice, InvoiceItem } from '../../../types/database';
import { z } from 'zod';
import { getServiceSupabase } from '../../../lib/db/supabase';

export const runtime = 'nodejs';

function withRelations(inv: Invoice): Invoice {
  const client = inv.client_id ? memDb.clients.find((c) => c.id === inv.client_id) : undefined;
  return { ...inv, client };
}

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, client:clients(*)')
      .order('created_at', { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data ?? []);
  }
  return Response.json(memDb.invoices.map(withRelations));
}

function calcTotals(items: InvoiceItem[]) {
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
  const tax_tps = +(subtotal * 0.05).toFixed(2);
  const tax_tvq = +(subtotal * 0.09975).toFixed(2);
  const total = +(subtotal + tax_tps + tax_tvq).toFixed(2);
  return { subtotal, tax_tps, tax_tvq, total };
}

export async function POST(req: Request) {
  try {
    const itemSchema = z.object({ desc: z.string().min(1), qty: z.number().positive(), unitPrice: z.number().nonnegative() });
    const schema = z.object({
      number: z.string().min(1),
      client_id: z.string().optional(),
      issue_date: z.string().optional(),
      due_date: z.string().optional(),
      status: z
        .enum(['draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled'])
        .default('draft'),
      items: z.array(itemSchema).min(1),
      currency: z.string().min(1).default('CAD'),
      notes: z.string().optional(),
    });
    const body = schema.parse(await req.json());
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const items: InvoiceItem[] = body.items.map((it) => ({ desc: it.desc, qty: it.qty, unitPrice: it.unitPrice }));

    const totals = calcTotals(items);

    const invoice: Invoice = {
      id,
      number: String(body.number ?? `TMP-${Date.now()}`),
      client_id: body.client_id ? String(body.client_id) : undefined,
      issue_date: body.issue_date ? String(body.issue_date) : now.slice(0, 10),
      due_date: body.due_date ? String(body.due_date) : now.slice(0, 10),
      status: body.status as Invoice['status'],
      items,
      subtotal: totals.subtotal,
      tax_tps: totals.tax_tps,
      tax_tvq: totals.tax_tvq,
      total: totals.total,
      currency: String(body.currency ?? 'CAD'),
      notes: body.notes ? String(body.notes) : undefined,
      created_at: now,
      updated_at: now,
    };

    const supabase = getServiceSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('invoices').insert(invoice as any).select('*, client:clients(*)').single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data, { status: 201 });
    }
    memDb.invoices.unshift(invoice);
    return Response.json(withRelations(invoice), { status: 201 });
  } catch (e: any) {
    if (e?.issues) return Response.json({ error: 'validation_error', issues: e.issues }, { status: 400 });
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

