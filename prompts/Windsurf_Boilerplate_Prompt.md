# Windsurf Prompt — Nx Monorepo Boilerplate (Next.js + Angular + Contentful)

**Goal**: Generate a production-ready boilerplate in an Nx monorepo containing:
- `apps/website` — Next.js (App Router) public site powered by Contentful (Delivery API), with ISR and webhook revalidation
- `apps/admin` — Angular app for managing content via a secured backend proxy to Contentful Management API
- `libs/` shared packages (`content-models`, `ui`, `utils`)
- Route handlers for `/api/revalidate` and `/api/contact`
- CI-ready scripts, environment scaffolding, and example content models

Use clean, minimal, accessible UI with Tailwind (for website) and Angular Standalone Components for admin.

---

## 0) Project Setup

- **Stack**: Nx monorepo, Node 20+, PNPM (preferred) or Yarn
- **Apps**:
  - `website`: Next.js 14+ (App Router), TypeScript, Tailwind, ESLint, Prettier
  - `admin`: Angular 18+, Standalone Components + signals, ESLint, Prettier
- **Libs**:
  - `content-models`: TypeScript interfaces and zod schemas generated from Contentful
  - `ui`: design system primitives (shared tokens, small components)
  - `utils`: misc helpers (slugify, date, schema.org helpers)
- **Testing**: Vitest (website + libs) and Karma/Jest (admin) — choose sensible defaults
- **Commit hooks**: Husky + lint-staged (format, lint, typecheck on staged files)

**Deliverables**:
- Nx workspace configured with affected builds
- `.editorconfig`, `.nvmrc`, `.gitignore`, `README.md`
- Workspace and app-level `tsconfig` with strict mode

---

## 1) Contentful Integration

Create a simple Contentful client and type-safe fetchers.

### Environment variables
Provide `.env.example` at repo root:
```
CONTENTFUL_SPACE_ID=
CONTENTFUL_CDA_TOKEN=   # Delivery (read)
CONTENTFUL_CMA_TOKEN=   # Management (admin-only; never exposed to browser)
CONTENTFUL_WEBHOOK_SECRET=
RESEND_API_KEY=         # for contact form
NEXT_PUBLIC_SITE_URL=
```

### Content models
Include codegen or hand-written types for the following models:
- `Post` `{ title, slug, excerpt, body (rich text/MDX ok), cover, tags[], author, seo }`
- `Project` `{ title, slug, role, stack[], heroImage, gallery[], body, client, year, seo }`
- `Page` `{ title, slug, blocks[], seo }`
- `Tag`, `Author`, `Testimonial`, `Service`
- `SiteSettings` `{ nav[], footer, social, defaultSeo }`

Generate TS interfaces in `libs/content-models` and export Zod validators.

---

## 2) Website (Next.js /apps/website)

**Requirements**:
- App Router with RSC fetching from Contentful Delivery API
- ISR: use `revalidate` and fine-grained tags (e.g., `posts`, `projects`)
- Pages: Home, Blog (list), Blog Post `[slug]`, Projects (list), Project `[slug]`, About, Contact
- SEO: `generateMetadata`, Open Graph (dynamic OG generator), `sitemap.xml`, `rss.xml`
- Styling: Tailwind + CSS modules (keep global CSS < 10KB). Prefer system fonts + local fonts.
- Accessibility: landmarks, focus visible, color contrast
- Internationalization (optional toggle): structure for `/fr` and `/en` segments

**Implement**:
- `src/lib/contentful.ts` — server-only client for Delivery API
- `src/lib/fetchers.ts` — typed fetchers: `getPosts`, `getPostBySlug`, `getProjects`, `getProjectBySlug`, `getSiteSettings`
- Route Handler: `POST /api/revalidate`
  - Verify `CONTENTFUL_WEBHOOK_SECRET` using `X-Contentful-Signature` (HMAC SHA256 of raw body)
  - Parse incoming payload, determine affected paths, call `revalidatePath` and/or `revalidateTag`
- Route Handler: `POST /api/contact`
  - Validate payload with Zod (name, email, message), rate-limit basic (header + IP)
  - Send email via Resend
  - Return JSON

**Example stubs** (abbreviated):
```ts
// apps/website/src/lib/contentful.ts
import { createClient } from 'contentful';

export const cf = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDA_TOKEN!,
  host: 'cdn.contentful.com',
});
```

```ts
// apps/website/src/app/api/revalidate/route.ts
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

function verifyContentfulSignature(raw: string, signature: string) {
  const digest = crypto
    .createHmac('sha256', process.env.CONTENTFUL_WEBHOOK_SECRET!)
    .update(raw, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get('x-contentful-signature') ?? '';
  if (!verifyContentfulSignature(raw, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = JSON.parse(raw);
  const paths = new Set<string>(['/']);

  const ctype = body?.sys?.contentType?.sys?.id
    ?? body?.entity?.sys?.contentType?.sys?.id;

  const getSlug = () =>
    body?.fields?.slug?.['en-US']
    ?? body?.fields?.slug?.['fr-CA']
    ?? body?.entity?.fields?.slug?.['en-US']
    ?? body?.entity?.fields?.slug?.['fr-CA']
    ?? body?.fields?.slug
    ?? body?.entity?.fields?.slug;

  if (ctype === 'post') {
    const slug = getSlug();
    if (slug) paths.add(`/blog/${slug}`);
    paths.add('/blog');
    revalidateTag('posts');
  }

  if (ctype === 'project') {
    const slug = getSlug();
    if (slug) paths.add(`/projects/${slug}`);
    paths.add('/projects');
    revalidateTag('projects');
  }

  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ revalidated: true, paths: [...paths] });
}
```

---

## 3) Admin (Angular /apps/admin)

**Purpose**: Minimal, secure UI to create/edit `Project` and `Post` entries by calling a **proxy backend** (Next.js route handler) that talks to Contentful Management API with server-side credentials.

**Requirements**:
- Angular 18+, Standalone Components, signals for state
- Auth provider placeholder (Clerk/Auth0) with `role=admin`
- Screens:
  - Dashboard
  - Projects: list/create/edit (title, slug, year, stack, hero, gallery, body)
  - Posts: list/create/edit (title, slug, excerpt, cover, body, tags)
  - Settings: default SEO preview (read-only for now)
- Call backend endpoints hosted in `apps/website` route handlers under `/api/admin/*`:
  - `POST /api/admin/project` (create/update, publish)
  - `POST /api/admin/post` (create/update, publish)
- Handle basic optimistic UI and error toasts

**Security**:
- Angular never sees `CONTENTFUL_CMA_TOKEN`
- All admin endpoints validate a server-side session (mock middleware + TODO comments for real auth)

---

## 4) Shared Libraries

- `libs/content-models`: types + zod schemas, plus minimal codegen task placeholder
- `libs/ui`: tokens (spacing, radii, colors), basic components (Button, Card, Prose, Container)
- `libs/utils`: slugify, date formatting, schema.org helpers, fetch wrappers with tags

---

## 5) Scripts & Tooling

- **Package scripts** (root):
  - `dev`: `nx run-many --target=serve --projects=website,admin --parallel`
  - `build`: `nx affected --target=build`
  - `lint`, `format`, `typecheck`
- **Website**: `dev:website`, `build:website`, `start:website`
- **Admin**: `dev:admin`, `build:admin`, `start:admin`
- **Codegen** (placeholder): `pnpm codegen:contentful`

- **CI**: Provide a GitHub Actions workflow that:
  - installs PNPM + Node 20
  - caches `~/.pnpm-store`
  - runs `pnpm install`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`

---

## 6) Directory Structure

```
/
├─ apps/
│  ├─ website/                # Next.js (App Router)
│  │  ├─ src/app/(site)/{home,blog,projects,about,contact}/page.tsx
│  │  ├─ src/app/blog/[slug]/page.tsx
│  │  ├─ src/app/api/{revalidate,contact,admin/*}/route.ts
│  │  ├─ src/lib/{contentful.ts,fetchers.ts,seo.ts}
│  │  ├─ src/components/{layout,ui}
│  │  └─ tailwind.config.ts
│  └─ admin/                  # Angular Standalone
│     ├─ src/app/{app.config.ts,app.routes.ts}
│     ├─ src/app/pages/{dashboard,projects,posts,settings}
│     └─ src/app/shared/{components,services,guards}
├─ libs/
│  ├─ content-models/
│  ├─ ui/
│  └─ utils/
├─ .github/workflows/ci.yml
├─ .editorconfig
├─ .nvmrc
├─ .gitignore
├─ nx.json
├─ package.json
├─ pnpm-lock.yaml
└─ README.md
```

---

## 7) Acceptance Criteria

- Repo clones and runs with `pnpm i && pnpm dev` (website + admin start)
- `/` renders Home with SiteSettings and 1–2 sample posts/projects from mocked fetchers (fallback if no env)
- ISR works: `revalidateTag('posts')` and `revalidatePath` on post/project change
- `/api/contact` validates + (mock) sends email
- Admin CRUD flows call backend proxies (mock management calls if no env)
- Lint, typecheck, and build succeed in CI

---

## 8) Nice-to-haves (scaffold TODOs)

- OG image generation route
- RSS feed builder for blog
- Simple role-based guard for admin routes
- i18n-ready folder structure (leave commented examples)
- CSP headers and basic security middleware
- Playwright e2e smoke test for website

---

## 9) README (autogenerated)

Include a concise README with:
- Setup, `.env` variables
- Useful scripts (dev, build, test)
- Contentful setup guide (webhook pointing to `/api/revalidate`), secret verification
- Deployment notes (Vercel for website, Vercel/Pages for admin)

---

## 10) Notes for the Agent

- Prefer zero-config over-complexity; put “TODO(auth)” for places requiring real auth
- Keep UI minimal but tidy; prioritize semantics and performance
- Keep functions small and well-typed; avoid runtime-only “any”
- Provide plentiful TODOs and comments to guide future work
- Ensure the repo runs without Contentful by using mocked data when env is missing
- Use Nx generators wherever it helps keep structure consistent

**Output**: 
- Full Nx workspace with the structure above
- All key files prefilled (stubs allowed) and clear TODO markers
- A single archive or ready-to-clone repository layout
