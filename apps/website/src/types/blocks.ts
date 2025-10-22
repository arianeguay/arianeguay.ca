import type { CFItem } from "../cms/cf-graphql";
import type {
  CTASection,
  ExperienceSection,
  Group,
  ItemsList,
  Project,
} from "./shared";

/** Optional discriminated union for “dynamic sections” on pages */
export type SectionBlock =
  | CFItem<CTASection, "CtaSection">
  | CFItem<ItemsList, "ItemsList">
  | CFItem<Group, "Group">
  | CFItem<Project, "Project">
  | CFItem<ExperienceSection, "ExperienceSection">;
