/**
 * Converts a string to a URL-friendly slug
 * 
 * @param text - The text to slugify
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Converts a slug back to a more readable string
 * 
 * @param slug - The slug to unslugify
 * @returns A more human-readable string
 */
export function unslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
