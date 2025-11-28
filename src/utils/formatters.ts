/**
 * Formats a date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Formats a date to a readable string
 */
export function formatDateReadable(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Truncates a string to a maximum length
 */
export function truncateString(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Converts an object to query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}
