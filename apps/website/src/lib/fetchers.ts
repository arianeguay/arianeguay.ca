import "server-only";
import { cache } from "react";
import { cf, mockData } from "./contentful";
import { SiteSettings } from "../types/settings";
import { WorkItem } from "../types/work";
import { EntrySkeletonType } from "contentful";



/**
 * Get site settings
 */
export const getSiteSettings = cache(async (): Promise< SiteSettings> => {
  if (!cf) return mockData.siteSettings;

  try {
    const response = await cf.getEntries<SiteSettings & {contentTypeId: "siteSettings"}>({
      content_type: "siteSettings",
      limit: 1,
    });

    return response.items[0] || mockData.siteSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return mockData.siteSettings;
  }
});
