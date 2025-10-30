export const formatMonthYear = (s?: string, locale?: string) => {
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  try {
    return new Intl.DateTimeFormat(locale || "fr", {
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toDateString();
  }
};

export const formatRange = (start?: string, end?: string, locale?: string) => {
  const a = formatMonthYear(start, locale);
  const b = end ? formatMonthYear(end, locale) : "Présent";
  if (!a && !b) return undefined;
  if (!b) return a;
  if (!a) return b;
  return `${a} – ${b}`;
};
