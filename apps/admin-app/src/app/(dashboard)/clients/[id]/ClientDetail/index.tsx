"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Client } from "../../../../../types/database";
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
        </div>
      )}
    </Container>
  );
}
