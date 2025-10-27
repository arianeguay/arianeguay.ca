# Admin App MVP Implementation Plan

## Phase 0 – Project bootstrap
- **Create app**: Next.js (App Router) at `apps/admin-app/` within Nx.
- **UI library**: Expose shared components/tokens in `libs/ui/` (Button, Card, Input, Select, Textarea, Badge, Tooltip, Modal, Table, Tabs, Pagination). Reuse `apps/website/src/theme`.
- **i18n**: `next-i18next` with default `fr`, secondary `en`; shared in `libs/i18n/`.
- **Env/secrets**: Add `.env` templates for Vercel and local; document keys and rotation cadence.

## Phase 1 – Core platform
- **Auth**: NextAuth.js + Resend (magic link, JWT sessions). Minimal login page.
- **Database**: Supabase Postgres (us-east-1). Add basic schema migrations (users, clients, projects, invoices, posts, settings).
- **Storage**: AWS S3 bucket `ag-admin-app-prod` (us-east-1), prefixes `invoices/` (private), `logos/` (public).
- **Theme & Layout**: Dashboard shell (sidebar: Dashboard / LinkedIn / Clients / Settings), light/dark mode.
- **Seed data**: 1 client, 2 projects, 3 LinkedIn posts, 2 invoices.

## Phase 2 – LinkedIn Assistant (manual-first)
- **Post Finder (manual)**: Form to paste post URL/content; store fields: `url`, `author`, `snippet`, `date`, optional `likeCount`, `commentCount`.
- **AI Comment Generator**: Use OpenAI low-cost model. Tone selector (Professional, Friendly, Playful). Copy/Regenerate actions.
- **Engagement Tracker**: Minimal metrics inputs `commentsPosted`, `postsEngaged`, `minutesSpent`; daily rollup display.

## Phase 3 – Clients & Projects
- **Project Manager**: CRUD for projects and clients; timeline/action cards (static first); Kanban/calendar later.
- **Templates**: Library of client communications; AI personalization field.

## Phase 4 – Invoicing & Documents
- **Invoice Generator**: Form with line items, taxes (TPS/TVQ), CAD totals; statuses lifecycle.
- **PDF generation**: Server route using react-pdf (Inter + Noto Sans), logo embedding; store in S3; download button.
- **Dunning**: Draft FR/EN email templates (3/7/14 days overdue).

## Phase 5 – Contentful integration
- **Setup**: Read keys from `.env.locale`; use Management API.
- **Content Types**: Map forms to types in `tools/contentful-cli/data/cpt/` for Projects and About.
- **Workflow**: Single-user draft → publish from admin app.

## Phase 6 – Notion sync (tasks)
- **Schema**: Import task properties from `prompts/admin-app/Freelance/`.
- **Sync**: Bidirectional with per-field merge; conflict indicators; manual resolve UI.

## Phase 7 – System & Ops
- **Cron jobs (Vercel Cron)**:
  - Engagement rollup at 08:00 ET daily.
  - Invoice reminders at 09:00 ET Mondays.
- **Budgets/quotas**: Enforce OpenAI $5/month cap; 30s timeout; 2 retries with backoff; per-route caching where safe.
- **Accessibility**: Target WCAG 2.1 AA; one toast per task; progress bars for long ops; focus-visible; reduced motion.
- **Security checklist**: Least-privilege keys, server-only boundaries, logging, S3 bucket policies, backups.
- **Deploy**: Vercel (preview + prod); env setup; health checks.

## Deliverables for MVP
- App scaffold under `apps/admin-app/` with routes and shared libs wired.
- Auth working end-to-end with Resend.
- LinkedIn manual module + AI comment generator.
- Clients/Projects CRUD.
- Invoice creation + PDF export to S3.
- Contentful push for Projects/About.
- Cron jobs configured.
- Seed data and demo flow.

## Nice-to-haves (post-MVP)
- Stripe hosted Checkout links for invoice payment.
- Semi-automated LinkedIn metrics retrieval.
- Rich timelines and Kanban/calendar.
- Email sending via Resend from within the app (status updates, reminders).
