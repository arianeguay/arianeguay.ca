// set-default-locale.cjs
// Run: SPACE_ID=xxx ENV_ID=master CMA_TOKEN=xxx LOCALE=fr FALLBACK=en-US node set-default-locale.cjs
const path = require('path');
const dotenv = require('dotenv');
const contentful = require('contentful-management');

dotenv.config({ path: path.resolve(process.cwd(), '.env.locale') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENV_ID   = process.env.CONTENTFUL_ENV_ID || 'master';
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;
const TARGET_CODE = process.env.LOCALE || 'fr';
const FALLBACK    = process.env.FALLBACK || 'en-US';

if (!SPACE_ID || !CMA_TOKEN) {
  console.error('❌ Missing SPACE_ID or CMA_TOKEN');
  process.exit(1);
}

async function ensureLocale(env, code, fallbackCode) {
  const list = await env.getLocales();
  let loc = list.items.find(l => l.code === code);

  if (!loc) {
    loc = await env.createLocale({
      name: code,
      code,
      fallbackCode: fallbackCode || null,
      optional: false,
      contentManagementApi: true,
      contentDeliveryApi: true
    });
  } else if (fallbackCode && loc.fallbackCode !== fallbackCode) {
    loc.fallbackCode = fallbackCode;
    loc = await loc.update();
  }
  return loc;
}

async function setDefault(env, code) {
  const locales = await env.getLocales();
  const target = locales.items.find(l => l.code === code);
  if (!target) throw new Error(`Locale ${code} not found`);

  if (target.default) return true; // already default
  target.default = true;
  await target.update();

  // Verify after a short delay (eventual consistency)
  await new Promise(r => setTimeout(r, 1000));
  const verify = await env.getLocales();
  const currentDefault = verify.items.find(l => l.default);
  return currentDefault && currentDefault.code === code;
}

(async () => {
  const client = contentful.createClient({ accessToken: CMA_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENV_ID);

  console.log(`🔗 Space ${space.sys.id} · Env ${env.sys.id}`);

  await ensureLocale(env, TARGET_CODE, FALLBACK);

  const ok = await setDefault(env, TARGET_CODE);
  if (!ok) {
    await new Promise(r => setTimeout(r, 1500));
    const ok2 = await setDefault(env, TARGET_CODE);
    if (!ok2) throw new Error('Could not verify default locale switch.');
  }

  console.log(`✅ Default locale set to ${TARGET_CODE}`);

  const updated = await env.getLocales();
  updated.items.forEach(l => {
    console.log(`${l.default ? '★' : ' '} ${l.code} → fallback: ${l.fallbackCode || '—'}`);
  });
})().catch(err => {
  console.error('❌', err.message || err);
  process.exit(1);
});
