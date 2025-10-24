import { memDb } from '../../../../lib/db/memory';
import type { Invoice, InvoiceItem } from '../../../../types/database';

export const runtime = 'nodejs';

function withRelations(inv: Invoice): Invoice {
  const client = inv.client_id ? memDb.clients.find((c) => c.id === inv.client_id) : undefined;
  return { ...inv, client };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = memDb.invoices.find((i) => i.id === params.id);
  if (!item) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json(withRelations(item));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const idx = memDb.invoices.findIndex((i) => i.id === params.id);
    if (idx === -1) return Response.json({ error: 'not found' }, { status: 404 });
    const body = await req.json();
    const next: Invoice = { ...memDb.invoices[idx], ...body, updated_at: new Date().toISOString() };
    memDb.invoices[idx] = next;
    return Response.json(withRelations(next));
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const before = memDb.invoices.length;
  memDb.invoices = memDb.invoices.filter((i) => i.id !== params.id);
  if (memDb.invoices.length === before) return Response.json({ error: 'not found' }, { status: 404 });
  return Response.json({ ok: true });
}
