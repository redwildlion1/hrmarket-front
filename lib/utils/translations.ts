import type { Translation } from "@/lib/api/categories-management"

/**
 * Get the translation for the current language from a translations array
 * Falls back to English if the requested language is not found
 */
export function getTranslation(
  translations: Translation[],
  languageCode: "en" | "ro",
): { name: string; description?: string } {
  // Try to find the translation for the requested language
  const translation = translations.find((t) => t.languageCode === languageCode)

  // If found, return it
  if (translation) {
    return {
      name: translation.name,
      description: translation.description,
    }
  }

  // Fall back to English
  const fallback = translations.find((t) => t.languageCode === "en")
  if (fallback) {
    return {
      name: fallback.name,
      description: fallback.description,
    }
  }

  // If no translations found, return empty
  return {
    name: "Untitled",
    description: undefined,
  }
}
