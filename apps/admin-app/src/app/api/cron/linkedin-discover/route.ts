import { memDb } from '../../../../lib/db/memory';
import type { LinkedInPost } from '../../../../types/database';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const url = new URL(req.url);
  const fromVercelCron = !!req.headers.get('x-vercel-cron');
  const secret = process.env.CRON_SECRET;
  if (fromVercelCron) return true;
  if (secret) return url.searchParams.get('secret') === secret;
  // Allow locally without a secret
  return process.env.NODE_ENV !== 'production';
}

function getSources(): string[] {
  const raw = process.env.LINKEDIN_DISCOVERY_SOURCES || '';
  return raw
    .split(/\r?\n|,|\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function getKeywords(): string[] | null {
  const raw = process.env.LINKEDIN_KEYWORDS || '';
  const list = raw
    .split(/\r?\n|,|\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  return list.length ? list : null;
}

function extractLinkedinUrls(html: string): string[] {
  const set = new Set<string>();

  // Direct absolute URLs
  const absRe = /https?:\/\/(?:www\.)?linkedin\.com\/(?:feed\/update\/urn:li:activity:\d+|posts\/[A-Za-z0-9._-]+[^"'\s<]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = absRe.exec(html)) !== null) {
    let u = m[0];
    u = u.replace(/[),.;]+$/, '');
    set.add(u);
  }

  // href attributes
  const hrefRe = /href=["']([^"']+)["']/gi;
  let m2: RegExpExecArray | null;
  while ((m2 = hrefRe.exec(html)) !== null) {
    const href = m2[1];
    if (/^https?:\/\/(?:www\.)?linkedin\.com\//i.test(href)) {
      if (/\/feed\/update\/urn:li:activity:\d+|\/posts\//i.test(href)) {
        set.add(href.replace(/[),.;]+$/, ''));
      }
    }
  }

  return Array.from(set).slice(0, 100);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const sources = getSources();
  if (sources.length === 0) {
    return Response.json(
      { ok: false, error: 'no_sources', hint: 'Set LINKEDIN_DISCOVERY_SOURCES env var (comma or newline separated URLs)' },
      { status: 400 }
    );
  }
  const keywords = getKeywords();
  const perSourceCap = Math.max(1, Number(process.env.LINKEDIN_PER_SOURCE_CAP || 10));

  const headers: Record<string, string> = {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
    'accept-language': 'fr-CA,fr;q=0.8,en;q=0.6',
  };

  const found = new Set<string>();
  let discovered = 0;
  const perSourceCounts = new Map<string, number>();

  for (const src of sources) {
    try {
      const res = await fetch(src, { headers, cache: 'no-store' });
      if (!res.ok) continue;
      const html = await res.text();
      const urls = extractLinkedinUrls(html);
      let accepted = 0;
      for (const u of urls) {
        if (perSourceCounts.get(src) === perSourceCap) break;
        if (found.has(u)) continue;
        if (keywords) {
          const lower = html.toLowerCase();
          const matches = keywords.some((k) => lower.includes(k.toLowerCase()));
          if (!matches) continue;
        }
        found.add(u);
        discovered++;
        accepted++;
        perSourceCounts.set(src, (perSourceCounts.get(src) || 0) + 1);
      }
    } catch (e) {
      // ignore source fetch errors
    }
  }

  // Persist new posts in memory, dedupe by URL
  const existingUrls = new Set((memDb.linkedin_posts || []).map((p) => p.url).filter(Boolean) as string[]);
  const now = new Date().toISOString();
  let created = 0;
  let existing = 0;

  for (const url of found) {
    if (existingUrls.has(url)) {
      existing++;
      continue;
    }
    const id = (globalThis.crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const post: LinkedInPost = {
      id,
      url,
      snippet: undefined,
      author: undefined,
      date: now,
      like_count: 0,
      comment_count: 0,
      engagement_score: 0,
      status: 'new',
      source: 'discovery',
      created_at: now,
      updated_at: now,
    };
    memDb.linkedin_posts.unshift(post);
    created++;
    if (created >= 50) break; // safety cap
  }

  return Response.json({ ok: true, sources: sources.length, discovered, created, existing, total: memDb.linkedin_posts.length });
}
