export const MAX_OUTFIT_IMAGE_SIZE = 10 * 1024 * 1024;

export const OUTFIT_OCCASIONS = [
  "Date",
  "Werk",
  "School",
  "Gym",
  "Festival",
] as const;

export const OUTFIT_ROASTER_PERSONAS = [
  "🔥 Brutale Vriend",
  "❤️ Date Coach",
  "💼 Recruiter",
] as const;

export type OutfitOccasion = (typeof OUTFIT_OCCASIONS)[number];
export type OutfitRoasterPersona = (typeof OUTFIT_ROASTER_PERSONAS)[number];

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
