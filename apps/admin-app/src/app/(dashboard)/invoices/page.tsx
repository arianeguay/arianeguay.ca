"use client";

import { Download, FileText, Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "../../../theme";
import type { Invoice, InvoiceStatus, Client, Project } from "../../../types/database";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const Container = styled.div`
  max-width: 1400px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xxxl};
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 44px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
`;

const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xxl};
  background: ${theme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-family: ${theme.font.family.body};
  font-size: 15px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: background ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.brand.primaryAlt};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatusFilters = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xxl};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${(props) =>
    props.$active ? theme.colors.brand.primary : "white"};
  color: ${(props) => (props.$active ? "white" : theme.colors.ink1)};
  border: 2px solid
    ${(props) =>
      props.$active ? theme.colors.brand.primary : theme.colors.border};
  border-radius: ${theme.radius.pill};
  font-family: ${theme.font.family.body};
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    border-color: ${theme.colors.brand.primary};
  }
`;

const InvoicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InvoiceCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}px) {
    flex-direction: column;
  }
`;

const InvoiceNumber = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.bold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const ClientName = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink2};
`;

const InvoiceActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const StatusBadge = styled.span<{ $status: InvoiceStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.pill};
  font-size: 13px;
  font-weight: ${theme.font.weight.medium};
  background: ${(props) => {
    switch (props.$status) {
      case "paid":
        return theme.colors.status.success;
      case "sent":
      case "viewed":
        return theme.colors.status.info;
      case "overdue":
        return theme.colors.status.error;
      case "partially_paid":
        return theme.colors.status.warning;
      default:
        return theme.colors.border;
    }
  }};
  color: white;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.ink2};
  cursor: pointer;
  transition: all ${theme.motion.fast};

  &:hover {
    background: ${theme.colors.bg};
    border-color: ${theme.colors.brand.primary};
    color: ${theme.colors.brand.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const InvoiceMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.lg};
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const MetaLabel = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 12px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.ink2};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.ink1};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxxxxl} ${theme.spacing.xxl};
  background: white;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.xl};
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.md};
`;

const EmptyText = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 16px;
  color: ${theme.colors.ink2};
  margin-bottom: ${theme.spacing.xl};
`;

const statusLabels: Record<InvoiceStatus | "all", string> = {
  all: "Toutes",
  draft: "Brouillon",
  sent: "Envoyée",
  viewed: "Vue",
  partially_paid: "Partiellement payée",
  paid: "Payée",
  overdue: "En retard",
  cancelled: "Annulée",
};

export default function InvoicesPage() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all",
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newStatus, setNewStatus] = useState<InvoiceStatus>("draft");
  const [newItems, setNewItems] = useState<Array<{ desc: string; qty: string; unitPrice: string }>>([
    { desc: "", qty: "1", unitPrice: "0" },
  ]);
  const [creating, setCreating] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newClientId, setNewClientId] = useState<string>("");
  const [newProjectId, setNewProjectId] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/invoices", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setInvoices(Array.isArray(data) ? data : []);
      } catch {}
    })();
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch("/api/clients", { cache: "no-store" }),
          fetch("/api/projects", { cache: "no-store" }),
        ]);
        if (cRes.ok) {
          const cs = await cRes.json();
          if (active) setClients(Array.isArray(cs) ? cs : []);
        }
        if (pRes.ok) {
          const ps = await pRes.json();
          if (active) setProjects(Array.isArray(ps) ? ps : []);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);

  // Prefill form from URL (?project_id=...&client_id=...)
  useEffect(() => {
    const pid = searchParams.get("project_id");
    const cid = searchParams.get("client_id");
    if (pid || cid) {
      setShowForm(true);
      if (cid) setNewClientId(cid);
      if (pid) setNewProjectId(pid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = newItems
      .map((it) => ({ desc: it.desc.trim(), qty: parseFloat(it.qty), unitPrice: parseFloat(it.unitPrice) }))
      .filter((it) => it.desc.length > 0 && !Number.isNaN(it.qty) && !Number.isNaN(it.unitPrice));
    if (!newNumber || validItems.length === 0) {
      toast.error("Numéro et au moins 1 item requis");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: newNumber,
          status: newStatus,
          items: validItems.map((it) => ({ ...it, qty: Number(it.qty), unitPrice: Number(it.unitPrice) })),
          currency: "CAD",
          client_id: newClientId || undefined,
          project_id: newProjectId || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setInvoices((prev) => [created, ...prev]);
        setShowForm(false);
        setNewNumber("");
        setNewStatus("draft");
        setNewItems([{ desc: "", qty: "1", unitPrice: "0" }]);
        setNewClientId("");
        setNewProjectId("");
        toast.success("Facture créée");
      } else {
        toast.error("Création échouée");
      }
    } finally {
      setCreating(false);
    }
  };

  const addItemRow = () => {
    setNewItems((rows) => [...rows, { desc: "", qty: "1", unitPrice: "0" }]);
  };

  const removeItemRow = (idx: number) => {
    setNewItems((rows) => rows.filter((_, i) => i !== idx));
  };

  const updateItemRow = (idx: number, key: "desc" | "qty" | "unitPrice", value: string) => {
    setNewItems((rows) => rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

  const handleUpdateStatus = async (id: string, status: InvoiceStatus) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("bad");
      const updated = await res.json();
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Échec de la mise à jour du statut");
    }
  };

  const handleSend = async (inv: Invoice) => {
    let to = inv.client?.email;
    if (!to) {
      const promptEmail = window.prompt("Adresse email du client ?");
      if (!promptEmail) return;
      to = promptEmail;
    }
    try {
      const res = await fetch(`/api/invoices/${inv.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      if (!res.ok) throw new Error("send failed");
      const updated = await res.json();
      setInvoices((prev) => prev.map((i) => (i.id === inv.id ? updated : i)));
      toast.success("Facture envoyée");
    } catch {
      toast.error("Échec de l'envoi");
    }
  };

  const filteredInvoices =
    statusFilter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Factures</Title>
          <Subtitle>Créez et gérez vos factures</Subtitle>
        </HeaderContent>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus />
          Nouvelle facture
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
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.lg,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: theme.spacing.lg }}>
              <input
                type="text"
                placeholder="Numéro"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                required
                style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
              />
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
                style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
              >
                {(["draft", "sent", "paid", "overdue"] as const).map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
              <select
                value={newClientId}
                onChange={(e) => {
                  setNewClientId(e.target.value);
                  // reset project if the selected project doesn't belong to client
                  const proj = projects.find((p) => p.id === newProjectId);
                  if (proj && proj.client_id && e.target.value && proj.client_id !== e.target.value) setNewProjectId("");
                }}
                style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
              >
                <option value="">Client (optionnel)</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
              >
                <option value="">Projet (optionnel)</option>
                {projects
                  .filter((p) => (newClientId ? p.client_id === newClientId : true))
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>
            </div>

            <div style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2, fontSize: 14 }}>
              Lignes
            </div>
            {newItems.map((row, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: theme.spacing.lg }}>
                <input
                  type="text"
                  placeholder="Description"
                  value={row.desc}
                  onChange={(e) => updateItemRow(idx, "desc", e.target.value)}
                  style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Qté"
                  value={row.qty}
                  onChange={(e) => updateItemRow(idx, "qty", e.target.value)}
                  style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prix"
                  value={row.unitPrice}
                  onChange={(e) => updateItemRow(idx, "unitPrice", e.target.value)}
                  style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.md }}
                />
                <Button type="button" onClick={() => removeItemRow(idx)}>
                  Supprimer
                </Button>
              </div>
            ))}
            <div>
              <Button type="button" onClick={addItemRow}>Ajouter une ligne</Button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: theme.spacing.md, alignItems: "center" }}>
              <div style={{ color: theme.colors.ink2, fontFamily: theme.font.family.body }}>
                Aperçu des totaux (TPS + TVQ)
              </div>
              <div style={{ textAlign: "right", fontFamily: theme.font.family.body, fontWeight: 600 }}>
                {(() => {
                  const subtotal = newItems.reduce((sum, it) => {
                    const q = parseFloat(it.qty);
                    const p = parseFloat(it.unitPrice);
                    if (Number.isNaN(q) || Number.isNaN(p)) return sum;
                    return sum + q * p;
                  }, 0);
                  const tax_tps = +(subtotal * 0.05).toFixed(2);
                  const tax_tvq = +(subtotal * 0.09975).toFixed(2);
                  const total = +(subtotal + tax_tps + tax_tvq).toFixed(2);
                  return new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" }).format(total);
                })()}
              </div>
            </div>

            <div>
              <Button type="submit" disabled={creating || !newNumber}>
                {creating ? "Création…" : "Créer"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <StatusFilters>
        {(["all", "draft", "sent", "paid", "overdue"] as const).map(
          (status) => (
            <FilterButton
              key={status}
              $active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabels[status]}
            </FilterButton>
          ),
        )}
      </StatusFilters>

      {filteredInvoices.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FileText size={64} color={theme.colors.ink2} />
          </EmptyIcon>
          <EmptyTitle>Aucune facture trouvée</EmptyTitle>
          <EmptyText>
            {statusFilter === "all"
              ? "Commencez par créer votre première facture"
              : `Aucune facture avec le statut "${statusLabels[statusFilter]}"`}
          </EmptyText>
          {statusFilter === "all" && (
            <Button>
              <Plus />
              Créer une facture
            </Button>
          )}
        </EmptyState>
      ) : (
        <InvoicesList>
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id}>
              <InvoiceHeader>
                <div>
                  <InvoiceNumber>Facture #{invoice.number}</InvoiceNumber>
                  {invoice.client && (
                    <ClientName>{invoice.client.name}</ClientName>
                  )}
                  {invoice.project && (
                    <div style={{ fontFamily: theme.font.family.body, fontSize: 13, color: theme.colors.ink2 }}>
                      Projet: {invoice.project.name}
                    </div>
                  )}
                </div>
                <InvoiceActions>
                  <StatusBadge $status={invoice.status}>
                    {statusLabels[invoice.status]}
                  </StatusBadge>
                  <select
                    value={invoice.status}
                    onChange={(e) => handleUpdateStatus(invoice.id, e.target.value as InvoiceStatus)}
                    style={{ border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, padding: 6 }}
                  >
                    {(["draft", "sent", "paid", "overdue"] as const).map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                  <IconButton
                    title="Télécharger PDF"
                    onClick={() =>
                      window.open(`/api/invoices/${invoice.id}/pdf`, "_blank")
                    }
                  >
                    <Download />
                  </IconButton>
                  <IconButton title="Envoyer" onClick={() => handleSend(invoice)}>
                    <Send />
                  </IconButton>
                </InvoiceActions>
              </InvoiceHeader>

              <InvoiceMeta>
                <MetaItem>
                  <MetaLabel>Date d'émission</MetaLabel>
                  <MetaValue>
                    {new Date(invoice.issue_date).toLocaleDateString("fr-CA")}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Date d'échéance</MetaLabel>
                  <MetaValue>
                    {new Date(invoice.due_date).toLocaleDateString("fr-CA")}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Sous-total</MetaLabel>
                  <MetaValue>
                    {new Intl.NumberFormat("fr-CA", {
                      style: "currency",
                      currency: invoice.currency,
                    }).format(invoice.subtotal)}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Total (TPS + TVQ)</MetaLabel>
                  <MetaValue>
                    {new Intl.NumberFormat("fr-CA", {
                      style: "currency",
                      currency: invoice.currency,
                    }).format(invoice.total)}
                  </MetaValue>
                </MetaItem>
              </InvoiceMeta>
            </InvoiceCard>
          ))}
        </InvoicesList>
      )}
    </Container>
  );
}
