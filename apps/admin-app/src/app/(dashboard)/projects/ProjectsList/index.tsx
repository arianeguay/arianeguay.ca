"use client";

import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Project, ProjectStatus, Client } from "../../../../types/database";
import {
  Container,
  Header,
  HeaderContent,
  Title,
  Subtitle,
  Button,
  StatusFilters,
  FilterButton,
  List as ProjectsListWrapper,
  ProjectCard,
  ProjectHeader,
  ProjectTitle,
  ProjectClient,
  StatusBadge,
  ProjectMeta,
  MetaItem,
  MetaLabel,
  MetaValue,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
} from "./styles";
import { theme } from "../../../../theme";

const statusLabels: Record<ProjectStatus | "all", string> = {
  all: "Tous",
  draft: "Brouillon",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export default function ProjectsList() {
  const searchParams = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState<ProjectStatus>("draft");
  const [newBudget, setNewBudget] = useState("");
  const [creating, setCreating] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientId, setNewClientId] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setProjects(Array.isArray(data) ? data : []);
      } catch {}
    })();
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

  // Prefill form from URL (?client_id=...)
  useEffect(() => {
    const cid = searchParams.get("client_id");
    if (cid) {
      setShowForm(true);
      setNewClientId(cid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setCreating(true);
    try {
      const payload: any = {
        name: newName,
        status: newStatus,
        currency: "CAD",
      };
      const b = parseFloat(newBudget);
      if (!Number.isNaN(b)) payload.budget = b;
      if (newClientId) payload.client_id = newClientId;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setProjects((prev) => [created, ...prev]);
        setShowForm(false);
        setNewName("");
        setNewStatus("draft");
        setNewBudget("");
      }
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects =
    statusFilter === "all"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Projets</Title>
          <Subtitle>Gérez vos projets et suivez leur progression</Subtitle>
        </HeaderContent>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus />
          Nouveau projet
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
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
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
            <select
              value={newClientId}
              onChange={(e) => setNewClientId(e.target.value)}
              style={{
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              }}
            >
              <option value="">Client (optionnel)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
              style={{
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              }}
            >
              <option value="draft">Brouillon</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Budget (optionnel)"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              style={{
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              }}
            />
            <Button type="submit" disabled={creating || !newName}>
              {creating ? "Création…" : "Créer"}
            </Button>
          </form>
        </div>
      )}

      <StatusFilters>
        {(
          ["all", "draft", "in_progress", "completed", "cancelled"] as const
        ).map((status) => (
          <FilterButton
            key={status}
            $active={statusFilter === status}
            onClick={() => setStatusFilter(status)}
          >
            {statusLabels[status]}
          </FilterButton>
        ))}
      </StatusFilters>

      {filteredProjects.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FolderKanban size={64} color={theme.colors.ink2} />
          </EmptyIcon>
          <EmptyTitle>Aucun projet trouvé</EmptyTitle>
          <EmptyText>
            {statusFilter === "all"
              ? "Commencez par créer votre premier projet"
              : `Aucun projet avec le statut "${statusLabels[statusFilter]}"`}
          </EmptyText>
          {statusFilter === "all" && (
            <Button onClick={() => setShowForm(true)}>
              <Plus />
              Créer un projet
            </Button>
          )}
        </EmptyState>
      ) : (
        <ProjectsListWrapper>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <div>
                  <ProjectTitle>
                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                  </ProjectTitle>
                  {project.client && (
                    <ProjectClient>
                      <Link href={`/clients/${project.client.id}`}>{project.client.name}</Link>
                    </ProjectClient>
                  )}
                </div>
                <StatusBadge $status={project.status}>
                  {statusLabels[project.status]}
                </StatusBadge>
              </ProjectHeader>

              {project.description && (
                <p
                  style={{
                    fontFamily: theme.font.family.body,
                    fontSize: "15px",
                    color: theme.colors.ink2,
                    marginBottom: theme.spacing.lg,
                    lineHeight: "1.6",
                  }}
                >
                  {project.description}
                </p>
              )}

              <ProjectMeta>
                {project.budget && (
                  <MetaItem>
                    <MetaLabel>Budget</MetaLabel>
                    <MetaValue>
                      {new Intl.NumberFormat("fr-CA", {
                        style: "currency",
                        currency: project.currency,
                      }).format(project.budget)}
                    </MetaValue>
                  </MetaItem>
                )}
                {project.deadline && (
                  <MetaItem>
                    <MetaLabel>Échéance</MetaLabel>
                    <MetaValue>
                      {new Date(project.deadline).toLocaleDateString("fr-CA")}
                    </MetaValue>
                  </MetaItem>
                )}
                {project.tags && project.tags.length > 0 && (
                  <MetaItem>
                    <MetaLabel>Tags</MetaLabel>
                    <MetaValue>{project.tags.join(", ")}</MetaValue>
                  </MetaItem>
                )}
              </ProjectMeta>
            </ProjectCard>
          ))}
        </ProjectsListWrapper>
      )}
    </Container>
  );
}
