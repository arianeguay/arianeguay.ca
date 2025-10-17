import type { CFMaybe, WithSys } from "../cms/cf-graphql";
import type { Page as PageShared, NextProjectCTA } from "./shared";
import type { WorkItem } from "./work";

/** Page (concrete, with some useful relations picked) */
export type Page = WithSys<PageShared>;

/** Projects grid for listing pages */
export type ProjectsGrid = WithSys<{
  title: string;
  items: CFMaybe<WorkItem[]>;
}>;

/** Next-project CTA reused in work detail */
export type { NextProjectCTA };
