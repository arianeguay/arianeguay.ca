import type { CFMaybe } from "../cms/cf-graphql";
import type { CfAsset } from "./asset";

/** SEO fields as you’d request them from Contentful GraphQL */
export interface SEO {
  title: string;
  description?: CFMaybe<string>;
  image?: CFMaybe<CfAsset>;
}
