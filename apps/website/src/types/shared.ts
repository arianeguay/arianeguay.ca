import type { CFMaybe, CFRefs, CFRef, WithSys } from "../cms/cf-graphql";
import type { CfAsset } from "../types/asset";
import type { SEO } from "../types/seo";
import { SectionBlock } from "./blocks";
import type { Document } from "@contentful/rich-text-types";
/** Generic link that can resolve to an internal page or an external url */
export type LinkItemKind = "Internal" | "External";
export type LinkItemVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "link";

export type LinkItem = {
  label: string;
  url?: CFMaybe<string>; // e.g., "/work/my-project"
  openInNewTab?: CFMaybe<boolean>;
  page?: CFRef<Page>;
  kind?: CFMaybe<LinkItemKind>;
  variant?: CFMaybe<LinkItemVariant>;
};

export type ListItem = { text: string };

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

export type CTASection = {
  title: string;
  description?: CFMaybe<{ json: Document }>;
  variation?: CFMaybe<string>;
  illustration?: CFMaybe<CfAsset>;
  primaryCta?: CFRef<LinkItem>;
  background?: CFMaybe<Background>;
  isScreen?: CFMaybe<boolean>;
};

export type ContactInfo = {
  website?: CFMaybe<string>;
  email?: CFMaybe<string>;
  telephone?: CFMaybe<string>;
  ctaName?: CFMaybe<string>;
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
export type HeroSection = {
  title: string;
  subtitle?: CFMaybe<string>;
  description?: CFMaybe<{ json: Document }>;
  image?: CFMaybe<CfAsset>;
  cta?: CFRef<LinkItem>;
  background?: CFMaybe<Background>;
};

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
