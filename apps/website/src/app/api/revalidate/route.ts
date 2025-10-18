import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

function verifyContentfulSignature(raw: string, signature: string) {
  const secret = process.env.CONTENTFUL_WEBHOOK_SECRET;
  
  if (!secret) {
    console.warn('CONTENTFUL_WEBHOOK_SECRET not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(raw, 'utf8')
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get('x-contentful-signature') ?? '';
  
  if (!verifyContentfulSignature(raw, signature)) {
    console.warn('Invalid Contentful signature');
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(raw);
  const paths = new Set<string>(['/']);

  const ctype = body?.sys?.contentType?.sys?.id
    ?? body?.entity?.sys?.contentType?.sys?.id;

  const getSlug = () =>
    body?.fields?.slug?.['en']
    ?? body?.fields?.slug?.['fr']
    ?? body?.entity?.fields?.slug?.['en']
    ?? body?.entity?.fields?.slug?.['fr']
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

  // Handle other content types
  if (ctype === 'page') {
    const slug = getSlug();
    if (slug) paths.add(`/${slug}`);
    revalidateTag('pages');
  }

  if (ctype === 'siteSettings') {
    // Site settings affect all pages, so we revalidate everything
    revalidateTag('siteSettings');
  }

  // Revalidate all the collected paths
  for (const p of paths) revalidatePath(p);

  console.log('Revalidated paths:', [...paths]);
  return NextResponse.json({ revalidated: true, paths: [...paths] });
}
