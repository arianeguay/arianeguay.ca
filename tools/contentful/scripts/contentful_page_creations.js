/**
 * Seed SEO + Pages for Studio Ariane Guay
 *
 * Run:
 *   SPACE_ID=xxx ENV_ID=master CMA_TOKEN=xxx node seed_seo_and_pages.cjs
 * or put them in .env.locale and just: node seed_seo_and_pages.cjs
 *
 * Requires content types from your migration to already exist:
 * - seo, page (plus any others you use later)
 */

const path = require('path');
const dotenv = require('dotenv');
const contentful = require('contentful-management');

dotenv.config({ path: path.resolve(process.cwd(), '.env.locale') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENV_ID = process.env.CONTENTFUL_ENV_ID || 'master';
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;

// Locales
const FR = 'fr';
const EN = 'en';

// Helper to localize values
const L = (fr, en) => ({ [FR]: fr, [EN]: en });

// ---- Site constants
const SITE = 'https://arianeguay.ca';

// Placeholder OG images (change later). Asset title will carry the OG description (your request).
const PLACEHOLDER = 'https://placehold.co/1200x630/png';

// --- Content for each page (<=180 chars for seoDescription)
const PAGES = [
  {
    key: 'home',
    slug: 'home', // keep empty only if your model allows; else use "home" and map to "/"
    canonical: `${SITE}`,
    pageTitle: L('Accueil — Studio Ariane Guay', 'Home — Studio Ariane Guay'),
    seoTitle: L(
      'Studio Ariane Guay — Dév. web & design UX à Montréal',
      'Studio Ariane Guay — Web Development & UX Design'
    ),
    seoDescription: L(
      'Studio Ariane Guay crée des sites élégants, accessibles et rapides : UX/UI, React/Next.js, headless, SEO et performance.',
      'Studio Ariane Guay crafts elegant, accessible, fast websites: UX/UI, React/Next.js, headless, SEO and performance.'
    ),
    ogDesc: L(
      'Hero automnal moderne avec identité visuelle du studio.',
      'Modern autumn-hued hero with studio brand.'
    ),
    schemaType: 'WebSite'
  },
  {
    key: 'services',
    slug: 'services',
    canonical: `${SITE}/services`,
    pageTitle: L('Services', 'Services'),
    seoTitle: L(
      'Services — UX, front-end & performance | Studio Ariane Guay',
      'Services — UX, Front-End & Performance | Studio Ariane Guay'
    ),
    seoDescription: L(
      'UX/UI, React/Next.js, WordPress headless, accessibilité, SEO et performance. Des expériences web cohérentes et durables.',
      'UX/UI, React/Next.js, headless WordPress, accessibility, SEO and performance. Cohesive, durable web experiences.'
    ),
    ogDesc: L(
      'Illustration “Concevoir des expériences web qui ont du sens”.',
      '“Design meaningful web experiences” illustration.'
    ),
    schemaType: 'WebPage'
  },
  {
    key: 'projects',
    slug: 'projets',
    canonical: `${SITE}/projets`,
    pageTitle: L('Projets', 'Projects'),
    seoTitle: L(
      'Réalisations & études de cas | Studio Ariane Guay',
      'Work & Case Studies | Studio Ariane Guay'
    ),
    seoDescription: L(
      'Sélection de projets et études de cas : refontes, design systems, sites culturels et plateformes sur mesure.',
      'Selected work and case studies: redesigns, design systems, cultural sites and custom platforms.'
    ),
    ogDesc: L(
      'Grille de projets avec badges “Projet/Étude de cas”.',
      'Projects grid with “Project/Case Study” badges.'
    ),
    schemaType: 'CollectionPage'
  },
  {
    key: 'about',
    slug: 'a-propos',
    canonical: `${SITE}/a-propos`,
    pageTitle: L('À propos', 'About'),
    seoTitle: L(
      'À propos — Studio Ariane Guay',
      'About — Studio Ariane Guay'
    ),
    seoDescription: L(
      'Studio fondé par Ariane Guay, développeuse et designer UX. Une approche sensible, technique et accessible du web.',
      'Studio founded by Ariane Guay, developer and UX designer. A sensitive, technical and accessible approach to the web.'
    ),
    ogDesc: L(
      'Portrait/atelier avec dégradé automnal.',
      'Portrait/studio with autumn gradient.'
    ),
    schemaType: 'AboutPage'
  },
  {
    key: 'contact',
    slug: 'contact',
    canonical: `${SITE}/contact`,
    pageTitle: L('Contact', 'Contact'),
    seoTitle: L(
      'Contact — Travaillons ensemble | Studio Ariane Guay',
      'Contact — Let’s work together | Studio Ariane Guay'
    ),
    seoDescription: L(
      'Parlez-moi de votre projet : UX, front-end, refonte ou accompagnement. Réponse rapide et approche collaborative.',
      'Tell me about your project: UX, front-end, redesign or advisory. Fast response and collaborative approach.'
    ),
    ogDesc: L(
      'Visuel “Chaque projet commence par une conversation”.',
      '“Every project starts with a conversation” visual.'
    ),
    schemaType: 'ContactPage'
  }
];

// JSON-LD builders
const schemaFor = (schemaType, page) => {
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: page[EN], // will set properly per locale below
    url: page.url,
    inLanguage: '', // set per locale
    isPartOf:
      schemaType === 'WebSite'
        ? undefined
        : { '@type': 'WebSite', url: SITE }
  };
};

// -------- helpers
async function ensureLocales(env) {
  const current = await env.getLocales();
  const codes = current.items.map(l => l.code);

  async function upsert(code, fallbackCode) {
    const found = current.items.find(l => l.code === code);
    if (found) return found;
    const created = await env.createLocale({
      name: code,
      code,
      fallbackCode: fallbackCode || null,
      optional: false,
      contentManagementApi: true,
      contentDeliveryApi: true
    });
    return created;
  }

  if (!codes.includes(FR)) await upsert(FR, EN);
  if (!codes.includes(EN)) await upsert(EN, null);
}

function linkAsset(id) {
  return { sys: { type: 'Link', linkType: 'Asset', id } };
}
function linkEntry(id) {
  return { sys: { type: 'Link', linkType: 'Entry', id } };
}

async function createOgAsset(env, key, titleFR, titleEN) {
  // Title holds the OG image description, as requested
  const asset = await env.createAsset({
    fields: {
      title: { [FR]: titleFR, [EN]: titleEN },
      file: {
        [FR]: {
          fileName: `${key}-og-fr.png`,
          contentType: 'image/png',
          upload: PLACEHOLDER
        },
        [EN]: {
          fileName: `${key}-og-en.png`,
          contentType: 'image/png',
          upload: PLACEHOLDER
        }
      }
    }
  });
  const processed = await asset.processForAllLocales();
  const published = await processed.publish();
  return published.sys.id;
}

async function createSeo(env, pageKey, data) {
  // Create OG asset first
  const ogId = await createOgAsset(env, pageKey, data.ogDesc[FR], data.ogDesc[EN]);

  // Build JSON-LD per locale
  const jsonLdFR = {
    '@context': 'https://schema.org',
    '@type': data.schemaType,
    name: data.pageTitle[FR],
    url: data.canonical,
    inLanguage: FR,
    ...(data.schemaType === 'WebSite' ? {} : { isPartOf: { '@type': 'WebSite', url: SITE } })
  };
  const jsonLdEN = {
    '@context': 'https://schema.org',
    '@type': data.schemaType,
    name: data.pageTitle[EN],
    url: data.canonical,
    inLanguage: EN,
    ...(data.schemaType === 'WebSite' ? {} : { isPartOf: { '@type': 'WebSite', url: SITE } })
  };

  const entry = await env.createEntry('seo', {
    fields: {
      seoTitle: { [FR]: data.seoTitle[FR], [EN]: data.seoTitle[EN] },
      seoDescription: { [FR]: data.seoDescription[FR], [EN]: data.seoDescription[EN] },
      ogImage: { [FR]: linkAsset(ogId), [EN]: linkAsset(ogId) },
      canonicalUrl: { [FR]: data.canonical, [EN]: data.canonical },
      noindex: { [FR]: false, [EN]: false },
      structuredData: { [FR]: jsonLdFR, [EN]: jsonLdEN }
    }
  });
  const published = await entry.publish();
  return published.sys.id;
}

async function createPage(env, pageKey, data, seoId) {
  const slugValue = data.slug; // if your model forbids empty slug, set 'home' here.
  const entry = await env.createEntry('page', {
    fields: {
      title: { [FR]: data.pageTitle[FR], [EN]: data.pageTitle[EN] },
      slug: { [FR]: slugValue, [EN]: slugValue },
      sections: { [FR]: [], [EN]: [] }, // you can link sections later
      seo: { [FR]: linkEntry(seoId), [EN]: linkEntry(seoId) }
    }
  });
  const published = await entry.publish();
  return published.sys.id;
}

// -------- main
(async () => {
  if (!SPACE_ID || !CMA_TOKEN) {
    console.error('❌ Missing SPACE_ID or CMA_TOKEN');
    process.exit(1);
  }

  const client = contentful.createClient({ accessToken: CMA_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENV_ID);

  console.log(`🔗 Seeding to space:${space.sys.id} env:${env.sys.id}`);


  for (const page of PAGES) {
    console.log(`\n— Seeding ${page.key}…`);
    const seoId = await createSeo(env, page.key, page);
    const pageId = await createPage(env, page.key, page, seoId);
    console.log(`✅ Created SEO:${seoId} and Page:${pageId} for ${page.key}`);
  }

  console.log('\n✨ Done. You can now update OG images and add sections.');
})().catch((err) => {
  console.error('❌', err.message || err);
  process.exit(1);
});
