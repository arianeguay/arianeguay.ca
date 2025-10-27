import { memDb } from '../../../../../lib/db/memory';
import type { Invoice } from '../../../../../types/database';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

export const runtime = 'nodejs';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 20, marginBottom: 16 },
  section: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 6, marginBottom: 6 },
  cell: { flex: 1 },
  cellQty: { width: 60, textAlign: 'right' },
  cellPrice: { width: 100, textAlign: 'right' },
});

function money(n: number, currency = 'CAD') {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency }).format(n);
}

function InvoiceDoc({ invoice }: { invoice: Invoice }) {
  const items = invoice.items.map((it, idx) =>
    React.createElement(
      View,
      { key: idx, style: styles.row },
      React.createElement(Text, { style: styles.cell }, it.desc),
      React.createElement(Text, { style: styles.cellQty }, String(it.qty)),
      React.createElement(Text, { style: styles.cellPrice }, money(it.unitPrice, invoice.currency))
    )
  );

  const clientRow = invoice.client
    ? React.createElement(
        View,
        { style: styles.row },
        React.createElement(Text, null, `Client: ${invoice.client.name}`),
        invoice.client.company_name
          ? React.createElement(Text, null, `Entreprise: ${invoice.client.company_name}`)
          : null
      )
    : null;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.header }, `Facture #${invoice.number}`),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(
            Text,
            null,
            `Émise le: ${new Date(invoice.issue_date).toLocaleDateString('fr-CA')}`
          ),
          React.createElement(
            Text,
            null,
            `Échéance: ${new Date(invoice.due_date).toLocaleDateString('fr-CA')}`
          )
        ),
        clientRow
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.tableHeader },
          React.createElement(Text, { style: { ...styles.cell, fontWeight: 700 as any } }, 'Description'),
          React.createElement(Text, { style: { ...styles.cellQty, fontWeight: 700 as any } }, 'Qté'),
          React.createElement(Text, { style: { ...styles.cellPrice, fontWeight: 700 as any } }, 'Prix')
        ),
        ...items
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, null, 'Sous-total'),
          React.createElement(Text, null, money(invoice.subtotal, invoice.currency))
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, null, 'TPS (5%)'),
          React.createElement(Text, null, money(invoice.tax_tps, invoice.currency))
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, null, 'TVQ (9.975%)'),
          React.createElement(Text, null, money(invoice.tax_tvq, invoice.currency))
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: { fontWeight: 700 as any } }, 'Total'),
          React.createElement(Text, { style: { fontWeight: 700 as any } }, money(invoice.total, invoice.currency))
        )
      ),
      invoice.notes
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(Text, null, 'Notes:'),
            React.createElement(Text, null, invoice.notes)
          )
        : null
    )
  );
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const inv = memDb.invoices.find((i) => i.id === p.id);
  if (!inv) return new Response('Not found', { status: 404 });

  // populate client for PDF context
  const client = inv.client_id ? memDb.clients.find((c) => c.id === inv.client_id) : undefined;
  const invoice: Invoice = { ...inv, client };

  const instance = pdf(React.createElement(InvoiceDoc as any, { invoice } as any) as any);
  const buf = await instance.toBuffer();

  return new Response(buf as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${invoice.number}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
