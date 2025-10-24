"use client";

import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "../../../theme";
import type { Project, ProjectStatus } from "../../../types/database";
import Link from "next/link";

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

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ProjectCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xxl};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow ${theme.motion.fast};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}px) {
    flex-direction: column;
  }
`;

const ProjectTitle = styled.h3`
  font-family: ${theme.font.family.display};
  font-weight: ${theme.font.weight.semibold};
  font-size: 20px;
  color: ${theme.colors.ink1};
  margin-bottom: ${theme.spacing.xs};
`;

const ProjectClient = styled.p`
  font-family: ${theme.font.family.body};
  font-size: 14px;
  color: ${theme.colors.ink2};
`;

const StatusBadge = styled.span<{ $status: ProjectStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.pill};
  font-size: 13px;
  font-weight: ${theme.font.weight.medium};
  background: ${(props) => {
    switch (props.$status) {
      case "in_progress":
        return theme.colors.status.info;
      case "completed":
        return theme.colors.status.success;
      case "cancelled":
        return theme.colors.status.error;
      default:
        return theme.colors.border;
    }
  }};
  color: white;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: ${theme.spacing.xxl};
  flex-wrap: wrap;
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

const statusLabels: Record<ProjectStatus | "all", string> = {
  all: "Tous",
  draft: "Brouillon",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState<ProjectStatus>("draft");
  const [newBudget, setNewBudget] = useState("");
  const [creating, setCreating] = useState(false);

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
    return () => {
      active = false;
    };
  }, []);

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
              gridTemplateColumns: "2fr 1fr 1fr auto",
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
        <ProjectsList>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <div>
                  <ProjectTitle>
                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                  </ProjectTitle>
                  {project.client && (
                    <ProjectClient>{project.client.name}</ProjectClient>
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
        </ProjectsList>
      )}
    </Container>
  );
}
