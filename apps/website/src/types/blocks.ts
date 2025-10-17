import type { CFItem, CFMaybe } from "../cms/cf-graphql";
import type { CTASection, GalleryItem, MetricItem, ProcessPhase, LinkItem, HeroSection, ItemsList, Group } from "./shared";
import type { TechTag } from "../taxonomy/tech";

/** Optional discriminated union for “dynamic sections” on pages */
export type SectionBlock = CFItem<CTASection, "CtaSection"> 
  | CFItem<ItemsList, "ItemsList"> 
  | CFItem<Group, "Group"> 
  | CFItem<HeroSection, "HeroSection"> 


