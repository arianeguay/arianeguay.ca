# Ariane Guay Website

A production-ready monorepo containing a Next.js website and Angular admin interface, both integrated with Contentful CMS.

## Overview

This project uses:

- **Nx** for monorepo management
- **Next.js** (App Router) for the public-facing website
- **Angular** (v18+ Standalone Components) for the admin interface
- **Contentful** for content management
- **Tailwind CSS** for styling the website
- **TypeScript** for type safety across the codebase

## Project Structure

```
/
├─ apps/
│  ├─ website/                # Next.js (App Router)
│  │  ├─ src/app/(site)/{home,blog,projects,about,contact}/page.tsx
│  │  ├─ src/app/blog/[slug]/page.tsx
│  │  ├─ src/app/api/{revalidate,contact,admin/*}/route.ts
│  │  ├─ src/lib/{contentful.ts,fetchers.ts,seo.ts}
│  │  └─ src/components/{layout,ui}
│  └─ admin/                  # Angular Standalone
│     ├─ src/app/{app.config.ts,app.routes.ts}
│     ├─ src/app/pages/{dashboard,projects,posts,settings}
│     └─ src/app/shared/{components,services,guards}
├─ libs/
│  ├─ content-models/         # TypeScript interfaces + Zod schemas
│  ├─ ui/                     # Shared UI components
│  └─ utils/                  # Utility functions
└─ {other config files}
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- PNPM (preferred) or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd arianeguay.ca
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables by copying `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Then fill in the required environment variables:

   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_CDA_TOKEN=your_delivery_token
   CONTENTFUL_CMA_TOKEN=your_management_token
   CONTENTFUL_WEBHOOK_SECRET=your_webhook_secret
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_SITE_URL=http://localhost:4000
   ```

### Development

Run both applications in development mode:

```bash
pnpm dev
```

Or run each application separately:

```bash
# Next.js Website
pnpm dev:website

# Angular Admin
pnpm dev:admin
```

### Building for Production

Build all applications:

```bash
pnpm build
```

Or build each application separately:

```bash
pnpm build:website
pnpm build:admin
```

### Running Tests

```bash
pnpm test
```

## Contentful Setup

### Content Models

The following content models need to be created in Contentful:

- `Post` - Blog posts
- `Project` - Portfolio projects
- `Page` - General pages
- `Tag` - Content tags
- `Author` - Content authors
- `Testimonial` - Client testimonials
- `Service` - Services offered
- `SiteSettings` - Global site settings

### Setting Up the Webhook for Revalidation

1. In Contentful, go to Settings > Webhooks
2. Create a new webhook with the following settings:
   - Name: `Revalidate Website`
   - URL: `https://your-website.com/api/revalidate`
   - Triggers: Select the events for content changes (publish, unpublish)
   - Headers:
     - Key: `X-Contentful-Signature`
     - Value: Generate a secret and set it as `CONTENTFUL_WEBHOOK_SECRET` in your environment variables

## Deployment

### Website (Next.js)

The website can be deployed to Vercel:

1. Connect your repository to Vercel
2. Set up the environment variables
3. Deploy

### Admin (Angular)

The admin interface can be deployed to Vercel, Netlify, or any static hosting service:

1. Build the admin app: `pnpm build:admin`
2. Deploy the `dist/apps/admin-app` folder

## Security Notes

- The admin interface requires authentication to access Contentful Management API
- All API calls to the Management API are proxied through Next.js API routes for security
- The Contentful Management API token is never exposed to the client

## Static Pages with Middleware

All pages are configured to be static by default using:

1. Next.js static export configuration in `next.config.js`
2. A middleware that sets appropriate cache headers
3. Explicit static rendering flags in page components

## License

[MIT](LICENSE)
