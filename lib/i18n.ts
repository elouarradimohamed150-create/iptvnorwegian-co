export const locales = ["no", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "no";

import no from "@/messages/no.json";
import en from "@/messages/en.json";

const dictionaries = { no, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
