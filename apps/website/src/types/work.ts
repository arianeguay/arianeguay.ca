import type { Document } from "@contentful/rich-text-types";
import type { CFMaybe, CFRef, WithSys } from "../cms/cf-graphql";
import type { TechTag } from "../taxonomy/tech";
import type { SEO } from "../types/seo";
import type {
  CTASection,
  GalleryItem,
  HighlightItem,
  LinkItem,
  MetricItem,
  ListItem,
  ProcessPhase,
  Testimonial,
  WorkItemBase,
} from "./shared";

/** Full WorkItem (Project | Case Study) as returned by Contentful GraphQL */
export type WorkItem = WithSys<
  WorkItemBase & {
    summary?: CFMaybe<{ json: Document }>;
    overview?: CFMaybe<{ json: Document }>;

    problemStatement?: CFMaybe<ListItem[]>;
    roleScope?: CFMaybe<ListItem[]>;
    process?: CFMaybe<ProcessPhase[]>;
    highlights?: CFMaybe<HighlightItem[]>;

    metrics?: CFMaybe<MetricItem[]>;
    gallery?: CFMaybe<GalleryItem[]>;
    techStack?: CFMaybe<TechTag[]>;
    linksCta?: CFMaybe<LinkItem[]>;
    testimonial?: CFRef<Testimonial>;

    ctaSection?: CFRef<CTASection>;

    seo?: CFRef<SEO>;
    breadcrumbs?: CFMaybe<unknown>;
  }
>;
