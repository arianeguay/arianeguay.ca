"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Project, ProjectStatus, Invoice, Client } from "../../../../../types/database";
import {
  Container,
  Header,
  Title,
  Button,
  Secondary,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from "./styles";
import { theme } from "../../../../../theme";
import Link from "next/link";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("draft");
  const [budget, setBudget] = useState<string>("");
  const [currency, setCurrency] = useState("CAD");
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
        if (!res.ok) return;
        const data: Project = await res.json();
        if (!active) return;
        setProject(data);
        setName(data.name || "");
        setStatus(data.status);
        setBudget(typeof data.budget === "number" ? String(data.budget) : "");
        setCurrency(data.currency || "CAD");
        setDeadline(data.deadline || "");
        setDescription(data.description || "");
        setTags((data.tags || []).join(", "));
        setSelectedClientId((data as any).client_id || "");
      } finally {
        setLoading(false);
      }
    })();
    (async () => {
      try {
        const resp = await fetch(`/api/invoices?project_id=${id}`, { cache: "no-store" });
        if (resp.ok) {
          const data = await resp.json();
          if (active) setInvoices(Array.isArray(data) ? data : []);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/clients", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setClients(Array.isArray(data) ? data : []);
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    try {
      const payload: any = {
        name,
        status,
        currency,
        deadline: deadline || undefined,
        description: description || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const b = parseFloat(budget);
      if (!Number.isNaN(b)) payload.budget = b;

      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, client_id: selectedClientId || undefined }),
      });
      if (!res.ok) throw new Error("update failed");
      const updated: Project = await res.json();
      setProject(updated);
      setEditing(false);
      toast.success("Projet mis à jour");
    } catch (e) {
      toast.error("Échec de la mise à jour");
    }
  };

  const remove = async () => {
    if (!confirm("Supprimer ce projet ?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Projet supprimé");
      router.push("/projects");
    } else {
      toast.error("Suppression échouée");
    }
  };

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md }}>
          <Secondary onClick={() => router.push("/projects")}>
            <ArrowLeft /> Retour
          </Secondary>
          <Title>Projet</Title>
        </div>
        <div style={{ display: "flex", gap: theme.spacing.md }}>
          <Secondary onClick={() => setEditing((e) => !e)}>
            <Edit /> Modifier
          </Secondary>
          <Secondary
            onClick={remove}
            style={{ borderColor: theme.colors.status.error, color: theme.colors.status.error }}
          >
            <Trash2 /> Supprimer
          </Secondary>
        </div>
      </Header>

      {loading && (
        <p style={{ color: theme.colors.ink2, fontFamily: theme.font.family.body }}>Chargement…</p>
      )}

      {!loading && project && (
        <div style={{ display: "grid", gap: theme.spacing.lg }}>
          <FieldGroup>
            <FieldLabel>Client</FieldLabel>
            {editing ? (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
              >
                <option value="">Aucun</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : project?.client ? (
              <div style={{ fontFamily: theme.font.family.body }}>
                <Link href={`/clients/${project.client.id}`}>{project.client.name}</Link>
              </div>
            ) : (
              <div style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2 }}>Aucun</div>
            )}
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Nom</FieldLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
          </FieldGroup>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing.lg }}>
            <FieldGroup>
              <FieldLabel>Statut</FieldLabel>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                disabled={!editing}
                style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
              >
                <option value="draft">Brouillon</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Budget</FieldLabel>
              <Input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={!editing}
                type="number"
                step="0.01"
              />
            </FieldGroup>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing.lg }}>
            <FieldGroup>
              <FieldLabel>Devise</FieldLabel>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} disabled={!editing} />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Échéance</FieldLabel>
              <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} disabled={!editing} type="date" />
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel>Description</FieldLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editing} />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Tags (séparés par des virgules)</FieldLabel>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} disabled={!editing} />
          </FieldGroup>

          {editing && (
            <div>
              <Button onClick={save}>Enregistrer</Button>
            </div>
          )}

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
              Factures du projet
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
