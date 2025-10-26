import Link from "next/link";
import { FileText, Linkedin, TrendingUp, Users } from "lucide-react";
import { memDb } from "../../../lib/db/memory";
import { getServiceSupabase } from "../../../lib/db/supabase";
import { theme } from "../../../theme";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  IconWrapper,
  Value,
  Change,
  QuickActions,
  SectionTitle,
  ActionGrid,
  ActionButton,
  ActivitySection,
  ActivityCard,
  ActivityItem,
  ActivityIcon,
  ActivityContent,
  ActivityText,
  ActivityTime,
  SmallLink,
} from "../../../components/dashboard/styles";

export default async function DashboardPage() {
  const supabase = getServiceSupabase();
  let activeProjects = 0;
  let clientsCount = 0;
  let pendingInvoices = 0;
  let postsThisWeek = 0;
  const oneWeekAgoIso = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  if (supabase) {
    const [pRes, cRes, iRes, lRes] = await Promise.all([
      supabase.from("projects").select("id").eq("status", "in_progress"),
      supabase.from("clients").select("id"),
      supabase.from("invoices").select("id").in("status", ["sent", "overdue"]),
      supabase
        .from("linkedin_posts")
        .select("id, created_at")
        .gte("created_at", oneWeekAgoIso),
    ]);
    activeProjects = Array.isArray(pRes.data) ? pRes.data.length : 0;
    clientsCount = Array.isArray(cRes.data) ? cRes.data.length : 0;
    pendingInvoices = Array.isArray(iRes.data) ? iRes.data.length : 0;
    postsThisWeek = Array.isArray(lRes.data) ? lRes.data.length : 0;
  } else {
    activeProjects = memDb.projects.filter(
      (p) => p.status === "in_progress",
    ).length;
    clientsCount = memDb.clients.length;
    pendingInvoices = memDb.invoices.filter((i) =>
      ["sent", "overdue"].includes(i.status as any),
    ).length;
    postsThisWeek = memDb.linkedin_posts.filter(
      (p) => new Date(p.created_at) >= new Date(oneWeekAgoIso),
    ).length;
  }

  const stats = [
    {
      title: "Projets actifs",
      value: String(activeProjects),
      change: "",
      positive: true,
      icon: TrendingUp,
      color: theme.colors.status.success,
    },
    {
      title: "Clients",
      value: String(clientsCount),
      change: "",
      positive: true,
      icon: Users,
      color: theme.colors.status.info,
    },
    {
      title: "Factures en attente",
      value: String(pendingInvoices),
      change: "",
      positive: false,
      icon: FileText,
      color: theme.colors.status.warning,
    },
    {
      title: "Posts LinkedIn (semaine)",
      value: String(postsThisWeek),
      change: "Objectif: 7",
      positive: true,
      icon: Linkedin,
      color: theme.colors.brand.primary,
    },
  ];

  const statLinks = [
    "/projects",
    "/clients",
    "/invoices",
    "/linkedin",
  ];

  const quickActions = [
    { label: "Générer un post LinkedIn", href: "/linkedin" },
    { label: "Créer une facture", href: "/invoices" },
    { label: "Nouveau client", href: "/clients" },
    { label: "Nouveau projet", href: "/projects" },
    { label: "Commentaires suggérés", href: "/linkedin" },
  ];

  // Recent activities: combine latest items across invoices, projects, and linkedin posts
  let activities: { text: string; time: string; ts: string; href: string }[] = [];
  if (supabase) {
    const [ri, rp, rl] = await Promise.all([
      supabase
        .from("invoices")
        .select("id, number, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("projects")
        .select("id, name, status, updated_at, created_at")
        .order("updated_at", { ascending: false })
        .limit(3),
      supabase
        .from("linkedin_posts")
        .select("id, url, created_at")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);
    activities = [
      ...(ri.data ?? []).map((i: any) => ({
        text: `Facture #${i.number} créée`,
        time: new Date(i.created_at).toLocaleString("fr-CA"),
        ts: i.created_at,
        href: "/invoices",
      })),
      ...(rp.data ?? []).map((p: any) => ({
        text: `Projet "${p.name}" mis à jour (${p.status})`,
        time: new Date(p.updated_at || p.created_at).toLocaleString("fr-CA"),
        ts: p.updated_at || p.created_at,
        href: `/projects/${p.id}`,
      })),
      ...(rl.data ?? []).map((l: any) => ({
        text: `Post LinkedIn ajouté`,
        time: new Date(l.created_at).toLocaleString("fr-CA"),
        ts: l.created_at,
        href: "/linkedin",
      })),
    ];
  } else {
    activities = [
      ...memDb.invoices
        .slice()
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 3)
        .map((i) => ({
          text: `Facture #${i.number} créée`,
          time: new Date(i.created_at).toLocaleString("fr-CA"),
          ts: i.created_at,
          href: "/invoices",
        })),
      ...memDb.projects
        .slice()
        .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
        .slice(0, 3)
        .map((p) => ({
          text: `Projet "${p.name}" mis à jour (${p.status})`,
          time: new Date(p.updated_at || p.created_at).toLocaleString("fr-CA"),
          ts: p.updated_at || p.created_at,
          href: `/projects/${p.id}`,
        })),
      ...memDb.linkedin_posts
        .slice()
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 3)
        .map((l) => ({
          text: `Post LinkedIn ajouté`,
          time: new Date(l.created_at).toLocaleString("fr-CA"),
          ts: l.created_at,
          href: "/linkedin",
        })),
    ];
  }
  activities.sort((a, b) => +new Date(b.ts) - +new Date(a.ts));
  activities = activities
    .slice(0, 5)
    .map(({ text, time, href }) => ({ text, time, href, ts: "" }));

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Vue d'ensemble de votre activité freelance</Subtitle>
      </Header>

      <Grid>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
              <IconWrapper $color={stat.color}>
                <stat.icon />
              </IconWrapper>
            </CardHeader>
            <Value>{stat.value}</Value>
            <Change $positive={stat.positive}>{stat.change}</Change>
            <div>
              <Link href={statLinks[index]}>
                <SmallLink>Voir tout</SmallLink>
              </Link>
            </div>
          </Card>
        ))}
      </Grid>

      <QuickActions>
        <SectionTitle>Actions rapides</SectionTitle>
        <ActionGrid>
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <ActionButton key={index}>{action.label}</ActionButton>
            </Link>
          ))}
        </ActionGrid>
      </QuickActions>

      <ActivitySection>
        <SectionTitle>Activité récente</SectionTitle>
        <ActivityCard>
          {activities.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon>📌</ActivityIcon>
              <ActivityContent>
                <ActivityText>{activity.text}</ActivityText>
                <ActivityTime>{activity.time}</ActivityTime>
                <div>
                  <Link href={activity.href}>
                    <SmallLink>Voir</SmallLink>
                  </Link>
                </div>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityCard>
      </ActivitySection>
    </Container>
  );
}
