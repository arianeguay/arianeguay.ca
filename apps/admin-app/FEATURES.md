# Admin App Features

## Current Features (Completed)

- **[Authentication]**
  - NextAuth session-gated dashboard layout in `app/(dashboard)/layout.tsx`
  - Redirects unauthenticated users to `/auth/signin`

- **[Dashboard (SSR)]**
  - Server-rendered stats (active projects, clients, pending invoices, weekly LinkedIn posts) in `app/(dashboard)/dashboard/page.tsx`
  - Recent activities aggregated from invoices, projects, LinkedIn posts
  - Supabase-first; falls back to in-memory DB when Supabase is not configured

- **[Clients]**
  - List with create, edit, delete in `app/(dashboard)/clients/ClientsList/`
  - Client detail page shows related projects and invoices in `clients/[id]/ClientDetail/`
  - Quick actions to create project/invoice prefilled with `client_id`

- **[Projects]**
  - List with client selection on create; filtered view and metadata in `projects/ProjectsList/`
  - Project detail shows linked client, editable client select, and related invoices in `projects/[id]/ProjectDetail/`
  - Links across clients/projects/invoices

- **[Invoices]**
  - List with create form supporting client and project linking in `invoices/InvoicesList/`
  - Status updates and email “send” action
  - Totals with TPS/TVQ auto-calculation on the API

- **[LinkedIn Assistant]**
  - Posts persistence (Supabase + memDb fallback) with Zod validation
  - Comments persistence and generation endpoint
  - Discovery cron route to save discovered posts; dedupe by URL
  - UI for adding posts, filtering by status, and generating comments

- **[Database and Security]**
  - PostgreSQL schema in `src/lib/db/schema.sql` with RLS enabled on core tables
  - Unique index on `linkedin_posts.url`
  - `invoices.project_id` foreign key and index

## Server-Side Rendering (SSR) Status

- **[Dashboard]** Completed — `dashboard/page.tsx` queries Supabase/memDb on the server
- **[Projects]** Completed — `projects/page.tsx` fetches initial projects and clients, passes to client list
- **[Invoices]** Completed — `invoices/page.tsx` fetches initial invoices, clients, projects
- **[LinkedIn]** Completed — `linkedin/page.tsx` fetches initial posts
- **[Clients]** Completed — `clients/page.tsx` fetches initial clients and passes to client list

## Planned / Future Features

- (none)

- **[Dashboard enhancements]**
  - Trend charts, time windows, and drill-down links

- **[Invoices]**
  - Improved PDF generation and customizable templates
  - Payment tracking and integrations

- **[Search and Filters]**
  - Advanced filters (by date ranges, amounts, tags) on all list pages

- **[Performance/UX]**
  - Pagination or infinite scroll for long lists
  - Optimistic UI updates for create/edit/delete

## Notes

- All API routes are Supabase-first with memDb fallback for local/dev without Supabase.
- Zod validation is applied on LinkedIn routes and invoice/project creation/update payloads.
- UI follows the component folder pattern: `ComponentName/index.tsx` and `ComponentName/styles.tsx`.
