import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import React from "react";
import { Resend } from "resend";
import { memDb } from "../../../../../lib/db/memory";
import type { Invoice } from "../../../../../types/database";

export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 20, marginBottom: 16 },
  section: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 6,
    marginBottom: 6,
  },
  cell: { flex: 1 },
  cellQty: { width: 60, textAlign: "right" },
  cellPrice: { width: 100, textAlign: "right" },
});

function money(n: number, currency = "CAD") {
  return new Intl.NumberFormat("fr-CA", { style: "currency", currency }).format(
    n,
  );
}

function InvoiceDoc({ invoice }: { invoice: Invoice }) {
  const items = invoice.items.map((it, idx) =>
    React.createElement(
      View,
      { key: idx, style: styles.row },
      React.createElement(Text, { style: styles.cell }, it.desc),
      React.createElement(Text, { style: styles.cellQty }, String(it.qty)),
      React.createElement(
        Text,
        { style: styles.cellPrice },
        money(it.unitPrice, invoice.currency),
      ),
    ),
  );

  const clientRow = invoice.client
    ? React.createElement(
        View,
        { style: styles.row },
        React.createElement(Text, null, `Client: ${invoice.client.name}`),
        invoice.client.company_name
          ? React.createElement(
              Text,
              null,
              `Entreprise: ${invoice.client.company_name}`,
            )
          : null,
      )
    : null;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        Text,
        { style: styles.header },
        `Facture #${invoice.number}`,
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(
            Text,
            null,
            `Émise le: ${new Date(invoice.issue_date).toLocaleDateString("fr-CA")}`,
          ),
          React.createElement(
            Text,
            null,
            `Échéance: ${new Date(invoice.due_date).toLocaleDateString("fr-CA")}`,
          ),
        ),
        clientRow,
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.tableHeader },
          React.createElement(
            Text,
            { style: { ...styles.cell, fontWeight: 700 as any } },
            "Description",
          ),
          React.createElement(
            Text,
            { style: { ...styles.cellQty, fontWeight: 700 as any } },
            "Qté",
          ),
          React.createElement(
            Text,
            { style: { ...styles.cellPrice, fontWeight: 700 as any } },
            "Prix",
          ),
        ),
        ...items,
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, null, "Sous-total"),
          React.createElement(
            Text,
            null,
            money(invoice.subtotal, invoice.currency),
          ),
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, null, "TPS (5%)"),
          React.createElement(
            Text,
            null,
            money(invoice.tax_tps, invoice.currency),
          ),
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, null, "TVQ (9.975%)"),
          React.createElement(
            Text,
            null,
            money(invoice.tax_tvq, invoice.currency),
          ),
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(
            Text,
            { style: { fontWeight: 700 as any } },
            "Total",
          ),
          React.createElement(
            Text,
            { style: { fontWeight: 700 as any } },
            money(invoice.total, invoice.currency),
          ),
        ),
      ),
      invoice.notes
        ? React.createElement(
            View,
            { style: styles.section },
            React.createElement(Text, null, "Notes:"),
            React.createElement(Text, null, invoice.notes),
          )
        : null,
    ),
  );
}

function withRelations(inv: Invoice): Invoice {
  const client = inv.client_id
    ? memDb.clients.find((c) => c.id === inv.client_id)
    : undefined;
  return { ...inv, client };
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const p = await params;
    const body = await req.json().catch(() => ({}));
    const to = String(body?.to || "");

    const inv = memDb.invoices.find((i) => i.id === p.id);
    if (!inv) return Response.json({ error: "not found" }, { status: 404 });

    const invoice = withRelations(inv);

    const instance = pdf(
      React.createElement(InvoiceDoc as any, { invoice } as any) as any,
    );
    const raw = await instance.toBuffer();
    const pdfBuf = Buffer.isBuffer(raw)
      ? raw
      : Buffer.from(raw as unknown as Uint8Array);

    // Optional S3 upload
    let pdfUrl: string | undefined;
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION || "us-east-1";
    const hasS3 = !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      bucket
    );
    const key = `invoices/Invoice-${invoice.number}-${invoice.id}.pdf`;

    if (hasS3) {
      const s3 = new S3Client({ region });
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket!,
          Key: key,
          Body: pdfBuf,
          ContentType: "application/pdf",
        }),
      );
      pdfUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }

    // Send email via Resend
    const API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.RESEND_FROM_EMAIL || "no-reply@arianeguay.ca";
    const dest = to || invoice.client?.email;
    if (!API_KEY) {
      return Response.json(
        { error: "Missing RESEND_API_KEY" },
        { status: 500 },
      );
    }
    if (!dest) {
      return Response.json(
        { error: "Recipient email required" },
        { status: 400 },
      );
    }

    const resend = new Resend(API_KEY);

    const subject = `Facture #${invoice.number}`;
    const html = `Bonjour${invoice.client?.name ? ` ${invoice.client.name}` : ""},<br/><br/>Veuillez trouver ci-joint votre facture #${invoice.number}.<br/>Total: ${money(invoice.total, invoice.currency)}.<br/>${
      pdfUrl ? `Lien: <a href="${pdfUrl}">${pdfUrl}</a><br/>` : ""
    }Merci!`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: [dest],
      subject,
      html,
      attachments: [
        {
          filename: `Invoice-${invoice.number}.pdf`,
          content: pdfBuf.toString("base64"),
        },
      ],
    } as any);

    if (error) {
      return Response.json(
        { error: (error as any)?.message || String(error) },
        { status: 500 },
      );
    }

    // Update status to sent and optional pdf_url
    const idx = memDb.invoices.findIndex((i) => i.id === invoice.id);
    if (idx !== -1) {
      const updated: Invoice = {
        ...memDb.invoices[idx],
        status: "sent",
        pdf_url: pdfUrl || memDb.invoices[idx].pdf_url,
        updated_at: new Date().toISOString(),
      } as Invoice;
      memDb.invoices[idx] = updated;
    }

    return Response.json(
      withRelations(memDb.invoices.find((i) => i.id === invoice.id) || inv),
    );
  } catch (e: any) {
    return Response.json(
      { error: e?.message ?? "unexpected" },
      { status: 500 },
    );
  }
}
