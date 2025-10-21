// Adapter to the exact interface shape you asked for (“fields” wrapper)

import { CFItem, CFSys } from "apps/website/src/cms/cf-graphql";
import { Page } from "./page";

export interface SiteSocial {
  platform: string;
  url: string;
}

export interface SiteFooter {
  copyright: string;
}

export interface SiteDefaultSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface NavItem {
  label: string;
  page: Page;
  subitemsCollection: { items: NavItem[] };
  sys: CFSys;
}

export type SiteSettingsFields = {
  navCollection: { items: CFItem<NavItem, "NavItem">[] };
  footer: SiteFooter;
  socials: SiteSocial[];
  defaultSeo: SiteDefaultSeo;
  siteName: string;
};

export type SiteSettings = CFItem<SiteSettingsFields, "SiteSettings">;
