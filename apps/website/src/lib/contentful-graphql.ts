import "server-only";
import { SectionBlock } from "../types/blocks";
import { SiteSettings } from "../types/settings";
import { WorkItem } from "../types/work";
import {
  CtaSectionFields,
  ExperienceSectionFields,
  GroupFields,
  ItemsListFields,
  PageFieldsSlugs,
  PageShellFields,
  ProjectFields,
  WorkItemFieldsCompact,
  WorkItemFieldsFull,
} from "./fragments";

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
    const errors = json.errors as any[];
    const allUnresolvable =
      Array.isArray(errors) &&
      errors.length > 0 &&
      errors.every(
        (e) => e?.extensions?.contentful?.code === "UNRESOLVABLE_LINK",
      );
    if (!allUnresolvable) {
      throw new Error(
        `Contentful GraphQL errors: ${JSON.stringify(json.errors)}`,
      );
    }
  }
  return json.data as T;
}

export type PageSlug = { slug: string };
export type PageSlugWithParent = {
  slug: string;
  noindex: boolean;
  parentSlug?: string | null;
};

export async function getAllPageSlugs(
  locale: string = DEFAULT_LOCALE,
): Promise<string[]> {
  const query = /* GraphQL */ `
    query AllPageSlugs($limit: Int = 200, $locale: String = "${DEFAULT_LOCALE}") {
      pageCollection(limit: $limit, locale: $locale) {
        items {
          ${PageFieldsSlugs}
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
          ${PageFieldsSlugs}
          parentPage { slug }
          seo {
            noindex
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    pageCollection: {
      items: Array<{
        slug?: string | null;
        parentPage?: { slug?: string | null } | null;
        seo?: { noindex?: boolean | null } | null;
      }>;
    };
  }>(query, { locale });

  const entries = (data.pageCollection?.items || []).map((i) => ({
    slug: i?.slug || "",
    parentSlug: i?.parentPage?.slug || null,
    noindex: i?.seo?.noindex || false,
  }));
  return entries.filter((e) => Boolean(e.slug)) as PageSlugWithParent[];
}
export async function getAllWorkSlugsWithParents(
  locale: string = DEFAULT_LOCALE,
): Promise<PageSlugWithParent[]> {
  const query = /* GraphQL */ `
    query AllWorkSlugsWithParents( $locale: String = "${DEFAULT_LOCALE}") {
      workItemCollection( locale: $locale) {
        items {
          slug
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    workItemCollection: {
      items: Array<{
        slug?: string | null;
      }>;
    };
  }>(query, { locale });

  const entries = (data.workItemCollection?.items || []).map((i) => ({
    slug: i?.slug || "",
  }));

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
  __typename: "Page";
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

  if (!id) {
    return {
      page: data.pageCollection?.items?.[0] ?? null,
      otherLocalePage: null,
    };
  }

  const queryOtherLocale = /* GraphQL */ `
    query PageBySlug(
      $id: String!
      $preview: Boolean = false
      $locale: String = "${DEFAULT_LOCALE}"
      $sectionLimit: Int = 12
    ) {
      pageCollection(where: { sys: { id: $id } }, limit: 1, preview: $preview, locale: $locale) {
        items {
          ${PageShellFields}
        }
      }
    }
  `;
  const dataOtherLocale = id
    ? await fetchGraphQL<{
        pageCollection: { items: PageEntry[] };
      }>(queryOtherLocale, { id, preview, locale: otherLocale })
    : ({ pageCollection: { items: [] } } as {
        pageCollection: { items: PageEntry[] };
      });

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

  const shellQuery = /* GraphQL */ `
    query PageShell(
      $slug: String!
      $preview: Boolean = false
      $locale: String = "${DEFAULT_LOCALE}"
      $sectionLimit: Int = 12
    ) {
      pageCollection(where: { slug: $slug }, limit: 1, preview: $preview, locale: $locale) {
        items {
          ${PageShellFields}
        }
      }
    }
  `;

  const shellData = await fetchGraphQL<{
    pageCollection: {
      items: Array<
        PageEntry & {
          sectionsCollection?: {
            items: Array<{
              __typename: string;
              sys: { id: string };
            } | null> | null;
          };
        }
      >;
    };
  }>(shellQuery, { slug, preview, locale });

  const shell = shellData.pageCollection?.items?.[0];
  if (!shell) return null;

  const sectionRefs = shell.sectionsCollection?.items?.filter(Boolean) as
    | Array<{ __typename: string; sys: { id: string } }>
    | undefined;
  if (!sectionRefs || sectionRefs.length === 0) {
    return {
      ...shell,
      sectionsCollection: { items: [] as SectionBlock[] },
    } as PageEntry;
  }

  const idsByType: Record<string, string[]> = {};
  for (const s of sectionRefs) {
    const t = s.__typename;
    if (!idsByType[t]) idsByType[t] = [];
    idsByType[t].push(s.sys.id);
  }

  const resultsById: Record<string, any> = {};

  if (idsByType["ItemsList"]?.length) {
    const q = /* GraphQL */ `
      query ItemsLists($ids: [String!], $locale: String = "${DEFAULT_LOCALE}") {
        itemsListCollection(where: { sys: { id_in: $ids } }, limit: 10, locale: $locale) {
          items {
           ${ItemsListFields}
          }
        }
      }
    `;
    const r = await fetchGraphQL<{ itemsListCollection: { items: any[] } }>(q, {
      ids: idsByType["ItemsList"],
      locale,
    });
    for (const it of r.itemsListCollection?.items || [])
      resultsById[it.sys.id] = it;
  }

  if (idsByType["CtaSection"]?.length) {
    const q = /* GraphQL */ `
      query Ctas($ids: [String!], $locale: String = "${DEFAULT_LOCALE}") {
        ctaSectionCollection(where: { sys: { id_in: $ids } }, limit: 10, locale: $locale) {
          items {
           ${CtaSectionFields}
          }
        }
      }
    `;
    const r = await fetchGraphQL<{ ctaSectionCollection: { items: any[] } }>(
      q,
      { ids: idsByType["CtaSection"], locale },
    );
    for (const it of r.ctaSectionCollection?.items || [])
      resultsById[it.sys.id] = it;
  }

  if (idsByType["ExperienceSection"]?.length) {
    const q = /* GraphQL */ `
      query Experiences($ids: [String!], $locale: String = "${DEFAULT_LOCALE}") {
        experienceSectionCollection(where: { sys: { id_in: $ids } }, limit: 10, locale: $locale) {
          items {
            ${ExperienceSectionFields}
          }
        }
      }
    `;
    const r = await fetchGraphQL<{
      experienceSectionCollection: { items: any[] };
    }>(q, { ids: idsByType["ExperienceSection"], locale });
    for (const it of r.experienceSectionCollection?.items || [])
      resultsById[it.sys.id] = it;
  }

  if (idsByType["Project"]?.length) {
    const q = /* GraphQL */ `
      query Projects($ids: [String!], $locale: String = "${DEFAULT_LOCALE}") {
        projectCollection(where: { sys: { id_in: $ids } }, limit: 1, locale: $locale) {
          items {
            ${ProjectFields}
          }
        }
      }
    `;
    const r = await fetchGraphQL<{ projectCollection: { items: any[] } }>(q, {
      ids: idsByType["Project"],
      locale,
    });
    for (const it of r.projectCollection?.items || [])
      resultsById[it.sys.id] = it;
  }

  if (idsByType["Group"]?.length) {
    const q = /* GraphQL */ `
      query Groups($ids: [String!], $locale: String = "${DEFAULT_LOCALE}") {
        groupCollection(where: { sys: { id_in: $ids } }, limit: 10, locale: $locale) {
          items {
            ${GroupFields}
          }
        }
      }
    `;
    const r = await fetchGraphQL<{ groupCollection: { items: any[] } }>(q, {
      ids: idsByType["Group"],
      locale,
    });
    for (const it of r.groupCollection?.items || [])
      resultsById[it.sys.id] = it;
  }

  const orderedItems: any[] = [];
  for (const ref of sectionRefs) {
    const node = resultsById[ref.sys.id];
    if (node) {
      if (!node.__typename) (node as any).__typename = ref.__typename;
      orderedItems.push(node);
    }
  }

  return {
    ...shell,
    sectionsCollection: { items: orderedItems as SectionBlock[] },
  } as PageEntry;
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
                      variant
                      subitemsCollection(limit: 10, locale: $locale) {
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
                              variant
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

export async function getAllWorkItems(
  locale: string = DEFAULT_LOCALE,
): Promise<WorkItem[]> {
  const query = /* GraphQL */ `
    query WorkItems($locale: String = "${DEFAULT_LOCALE}") {
      workItemCollection(limit: 50, locale: $locale) {
        items {
          ${WorkItemFieldsCompact}
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    workItemCollection: { items: WorkItem[] };
  }>(query, { locale });
  return data.workItemCollection?.items ?? [];
}

export async function getWorkItems(options?: {
  locale?: string;
  kind?: "all" | "projects" | "caseStudy";
}): Promise<WorkItem[]> {
  const locale = options?.locale || DEFAULT_LOCALE;
  const kind = options?.kind || "all";
  const isAll = kind === "all";
  const typeVar = !isAll
    ? kind === "projects"
      ? "project"
      : "caseStudy"
    : undefined;

  const query = /* GraphQL */ `
    query WorkItems($locale: String = "${DEFAULT_LOCALE}"${isAll ? "" : ", $type: String"}) {
      workItemCollection(${isAll ? "" : "where: { type: $type }, "}limit: 9, locale: $locale) {
        items {
          ${WorkItemFieldsCompact}
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    workItemCollection: { items: WorkItem[] };
  }>(query, { locale, type: typeVar });
  return data.workItemCollection?.items ?? [];
}
export async function getWorkBySlug(
  slug: string,
  options?: {
    locale?: string;
  },
): Promise<WorkItem | null> {
  const locale = options?.locale || DEFAULT_LOCALE;

  const query = /* GraphQL */ `
    query WorkItems($slug: String!, $locale: String = "${DEFAULT_LOCALE}") {
      workItemCollection(limit: 1, where: { slug: $slug } , locale: $locale) {
        items {
          ${WorkItemFieldsFull}
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    workItemCollection: { items: WorkItem[] };
  }>(query, { locale, slug });
  return data.workItemCollection?.items?.[0] ?? null;
}

export async function getServicePages(
  locale: string = DEFAULT_LOCALE,
): Promise<PageEntry[]> {
  const query = /* GraphQL */ `
    query ServicePages($locale: String = "${DEFAULT_LOCALE}") {
      pageCollection(where: { pageType: "service" }, limit: 50, locale: $locale) {
        items {
          title
          slug
          sys { id }
          pageType
          parentPage { slug sys { id } }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    pageCollection: { items: PageEntry[] };
  }>(query, { locale });
  return data.pageCollection?.items ?? [];
}
