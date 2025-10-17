import type { CFMaybe, WithSys } from "../cms/cf-graphql";

/** Matches Contentful GraphQL Asset fields you typically select */
export type CfAsset = WithSys<{
  url: string;
  title?: CFMaybe<string>;
  description?: CFMaybe<string>;
  contentType?: CFMaybe<string>;
  width?: CFMaybe<number>;
  height?: CFMaybe<number>;
}>;
