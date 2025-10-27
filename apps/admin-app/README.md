# Admin App

Freelance admin dashboard for managing clients, projects, invoices, and LinkedIn presence.

## Features

- **Dashboard**: Central hub with summary cards and quick actions
- **LinkedIn Assistant**: Manual post management, AI comment generator, engagement tracking
- **Clients & Projects**: CRUD interfaces with AI-powered timelines
- **Invoicing**: Generate quotes, contracts, and invoices with PDF export (FR/EN)
- **Contentful Integration**: Push Projects and About content to the website CMS
- **Notion Sync**: Bidirectional task mirroring with per-field merge

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: styled-components (reusing tokens from `apps/website`)
- **Auth**: NextAuth.js + Resend (magic link)
- **Database**: Supabase Postgres (us-east-1)
- **Storage**: AWS S3 (invoices, logos)
- **AI**: OpenAI (gpt-4o-mini)
- **PDF**: @react-pdf/renderer
- **i18n**: next-i18next (default `fr`, secondary `en`)

## Getting Started

### Prerequisites

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

3. Set up external services:
   - **Supabase**: Create a project and get the URL and keys
   - **Resend**: Get an API key and configure `hello@arianeguay.ca` sender
   - **AWS S3**: Create bucket `ag-admin-app-prod` in `us-east-1`
   - **OpenAI**: Get an API key
   - **Contentful**: Use keys from root `.env.locale`
   - **Notion**: Get an API key and database ID

### Development

```bash
# Start dev server (port 3001)
pnpm dev:admin

# Build
pnpm build:admin

# Lint
nx lint admin-app

# Type-check
nx typecheck admin-app
```

## Project Structure

```
apps/admin-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth routes (login, etc.)
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── linkedin/
│   │   │   ├── clients/
│   │   │   ├── projects/
│   │   │   ├── invoices/
│   │   │   └── settings/
│   │   ├── api/            # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # Shared components
│   ├── lib/                # Utilities, DB, API clients
│   ├── theme/              # Design tokens
│   └── types/              # TypeScript types
├── .env.example
├── next.config.js
├── project.json
├── tsconfig.json
└── README.md
```

## Environment Variables

See `.env.example` for the full list of required environment variables.

## Accessibility

- Target: WCAG 2.1 AA
- Low cognitive load patterns:
  - Max 1 toast notification per task
  - Progress bars for long operations
  - Focus-visible outlines
  - Reduced motion support

## License

MIT
