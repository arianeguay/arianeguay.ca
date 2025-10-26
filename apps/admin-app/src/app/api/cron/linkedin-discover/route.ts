import { memDb } from '../../../../lib/db/memory';
import type { LinkedInPost } from '../../../../types/database';
import { getServiceSupabase } from '../../../../lib/db/supabase';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    if (bearer === secret) return true;
    const url = new URL(req.url);
    if (url.searchParams.get('secret') === secret) return true;
    return false;
  }
  // Without a secret, allow only in non-production for local testing
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

  const supabase = getServiceSupabase();
  const now = new Date().toISOString();
  let created = 0;
  let existing = 0;

  if (supabase) {
    const { data: existingRows } = await supabase
      .from('linkedin_posts')
      .select('url');
    const dedupe = new Set<string>((existingRows || []).map((r: any) => r.url).filter(Boolean));
    for (const url of found) {
      if (dedupe.has(url)) {
        existing++;
        continue;
      }
      const insert: Partial<LinkedInPost> = {
        url,
        date: now,
        like_count: 0,
        comment_count: 0,
        engagement_score: 0,
        status: 'new',
        source: 'discovery',
        created_at: now,
        updated_at: now,
      } as any;
      const { error } = await supabase.from('linkedin_posts').insert(insert as any);
      if (!error) {
        created++;
        dedupe.add(url);
      }
      if (created >= 50) break;
    }
    const { count } = await supabase.from('linkedin_posts').select('*', { count: 'exact', head: true });
    return Response.json({ ok: true, sources: sources.length, discovered, created, existing, total: count ?? 0 });
  }

  // Fallback to memory persistence
  const existingUrls = new Set((memDb.linkedin_posts || []).map((p) => p.url).filter(Boolean) as string[]);
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

export async function POST(req: Request) {
  return GET(req);
}
