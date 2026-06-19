export const MAX_ROAST_TEXT_LENGTH = 5000;
export const FREE_DAILY_ROAST_LIMIT = 5;

export const ROAST_CATEGORIES = [
  "CV",
  "LinkedIn-profiel",
  "Instagram bio",
  "Business idee",
  "Website tekst",
  "Social media post",
  "Sollicitatiebrief",
  "Dating profiel",
  "AI-output",
  "Overig",
] as const;

export const ROAST_INTENSITIES = ["mild", "medium", "brutal"] as const;

export type RoastCategory = (typeof ROAST_CATEGORIES)[number];
export type RoastIntensity = (typeof ROAST_INTENSITIES)[number];

export type RoastResultData = {
  roast: string;
  analysis: string[];
  improvements: string[];
  improvedVersion: string;
};

export type RoastReportData = RoastResultData & {
  originalText: string;
  category: RoastCategory;
  intensity: RoastIntensity;
  createdAt: string;
};
