"use client";

import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Client } from "../../../../types/database";
import {
  Container,
  Header,
  HeaderContent,
  Title,
  Subtitle,
  Button,
  SearchBar,
  SearchIcon,
  SearchInput,
  ClientsGrid,
  ClientCard,
  ClientHeader,
  ClientName,
  ClientCompany,
  ClientActions,
  IconButton,
  ClientInfo,
  InfoRow,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
} from "./styles";
import { theme } from "../../../../theme";

export default function ClientsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCompany, setEditCompany] = useState("");

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          company_name: newCompany,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setClients((prev) => [created, ...prev]);
        setShowForm(false);
        setNewName("");
        setNewEmail("");
        setNewCompany("");
        toast.success("Client ajouté");
      } else {
        toast.error("Erreur lors de la création");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== id));
        toast.success("Client supprimé");
      } else {
        toast.error("Suppression échouée");
      }
    } catch {}
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditName(client.name || "");
    setEditEmail(client.email || "");
    setEditCompany(client.company_name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const res = await fetch(`/api/clients/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, email: editEmail, company_name: editCompany }),
    });
    if (!res.ok) {
      toast.error("Échec de la mise à jour");
      return;
    }
    const updated = await res.json();
    setClients((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
    setEditingId(null);
    toast.success("Client mis à jour");
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Clients</Title>
          <Subtitle>Gérez vos clients et leurs informations</Subtitle>
        </HeaderContent>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus />
          Nouveau client
        </Button>
      </Header>

      {showForm && (
        <div
          style={{
            background: "white",
            padding: theme.spacing.xxl,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadows.sm,
            marginBottom: theme.spacing.xxl,
          }}
        >
          <form
            onSubmit={handleCreate}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: theme.spacing.lg,
            }}
          >
            <input
              type="text"
              placeholder="Nom"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              style={{
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              }}
            />
            <input
              type="email"
              placeholder="Email (optionnel)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              }}
            />
            <input
              type="text"
              placeholder="Entreprise (optionnel)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              style={{
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              }}
            />
            <Button type="submit" disabled={loading || !newName}>
              {loading ? "Ajout…" : "Ajouter"}
            </Button>
          </form>
        </div>
      )}

      <SearchBar>
        <SearchIcon>
          <Search />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      {filteredClients.length === 0 ? (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyTitle>Aucun client trouvé</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? "Essayez une autre recherche"
              : "Commencez par ajouter votre premier client"}
          </EmptyText>
          {!searchQuery && (
            <Button onClick={() => setShowForm(true)}>
              <Plus />
              Ajouter un client
            </Button>
          )}
        </EmptyState>
      ) : (
        <ClientsGrid>
          {filteredClients.map((client) => (
            <ClientCard key={client.id}>
              <ClientHeader>
                <div>
                  <ClientName>
                    <Link href={`/clients/${client.id}`}>{client.name}</Link>
                  </ClientName>
                  {client.company_name && (
                    <ClientCompany>{client.company_name}</ClientCompany>
                  )}
                </div>
                <ClientActions>
                  <IconButton title="Modifier" onClick={() => startEdit(client)}>
                    <Edit />
                  </IconButton>

                  <IconButton title="Supprimer" onClick={() => handleDelete(client.id)}>
                    <Trash2 />
                  </IconButton>
                </ClientActions>
              </ClientHeader>

              {editingId === client.id ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto auto",
                    gap: theme.spacing.md,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nom"
                    style={{
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.radius.md,
                      padding: theme.spacing.md,
                    }}
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.radius.md,
                      padding: theme.spacing.md,
                    }}
                  />
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="Entreprise"
                    style={{
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.radius.md,
                      padding: theme.spacing.md,
                    }}
                  />
                  <Button onClick={saveEdit}>Enregistrer</Button>
                  <Button onClick={cancelEdit} style={{ background: theme.colors.bg, color: theme.colors.ink1 }}>
                    Annuler
                  </Button>
                </div>
              ) : null}

              <ClientInfo>
                {client.email && (
                  <InfoRow>
                    <strong>Email:</strong> {client.email}
                  </InfoRow>
                )}
                {client.phone && (
                  <InfoRow>
                    <strong>Tél:</strong> {client.phone}
                  </InfoRow>
                )}
                {client.tax_number_tps && (
                  <InfoRow>
                    <strong>TPS:</strong> {client.tax_number_tps}
                  </InfoRow>
                )}
              </ClientInfo>
            </ClientCard>
          ))}
        </ClientsGrid>
      )}
    </Container>
  );
}
