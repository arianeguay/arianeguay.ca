/**
 * Formats a date to 'Month DD, YYYY' format
 * 
 * @param date - The date to format
 * @param locale - The locale to use, defaults to en-US
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date to ISO format for machine-readable dates
 * 
 * @param date - The date to format
 * @returns ISO formatted date string
 */
export function formatIsoDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}
