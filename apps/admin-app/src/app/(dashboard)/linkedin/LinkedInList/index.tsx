"use client";

import { Copy, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { LinkedInPost } from "../../../../types/database";
import { theme } from "../../../../theme";
import {
  Container,
  Header,
  Title,
  Tabs,
  Tab,
  Card,
  SectionTitle,
  Form,
  Label,
  Input,
  TextArea,
  Button,
  SecondaryButton,
  ToneSelector,
  ToneButton,
  CommentBox,
  CommentText,
  CommentActions,
  IconButton,
} from "./styles";

interface Props { initialPosts?: LinkedInPost[] }

export default function LinkedInList({ initialPosts }: Props) {
  const [activeTab, setActiveTab] = useState<"posts" | "generate">("posts");
  const [postUrl, setPostUrl] = useState("");
  const [postSnippet, setPostSnippet] = useState("");
  const [selectedTone, setSelectedTone] = useState<
    "professional" | "friendly" | "playful"
  >("professional");
  const [generatedComments, setGeneratedComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<LinkedInPost[]>(initialPosts ?? []);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "queued" | "commented" | "skipped"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let active = true;
    if (!initialPosts || statusFilter !== "all" || page !== 1) {
      (async () => {
        try {
          setLoadingPosts(true);
          const qs = new URLSearchParams();
          if (statusFilter !== "all") qs.set("status", statusFilter);
          qs.set("page", String(page));
          qs.set("page_size", String(pageSize));
          const res = await fetch(`/api/linkedin/posts?${qs.toString()}`, { cache: "no-store" });
          if (!res.ok) return;
          const data = await res.json();
          if (active) {
            setPosts(Array.isArray(data) ? data : []);
            setHasNext(Array.isArray(data) && data.length === pageSize);
          }
        } finally {
          setLoadingPosts(false);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [initialPosts, statusFilter, page]);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/linkedin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: postUrl, snippet: postSnippet }),
      });
      if (res.ok) {
        const created: LinkedInPost = await res.json();
        setPosts((prev) => [created, ...prev]);
        toast.success("Post enregistré");
      }
    } catch {}
    finally {
      setPostUrl("");
      setPostSnippet("");
    }
  };

  const updatePostStatus = async (
    id: string,
    status: "new" | "queued" | "commented" | "skipped",
  ) => {
    try {
      const res = await fetch(`/api/linkedin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Request failed");
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      toast.success(
        status === "queued"
          ? "Ajouté à la file"
          : status === "commented"
          ? "Marqué commenté"
          : status === "skipped"
          ? "Ignoré"
          : "Statut mis à jour",
      );
    } catch {
      toast.error("Échec de la mise à jour du statut");
    }
  };

  const handleGenerateComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/linkedin/generate-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone: selectedTone, snippet: postSnippet }),
      });
      const data = await res.json();
      if (Array.isArray(data?.comments)) setGeneratedComments(data.comments);
    } catch {
      // fallback handled server-side already
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container>
      <Header>
        <Title>LinkedIn Assistant</Title>
      </Header>

      <Tabs>
        <Tab $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
          Mes posts
        </Tab>
        <Tab $active={activeTab === "generate"} onClick={() => setActiveTab("generate")}>
          Générer des commentaires
        </Tab>
      </Tabs>

      {activeTab === "posts" && (
        <>
          <Card>
            <SectionTitle>Ajouter un post LinkedIn</SectionTitle>
            <Form onSubmit={handleAddPost}>
              <div>
                <Label htmlFor="url">URL du post</Label>
                <Input
                  id="url"
                  type="url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/posts/..."
                />
              </div>

              <div>
                <Label htmlFor="snippet">Extrait du post (optionnel)</Label>
                <TextArea
                  id="snippet"
                  value={postSnippet}
                  onChange={(e) => setPostSnippet(e.target.value)}
                  placeholder="Collez un extrait du contenu du post..."
                />
              </div>

              <Button type="submit">
                <Plus />
                Ajouter le post
              </Button>
            </Form>
          </Card>

          <Card>
            <SectionTitle>Mes posts enregistrés</SectionTitle>
            <div style={{ display: "flex", gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <label style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2, display: "flex", alignItems: "center", gap: 8 }}>
                Statut
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{ border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.md, padding: theme.spacing.sm }}
                >
                  <option value="all">Tous</option>
                  <option value="new">Nouveau</option>
                  <option value="queued">File d'attente</option>
                  <option value="commented">Commenté</option>
                  <option value="skipped">Ignoré</option>
                </select>
              </label>
            </div>
            {loadingPosts && (
              <p style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2 }}>Chargement…</p>
            )}
            {!loadingPosts && posts.length === 0 && (
              <p style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2 }}>Aucun post enregistré.</p>
            )}
            {!loadingPosts && posts.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
                {posts
                  .filter((p) => (statusFilter === "all" ? true : (p.status || "new") === statusFilter))
                  .map((p) => (
                    <div key={p.id} style={{ padding: theme.spacing.lg, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md }}>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: theme.colors.brand.primary, textDecoration: "underline" }}
                        >
                          {p.url}
                        </a>
                      )}
                      {p.snippet && (
                        <p style={{ marginTop: theme.spacing.sm, color: theme.colors.ink2, whiteSpace: "pre-wrap" }}>
                          {p.snippet}
                        </p>
                      )}
                      <p style={{ marginTop: theme.spacing.sm, color: theme.colors.ink1, fontSize: 12 }}>
                        Ajouté le {new Date(p.created_at).toLocaleString("fr-CA")}
                      </p>

                      <div style={{ display: "flex", gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                        <SecondaryButton onClick={() => updatePostStatus(p.id, "queued")} disabled={p.status === "queued"}>
                          Ajouter à la file
                        </SecondaryButton>
                        <SecondaryButton onClick={() => updatePostStatus(p.id, "commented")} disabled={p.status === "commented"}>
                          Marquer commenté
                        </SecondaryButton>
                        <SecondaryButton onClick={() => updatePostStatus(p.id, "skipped")} disabled={p.status === "skipped"}>
                          Ignorer
                        </SecondaryButton>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: theme.spacing.xl }}>
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Page précédente
            </Button>
            <div style={{ fontFamily: theme.font.family.body, color: theme.colors.ink2 }}>Page {page}</div>
            <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
              Page suivante
            </Button>
          </div>
        </>
      )}

      {activeTab === "generate" && (
        <>
          <Card>
            <SectionTitle>Générer des commentaires</SectionTitle>

            <div style={{ marginBottom: theme.spacing.xl }}>
              <Label>Ton</Label>
              <ToneSelector>
                <ToneButton $active={selectedTone === "professional"} onClick={() => setSelectedTone("professional")}>
                  Professionnel
                </ToneButton>
                <ToneButton $active={selectedTone === "friendly"} onClick={() => setSelectedTone("friendly")}>
                  Amical
                </ToneButton>
                <ToneButton $active={selectedTone === "playful"} onClick={() => setSelectedTone("playful")}>
                  Enjoué
                </ToneButton>
              </ToneSelector>
            </div>

            <Button onClick={handleGenerateComments} disabled={loading}>
              {loading ? (
                "Génération en cours..."
              ) : (
                <>
                  <RefreshCw />
                  Générer 3 commentaires
                </>
              )}
            </Button>
          </Card>

          {generatedComments.length > 0 && (
            <Card>
              <SectionTitle>Commentaires générés</SectionTitle>
              {generatedComments.map((comment, index) => (
                <CommentBox key={index}>
                  <CommentText>{comment}</CommentText>
                  <CommentActions>
                    <IconButton onClick={() => handleCopy(comment)}>
                      <Copy />
                      Copier
                    </IconButton>
                  </CommentActions>
                </CommentBox>
              ))}
              <SecondaryButton onClick={handleGenerateComments} disabled={loading}>
                <RefreshCw />
                Régénérer
              </SecondaryButton>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
