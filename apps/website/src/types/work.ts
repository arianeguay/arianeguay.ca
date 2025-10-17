import type { CFMaybe, CFRef, WithSys } from "../cms/cf-graphql";
import type { SEO } from "../types/seo";
import type {
  CTASection,
  GalleryItem,
  MetricItem,
  ProcessPhase,
  LinkItem,
  ProjectMeta,
  WorkItemBase,
  NextProjectCTA,
} from "./shared";
import type { TechTag } from "../taxonomy/tech";

/** Full WorkItem (Project | Case Study) as returned by Contentful GraphQL */
export type WorkItem = WithSys<
  WorkItemBase & {
    overviewExcerpt?: CFMaybe<string>;
    overviewDescription?: CFMaybe<string>;

    process?: CFMaybe<ProcessPhase[]>;
    problemAndSolution?: CFMaybe<string>;
    pointsAether?: CFMaybe<string>;

    metrics?: CFMaybe<MetricItem[]>;
    gallery?: CFMaybe<GalleryItem[]>;
    techStack?: CFMaybe<TechTag[]>;
    links?: CFMaybe<LinkItem[]>;

    ctaSection?: CFRef<CTASection>;
    nextProjectCTA?: CFRef<NextProjectCTA>;

    seo?: CFRef<SEO>;
    breadcrumbsJSON?: CFMaybe<unknown>;
  }
>;
