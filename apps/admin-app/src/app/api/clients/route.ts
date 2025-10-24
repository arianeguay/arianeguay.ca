import { memDb } from '../../../lib/db/memory';
import type { Client } from '../../../types/database';

export const runtime = 'nodejs';

export async function GET() {
  return Response.json(memDb.clients);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);

    const client: Client = {
      id,
      name: (body.name ?? '').toString(),
      email: body.email?.toString(),
      phone: body.phone?.toString(),
      address: body.address?.toString(),
      company_name: body.company_name?.toString(),
      tax_number_tps: body.tax_number_tps?.toString(),
      tax_number_tvq: body.tax_number_tvq?.toString(),
      notes: body.notes?.toString(),
      created_at: now,
      updated_at: now,
    };

    if (!client.name) {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    memDb.clients.unshift(client);
    return Response.json(client, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Invalid JSON' }, { status: 400 });
  }
}
