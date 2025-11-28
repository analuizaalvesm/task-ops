/**
 * Validates if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is not empty or just whitespace
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates if a date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Validates if a string has minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Validates if an object has all required fields
 */
export function hasRequiredFields<T extends object>(
  obj: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => {
    const value = obj[field];
    return value !== undefined && value !== null && value !== "";
  });
}
