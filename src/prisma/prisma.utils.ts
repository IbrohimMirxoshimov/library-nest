import { Prisma } from '@prisma/client';

/**
 * Constructs a case-insensitive Prisma StringFilter object based on the provided value.
 * 
 * @param value - The string to be used for creating the filter. If undefined, no filter is created.
 * @returns A Prisma.StringFilter with the 'contains' mode set to 'insensitive', or undefined if no value is provided.
 * 
 * Description auto generated by Codeium
 */
export function ilike(value?: string) {
  if (value) {
    const string_filter: Prisma.StringFilter<any> = {
      contains: value,
      mode: 'insensitive',
    };

    return string_filter;
  }

  return undefined;
}