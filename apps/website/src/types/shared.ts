import type { Document } from "@contentful/rich-text-types";
import type { CFMaybe, CFRef, WithSys } from "../cms/cf-graphql";
import type { CfAsset } from "../types/asset";
import type { SEO } from "../types/seo";
import { SectionBlock } from "./blocks";
/** Generic link that can resolve to an internal page or an external url */
export type LinkItemKind = "Internal" | "External" | "Action";
export type LinkItemVariant =
  | "primary"
  | "secondary"
  | "tertiary"
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
  text: string;
  title?: string;
  icon?: CFRef<CfAsset>;
  variant?: CFMaybe<ListItemVariant>;
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
  companyName?: CFMaybe<string>;
  projectRole?: CFMaybe<string>;
  year?: CFMaybe<string>;
  scope?: CFMaybe<string[]>;
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

export type ItemsList = {
  title: string;
  description?: CFMaybe<{ json: Document }>;
  itemsCollection?: CFMaybe<{ items: ListItem[] }>;
  variant?: CFMaybe<ItemsListVariant>;
  background?: CFMaybe<Background>;
  isScreen?: CFMaybe<boolean>;
  primaryCta: CFMaybe<LinkItem>;
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

export interface Group {
  background?: CFMaybe<Background>;
  isScreen?: CFMaybe<boolean>;
  elementsCollection?: CFMaybe<{ items: SectionBlock[] }>;
}

/** Forward declarations to break cycles; merged by TS across files */
export type Page = WithSys<{
  title: string;
  slug: string;
  seo?: CFRef<SEO>;
  sections?: CFMaybe<SectionBlock[]>; // or use SectionBlock[]
}>;

export type NextProjectCTA = {
  label: string;
  cta: CTASection;
};

/** Work item base used by multiple views (card & detail) */
export type WorkItemBase = {
  title: string;
  slug: string;
  type: "Project" | "Case Study";
  featured?: CFMaybe<boolean>;
  featuredImage?: CFMaybe<CfAsset>;
};

/** Tag model for skills and technologies */
export type Tag = {
  name: string;
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
};
