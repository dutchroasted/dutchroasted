export const MAX_OUTFIT_IMAGE_SIZE = 10 * 1024 * 1024;

export const OUTFIT_OCCASIONS = [
  "Date",
  "Werk",
  "School",
  "Gym",
  "Party",
  "Festival",
] as const;

export const OUTFIT_ROAST_LEVELS = ["Complimenten", "Pittig", "Genadeloos"] as const;
export const OUTFIT_PROFILES = ["Man", "Vrouw", "Zeg ik liever niet"] as const;

export type OutfitOccasion = (typeof OUTFIT_OCCASIONS)[number];
export type OutfitRoastLevel = (typeof OUTFIT_ROAST_LEVELS)[number];
export type OutfitProfile = (typeof OUTFIT_PROFILES)[number];

export type ShoppingSuggestion = {
  title: string;
  reason: string;
  imageUrl: string;
  productUrl: string;
  affiliateUrl: string;
  category: string;
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
