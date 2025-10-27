// Generic helpers to model Contentful GraphQL responses

/** Contentful GraphQL often returns nullables. */
export type CFMaybe<T> = T | null;

/** A collection is `{ items: (T | null)[] }` */
export type CFCollection<T> = {
  items: Array<CFMaybe<T>>;
};

/** Optional `sys` when you select it in your query */
export type CFSys = {
  id: string;
  publishedAt?: string | null;
  firstPublishedAt?: string | null;
  publishedVersion?: number | null;
  locale?: string | null;
};

/** Attach `sys` to any entry (when selected) */
export type WithSys<T> = T & { sys?: CFSys | null };

/** Convenience for single vs multi references */
export type CFRef<T> = CFMaybe<WithSys<T>>;
export type CFRefs<T> = CFCollection<WithSys<T>>;

export type CFItem<T, Type extends string> = {
  sys: CFSys;
  __typename: Type;
} & T;
