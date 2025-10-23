# Admin App Decisions (Working Draft)

- **App placement**
  - Create Next.js app at `apps/admin-app/` (migrate away from current Angular setup).
  - Use Next.js App Router.

- **Hosting & environments**
  - Frontend and API routes on Vercel (dev/prod envs).
  - Background jobs via Vercel Cron.
  - Keep infra minimal: no EC2/servers; only S3 for storage.

- **Auth**
  - Single-user app. Prioritize free and simple.
  - Decision: NextAuth.js + Resend, magic link, JWT sessions (no DB).

- **Database**
  - PostgreSQL on Supabase (free tier), region `us-east-1`.

- **AI provider**
  - Prefer low-cost OpenAI models (e.g., `gpt-4o-mini`).
  - Budgets/timeouts: $5/month cap, 30s timeout, 2 retries with exponential backoff.

- **LinkedIn integration**
  - Preference for official API and free usage; official API access is limited for this use case.
  - Decision (Phase 1): Manual workflow (paste URL/content) with storage of minimal fields; evaluate compliant scraping later.
  - Minimal fields: `url`, `author`, `snippet`, `date`, optional `likeCount`, `commentCount`.

- **PDF generation**
  - Start with `react-pdf` for invoices/quotes on the server (API route) for consistent output.
  - Bilingual (FR/EN) fonts embedded (Inter + Noto Sans). Logo embedding enabled.
  - Store generated PDFs in AWS S3.
  - Maybe use a separate packages for PDF generation since react-pdf is it's own kind of components vs normal react.

- **Legal templates**
  - Jurisdiction: Quebec/Canada; languages: FR/EN.
  - Taxes: TPS 5%, TVQ 9.975%, currency CAD.
  - Source baseline templates tailored for Quebec freelancers; include clauses: IP ownership, revisions, acceptance, kill fee. Adapt language and taxes.
  - Invoice numbering scheme: `YYYY-SEQ` (e.g., 2025-001).
  - In the process of getting a NEQ from the Quebec Bar.

- **Invoicing & payments**
  - Stripe: nice-to-have; phase later.
  - Invoice statuses: Draft → Sent → Viewed → Partially Paid → Paid → Overdue → Canceled.
  - Dunning cadence: 3, 7, 14 days overdue; bilingual email templates drafted in Ariane's tone.

- **Notion integration**
  - Bidirectional sync for task mirroring. Use existing workspace.
  - Conflict policy: per-field merge.
  - Reference schema materials in `prompts/admin-app/Freelance/` and formalize task properties during implementation.

- **Internationalization**
  - Use `next-i18next`.
  - Locales: default `fr`, secondary `en`.
  - Store shared translations and template strings in `libs/i18n/`.

- **UI/Design tokens**
  - Source tokens from `apps/website/src/theme`; expose shared components/tokens via `libs/ui/`.
  - Initial shared components: Button, Card, Input, Select, Textarea, Badge, Tooltip, Modal, Table, Tabs, Pagination.

- **Storage**
  - Assets and PDFs in AWS S3.
  - Bucket: `ag-admin-app-prod`, region `us-east-1`.
  - Prefixes: `invoices/` (private), `logos/` (public). Retention: 12 months for PDFs.

- **Email**
  - Use Resend (free tier). Sender: `hello@arianeguay.ca`. Configure SPF/DKIM in GoDaddy.

- **Security & secrets**
  - Store secrets in Vercel envs. Server-only for AI and LinkedIn calls.
  - Rotate envs quarterly; naming convention `NEXT_PUBLIC_*` (client) vs server-only.
  - Deploy audit checklist: env vars present, least-privilege keys, logging on API routes, S3 bucket policies, backups.

- **Performance & quotas**
  - Implement request caching where safe; timeouts/retries as above; enforce monthly budget cap.

- **Branding assets**
  - Use existing `arianeguay.ca` assets; designer can supply additional as needed.

- **Background jobs**
  - Via Vercel Cron.
  - Schedules:
    - Engagement rollup: daily 08:00 ET
    - Invoice reminders: Mondays 09:00 ET

- **Engagement tracking**
  - Low cognitive load. Manual minimal inputs with optional auto-fill from pasted post counts.

- **Accessibility**
  - Target: WCAG 2.1 AA.
  - Rules: follow `next-axe` for automated testing; limit to 1 toast per task; use progress bars for long ops; ensure focus-visible; respect reduced motion.

- **Migration plan**
  - Phase 1: manual workflows, minimal automation.
  - Phase 2: automate workflows, integrate with Notion.

- **Contentful integration**
  - Admin app can push content (projects, about) to Contentful using the Management API (similar to `tools/contentful-cli`).
  - Start with free tier; JSON payloads can originate from ChatGPT drafts.
  - Environment/keys from `.env.locale`. Content types in `tools/contentful-cli/data/cpt/`.
  - Workflow: single-user draft → publish in app.

- **Seed/demo data**
  - Client: name, email, phone, address, companyName, taxNumbers (TPS/TVQ), notes
  - Project: name, clientId, status, budget, currency, deadline, description, tags
  - LinkedInPost: url, author, snippet, date, likeCount?, commentCount?
  - Invoice: number, clientId, issueDate, dueDate, items[{desc, qty, unitPrice}], taxRates, subtotal, taxes, total, status
