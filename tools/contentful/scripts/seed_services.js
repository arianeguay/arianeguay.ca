// scripts/seed-services.js
// Node >=18, package.json avec "type":"module"

import contentful from "contentful-management";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// ----- ENV (.env.locale facultatif) -----
const envPath = path.resolve(process.cwd(), ".env.locale");
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log("No .env file found; using process env.");
}

const {
  CONTENTFUL_CMA_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENV_ID = "master",
  DEFAULT_LOCALE = "fr",
  SECONDARY_LOCALE = "en",
} = process.env;

if (!CONTENTFUL_CMA_TOKEN || !CONTENTFUL_SPACE_ID) {
  console.error(
    "❌ Missing env vars: CONTENTFUL_CMA_TOKEN, CONTENTFUL_SPACE_ID",
  );
  process.exit(1);
}

// ----- Args -----
const argv = process.argv.slice(2);
const contentArgIdx = argv.findIndex((a) => a === "--content");
const contentPath =
  contentArgIdx >= 0 ? argv[contentArgIdx + 1] : "./seed-services.content.json";
if (!fs.existsSync(contentPath)) {
  console.error(`❌ Content JSON not found at ${contentPath}`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(contentPath, "utf-8"));

// ----- Contentful client -----
const client = contentful.createClient({ accessToken: CONTENTFUL_CMA_TOKEN });

// ----- Helpers -----
const l = (fr, en) => ({
  [DEFAULT_LOCALE]: fr ?? "",
  [SECONDARY_LOCALE]: en ?? "",
});
const link = (type, id) => ({ sys: { type: "Link", linkType: type, id } });
const toRich = (text = "") => ({
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: text, marks: [], data: {} }],
    },
  ],
});
const lr = (fr, en) => ({
  [DEFAULT_LOCALE]: toRich(fr ?? ""),
  [SECONDARY_LOCALE]: toRich(en ?? ""),
});

async function ensureEntry(env, contentType, fields, id) {
  if (id) {
    try {
      const existing = await env.getEntry(id);
      return existing;
    } catch (_) {}
  }
  return env.createEntry(contentType, { fields });
}

async function ensurePublished(env, contentType, fields, id) {
  const e = await ensureEntry(env, contentType, fields, id);
  if (!e.sys.publishedVersion) await e.publish();
  return e;
}

// ----- OG Asset handling (optional) -----
async function resolveOgAsset(env, ogConfig) {
  const assetId = ogConfig?.assetId?.trim();
  const imageUrl = ogConfig?.imageUrl?.trim();

  // If assetId provided, reuse it (ensure published)
  if (assetId) {
    try {
      let asset = await env.getAsset(assetId);
      if (!asset.sys.publishedVersion) asset = await asset.publish();
      return asset;
    } catch {
      console.warn(
        `⚠️ Provided og.assetId not found: ${assetId}. Will try to create from og.imageUrl or placeholder.`,
      );
    }
  }

  // Try to create from imageUrl
  let buffer = null;
  if (imageUrl) {
    try {
      const res = await fetch(imageUrl);
      if (res.ok) buffer = Buffer.from(await res.arrayBuffer());
      else
        console.warn(
          `⚠️ Fetch OG image failed (${res.status}). Using placeholder.`,
        );
    } catch (e) {
      console.warn(
        `⚠️ Fetch OG image error: ${e?.message}. Using placeholder.`,
      );
    }
  }
  if (!buffer) {
    // 1x1 transparent PNG
    const base64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
    buffer = Buffer.from(base64, "base64");
  }

  const asset = await env.createAssetFromFiles({
    fields: {
      title: { [DEFAULT_LOCALE]: "OG Default" },
      description: { [DEFAULT_LOCALE]: "Open Graph image (seeded)" },
      file: {
        [DEFAULT_LOCALE]: {
          fileName: "og-default.png",
          contentType: "image/png",
          file: buffer,
        },
      },
    },
  });

  await asset.processForAllLocales();
  // simple polling until processed
  for (let i = 0; i < 20; i++) {
    const a = await env.getAsset(asset.sys.id);
    const file = a.fields?.file?.[DEFAULT_LOCALE];
    if (file?.url) {
      if (!a.sys.publishedVersion) await a.publish();
      return a;
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  // Publish anyway
  if (!asset.sys.publishedVersion) await asset.publish();
  return asset;
}

async function run() {
  const space = await client.getSpace(CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment(CONTENTFUL_ENV_ID);

  // 0) OG asset (optional create)
  const ogAsset = await resolveOgAsset(env, config.globals?.og || {});

  // 1) FORM
  const gForm = config.globals?.form ?? {};
  const form = await ensurePublished(
    env,
    "form",
    {
      title: l(gForm.title?.fr, gForm.title?.en),
      description: l(gForm.description?.fr, gForm.description?.en),
      successTitle: l(gForm.successTitle?.fr, gForm.successTitle?.en),
      successMessage: l(gForm.successMessage?.fr, gForm.successMessage?.en),
      submitButtonLabel: l(
        gForm.submitButtonLabel?.fr,
        gForm.submitButtonLabel?.en,
      ),
      resetButtonLabel: l(
        gForm.resetButtonLabel?.fr,
        gForm.resetButtonLabel?.en,
      ),
      emailRecipient: {
        [DEFAULT_LOCALE]: gForm.emailRecipient || "hello@arianeguay.ca",
      },
      honeypotEnabled: { [DEFAULT_LOCALE]: !!gForm.honeypotEnabled },
    },
    gForm.id || "form_quote_request",
  );

  const ctaLabel = config.globals?.ctaLabel || {
    fr: "Demander une soumission",
    en: "Request a quote",
  };

  // 2) pour chaque service
  for (const svc of config.services) {
    const svcId = svc.id;

    // 2.a CTA (linkItem)
    const ctaId = `cta_${svcId}`;
    const cta = await ensurePublished(
      env,
      "linkItem",
      {
        internalTitle: { [DEFAULT_LOCALE]: ctaId },
        label: l(ctaLabel.fr, ctaLabel.en),
        variant: { [DEFAULT_LOCALE]: "primary" },
        kind: { [DEFAULT_LOCALE]: "Action" },
        actionForm: { [DEFAULT_LOCALE]: link("Entry", form.sys.id) },
        openInNewTab: { [DEFAULT_LOCALE]: false },
      },
      ctaId,
    );

    // 2.b Items (listItem) + ItemsList
    const listItems = [];
    const bullets = svc.list?.bullets || [];
    for (let i = 0; i < bullets.length; i++) {
      const itemId = `${svcId}_item_${i + 1}`;
      const li = await ensurePublished(
        env,
        "listItem",
        {
          internalTitle: { [DEFAULT_LOCALE]: itemId },
          title: l("", ""),
          text: l(bullets[i]?.fr, bullets[i]?.en),
          variant: { [DEFAULT_LOCALE]: "row" },
        },
        itemId,
      );
      listItems.push(link("Entry", li.sys.id));
    }

    const listId = `${svcId}_list`;
    const list = await ensurePublished(
      env,
      "itemsList",
      {
        internalTitle: { [DEFAULT_LOCALE]: listId },
        title: l(svc.list?.title?.fr, svc.list?.title?.en),
        description: lr("", ""),
        primaryCta: { [DEFAULT_LOCALE]: link("Entry", cta.sys.id) },
        variant: { [DEFAULT_LOCALE]: "twoColsRight" },
        items: { [DEFAULT_LOCALE]: listItems },
        background: { [DEFAULT_LOCALE]: "none" },
        isScreen: { [DEFAULT_LOCALE]: false },
      },
      listId,
    );

    // 2.c CTA Section
    const ctaSecId = `${svcId}_cta`;
    const ctaSection = await ensurePublished(
      env,
      "ctaSection",
      {
        internalTitle: { [DEFAULT_LOCALE]: ctaSecId },
        title: l(svc.ctaSection?.title?.fr, svc.ctaSection?.title?.en),
        description: lr(
          svc.ctaSection?.description?.fr,
          svc.ctaSection?.description?.en,
        ),
        variant: { [DEFAULT_LOCALE]: "horizontal" },
        background: { [DEFAULT_LOCALE]: "none" },
        primaryCta: { [DEFAULT_LOCALE]: link("Entry", cta.sys.id) },
        isScreen: { [DEFAULT_LOCALE]: false },
      },
      ctaSecId,
    );

    // 2.d SEO
    const seo = await ensurePublished(
      env,
      "seo",
      {
        seoTitle: l(svc.seo?.title?.fr, svc.seo?.title?.en),
        seoDescription: l(svc.seo?.description?.fr, svc.seo?.description?.en),
        canonicalUrl: l(svc.seo?.canonical?.fr, svc.seo?.canonical?.en),
        noindex: { [DEFAULT_LOCALE]: false },
        ogImage: { [DEFAULT_LOCALE]: link("Asset", ogAsset.sys.id) },
      },
      svc.seo?.id || `seo_${svcId}`,
    );

    // 2.e PAGE
    const pageId = svc.page?.id || `page_${svcId}`;
    await ensurePublished(
      env,
      "page",
      {
        internalTitle: { [DEFAULT_LOCALE]: pageId },
        pageType: { [DEFAULT_LOCALE]: svc.page?.type || "service" },
        title: l(svc.page?.title?.fr, svc.page?.title?.en),
        slug: l(svc.page?.slug?.fr, svc.page?.slug?.en),
        sections: {
          [DEFAULT_LOCALE]: [list, ctaSection].map((s) =>
            link("Entry", s.sys.id),
          ),
        },
        seo: { [DEFAULT_LOCALE]: link("Entry", seo.sys.id) },
        parentPage: { [DEFAULT_LOCALE]: null },
      },
      pageId,
    );

    console.log(`✅ Seeded service page: ${pageId}`);
  }

  console.log("🎉 All services seeded from JSON.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
