export const MAX_OUTFIT_IMAGE_SIZE = 10 * 1024 * 1024;

export const OUTFIT_OCCASIONS = [
  "Casual",
  "Werk",
  "Date",
  "Feest",
  "Festival",
  "Bruiloft",
  "Sollicitatie",
  "Anders",
] as const;

export const OUTFIT_INTENSITIES = ["roast", "rotterdams"] as const;

export type OutfitOccasion = (typeof OUTFIT_OCCASIONS)[number];
export type OutfitIntensity = (typeof OUTFIT_INTENSITIES)[number];

export type ShoppingSuggestion = {
  label: string;
  reason: string;
  searchQuery: string;
};

export type OutfitResultData = {
  roast: string;
  shareQuote: string;
  alternativeQuotes: string[];
  worksWell: string[];
  canImprove: string[];
  stylingTips: string[];
  shoppingSuggestions: ShoppingSuggestion[];
  score: number;
};
