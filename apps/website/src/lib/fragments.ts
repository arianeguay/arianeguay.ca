export const CtaSectionFields = /* GraphQL */ `
 __typename
            sys { id }
            title
            variant
            description { json }
            illustration { url title }
            primaryCta {
              kind
              label
              openInNewTab
              url
              page { slug parentPage { slug } }
              variant
              actionForm {
                title
                description
                formItemsCollection(limit: 20) { items { fieldName fieldType label placeholder helperText required maxLength minLength pattern options defaultValue order } }
                honeypotEnabled
                rateLimitMax
                rateLimitTimeframe
                submitButtonLabel
                resetButtonLabel
              }
            }
            splashesCollection(limit: 2, locale: $locale) { items { asset { url title } margin top side } }
            background
            isScreen
`;

export const ItemsListFields = /* GraphQL */ `
 __typename
            sys { id }
            title
            description { json }
            cardVariant
            background
            isScreen
            variant
            includeAll
            primaryCta {
              label
              kind
              url
              variant
              openInNewTab
              actionForm {
                title
                description
                formItemsCollection(limit: 20) { items { fieldName fieldType label placeholder helperText required maxLength minLength pattern options defaultValue order } }
                honeypotEnabled
                rateLimitMax
                rateLimitTimeframe
                submitButtonLabel
                resetButtonLabel
              }
              page { slug parentPage { slug } }
            }
            itemsCollection(limit: 10, locale: $locale) {
              items { ... on ListItem { __typename text title icon { url title } variant } }
            }
            splashesCollection(limit: 2, locale: $locale) { items { asset { url title } margin top side } }
`;

export const SeoFields = /* GraphQL */ `
  seoTitle
  seoDescription
  canonicalUrl
  noindex
  structuredData
  ogImage { url title }
`;

export const WorkItemFields = /* GraphQL */ `
  __typename
  sys { id }
  type
  title
  subtitle
  slug
  badge
  cover { url title }
  projectMeta {
    company
    role
    period
    sector
    location
    stackCollection(limit: 50) { items { name kind color icon { url title } } }
    linksCollection(limit: 20) { items { label url kind } }
  }
  overview { json }
  problemStatementCollection(limit: 20) { items { text } }
  roleScopeCollection(limit: 20) { items { text } }
  processCollection(limit: 20) {
    items {
      title
      description { json }
      itemsCollection(limit: 20) { items { text } }
      mediaCollection(limit: 20) {
        items {
          image { url title }
          alt
          caption
          priority
        }
      }
      order
    }
  }
  highlightsCollection(limit: 20) { items { text icon { url title } } }
  metricsCollection(limit: 20) { items { label value context } }
  galleryCollection(limit: 20) {
    items {
      image { url title }
      alt
      caption
      priority
    }
  }
  techStackCollection(limit: 20) { items { name kind color icon { url title } } }
  linksCtaCollection(limit: 20) { items { label url kind } }
  testimonial { quote author roleOrCompany avatar { url title } url }
  ctaSection { ${CtaSectionFields} }
  seo { ${SeoFields} }
  breadcrumbs
`;

export const WorkItemFieldsFull = /* GraphQL */ `
  ${WorkItemFields}
`;

export const WorkItemFieldsCompact = /* GraphQL */ `
  __typename
  sys { id }
  type
  title
  subtitle
  slug
  badge
  cover { url title }
  projectMeta {
    company
    role
    period
    sector
    location
    stackCollection(limit: 15) { items { name kind color icon { url title } } }
  }
`;

export const WorkItemFieldsSlugs = /* GraphQL */ `
  __typename
  sys { id }
  slug
`;

export const PageFieldsSlugs = /* GraphQL */ `
  slug
   parentPage {
    slug
}
`;

export const PageShellFields = /* GraphQL */ `
  title
  slug
  pageType
  parentPage {
    slug
    title
    sys { id }
  }
  sectionsCollection(limit: $sectionLimit, locale: $locale) {
    items {
      __typename
      ... on Entry { sys { id } }
    }
  }
  seo {
    seoTitle
    seoDescription
    canonicalUrl
    noindex
    ogImage { url }
  }
`;

export const ExperienceSectionFields = /* GraphQL */ `
  __typename
  sys { id }
  title
  description { json }
  enterpriseTitle
  background
  enterpriseCollection(limit: 3) { items { companyName dateEnd dateStart description { json } highlights { json } location roleTitle tagsCollection { items { name } } } }
  formationsTitle
  formationsCollection(limit: 3) { items { school description { json } program years } }
  competencesTitle
  competencesCollection(limit: 6) { items { title tagsCollection { items { name } } } }
  cvFile { url }
  cvFileTitle
  cvFileCta
  cvFileDescription
`;

export const ProjectFields = /* GraphQL */ `
  __typename
  sys { id }
  internalTitle
  title
  kind
  company
  category
  status
  featured
  tagsCollection { items { title tagsCollection { items { name }} } }
  caseBody { json }
  highlights
  confidentialityNote
  summary
  liveUrl
  repoUrl
  cover { url }
  galleryCollection(limit: 12) { items { url } }
  startDate
  endDate
  ongoing
`;

export const GroupFields = /* GraphQL */ `
  __typename
  sys { id }
  background
  isScreen
  splashesCollection(limit: 2, locale: $locale) { items { asset { url title } margin top side } }
  elementsCollection(limit: 2, locale: $locale) {
    items {
      __typename
      ... on ItemsList {
        ${ItemsListFields}
      }
      ... on CtaSection {
        ${CtaSectionFields}
      }
    }
  }
`;
