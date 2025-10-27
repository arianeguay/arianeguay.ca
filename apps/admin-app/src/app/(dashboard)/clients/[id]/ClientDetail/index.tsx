"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Client, Project, Invoice } from "../../../../../types/database";
import Link from "next/link";
import { theme } from "../../../../../theme";
import {
  Container,
  Header,
  Title,
  Button,
  Secondary,
  FieldGroup,
  FieldLabel,
  Input,
} from "./styles";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/clients/${id}`, { cache: "no-store" });
        if (!res.ok) return;
        const data: Client = await res.json();
        if (!active) return;
        setClient(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setCompany(data.company_name || "");
      } finally {
        setLoading(false);
      }
    })();
    (async () => {
      try {
        const [pr, ir] = await Promise.all([
          fetch(`/api/projects?client_id=${id}`, { cache: "no-store" }),
          fetch(`/api/invoices?client_id=${id}`, { cache: "no-store" }),
        ]);
        if (pr.ok) {
          const pjs = await pr.json();
          if (active) setProjects(Array.isArray(pjs) ? pjs : []);
        }
        if (ir.ok) {
          const invs = await ir.json();
          if (active) setInvoices(Array.isArray(invs) ? invs : []);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const save = async () => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company_name: company }),
      });
      if (!res.ok) throw new Error("update failed");
      const updated: Client = await res.json();
      setClient(updated);
      setEditing(false);
      toast.success("Client mis à jour");
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  const remove = async () => {
    if (!confirm("Supprimer ce client ?")) return;
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Client supprimé");
      router.push("/clients");
    } else {
      toast.error("Suppression échouée");
    }
  };

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md }}>
          <Secondary onClick={() => router.push("/clients")}> 
            <ArrowLeft /> Retour
          </Secondary>
          <Title>Client</Title>
        </div>
        <div style={{ display: "flex", gap: theme.spacing.md }}>
          <Secondary onClick={() => router.push(`/projects?client_id=${id}`)}>Nouveau projet</Secondary>
          <Secondary onClick={() => router.push(`/invoices?client_id=${id}`)}>Nouvelle facture</Secondary>
          <Secondary onClick={() => setEditing((e) => !e)}><Edit /> Modifier</Secondary>
          <Secondary onClick={remove} style={{ borderColor: theme.colors.status.error, color: theme.colors.status.error }}>
            <Trash2 /> Supprimer
          </Secondary>
        </div>
      </Header>

      {loading && <p style={{ color: theme.colors.ink2, fontFamily: theme.font.family.body }}>Chargement…</p>}
      {!loading && client && (
        <div style={{ display: "grid", gap: theme.spacing.lg }}>
          <FieldGroup>
            <FieldLabel>Nom</FieldLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Entreprise</FieldLabel>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} disabled={!editing} />
          </FieldGroup>

          {editing && (
            <div>
              <Button onClick={save}>Enregistrer</Button>
            </div>
          )}

          {/* Related projects */}
          <div style={{ marginTop: theme.spacing.xxl }}>
            <h3
              style={{
                fontFamily: theme.font.family.display,
                fontSize: 20,
                marginBottom: theme.spacing.md,
                color: theme.colors.ink1,
              }}
            >
              Projets
            </h3>
            {projects.length === 0 ? (
              <p style={{ color: theme.colors.ink2, fontFamily: theme.font.family.body }}>Aucun projet</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: theme.spacing.lg }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ background: "white", borderRadius: theme.radius.lg, boxShadow: theme.shadows.sm, padding: theme.spacing.xl }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: theme.spacing.sm }}>
                      <div>
                        <div style={{ fontFamily: theme.font.family.display, fontWeight: 600 }}>
                          <Link href={`/projects/${p.id}`}>{p.name}</Link>
                        </div>
                        <div style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2, fontSize: 13 }}>{p.description}</div>
                      </div>
                      <span style={{ background: theme.colors.border, color: theme.colors.ink1, fontSize: 12, padding: "4px 10px", borderRadius: 999 }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontFamily: theme.font.family.body, fontSize: 14, color: theme.colors.ink2 }}>
                      {p.budget ? new Intl.NumberFormat("fr-CA", { style: "currency", currency: p.currency }).format(p.budget) : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related invoices */}
          <div style={{ marginTop: theme.spacing.xxl }}>
            <h3
              style={{
                fontFamily: theme.font.family.display,
                fontSize: 20,
                marginBottom: theme.spacing.md,
                color: theme.colors.ink1,
              }}
            >
              Factures
            </h3>
            {invoices.length === 0 ? (
              <p style={{ color: theme.colors.ink2, fontFamily: theme.font.family.body }}>Aucune facture</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: theme.spacing.lg }}>
                {invoices.map((inv) => (
                  <div key={inv.id} style={{ background: "white", borderRadius: theme.radius.lg, boxShadow: theme.shadows.sm, padding: theme.spacing.xl }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: theme.spacing.sm }}>
                      <div style={{ fontFamily: theme.font.family.display, fontWeight: 600 }}>Facture #{inv.number}</div>
                      <span style={{ background: theme.colors.border, color: theme.colors.ink1, fontSize: 12, padding: "4px 10px", borderRadius: 999 }}>
                        {inv.status}
                      </span>
                    </div>
                    {inv.project && (
                      <div style={{ fontFamily: theme.font.family.body, fontSize: 13, color: theme.colors.ink2, marginBottom: theme.spacing.xs }}>
                        Projet: {inv.project.name}
                      </div>
                    )}
                    <div style={{ fontFamily: theme.font.family.body, fontSize: 14, color: theme.colors.ink1, fontWeight: 600 }}>
                      {new Intl.NumberFormat("fr-CA", { style: "currency", currency: inv.currency }).format(inv.total)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
