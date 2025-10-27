import type { Document } from "@contentful/rich-text-types";
import type { CFMaybe, CFRef, WithSys } from "../cms/cf-graphql";
import { PageEntry } from "../lib/contentful-graphql";
import type { CfAsset } from "../types/asset";
import type { SEO } from "../types/seo";
import { SectionBlock } from "./blocks";
import { WorkItem } from "./work";
/** Generic link that can resolve to an internal page or an external url */
export type LinkItemKind = "Internal" | "External" | "Action";
export type LinkItemVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "link";

export type LinkItemActionType = "openContactForm" | "none";
export type LinkItem = {
  label: string;
  url?: CFMaybe<string>; // e.g., "/work/my-project"
  openInNewTab?: CFMaybe<boolean>;
  page?: CFRef<Page>;
  kind?: CFMaybe<LinkItemKind>;
  variant?: CFMaybe<LinkItemVariant>;
  action?: CFMaybe<LinkItemActionType>;
  actionForm?: CFRef<Form>;
};

export type ListItemVariant = "card" | "row";
export type ListItem = {
  __typename: "ListItem";
  text: string;
  title?: string;
  icon?: CFRef<CfAsset>;
  variant?: CFMaybe<ListItemVariant>;
  page?: CFRef<Page>;
};

export type HighlightItem = {
  title: string;
  inlineBottomText?: CFMaybe<string>;
};

export type Background =
  | "gradient1"
  | "gradient2"
  | "gradient3"
  | "gradient4"
  | "gradient5"
  | "gradient6"
  | "none";

export type CtaVariation =
  | "vertical"
  | "verticalReversed"
  | "horizontal"
  | "horizontalReversed";

export type CTASection = {
  title: string;
  description?: CFMaybe<{ json: Document }>;
  variant?: CFMaybe<CtaVariation>;
  illustration?: CFMaybe<CfAsset>;
  primaryCta?: CFRef<LinkItem>;
  background?: CFMaybe<Background>;
  isScreen?: CFMaybe<boolean>;
  splashesCollection?: CFMaybe<{ items: BackgroundSplash[] }>;
};

export type GalleryItem = {
  image: CfAsset;
  altText?: CFMaybe<string>;
  layout?: CFMaybe<string>;
  caption?: CFMaybe<string>;
  portraitCrop?: CFMaybe<string>;
};

export type MetricItem = {
  label: string;
  value: string;
  isTop?: CFMaybe<boolean>;
  description?: CFMaybe<string>;
  ecoType?: CFMaybe<string>;
  openGraphImage?: CFMaybe<CfAsset>;
  contextualURL?: CFMaybe<string>;
  thumbnailDataJSON?: CFMaybe<unknown>;
};

export type ProcessPhase = {
  title: string;
  description?: CFMaybe<string>;
  parents?: CFMaybe<string[]>; // ids/titles of parent phases
  visuals?: CFMaybe<CfAsset[]>;
  order?: CFMaybe<number>;
};

export type ProjectMeta = {
  company: string;
  role: string;
  period: string;
  sector?: CFMaybe<string>;
  stackCollection?: CFMaybe<{ items: import("../taxonomy/tech").TechTag[] }>;
  linksCollection?: CFMaybe<{ items: LinkItem[] }>;
  location?: CFMaybe<string>;
};

/** Page-level hero */
export type BackgroundSplashSide = "left" | "right";
export interface BackgroundSplash {
  asset: CFRef<CfAsset>;
  margin: CFMaybe<number>;
  top: CFMaybe<number>;
  side: CFMaybe<BackgroundSplashSide>;
}

export type ItemsListVariant =
  | "twoColsRight"
  | "twoColsLeft"
  | "verticalScroll"
  | "verticalGrid";

export type ItemsListCardVariant = "cards" | "rows" | "faq" | "citation";
export type ItemsListIncludeAllType =
  | "disabled"
  | "projects"
  | "workItems"
  | "services"
  | "caseStudy";

export type ItemsList = {
  __typename: "ItemsList";
  title: string;
  description?: CFMaybe<{ json: Document }>;
  itemsCollection?: CFMaybe<{ items: (ListItem | PageEntry | WorkItem)[] }>;
  variant?: CFMaybe<ItemsListVariant>;
  background?: CFMaybe<Background>;
  isScreen?: CFMaybe<boolean>;
  primaryCta: CFMaybe<LinkItem>;
  cardVariant?: CFMaybe<ItemsListCardVariant>;
  includeAll?: CFMaybe<ItemsListIncludeAllType>;
};

/** Form model (Contentful) */
export type FormItemFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date";

export type FormItem = {
  fieldName: string;
  fieldType: FormItemFieldType;
  label: string;
  placeholder?: CFMaybe<string>;
  helperText?: CFMaybe<string>;
  required?: CFMaybe<boolean>;
  maxLength?: CFMaybe<number>;
  minLength?: CFMaybe<number>;
  pattern?: CFMaybe<string>;
  /** For select/radio/checkbox fields */
  options?: CFMaybe<string[]>;
  defaultValue?: CFMaybe<string>;
  order?: CFMaybe<number>;
};

export type Form = {
  title: string;
  description?: CFMaybe<string>;
  successTitle?: CFMaybe<string>;
  successMessage?: CFMaybe<string>;
  submitButtonLabel: string;
  resetButtonLabel?: CFMaybe<string>;
  emailRecipient?: CFMaybe<string>;
  formItemsCollection?: CFMaybe<{ items: FormItem[] }>;
  honeypotEnabled?: CFMaybe<boolean>;
  rateLimitMax?: CFMaybe<number>;
  rateLimitTimeframe?: CFMaybe<number>; // ms
};

export interface Project {
  /** Internal Title */
  internalTitle: CFMaybe<string>;

  /** Title (localized) */
  title: CFMaybe<string>;

  /** Type */
  kind: "caseStudy" | "project";

  /** Company */
  company?: CFMaybe<string>;

  /** Category (localized) */
  category?: CFMaybe<string>;

  /** Status */
  status: "online" | "finished" | "inprogress";

  /** Featured */
  featured: boolean;

  /** Tags (link to TagGroup entries) */
  tagsCollection?: CFMaybe<{ items: TagGroup[] }>;

  /** Case Body (localized Rich Text) */
  caseBody?: { json: Document };

  /** Highlights (localized array of strings) */
  highlights?: CFMaybe<string[]>;

  /** Confidentiality Note (localized text) */
  confidentialityNote?: CFMaybe<string>;

  /** Summary (localized text) */
  summary?: CFMaybe<string>;

  /** Live URL */
  liveUrl?: CFMaybe<string>;

  /** Repository URL */
  repoUrl?: CFMaybe<string>;

  /** Cover image */
  cover?: CFRef<CfAsset>;

  /** Gallery images */
  gallery?: CFRef<CfAsset>[];

  /** Start Date */
  startDate?: CFMaybe<string>;

  /** End Date */
  endDate?: CFMaybe<string>;

  /** Ongoing */
  ongoing: CFMaybe<boolean>;
}

export interface Group {
  background?: CFMaybe<Background>;
  isScreen?: CFMaybe<boolean>;
  splashesCollection?: CFMaybe<{ items: BackgroundSplash[] }>;
  elementsCollection?: CFMaybe<{ items: SectionBlock[] }>;
}

/** Forward declarations to break cycles; merged by TS across files */
export type Page = WithSys<{
  title: string;
  slug: string;
  parentPage?: CFRef<Page>;
  seo?: CFRef<SEO>;
  sections?: CFMaybe<SectionBlock[]>; // or use SectionBlock[]
}>;

export type NextProjectCTA = {
  label: string;
  cta: CTASection;
};

/** Work item base used by multiple views (card & detail) */
export interface WorkItemBase {
  __typename: "WorkItem";
  title: string;
  slug: string;
  type: "project" | "caseStudy";
  subtitle?: CFMaybe<string>;
  badge?: CFMaybe<string>;
  cover?: CFMaybe<CfAsset>;
  projectMeta?: CFMaybe<ProjectMeta>;
}

export type Testimonial = {
  quote: string;
  author?: CFMaybe<string>;
  roleOrCompany?: CFMaybe<string>;
  avatar?: CFMaybe<CfAsset>;
  url?: CFMaybe<string>;
};

/** Tag model for skills and technologies */
export type Tag = {
  name: string;
};

export type TagGroup = {
  title: string;
  tagsCollection?: CFMaybe<{ items: Tag[] }>;
};
/** Enterprise/Company experience item */
export type Enterprise = {
  companyName: string;
  dateEnd?: CFMaybe<string>;
  dateStart: string;
  description?: CFMaybe<{ json: Document }>;
  highlights?: CFMaybe<{ json: Document }>;
  location?: CFMaybe<string>;
  roleTitle: string;
  tagsCollection?: CFMaybe<{ items: Tag[] }>;
};

/** Education/Formation item */
export type Formation = {
  school: string;
  program: string;
  years: string;
  description?: CFMaybe<{ json: Document }>;
};

/** Competence/Skills category */
export type Competence = {
  title: string;
  tagsCollection?: CFMaybe<{ items: Tag[] }>;
};

/** Experience section with professional and educational background */
export type ExperienceSection = {
  title: string;
  description?: CFMaybe<{ json: Document }>;
  enterpriseTitle?: CFMaybe<string>;
  enterpriseCollection?: CFMaybe<{ items: Enterprise[] }>;
  formationsTitle?: CFMaybe<string>;
  formationsCollection?: CFMaybe<{ items: Formation[] }>;
  competencesTitle?: CFMaybe<string>;
  competencesCollection?: CFMaybe<{ items: Competence[] }>;
  cvFile?: CFMaybe<{ url: string }>;
  cvFileTitle?: CFMaybe<string>;
  cvFileCta?: CFMaybe<string>;
  cvFileDescription?: CFMaybe<string>;
  background?: CFMaybe<Background>;
};
