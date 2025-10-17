import type { CFItem } from "../cms/cf-graphql";
import type {
  CTASection,
  HeroSection,
  ItemsList,
  Group,
} from "./shared";

/** Optional discriminated union for “dynamic sections” on pages */
export type SectionBlock =
  | CFItem<CTASection, "CtaSection">
  | CFItem<ItemsList, "ItemsList">
  | CFItem<Group, "Group">
  | CFItem<HeroSection, "HeroSection">;
