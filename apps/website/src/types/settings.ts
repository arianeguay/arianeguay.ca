// Adapter to the exact interface shape you asked for (“fields” wrapper)

import { Page } from "./page";
import { CFItem } from "apps/website/src/cms/cf-graphql";

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
  
}



export type SiteSettingsFields = {
    navCollection:  {items: CFItem<NavItem,"NavItem">[]};
    footer: SiteFooter;
    socials: SiteSocial[];
    defaultSeo: SiteDefaultSeo;
  
}

export type SiteSettings = CFItem<SiteSettingsFields,"SiteSettings">;
