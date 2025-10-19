import type { CFItem } from "../cms/cf-graphql";
import type { CTASection, Group, ItemsList } from "./shared";

/** Optional discriminated union for “dynamic sections” on pages */
export type SectionBlock =
  | CFItem<CTASection, "CtaSection">
  | CFItem<ItemsList, "ItemsList">
  | CFItem<Group, "Group">;
