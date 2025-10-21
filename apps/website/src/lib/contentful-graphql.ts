import "server-only";
import { SectionBlock } from "../types/blocks";
import { SiteSettings } from "../types/settings";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ENV_ID = process.env.CONTENTFUL_ENV_ID || "master";
const CDA_TOKEN = process.env.CONTENTFUL_CDA_TOKEN;
const DEFAULT_LOCALE = process.env.CONTENTFUL_DEFAULT_LOCALE || "fr";

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

  // Minify GraphQL query to avoid Contentful QUERY_TOO_BIG (8192 bytes) errors
  // Collapses all whitespace (including newlines) to single spaces and trims ends.
  const minifiedQuery = query.replace(/\s+/g, " ").trim();

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CDA_TOKEN}`,
    },
    body: JSON.stringify({ query: minifiedQuery, variables }),
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
export type PageSlugWithParent = { slug: string; parentSlug?: string | null };

export async function getAllPageSlugs(
  locale: string = DEFAULT_LOCALE,
): Promise<string[]> {
  const query = /* GraphQL */ `
    query AllPageSlugs($limit: Int = 200, $locale: String = "${DEFAULT_LOCALE}") {
      pageCollection(limit: $limit, locale: $locale) {
        items {
          slug
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ pageCollection: { items: PageSlug[] } }>(
    query,
    { locale },
  );
  const slugs = (data.pageCollection?.items || [])
    .map((i) => i?.slug)
    .filter((s): s is string => Boolean(s));
  return Array.from(new Set(slugs));
}

export async function getAllPageSlugsWithParents(
  locale: string = DEFAULT_LOCALE,
): Promise<PageSlugWithParent[]> {
  const query = /* GraphQL */ `
    query AllPageSlugsWithParents( $locale: String = "${DEFAULT_LOCALE}") {
      pageCollection( locale: $locale) {
        items {
          slug
          parentPage { slug }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    pageCollection: {
      items: Array<{
        slug?: string | null;
        parentPage?: { slug?: string | null } | null;
      }>;
    };
  }>(query, { locale });

  const entries = (data.pageCollection?.items || []).map((i) => ({
    slug: i?.slug || "",
    parentSlug: i?.parentPage?.slug || null,
  }));

  console.log(entries);
  return entries.filter((e) => Boolean(e.slug)) as PageSlugWithParent[];
}

export type SeoFields = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean | null;
  structuredData?: any;
  ogImage?: { url: string; title?: string | null } | null;
};

export type PageType = "service" | "project" | "default";

export type PageEntry = {
  title?: string | null;
  slug?: string | null;
  sectionsCollection: { items: SectionBlock[] | null } | null;
  seo?: SeoFields | null;
  pageType?: PageType | null;
  parentPage?: PageEntry | null;
  sys?: { id: string } | null;
};

export async function getSimplePageBySlug(
  slug: string,
  options?: { locale?: string; preview?: boolean },
): Promise<{ page: PageEntry | null; otherLocalePage: PageEntry | null }> {
  const locale = options?.locale || DEFAULT_LOCALE;
  const otherLocale = locale === "fr" ? "en" : "fr";

  const preview = options?.preview ?? false;
  const query = /* GraphQL */ `
    query PageBySlug(
      $slug: String!
      $preview: Boolean = false
      $locale: String = "${DEFAULT_LOCALE}"
      $sectionLimit: Int = 12
    ) {
      pageCollection(where: { slug: $slug }, limit: 1, preview: $preview, locale: $locale) {
        items {
    
          title
            sys {
        id
      }
          slug
          pageType
          parentPage {
            slug
            title
            sys {
              id
            }
          }
          sectionsCollection(limit: $sectionLimit, locale: $locale) {
            items {
              __typename
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ pageCollection: { items: PageEntry[] } }>(
    query,
    { slug, preview, locale },
  );

  const id = data.pageCollection?.items?.[0]?.sys?.id;

  const queryOtherLocale = /* GraphQL */ `
    query PageBySlug(
      $id: String!
      $preview: Boolean = false
      $locale: String = "${DEFAULT_LOCALE}"
      $sectionLimit: Int = 12
    ) {
      pageCollection(where: { sys: { id: $id } }, limit: 1, preview: $preview, locale: $locale) {
        items {
    
          title
          slug  
          sys {
        id
      }
          pageType
          parentPage {
            slug
            title
            sys {
              id
            }
          }
          sectionsCollection(limit: $sectionLimit, locale: $locale) {
            items {
              __typename
            }
          }
        }
      }
    }
  `;
  //Fetch other locale
  const dataOtherLocale = await fetchGraphQL<{
    pageCollection: { items: PageEntry[] };
  }>(queryOtherLocale, { id, preview, locale: otherLocale });

  return {
    page: data.pageCollection?.items?.[0] ?? null,
    otherLocalePage: dataOtherLocale.pageCollection?.items?.[0] ?? null,
  };
}

export async function getPageBySlug(
  slug: string,
  options?: { locale?: string; preview?: boolean },
): Promise<PageEntry | null> {
  const locale = options?.locale || DEFAULT_LOCALE;
  const preview = options?.preview ?? false;
  const query = /* GraphQL */ `
    query PageBySlug(
      $slug: String!
      $preview: Boolean = false
      $locale: String = "${DEFAULT_LOCALE}"
      $sectionLimit: Int = 12
      $listItemLimit: Int = 30
    ) {
      pageCollection(where: { slug: $slug }, limit: 1, preview: $preview, locale: $locale) {
        items {
          title
          slug
          pageType
          parentPage {
            slug
            title
            sys {
              id
            }
          }
          sectionsCollection(limit: $sectionLimit, locale: $locale) {
            items {
              __typename

              ... on ItemsList {
                title
                description {
                  json
                }
                background
                isScreen
                variant
                primaryCta {
                label
                kind
                url
                variant
                openInNewTab
                actionForm {
                  title
                  description
                  formItemsCollection {
                    items {
                      fieldName
                      fieldType
                      label
                      placeholder
                      helperText
                      required
                      maxLength
                      minLength
                      pattern
                      options
                      defaultValue
                      order
                    }
                  }
                  honeypotEnabled
                  rateLimitMax
                  rateLimitTimeframe
                  submitButtonLabel
                  resetButtonLabel
                }
                page {
                  slug
                  parentPage {
                    slug
                  }
                }
                }
                itemsCollection(limit: $listItemLimit, locale: $locale) {
                  items {
                    ... on ListItem {
                      text
                      title
                      icon {
                        url
                        title
                      }
                      variant
                    }
                  }
                }
              }
                ...  on ExperienceSection {
                 title
      description {
        json
      }
      enterpriseTitle
      background

      enterpriseCollection(limit: 3) {
        items {
          companyName
          dateEnd
          dateStart
          description {
            json
          }
          highlights {
            json
          }
          location
          roleTitle
          tagsCollection {
            items {
              name
            }
          }
        }
      }
      formationsTitle
      formationsCollection (limit: 3) {
        items {
          school
          description {
            json
          }
          program
          years
        }
      }
      competencesTitle
      competencesCollection(limit: 6) {
        items {
          title
          tagsCollection {
            items {
              name
            }
          }
        }
      }
      cvFile {
        url
      }
      cvFileTitle
      cvFileCta
      cvFileDescription 
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
                    slug
                    parentPage {
                      slug
                    }
                  }
                  variant
                  actionForm {
                    title
               description
               formItemsCollection {
                 items {
                   fieldName
                   fieldType
                   label
                   placeholder
                   helperText
                   required
                   maxLength
                   minLength
                   pattern
                   options
                   defaultValue
                   order
                 }
               }
               honeypotEnabled
               rateLimitMax
               rateLimitTimeframe
               submitButtonLabel
               resetButtonLabel
                  }
                }
                splashesCollection(limit: 2, locale: $locale) {
                  items {
                    asset {
                      url
                      title
                    }
                    margin
                    top
                    side
                  }
                }
                background
                isScreen
                title
              }
              ... on Group {
                background
                isScreen
                splashesCollection(limit: 2, locale: $locale) {
                  items {
                    asset {
                      url
                      title
                    }
                    margin
                    top
                    side
                  }
                }
                elementsCollection(limit: 2, locale: $locale) {
                  items {
                    __typename
                    ... on ItemsList {
                      title
                      description {
                        json
                      }
                      variant
                      itemsCollection(locale: $locale) {
                        items {
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
                          slug
                          parentPage {
                            slug
                          }
                        }
                        variant
                        actionForm {
                          title
                        description
                        formItemsCollection {
                          items {
                            fieldName
                            fieldType
                            label
                            placeholder
                            helperText
                            required
                            maxLength
                            minLength
                            pattern
                            options
                            defaultValue
                            order
                          }
                        }
                        honeypotEnabled
                        rateLimitMax
                        rateLimitTimeframe
                        submitButtonLabel
                        resetButtonLabel
                        
                        }
                      }
                      background
                      isScreen
                      splashesCollection(limit: 2, locale: $locale) {
                        items {
                          asset {
                            url
                            title
                          }
                          margin
                          top
                          side
                        }
                      }
                    }
                  }
                }
              }
          
            }
          }
          seo {
            seoTitle
            seoDescription
            canonicalUrl
            noindex
            ogImage {
              url
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{ pageCollection: { items: PageEntry[] } }>(
    query,
    { slug, preview, locale },
  );
  return data.pageCollection?.items?.[0] ?? null;
}

export { fetchGraphQL };

export async function getSiteSettings(
  locale: string = DEFAULT_LOCALE,
): Promise<SiteSettings> {
  const query = /* GraphQL */ `
    query SiteSettings($locale: String = "${DEFAULT_LOCALE}") {
      siteSettingsCollection(limit: 1, locale: $locale) {
          items {
          sys {
              id
          }
              navCollection(locale: $locale) {
                  items {
                  sys {
                      id
                  }
                  label
                  page {
                      slug
                      parentPage {
                        slug
                      }
                  }
                      subitemsCollection(limit: 5, locale: $locale) {
                        items {
                         
                          label
                           sys {
                              id
                          }
                          page {
                              slug
                              parentPage {
                                slug
                              }
                          }
                      }
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
  }>(query, { locale });
  return data.siteSettingsCollection?.items?.[0] ?? null;
}
