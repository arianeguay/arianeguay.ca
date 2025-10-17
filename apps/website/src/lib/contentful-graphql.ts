import "server-only";
import { SectionBlock } from "../types/blocks";
import { SiteSettings } from "../types/settings";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENV_ID = process.env.CONTENTFUL_ENV_ID || "master";
const CDA_TOKEN = process.env.CONTENTFUL_CDA_TOKEN;

const ENDPOINT = SPACE_ID
  ? `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENV_ID}`
  : "";

async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  if (!SPACE_ID || !CDA_TOKEN) {
    throw new Error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_CDA_TOKEN");
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CDA_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    // Ensure static during build
    next: { revalidate: false },
    cache: "force-cache",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Contentful GraphQL error: ${res.status} ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(
      `Contentful GraphQL errors: ${JSON.stringify(json.errors)}`,
    );
  }
  return json.data as T;
}

export type PageSlug = { slug: string };

export async function getAllPageSlugs(): Promise<string[]> {
  const query = `
    query AllPageSlugs($limit: Int = 200) {
      pageCollection(limit: $limit) {
        items {
          slug
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ pageCollection: { items: PageSlug[] } }>(
    query,
  );
  const slugs = (data.pageCollection?.items || [])
    .map((i) => i?.slug)
    .filter((s): s is string => Boolean(s));
  return Array.from(new Set(slugs));
}

export type SeoFields = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean | null;
  structuredData?: any;
  ogImage?: { url: string; title?: string | null } | null;
};

export type PageEntry = {
  title?: string | null;
  slug?: string | null;
  sectionsCollection: { items: SectionBlock[] | null } | null;
  seo?: SeoFields | null;
};

export async function getPageBySlug(slug: string): Promise<PageEntry | null> {
  const query = /* GraphQL */ `
    query PageBySlug(
      $slug: String!
      $preview: Boolean = false
      $sectionLimit: Int = 20
      $listItemLimit: Int = 50
    ) {
      pageCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
        items {
          title
          slug
          sectionsCollection(limit: $sectionLimit) {
            items {
              __typename
              ... on ContactInfo {
                city
              }
              ... on ItemsList {
                title
                description {
                  json
                }
                variant
                itemsCollection(limit: $listItemLimit) {
                  items {
                    __typename
                    ... on ListItem {
                      text
                    }
                  }
                }
              }
              ... on CtaSection {
                variant
                description {
                  json
                }
                illustration {
                  url
                  title
                }
                primaryCta {
                  kind
                  label
                  openInNewTab
                  url
                  page {
                    title
                    slug
                  }
                  variant
                }
                background
                isScreen
                title
              }
              ... on Group {
                background
                isScreen
                elementsCollection(limit: 2) {
                  items {
                    __typename
                    ... on ItemsList {
                      title
                      description {
                        json
                      }
                      variant
                      itemsCollection {
                        items {
                          __typename
                          ... on ListItem {
                            text
                          }
                        }
                      }
                    }
                    ... on CtaSection {
                      title
                      variant
                      description {
                        json
                      }
                      illustration {
                        url
                        title
                      }
                      
                      primaryCta {
                        kind
                        label
                        openInNewTab
                        url
                        page {
                          title
                          slug
                        }
                        variant
                      }
                      background
                      isScreen
                    }
                  }
                }
              }
              ... on HeroSection {
                title
                description {
                  json
                }
                cta {
                  kind
                  label
                  openInNewTab
                  url
                  page {
                    title
                    slug
                  }
                  variant
                }
                image {
                  url
                  title
                }

                background
                variant
              }
            }
          }
          seo {
            seoTitle
            seoDescription
            canonicalUrl
            noindex
            structuredData
            ogImage {
              url
              title
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ pageCollection: { items: PageEntry[] } }>(
    query,
    { slug },
  );
  return data.pageCollection?.items?.[0] ?? null;
}

export { fetchGraphQL };

export async function getSiteSettings(): Promise<SiteSettings> {
  const query = `
    query SiteSettings {
      siteSettingsCollection(limit: 1) {
          items {
          sys {
              id
          }
              navCollection {
                  items {
                  sys {
                      id
                  }
                  label
                  page {
                      slug
                  }
                  }
              }
              footer 
              defaultSeo 
              socials
          }
      }
  }`;

  const data = await fetchGraphQL<{
    siteSettingsCollection: { items: SiteSettings[] };
  }>(query);
  return data.siteSettingsCollection?.items?.[0] ?? null;
}
