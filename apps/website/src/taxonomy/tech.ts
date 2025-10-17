import type { CFMaybe, WithSys } from "../cms/cf-graphql";

export type TechTag = WithSys<{
  name: string;
  category?: CFMaybe<string>;
  colorHex?: CFMaybe<string>;
}>;
