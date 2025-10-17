# Contentful Setup & Webhooks — Next.js ISR Revalidation

This guide configures Contentful to power your **Next.js** site with **Incremental Static Regeneration (ISR)** and **webhook-based revalidation**. It also shows how to verify webhook signatures securely and map events to the correct page paths.

---

## 1) Prerequisites

- A Contentful Space (free tier ok)
- **API Keys**:
  - **Content Delivery API (CDA)** token — read-only
  - **Content Management API (CMA)** token — admin (server-side only)
- Your Next.js site deployed (e.g., Vercel) or running locally with a public tunnel (e.g., `ngrok`)

Create a `.env.local` (or `.env`) in your repo root and fill:
```
CONTENTFUL_SPACE_ID=xxxx
CONTENTFUL_CDA_TOKEN=xxxx
CONTENTFUL_CMA_TOKEN=xxxx
CONTENTFUL_WEBHOOK_SECRET=supersecretstring
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
RESEND_API_KEY=xxxx
```

> ⚠️ **Never** expose `CMA_TOKEN` to the browser. Only use it from server route handlers.

---

## 2) Content Models (recommended)

Create these models (or adjust to your needs):

- **Post**: `title`, `slug`, `excerpt`, `body` (Rich Text or long text/MDX), `cover` (Asset), `tags (Array)`, `author (ref)`, `seo` (JSON or separate fields)
- **Project**: `title`, `slug`, `role`, `stack (Array)`, `heroImage`, `gallery (Array of Assets)`, `body`, `client`, `year`, `seo`
- **Page**: `title`, `slug`, `blocks (JSON/Refs)`, `seo`
- **Tag**, **Author**, **Testimonial**, **Service**
- **SiteSettings**: `nav (Array)`, `footer`, `social`, `defaultSeo`

Set your **default locale** (e.g., `en-US`). If you also use French, add `fr-CA` and enable it on fields where relevant.

---

## 3) Contentful Delivery Client (read-only)

Use the **CDA** token for reading content in your Next.js app:

```ts
// apps/website/src/lib/contentful.ts
import { createClient } from 'contentful';

export const cf = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_CDA_TOKEN!,
  host: 'cdn.contentful.com',
});
```

Example fetchers (server-side only) with fine-grained **Next.js tags** for ISR:
```ts
export async function getPosts() {
  const res = await fetch('https://cdn.contentful.com/...', { next: { tags: ['posts'] }, cache: 'force-cache' });
  // or use cf.getEntries({ content_type: 'post' })
}
```

---

## 4) Webhook → Next.js `/api/revalidate`

In **Contentful → Settings → Webhooks → Add webhook**:

- **Name**: `Next Revalidate`
- **URL**: `https://yourdomain.com/api/revalidate`
- **Secret**: `CONTENTFUL_WEBHOOK_SECRET` (same as in your env)
- **Triggers**: select events you want to revalidate, e.g.:
  - **Entry**: publish, unpublish, archive, delete
  - **Asset**: publish (if your pages depend on assets)
- **HTTP headers**: leave default (Contentful will send `X-Contentful-Topic`, `X-Contentful-Signature`, etc.)

> ✅ When a secret is set, Contentful sends an `X-Contentful-Signature` HMAC SHA-256 header computed over the **raw request body** using your secret.

**Next.js route handler** (signature verification + path mapping):
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
  // Note: signature may be hex string; ensure consistent format
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  // Get raw body to verify signature
  const raw = await req.text();
  const signature = req.headers.get('x-contentful-signature') ?? '';

  if (!verifyContentfulSignature(raw, signature)) {
    return NextResponse.json({ ok: false, reason: 'invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(raw);
  const topic = req.headers.get('x-contentful-topic') ?? '';
  const locale = payload?.sys?.locale
    ?? payload?.fields?.slug && Object.keys(payload.fields.slug)[0]
    ?? 'en-US';

  const paths = new Set<string>(['/']);

  // Try to find content type & slug across event shapes
  const contentType =
    payload?.sys?.contentType?.sys?.id
    ?? payload?.entity?.sys?.contentType?.sys?.id
    ?? payload?.sys?.type;

  const getLocalized = (field: any) => field?.[locale] ?? field?.['en-US'] ?? field?.['fr-CA'] ?? field;

  const slug =
    getLocalized(payload?.fields?.slug)
    ?? getLocalized(payload?.entity?.fields?.slug);

  if (contentType === 'post') {
    if (slug) paths.add(`/blog/${slug}`);
    paths.add('/blog');
    revalidateTag('posts');
  }

  if (contentType === 'project') {
    if (slug) paths.add(`/projects/${slug}`);
    paths.add('/projects');
    revalidateTag('projects');
  }

  // Always revalidate homepage & sitemap-ish pages if needed
  // paths.add('/sitemap.xml'); // if you implement revalidatePath for XML
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ revalidated: true, topic, locale, paths: [...paths] });
}
```

> ℹ️ On Vercel/Next.js App Router, `req.text()` returns the body as text. If you need **both** raw body and parsed JSON elsewhere, parse with `JSON.parse(raw)` manually as above.

---

## 5) Local testing with cURL

You can simulate a webhook locally (set your secret first):
```bash
export CONTENTFUL_WEBHOOK_SECRET=supersecretstring
RAW='{"sys":{"contentType":{"sys":{"id":"post"}}},"fields":{"slug":{"en-US":"hello-world"}}}'

SIG=$(printf %s "$RAW" | openssl dgst -sha256 -hmac "$CONTENTFUL_WEBHOOK_SECRET" | awk '{print $2}')

curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Contentful-Signature: $SIG" \
  -H "X-Contentful-Topic: ContentManagement.Entry.publish" \
  --data "$RAW"
```

You should get `{ "revalidated": true, ... }` and your blog post page should be revalidated.

---

## 6) Mapping Events → Pages

- **Blog Post** (`post`): revalidate `/blog/[slug]` and `/blog`
- **Project** (`project`): revalidate `/projects/[slug]` and `/projects`
- **Global settings changes** (`siteSettings`): revalidate `/`, `/blog`, `/projects`, `/about`
- **Asset publish**: if used on posts/projects, revalidate their paths (you can look up reverse references if needed, or simply revalidate lists for simplicity)

For larger sites, consider:
- Tracking reverse references (Contentful GraphQL helps)
- Using **tag-based ISR** via `revalidateTag('posts')` with `fetch(..., { next: { tags: ['posts'] } })`

---

## 7) Admin → Management API Proxy

Create admin endpoints under `/api/admin/*` that use the **CMA token** on server only:
- `POST /api/admin/post` — create/update/publish Post
- `POST /api/admin/project` — create/update/publish Project

**Security**:
- Require a session or API key check (e.g., `Authorization: Bearer ...`) before calling Contentful
- Never expose `CMA_TOKEN` to the Angular app directly

---

## 8) Common Pitfalls

- **Signature mismatch**: ensure you compute HMAC over the **exact raw body** bytes and compare to `X-Contentful-Signature`
- **Locales**: payload `fields` are locale-keyed objects; pick the right one (`en-US`, `fr-CA`, etc.)
- **Unpublished entries**: publishing triggers revalidation; drafts won’t appear via Delivery API
- **Caching**: if you cache responses manually, clear or revalidate tagged fetches when webhook arrives
- **Rate limiting**: add simple rate limit to `/api/contact` to avoid spam

---

## 9) Production Checklist

- ✅ Environment variables set on hosting (Vercel)
- ✅ Webhook configured with HTTPS URL and secret
- ✅ `revalidateTag` adopted for lists, `revalidatePath` for detail pages
- ✅ 404 fallback in `generateStaticParams` if content missing
- ✅ Monitoring: log webhook events (topic, slug, paths) for debugging
- ✅ Access Control: protect `/api/admin/*` with real auth (Clerk/Auth0)

---

## 10) Next Steps

- Add OG image generation route (`/api/og`) for posts & projects
- Add RSS feed for blog
- Add i18n folder structure (`/fr`, `/en`) if bilingual
- Expand webhook mapping (e.g., for `Page` blocks, `Service` pages)
