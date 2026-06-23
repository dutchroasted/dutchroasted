import OpenAI from "openai";
import { buildProAnalysisPrompt } from "@/lib/proAnalysisPrompt";
import {
  getCurrentUser,
  getUserProfile,
  hasActivePremium,
} from "@/lib/authServer";
import {
  type OutfitCheckMode,
  OUTFIT_OCCASIONS,
  OUTFIT_PROFILES,
  OUTFIT_ROAST_LEVELS,
  type OutfitOccasion,
  type OutfitProfile,
  type OutfitResultData,
  type OutfitRoastLevel,
  type ProAnalysisResult,
} from "@/lib/outfitTypes";

const MODEL = "gpt-4o-mini";
const PREMIUM_BETA_ENABLED = process.env.NEXT_PUBLIC_PREMIUM_BETA !== "false";
const LEGACY_OCCASION_MAP: Record<string, (typeof OUTFIT_OCCASIONS)[number]> = {
  Casual: "School",
  Bruiloft: "Date",
  Sollicitatie: "Werk",
  Anders: "School",
  Sportschool: "Gym",
};
const FALLBACK_SHARE_QUOTES = [
  "Hier is vergaderd, maar duidelijk nog niet besloten.",
  "Deze outfit zit zichtbaar nog in de conceptfase.",
  "Je kledingstukken werken vandaag blijkbaar volledig hybride.",
];
const FALLBACK_ALTERNATIVE_QUOTES = [
  "De outfit maakt lawaai, maar vergeet een duidelijke boodschap.",
  "Deze combinatie heeft ambitie en nog dringend een eindredacteur nodig.",
  "De styling staat klaar, alleen het plan is zoek.",
];
const FALLBACK_ROAST = [
  "Je outfit heeft een plan, maar de kledingstukken hebben de vergadering gemist.",
  "De basis staat, alleen de styling zoekt nog naar een duidelijke richting.",
  "Met één sterke kleur of accessoire stopt deze look met twijfelen.",
].join("\n");
const ROAST_LEVEL_FALLBACKS: Record<
  OutfitRoastLevel,
  { roast: string; shareQuote: string; alternativeQuotes: string[] }
> = {
  Stijlcoach: {
    roast: [
      "Deze outfit weet precies wat hij wil zijn.",
      "Rustig, stijlvol en verrassend goed gecombineerd.",
      "Deze look heeft geen excuses nodig.",
    ].join("\n"),
    shareQuote: "Deze look heeft geen excuses nodig en straalt zelfvertrouwen uit.",
    alternativeQuotes: [
      "Simpel gedaan, slim uitgevoerd en klaar om gezien te worden.",
      "Deze outfit weet precies wat werkt en draagt dat uit.",
    ],
  },
  Pittig: {
    roast: FALLBACK_ROAST,
    shareQuote: "Deze outfit heeft meer twijfel dan een volle groepsapp.",
    alternativeQuotes: [
      "De outfit maakt lawaai, maar vergeet een duidelijke boodschap.",
      "De styling staat klaar, alleen het plan is zoek.",
    ],
  },
  Genadeloos: {
    roast: [
      "Deze outfit heeft een plan, maar niemand durfde het uit te voeren.",
      "De styling schreeuwt om aandacht en fluistert vervolgens niets.",
      "Deze combinatie heeft ambitie, alleen smaak miste de vergadering.",
    ].join("\n"),
    shareQuote: "Deze outfit heeft ambitie en dringend een volwassen besluit nodig.",
    alternativeQuotes: [
      "De styling kwam opdagen, maar samenhang bleef blijkbaar thuis.",
      "Deze combinatie maakt lawaai en vergeet de punchline.",
    ],
  },
};
const ROAST_DETAIL_TERMS = [
  "schoenen",
  "sneakers",
  "shirt",
  "trui",
  "jas",
  "broek",
  "jeans",
  "kleur",
  "pasvorm",
  "silhouet",
  "accessoire",
  "outfit",
  "look",
  "stijl",
];
const SHOP_CATEGORY_CONFIG = {
  schoenen: "schoenen",
  broeken: "broeken",
  tops: "tops",
  jassen: "jassen",
  accessoires: "accessoires",
  sportkleding: "sportkleding",
} as const;
type ShopCategory = keyof typeof SHOP_CATEGORY_CONFIG;
const CLOTHING_ITEMS = [
  "T-shirt",
  "Polo",
  "Overhemd",
  "Vest",
  "Trui",
  "Hoodie",
  "Jas",
  "Blazer",
  "Jeans",
  "Chino",
  "Sneakers",
  "Nette schoenen",
  "Boots",
  "Tas",
  "Horloge",
  "schoenen",
  "broek",
  "bovenlaag",
  "accessoire",
] as const;
type ClothingItem = (typeof CLOTHING_ITEMS)[number];
type ClothingInventoryItem = {
  item: ClothingItem;
  color: string;
  confidence: "hoog" | "middel";
};
const CLOTHING_REFERENCE_TERMS: Record<ClothingItem, string[]> = {
  "T-shirt": ["t-shirt", "tshirt"],
  Polo: ["polo", "poloshirt"],
  Overhemd: ["overhemd"],
  Vest: ["vest", "cardigan"],
  Trui: ["trui"],
  Hoodie: ["hoodie"],
  Jas: ["jas"],
  Blazer: ["blazer"],
  Jeans: ["jeans", "spijkerbroek"],
  Chino: ["chino"],
  Sneakers: ["sneaker"],
  "Nette schoenen": ["nette schoenen", "geklede schoenen"],
  Boots: ["boots", "laarzen", "enkellaars"],
  Tas: ["tas"],
  Horloge: ["horloge"],
  schoenen: ["schoenen"],
  broek: ["broek"],
  bovenlaag: ["bovenlaag"],
  accessoire: ["accessoire"],
};
const DANGLING_QUOTE_ENDINGS = new Set([
  "aan",
  "als",
  "bij",
  "boven",
  "dat",
  "de",
  "die",
  "door",
  "een",
  "en",
  "het",
  "in",
  "maar",
  "met",
  "naar",
  "om",
  "onder",
  "op",
  "te",
  "tussen",
  "van",
  "voor",
  "want",
  "zonder",
]);

const currentFashionContext = `
Actuele modecontext:
- Gebruik trends van nu als referentiekader, maar alleen wanneer ze zichtbaar en relevant zijn voor de outfit.
- Let op rustige luxe, minimalistische jaren-90 sandalen, rechte spijkerbroeken, zacht maatwerk, ton-sur-ton laagjes, sterke texturen, haakwerk als stedelijk detail en klassieke styling met slimme basics.
- Maak advies draagbaar voor Nederlandse situaties: fietsbaar, weerbestendig, niet te overdreven tenzij de gelegenheid daarom vraagt.
- Shopsuggesties moeten concreet en algemeen zijn, bijvoorbeeld: "minimalistische leren sneaker", "rechte donkere spijkerbroek", "gehaakt overshirt", "slanke jaren-90 sandaal".
`;

const systemPrompt = `
Je bent OutfitRoaster. Je klinkt niet als een AI, docent of mode-expert met moeilijke woorden. Je bent die scherpe Nederlandse vriend die binnen drie seconden ziet wat kleding, kleuren, pasvorm of gelegenheid met elkaar doen en daar iets raak-grappigs over zegt. Je bent direct, creatief en nooit gemeen. Je roast uitsluitend de outfit, nooit de persoon.

De gewenste reactie is: "Hahaha, verdomme... daar heeft ie wel gelijk in."

Gouden regel:
- Eerst een concrete zichtbare observatie, daarna humor. Nooit andersom.
- Humor komt uitsluitend uit zichtbare kleuren, schoenen, pasvorm, accessoires, botsende stijlen, gelegenheid of uitstraling.
- Een sterke roastregel bevat waar mogelijk observatie, contrast, vergelijking en punchline.
- Gebruik veel rake vergelijkingen. Nederlandse referenties zoals Action, HEMA, IKEA, VrijMiBo, Koningsdag, Lowlands, Pinkpop, bedrijfsuitje, voetbalteam, barbecue, verjaardag, tankstation, kringloop, Marktplaats, groepsapp, buurtfeest of teamoverleg mogen alleen wanneer ze logisch uit de zichtbare outfit volgen.
- Vermijd willekeurige metaforen die niets met de zichtbare outfit te maken hebben.

${currentFashionContext}

Belangrijke grenzen:
- Focus alleen op kleding, styling, kleuren, pasvorm van kleding, silhouet, accessoires en de gekozen gelegenheid.
- Beoordeel nooit iemands lichaam, gewicht, lichaamsvorm, aantrekkelijkheid, leeftijd, gender, afkomst, gezondheid of seksuele uitstraling.
- Leid gender nooit af uit de foto, kleding, lichaamsbouw, gezicht, haar of andere zichtbare kenmerken.
- Gebruik uitsluitend de expliciet meegegeven gender voorkeur voor mannelijke, vrouwelijke of neutrale modebewoording.
- Geen seksuele opmerkingen, geen bodyshaming, geen discriminatie.
- De roast mag scherp en grappig zijn, maar nooit gemeen of persoonlijk kwetsend.
- Schrijf uitsluitend Nederlands. Gebruik geen Engelse zinnen en meng geen Nederlands met Engels.
- Schrijf het veld roast als exact 3 korte Nederlandse feedbackzinnen, elk op een eigen regel.
- Bij Pittig en Genadeloos zijn dit roastregels; bij Stijlcoach zijn dit eerlijke coachingsregels.
- Iedere feedbackzin heeft een duidelijke clou en moet zelfstandig deelbaar zijn.
- Pas de toon strikt aan het gekozen roastniveau aan; Stijlcoach blijft positief, eerlijk en praktisch.
- Maak de roast vermakelijk, modebewust en citeerbaar, met een originele stem.
- Gebruik nooit de AI-achtige formuleringen "interessante keuze", "stijlvolle uitstraling", "modieuze look", "leuke combinatie", "persoonlijk vind ik", "esthetisch", "fashion-forward", "trendy uitstraling", "uitgebalanceerd" of "harmonisch".
- Gebruik uitsluitend kledingstukken uit de vooraf aangeleverde kledinginventaris.
- Noem nooit een specifiek kledingstuk dat niet in die inventaris staat.
- Als de inventaris een generieke term gebruikt, neem exact die generieke term over: bovenlaag, schoenen, broek of accessoire.
- Maak de roast specifieker dan "dit is saai": verwijs naar gedetecteerde kledingstukken, combinaties, kleuren of stylingkeuzes.
- Vermijd algemene feedback zoals "je outfit is leuk" of "dit past niet goed".
- Schrijf nooit een vierde feedbackzin of extra regel.
- Voorbeelden zijn alleen stijlreferenties; neem ze niet letterlijk over:
  "De schoenen zijn klaar voor actie, maar de bovenlaag plant een vergadering."
  "Deze outfit heeft meer twijfel dan een groepsapp waar niemand durft te kiezen."
  "Je broek zegt casual, je schoenen zeggen: ik ben per ongeluk meegekomen."
- Geef precies 3 deelbare quotes totaal: 1 shareQuote en exact 2 unieke alternativeQuotes.
- Iedere quote is één volledige Nederlandse zin van 6 tot 12 woorden.
- Quotes eindigen altijd met een punt, vraagteken of uitroepteken.
- Quotes eindigen nooit met ..., …, een dubbele punt, puntkomma of onafgemaakte bijzin.
- Alle quotes lezen natuurlijk wanneer ze zonder verdere context op een deelkaart staan.
- Alle quotes dupliceren elkaar niet.
- De shareQuote is belangrijker dan de volledige roast: schrijf de sterkste meme-waardige zin als shareQuote.
- De shareQuote bevat geen uitleg en moet direct begrijpelijk zijn in een screenshot.
- Schrijf quotes in de sfeer van: "Je schoenen hebben dit niet vooraf besproken.", "Hier is vergaderd maar niet besloten.", "Deze outfit zit nog in de conceptfase.", "Je look heeft meerdere projectleiders." Gebruik deze voorbeelden nooit letterlijk.
- Schrijf direct en modegericht. Vermijd generieke AI-taal zoals "goede balans" zonder concreet kledingstuk of effect.
- Benoem wat een kledingstuk doet voor de outfit: silhouet, laagjes, contrast, materiaal, proportie, kleur, schoenen of accessoires.
- Formuleer analysepunten als duidelijke mode-observaties, bijvoorbeeld: "De jas draagt de outfit en geeft hem een luxe uitstraling" of "De broek breekt het silhouet; een slankere pasvorm tilt dit meteen op."
- Laat intensiteit en woordkeuze bepalen door het gekozen roastniveau.
- Scorekalibratie op 10: 7+ is goed met kleine verbeterpunten, 8+ is sterk, 9+ is social-mediawaardig en 10 is uitzonderlijk. Geef niet automatisch hoge scores.

Output altijd als geldige JSON:
{
  "roast": "string",
  "shareQuote": "string",
  "alternativeQuotes": ["string", "string"],
  "worksWell": ["string"],
  "canImprove": ["string"],
  "stylingTips": ["string"],
  "shoppingSuggestions": [
    {
      "title": "string",
      "reason": "string",
      "category": "schoenen | broeken | tops | jassen | accessoires | sportkleding",
      "searchQuery": "string"
    }
  ],
  "score": number
}
`;

function normalizeOccasion(value: unknown): OutfitOccasion | null {
  if (typeof value === "string" && value in LEGACY_OCCASION_MAP) {
    return LEGACY_OCCASION_MAP[value];
  }

  return typeof value === "string" && OUTFIT_OCCASIONS.includes(value as never)
    ? value as OutfitOccasion
    : null;
}

function normalizeRoastLevel(
  value: unknown,
  legacyFeedbackStyle: unknown,
  legacyPersona: unknown,
): OutfitRoastLevel {
  if (typeof value === "string" && OUTFIT_ROAST_LEVELS.includes(value as never)) {
    return value as OutfitRoastLevel;
  }

  const legacyLevelMap: Record<string, OutfitRoastLevel> = {
    Mild: "Stijlcoach",
    Complimenten: "Stijlcoach",
    "🔥 Brutaal": "Pittig",
    "😏 Sarcastisch": "Pittig",
    "🧠 Eerlijk": "Stijlcoach",
    roast: "Pittig",
    rotterdams: "Pittig",
    "🔥 Brutale Vriend": "Genadeloos",
    "❤️ Date Coach": "Stijlcoach",
    "💼 Recruiter": "Stijlcoach",
  };

  if (typeof legacyFeedbackStyle === "string" && legacyFeedbackStyle in legacyLevelMap) {
    return legacyLevelMap[legacyFeedbackStyle];
  }

  return typeof legacyPersona === "string" && legacyPersona in legacyLevelMap
    ? legacyLevelMap[legacyPersona]
    : "Genadeloos";
}

function normalizeProfile(value: unknown): OutfitProfile {
  if (value === "Verras me") {
    return "Zeg ik liever niet";
  }

  return typeof value === "string" && OUTFIT_PROFILES.includes(value as never)
    ? value as OutfitProfile
    : "Zeg ik liever niet";
}

function isValidImage(value: unknown): value is string {
  return typeof value === "string" && /^data:image\/jpeg;base64,/.test(value);
}

function hasValidRoast(value: unknown): value is { roast: string } {
  const roast = getRoastText(value);
  return typeof roast === "string" && roast.trim().length > 0;
}

function getResultObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function getRoastText(value: unknown) {
  const source = getResultObject(value);
  return source && typeof source.roast === "string"
    ? source.roast.trim()
    : null;
}

function normalizeOutfitResult(
  source: Record<string, unknown>,
  roastText = FALLBACK_ROAST,
  inventory: ClothingInventoryItem[] = [],
  roastLevel: OutfitRoastLevel = "Genadeloos",
  profile: OutfitProfile = "Zeg ik liever niet",
): OutfitResultData {
  const levelFallback = ROAST_LEVEL_FALLBACKS[roastLevel];
  const isStyleCoach = roastLevel === "Stijlcoach";
  const normalizedRoastText = isStyleCoach
    ? extractRoastSentences(roastText).filter(isPositiveStyleCoachText).join("\n")
    : roastText;
  const roast = normalizeRoast(
    normalizedRoastText || levelFallback.roast,
    inventory,
    levelFallback.roast,
  );
  const providedQuotes = toStringArray(source.alternativeQuotes);
  const shareQuote = selectValidQuote(
    [
      isStyleCoach
        ? positiveStyleCoachText(toNonEmptyString(source.shareQuote))
        : toNonEmptyString(source.shareQuote),
      isStyleCoach
        ? positiveStyleCoachText(toNonEmptyString(source.title))
        : toNonEmptyString(source.title),
      ...extractRoastSentences(roast),
    ],
    inventory,
    [levelFallback.shareQuote, ...FALLBACK_SHARE_QUOTES],
  );
  const stylingTips = isStyleCoach
    ? []
    : firstNonEmptyStringArray(source.stylingTips, source.tips, source.advice);

  const result: OutfitResultData = {
    roast,
    shareQuote,
    alternativeQuotes: fillAlternativeQuotes(
      providedQuotes,
      shareQuote,
      inventory,
      levelFallback.alternativeQuotes,
      isStyleCoach,
    ),
    worksWell: withFallback(
      filterInventoryConsistentText(toStringArray(source.worksWell), inventory),
      "De outfit heeft een duidelijke basis waarop je verder kunt stylen.",
    ),
    canImprove: isStyleCoach
      ? []
      : withFallback(
          filterInventoryConsistentText(toStringArray(source.canImprove), inventory),
          "Meer samenhang in kleur, pasvorm en accessoires maakt het geheel sterker.",
        ),
    stylingTips: isStyleCoach
      ? []
      : withFallback(
          filterInventoryConsistentText(stylingTips, inventory),
          "Kies één duidelijke stijlrichting en laat kleuren en accessoires daarop aansluiten.",
        ),
    shoppingSuggestions: normalizeShoppingSuggestions(
      source.shoppingSuggestions,
      inventory,
    ),
    score: normalizeScore(source.score ?? source.rating),
  };

  if (profile === "Vrouw") {
    return transformOutfitResultText(result, (text) =>
      text.replace(/\b(gast|kerel|maat|bro)\b/gi, "meid"),
    );
  }

  return profile === "Zeg ik liever niet" ? neutralizeOutfitResult(result) : result;
}

function neutralizeOutfitResult(result: OutfitResultData): OutfitResultData {
  const neutralize = (text: string) =>
    text
      .replace(/\b(mannen|heren)\b/gi, "neutrale")
      .replace(/\b(vrouwen|dames)\b/gi, "neutrale")
      .replace(/\b(man|vrouw|jongen|meisje|meneer|mevrouw)\b/gi, "outfit")
      .replace(/\b(hij|zij)\b/gi, "die")
      .replace(/\b(hem|haar)\b/gi, "stijl")
      .replace(/\b(gast|kerel|maat|bro|meid|girl)\b/gi, "vriend");

  return transformOutfitResultText(result, neutralize);
}

function transformOutfitResultText(
  result: OutfitResultData,
  transform: (text: string) => string,
): OutfitResultData {
  return {
    ...result,
    roast: transform(result.roast),
    shareQuote: transform(result.shareQuote),
    alternativeQuotes: result.alternativeQuotes.map(transform),
    worksWell: result.worksWell.map(transform),
    canImprove: result.canImprove.map(transform),
    stylingTips: result.stylingTips.map(transform),
    shoppingSuggestions: result.shoppingSuggestions.map((suggestion) => {
      const searchQuery = transform(suggestion.searchQuery);
      const productUrl = createControlledZalandoUrl(searchQuery);
      return {
        ...suggestion,
        title: transform(suggestion.title),
        reason: transform(suggestion.reason),
        searchQuery,
        productUrl,
        affiliateUrl: productUrl,
      };
    }),
  };
}

function normalizeRoast(
  value: string,
  inventory: ClothingInventoryItem[],
  fallbackRoast: string,
) {
  const candidates = extractRoastSentences(value).filter((sentence) =>
    referencesOnlyDetectedClothing(sentence, inventory),
  );
  const rankedCandidates = candidates
    .map((sentence, index) => ({
      sentence,
      index,
      score: getRoastSentenceScore(sentence),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 3)
    .sort((left, right) => left.index - right.index)
    .map(({ sentence }) => sentence);

  const fallbackSentences = extractRoastSentences(fallbackRoast);
  const uniqueSentences = [...rankedCandidates, ...fallbackSentences].filter(
    (sentence, index, sentences) =>
      sentences.findIndex(
        (candidate) => candidate.toLowerCase() === sentence.toLowerCase(),
      ) === index,
  );

  return uniqueSentences.slice(0, 3).join("\n");
}

function extractRoastSentences(value: string) {
  const matches = value.match(/[^.!?\n]+(?:[.!?]+|$)/g) ?? [];
  return matches
    .map((sentence) => sentence.replace(/^[\s"'“”‘’•*-]+/, "").trim())
    .filter(Boolean)
    .map((sentence) => /[.!?…]$/.test(sentence) ? sentence : `${sentence}.`);
}

function getRoastSentenceScore(sentence: string) {
  const normalized = sentence.toLowerCase();
  const detailScore = ROAST_DETAIL_TERMS.filter((term) => normalized.includes(term)).length * 3;
  const punchlineScore = /[,;:—-]/.test(sentence) ? 2 : 0;
  const conciseScore = sentence.split(/\s+/).length <= 20 ? 1 : 0;
  return detailScore + punchlineScore + conciseScore;
}

function toNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toStringArray(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstNonEmptyStringArray(...values: unknown[]) {
  for (const value of values) {
    const items = toStringArray(value);
    if (items.length > 0) {
      return items;
    }
  }
  return [];
}

function withFallback(items: string[], fallback: string) {
  return items.length > 0 ? items : [fallback];
}

function normalizeScore(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value.replace(",", "."))
        : Number.NaN;

  return Number.isFinite(parsed) ? Math.min(10, Math.max(1, Math.round(parsed))) : 5;
}

function normalizeShoppingSuggestions(
  value: unknown,
  inventory: ClothingInventoryItem[],
): OutfitResultData["shoppingSuggestions"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const suggestion = item as Record<string, unknown>;
    const title =
      toNonEmptyString(suggestion.title) ??
      toNonEmptyString(suggestion.label);
    const reason = toNonEmptyString(suggestion.reason);
    if (!title || (reason && !referencesOnlyDetectedClothing(reason, inventory))) {
      return [];
    }
    const category = normalizeShopCategory(suggestion.category);
    const searchQuery =
      toNonEmptyString(suggestion.searchQuery) ??
      `${title} ${SHOP_CATEGORY_CONFIG[category]}`;
    const productUrl = createControlledZalandoUrl(searchQuery);

    return [{
      title,
      reason: reason ?? "Dit item kan meer samenhang en richting aan de outfit geven.",
      imageUrl: "",
      productUrl,
      // Later: append approved affiliate tracking parameters here.
      affiliateUrl: productUrl,
      category,
      searchQuery,
    }];
  });
}

function normalizeProAnalysis(
  value: unknown,
  inventory: ClothingInventoryItem[],
): ProAnalysisResult {
  const source = getResultObject(value) ?? {};
  const normalizeAnalysisSection = (
    sectionValue: unknown,
    fallbackSummary: string,
  ): ProAnalysisResult["colorAnalysis"] => {
    const section = getResultObject(sectionValue) ?? {};
    return {
      score: normalizeScore(section.score),
      summary: toNonEmptyString(section.summary) ?? fallbackSummary,
      strengths: filterInventoryConsistentText(toStringArray(section.strengths), inventory),
      improvements: filterInventoryConsistentText(toStringArray(section.improvements), inventory),
    };
  };
  const normalizeScoreSummary = (
    sectionValue: unknown,
    fallbackSummary: string,
  ) => {
    const section = getResultObject(sectionValue) ?? {};
    return {
      score: normalizeScore(section.score),
      summary: toNonEmptyString(section.summary) ?? fallbackSummary,
    };
  };
  const colorAnalysis = normalizeAnalysisSection(
    source.colorAnalysis,
    "De kleurwerking kon slechts beperkt worden beoordeeld.",
  );
  const fitAnalysis = normalizeAnalysisSection(
    source.fitAnalysis,
    "De pasvorm en het silhouet konden slechts beperkt worden beoordeeld.",
  );
  const cohesionAnalysis = normalizeAnalysisSection(
    source.cohesionAnalysis,
    "De samenhang tussen de zichtbare kledingstukken is neutraal.",
  );
  const occasionFit = normalizeScoreSummary(
    source.occasionFit,
    "De outfit is redelijk bruikbaar voor de gekozen gelegenheid.",
  );
  const trendScore = normalizeScoreSummary(
    source.trendScore,
    "De outfit gebruikt een tijdloze basis met beperkte trendinformatie.",
  );
  const scoreBreakdownSource = getResultObject(source.scoreBreakdown) ?? {};

  return {
    overallScore: normalizeScore(source.overallScore),
    styleIdentity:
      toNonEmptyString(source.styleIdentity) ?? "Verzorgde, eigentijdse basisstijl",
    styleCategories: withFallback(
      toStringArray(source.styleCategories).slice(0, 4),
      "Eigentijdse basisstijl",
    ),
    wornColors: withFallback(
      toStringArray(source.wornColors).slice(0, 8),
      "Kleuren beperkt zichtbaar",
    ),
    colorAnalysis,
    fitAnalysis,
    cohesionAnalysis,
    occasionFit,
    trendScore,
    contextAnalysis: normalizeContextAnalysis(source.contextAnalysis, occasionFit),
    scoreBreakdown: {
      style: normalizeScore(scoreBreakdownSource.style ?? cohesionAnalysis.score),
      colors: normalizeScore(scoreBreakdownSource.colors ?? colorAnalysis.score),
      fit: normalizeScore(scoreBreakdownSource.fit ?? fitAnalysis.score),
      trends: normalizeScore(scoreBreakdownSource.trends ?? trendScore.score),
      context: normalizeScore(scoreBreakdownSource.context ?? occasionFit.score),
    },
    strengths: withFallback(
      filterInventoryConsistentText(toStringArray(source.strengths), inventory),
      "De outfit heeft een herkenbare en bruikbare basis.",
    ),
    improvementPoints: [
      ...filterInventoryConsistentText(toStringArray(source.improvementPoints), inventory),
      "Maak de gekozen stijlrichting consequenter in kleur.",
      "Let op een rustigere samenhang tussen de zichtbare onderdelen.",
      "Kies één duidelijke prioriteit voor de volledige outfit.",
    ].slice(0, 3),
    stylistAdvice: (() => {
      const advice = toNonEmptyString(source.stylistAdvice);
      return advice && referencesOnlyDetectedClothing(advice, inventory)
        ? advice
        : "Behoud de sterke basis en werk met één duidelijke stijlrichting.";
    })(),
    suggestedUpgrades: filterInventoryConsistentText(
      toStringArray(source.suggestedUpgrades),
      inventory,
    ),
    shopSuggestions: normalizeProShopSuggestions(source.shopSuggestions, inventory),
  };
}

function normalizeContextAnalysis(
  value: unknown,
  fallback: { score: number; summary: string },
): ProAnalysisResult["contextAnalysis"] {
  const contexts = new Map<string, { score: number; summary: string }>();

  if (Array.isArray(value)) {
    value.forEach((item) => {
      const source = getResultObject(item);
      const occasion = toNonEmptyString(source?.occasion);
      if (!source || !occasion || !OUTFIT_OCCASIONS.includes(occasion as OutfitOccasion)) {
        return;
      }
      contexts.set(occasion, {
        score: normalizeScore(source.score),
        summary:
          toNonEmptyString(source.summary) ??
          "De geschiktheid voor deze context kon beperkt worden beoordeeld.",
      });
    });
  }

  return (["Date", "Werk", "School", "Gym", "Feest", "Festival"] as const).map((occasion) => ({
    occasion,
    ...(contexts.get(occasion) ?? fallback),
  }));
}

function normalizeProShopSuggestions(
  value: unknown,
  inventory: ClothingInventoryItem[],
): ProAnalysisResult["shopSuggestions"] {
  const normalized = normalizeShoppingSuggestions(value, inventory);
  const sourceItems = Array.isArray(value) ? value : [];

  return normalized.map((suggestion, index) => {
    const source = getResultObject(sourceItems[index]) ?? {};
    return {
      ...suggestion,
      brand: toNonEmptyString(source.brand) ?? "Merk naar keuze",
      improvementPoint:
        toNonEmptyString(source.improvementPoint) ??
        "Versterkt de samenhang en stijlrichting van de outfit.",
    };
  });
}

function normalizeShopCategory(value: unknown): ShopCategory {
  return typeof value === "string" && value in SHOP_CATEGORY_CONFIG
    ? value as ShopCategory
    : "accessoires";
}

function createControlledZalandoUrl(searchQuery: string) {
  return `https://www.zalando.nl/catalogus/?q=${encodeURIComponent(searchQuery)}`;
}

function fillAlternativeQuotes(
  quotes: string[],
  shareQuote: string,
  inventory: ClothingInventoryItem[],
  styleFallbacks: string[],
  positiveOnly = false,
) {
  const validQuotes = quotes.filter(
    (quote) =>
      isValidShareQuote(quote) &&
      referencesOnlyDetectedClothing(quote, inventory) &&
      (!positiveOnly || isPositiveStyleCoachText(quote)),
  );
  const uniqueQuotes = [
    ...validQuotes,
    ...styleFallbacks,
    ...FALLBACK_ALTERNATIVE_QUOTES,
  ].filter(
    (quote, index, allQuotes) =>
      quote.toLowerCase() !== shareQuote.toLowerCase() &&
      allQuotes.findIndex((item) => item.toLowerCase() === quote.toLowerCase()) === index,
  );

  return uniqueQuotes.slice(0, 2);
}

function positiveStyleCoachText(value: string | null) {
  return value && isPositiveStyleCoachText(value) ? value : null;
}

function isPositiveStyleCoachText(value: string) {
  return !/\b(mist|fout|probleem|slechter|slecht|saai|chaotisch|twijfel|crisis|redden|verbeter|moet|zou moeten)\b/i.test(
    value,
  );
}

function selectValidQuote(
  candidates: Array<string | null>,
  inventory: ClothingInventoryItem[],
  fallbacks: string[],
) {
  return [...candidates, ...fallbacks].find(
    (quote): quote is string =>
      typeof quote === "string" &&
      isValidShareQuote(quote) &&
      referencesOnlyDetectedClothing(quote, inventory),
  ) ?? FALLBACK_SHARE_QUOTES[0];
}

function isValidShareQuote(value: string) {
  const quote = value.trim();
  const words = quote.split(/\s+/).filter(Boolean);
  const lastWord = words.at(-1)?.toLowerCase().replace(/[.!?]+$/, "") ?? "";
  const sentenceMarks = quote.match(/[.!?]/g) ?? [];

  return (
    words.length >= 6 &&
    words.length <= 12 &&
    sentenceMarks.length === 1 &&
    /[.!?]$/.test(quote) &&
    !/(?:\.\.\.|…|:|;)$/.test(quote) &&
    !DANGLING_QUOTE_ENDINGS.has(lastWord) &&
    !containsLikelyEnglish(quote, 1)
  );
}

function filterInventoryConsistentText(
  items: string[],
  inventory: ClothingInventoryItem[],
) {
  return items.filter((item) => referencesOnlyDetectedClothing(item, inventory));
}

function referencesOnlyDetectedClothing(
  text: string,
  inventory: ClothingInventoryItem[],
) {
  const normalized = text.toLowerCase();
  const detectedItems = new Set(inventory.map((item) => item.item));
  const allowedItems = new Set<ClothingItem>(detectedItems);

  if (inventory.some((item) => ["Jeans", "Chino", "broek"].includes(item.item))) {
    allowedItems.add("broek");
  }
  if (inventory.some((item) => ["Sneakers", "Nette schoenen", "Boots", "schoenen"].includes(item.item))) {
    allowedItems.add("schoenen");
  }
  if (inventory.some((item) => ["Vest", "Jas", "Blazer", "bovenlaag"].includes(item.item))) {
    allowedItems.add("bovenlaag");
  }
  if (inventory.some((item) => ["Tas", "Horloge", "accessoire"].includes(item.item))) {
    allowedItems.add("accessoire");
  }

  if (containsWholeWord(normalized, "shirt")) {
    return false;
  }

  return CLOTHING_ITEMS.every((item) => {
    const mentionsItem = CLOTHING_REFERENCE_TERMS[item].some((term) =>
      containsWholeWord(normalized, term),
    );
    return !mentionsItem || allowedItems.has(item);
  });
}

function containsWholeWord(text: string, term: string) {
  return new RegExp(`(^|[^a-zà-ÿ])${escapeRegExp(term)}([^a-zà-ÿ]|$)`, "i").test(text);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeClothingInventory(value: unknown): ClothingInventoryItem[] {
  const source = getResultObject(value);
  if (!source || !Array.isArray(source.detectedClothing)) {
    return [];
  }

  const inventory = source.detectedClothing.flatMap<ClothingInventoryItem>((entry) => {
    const item = getResultObject(entry);
    if (!item || typeof item.item !== "string") {
      return [];
    }
    const itemName = item.item;

    const detectedItem = CLOTHING_ITEMS.find(
      (candidate) => candidate.toLowerCase() === itemName.toLowerCase(),
    );
    if (!detectedItem) {
      return [];
    }

    const confidence: ClothingInventoryItem["confidence"] | null =
      item.confidence === "hoog"
        ? "hoog"
        : item.confidence === "middel"
          ? "middel"
          : null;
    if (!confidence) {
      return [];
    }

    return [{
      item: detectedItem,
      color: toNonEmptyString(item.color) ?? "onbekende kleur",
      confidence,
    }];
  });

  return inventory.filter(
    (entry, index, entries) =>
      entries.findIndex((candidate) => candidate.item === entry.item) === index,
  );
}

function formatClothingInventory(inventory: ClothingInventoryItem[]) {
  if (inventory.length === 0) {
    return "- Geen specifiek kledingstuk met voldoende zekerheid gedetecteerd.";
  }

  return inventory
    .map((item) => `- ${item.color} ${item.item} (zekerheid: ${item.confidence})`)
    .join("\n");
}

function generatedResultNeedsCorrection(
  value: unknown,
  inventory: ClothingInventoryItem[],
) {
  const source = getResultObject(value);
  const roast = getRoastText(value);
  if (!source || !roast || containsLikelyEnglish(roast)) {
    return true;
  }

  const shareQuote = toNonEmptyString(source.shareQuote);
  const alternatives = toStringArray(source.alternativeQuotes);
  const analysisText = [
    roast,
    ...toStringArray(source.worksWell),
    ...toStringArray(source.canImprove),
    ...firstNonEmptyStringArray(source.stylingTips, source.tips, source.advice),
  ];

  return (
    !shareQuote ||
    !isValidShareQuote(shareQuote) ||
    !referencesOnlyDetectedClothing(shareQuote, inventory) ||
    alternatives.length !== 2 ||
    alternatives.some(
      (quote) =>
        !isValidShareQuote(quote) ||
        !referencesOnlyDetectedClothing(quote, inventory),
    ) ||
    analysisText.some((text) => !referencesOnlyDetectedClothing(text, inventory))
  );
}

function containsLikelyEnglish(text: string, minimumSignals = 2) {
  const normalized = ` ${text.toLowerCase().replace(/[^a-zà-ÿ]+/g, " ")} `;
  const englishSignals = [
    " the ",
    " this outfit ",
    " your outfit ",
    " shoes are ",
    " could be ",
    " would be ",
    " should ",
    " looks like ",
    " with the ",
    " and the ",
    " good choice ",
    " you are ",
    " you should ",
  ];

  return englishSignals.filter((signal) => normalized.includes(signal)).length >= minimumSignals;
}

async function detectClothingInventory(openai: OpenAI, image: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Je bent een nauwkeurige kledingherkenner. Identificeer uitsluitend duidelijk zichtbare kleding en accessoires. Leid nooit gender, lichaamstype, leeftijd of identiteit af. Bij twijfel tussen specifieke typen kies je de veilige generieke term bovenlaag, schoenen, broek of accessoire. Verzin niets.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Maak eerst een interne kledinginventaris voor latere stylingfeedback.

Toegestane items, in herkenningsprioriteit:
T-shirt, Polo, Overhemd, Vest, Trui, Hoodie, Jas, Blazer, Jeans, Chino, Sneakers, Nette schoenen, Boots, Tas, Horloge.

Bij lage zekerheid gebruik je alleen:
bovenlaag, schoenen, broek, accessoire.

Regels:
- OutfitRoaster-formule voor iedere roastregel: begin met een zichtbaar detail, maak daarna een logisch contrast of vergelijking en eindig met de clou.
- Minimaal één van de drie roastregels gebruikt een rake vergelijking die direct uit de zichtbare outfit volgt.
- Humor zonder zichtbare observatie is verboden.
- Laat het klinken als een snelle scherpe vriend, nooit als een AI-analyse.
- Neem alleen items op die werkelijk zichtbaar zijn.
- Onderscheid Polo, Overhemd, Vest, Jas en Blazer zorgvuldig.
- Noem per item een korte zichtbare kleur.
- Gebruik uitsluitend zekerheid "hoog" of "middel".
- Output alleen geldige JSON:
{
  "detectedClothing": [
    {
      "item": "Polo",
      "color": "donkerblauw",
      "confidence": "hoog"
    }
  ]
}`,
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message.content;
    return content
      ? normalizeClothingInventory(JSON.parse(content) as unknown)
      : [];
  } catch (error) {
    console.error("Clothing inventory detection failed:", error);
    return [];
  }
}

function getRoastLevelInstructions(roastLevel: OutfitRoastLevel) {
  switch (roastLevel) {
    case "Stijlcoach":
      return `
Roastniveau: ✨ Stijlcoach
- Focus primair op zichtbare sterke punten, stijlwinsten en zelfvertrouwen.
- Vermijd roasttaal en kritiek; benoem alleen een probleem als dat absoluut noodzakelijk is.
- Geef standaard geen stylingtips en vertel niet wat de gebruiker moet veranderen.
- Laat stylingTips en canImprove standaard lege arrays zijn.
- Wees positief maar eerlijk en gebruik alleen humor die het zelfvertrouwen versterkt.
- Geef een hoge score wanneer de outfit dat zichtbaar verdient.
- Maak shareQuote altijd positief, zelfverzekerd en social-mediawaardig.
- Schrijf in de sfeer van: "Deze outfit weet precies wat hij wil zijn.", "Rustig, stijlvol en verrassend goed gecombineerd.", "Deze look heeft geen excuses nodig." en "Simpel gedaan, slim uitgevoerd."
`;
    case "Genadeloos":
      return `
Roastniveau: Genadeloos
- Gebruik maximale roastenergie en directe Nederlandse humor.
- Maak iedere regel zeer grappig, scherp en screenshotwaardig.
- Wees een tikje bruut, maar nooit hatelijk, discriminerend of persoonlijk.
- Roast uitsluitend de outfit en stylingkeuzes.
`;
    default:
      return `
Roastniveau: Pittig
- Gebruik scherpe, grappige en directe Nederlandse humor.
- Gebruik Nederlandse humor en plaag direct, maar nooit hatelijk.
- Balanceer de roast met bruikbaar stijladvies.
- Wees scherper dan Stijlcoach, maar minder extreem dan Genadeloos.
- Iedere regel heeft een duidelijke punchline.
- Roast uitsluitend de outfit en nooit de persoon.
`;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      image?: unknown;
      mode?: unknown;
      occasion?: unknown;
      roastLevel?: unknown;
      feedbackStyle?: unknown;
      persona?: unknown;
      intensity?: unknown;
      profile?: unknown;
    };
    const mode: OutfitCheckMode =
      body.mode === "pro-analysis" ? "pro-analysis" : "roast";
    const occasion = normalizeOccasion(body.occasion);
    const roastLevel = normalizeRoastLevel(
      body.roastLevel,
      body.feedbackStyle ?? body.intensity,
      body.persona,
    );
    const profile = normalizeProfile(body.profile);

    if (mode === "pro-analysis" && !PREMIUM_BETA_ENABLED) {
      const user = await getCurrentUser(request);
      if (!user) {
        return Response.json(
          { error: "Log eerst in om Premium Verdict te gebruiken." },
          { status: 401 },
        );
      }

      const userProfile = await getUserProfile(user);
      if (!hasActivePremium(userProfile)) {
        return Response.json(
          { error: "Een actief Premium-abonnement is vereist voor Premium Verdict." },
          { status: 403 },
        );
      }
    }

    if (!isValidImage(body.image) || !occasion) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing. Add it to .env.local before using /api/outfit-check.");
      return Response.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const clothingInventory = await detectClothingInventory(openai, body.image);

    if (mode === "pro-analysis") {
      const proPrompt = buildProAnalysisPrompt({
        occasion,
        profile,
        clothingInventory: formatClothingInventory(clothingInventory),
      });
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Je bent een serieuze Nederlandse AI-stylist. Geef geen roast of grappen. Gebruik alleen kleding uit de aangeleverde inventaris en antwoord uitsluitend als geldige JSON.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: proPrompt },
              { type: "image_url", image_url: { url: body.image } },
            ],
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.35,
      });
      const proContent = completion.choices[0]?.message.content;
      if (!proContent) {
        return Response.json({ error: "Empty Pro Analysis response" }, { status: 500 });
      }

      let parsedProAnalysis: unknown;
      try {
        parsedProAnalysis = JSON.parse(proContent) as unknown;
      } catch {
        return Response.json({ error: "Invalid Pro Analysis response" }, { status: 500 });
      }

      return Response.json({
        proAnalysis: normalizeProAnalysis(parsedProAnalysis, clothingInventory),
      });
    }

    const userPrompt = `
Gelegenheid: ${occasion}
Roastniveau: ${roastLevel}
Voor wie: ${profile}

Gedetecteerde kledinginventaris — dit is de enige bron voor kledingnamen:
${formatClothingInventory(clothingInventory)}

${getRoastLevelInstructions(roastLevel)}

Regels:
- Gebruik de kledinginventaris hierboven consequent voor roast, shareQuote, alternativeQuotes, worksWell, canImprove, stylingTips en redenen bij shopsuggesties.
- Noem nooit een kledingstuk dat niet in de inventaris staat.
- Als een specifiek type niet zeker is, gebruik uitsluitend de generieke inventaristerm bovenlaag, schoenen, broek of accessoire.
- Herclassificeer de kleding niet opnieuw tijdens het schrijven.
- De gelegenheid bepaalt de context: Date, Werk, School, Gym, Feest of Festival.
- Het roastniveau bepaalt de toon: Stijlcoach, Pittig of Genadeloos.
- Houd gelegenheid en roastniveau strikt gescheiden; verzin geen extra rol of persona.
- Leid gender nooit af uit de foto. De keuze bij "Voor wie" hierboven is de enige toegestane bron.
- Bij "Man": gebruik waar nodig natuurlijke mannelijke Nederlandse bewoording. "Gast", "kerel" of "maat" mag spaarzaam, maar de roast blijft over de outfit gaan.
- Bij "Vrouw": gebruik natuurlijke vrouwelijke of neutrale Nederlandse bewoording. "Meid" of "girl" mag spaarzaam. Gebruik nooit gast, kerel, maat, bro of een andere mannelijke aanspreekvorm.
- Bij "Zeg ik liever niet": schrijf volledig genderneutraal. Gebruik nooit gast, kerel, maat, bro, meid, girl of een andere gendergebonden aanspreekvorm.
- Roast altijd de outfit, kledingcombinatie en styling; nooit de persoon.
- Beoordeel de outfit specifiek voor de gekozen gelegenheid.
- Bij Date: beoordeel eerste indruk, zelfvertrouwen en date-vibe.
- Bij Werk: beoordeel professionaliteit, geloofwaardigheid en netheid.
- Bij School: beoordeel comfort, zelfvertrouwen en een casual passende uitstraling.
- Bij Gym: beoordeel sportieve pasvorm, praktisch gebruik en gym-vibe.
- Bij Feest: beoordeel de outfit voor verjaardagen, borrels, uitgaan, diners en sociale evenementen. Focus op uitstraling, comfort en een sterke entree.
- Bij Festival: beoordeel vibe, expressie, comfort en opvallende kledingdetails.
- Schrijf alle feedback altijd in het Nederlands, inclusief shareQuote en alternativeQuotes.
- Genereer nooit Engelse quotes en mix nooit Nederlands met Engels.
- Schrijf voor een Nederlands publiek.
- Score is 1 t/m 10
- Het veld roast bevat exact 3 korte Nederlandse feedbackzinnen, elk op een eigen regel.
- Bij Stijlcoach zijn dit positieve confidence-regels over sterke punten en stijlwinsten.
- Bij Pittig en Genadeloos zijn roastregels toegestaan.
- Iedere feedbackregel heeft een duidelijke clou en is zelfstandig deelbaar.
- Pas de toon strikt aan het gekozen roastniveau aan. Stijlcoach is positief, zelfverzekerd en niet-corrigerend; Pittig en Genadeloos zijn directer.
- Noem waar mogelijk zichtbare details die letterlijk in de kledinginventaris staan.
- Vermijd algemene feedback zoals "je outfit is leuk" of "dit past niet goed".
- Gebruik nooit: "interessante keuze", "stijlvolle uitstraling", "modieuze look", "leuke combinatie", "persoonlijk vind ik", "esthetisch", "fashion-forward", "trendy uitstraling", "uitgebalanceerd" of "harmonisch".
- Schrijf nooit 4 of meer feedbackzinnen of regels.
- Roast uitsluitend kleding, styling en geschiktheid voor de gelegenheid; nooit leeftijd, lichaam, gewicht, afkomst, beperking, genderidentiteit of aantrekkelijkheid van de persoon.
- Gebruik deze voorbeelden alleen als stijlreferentie en neem ze niet letterlijk over:
  "De schoenen zijn klaar voor actie, maar de bovenlaag plant een vergadering."
  "Deze outfit heeft meer twijfel dan een groepsapp waar niemand durft te kiezen."
  "Je broek zegt casual, je schoenen zeggen: ik ben per ongeluk meegekomen."
- Schrijf origineel en imiteer geen echte stylist of televisiepersoonlijkheid.
- Genereer altijd een apart veld shareQuote.
- Genereer daarnaast exact 2 verschillende alternativeQuotes.
- Kies de sterkste en meest deelbare quote als shareQuote.
- Iedere quote is één complete, natuurlijk klinkende Nederlandse zin van 6 tot 12 woorden.
- Eindig iedere quote met één punt, vraagteken of uitroepteken.
- Eindig nooit met ..., …, een dubbele punt, puntkomma of een onafgemaakte bijzin.
- Vermijd losse eindwoorden zoals van, met, zonder, tussen, naar, maar, en, de of het.
- Gebruik geen Engelse woorden in de quotes.
- Laat iedere quote alleen een kledingdetail noemen wanneer dat exact in de inventaris staat.
- Alle quotes passen bij het roastniveau, zijn modieus en geschikt voor sociale media.
- De 3 quotes mogen niet hetzelfde idee of dezelfde formulering herhalen.
- shareQuote is een korte, harde one-liner voor het deelbeeld.
- shareQuote is maximaal 12 woorden, precies 1 zin en bevat geen tweede zin.
- shareQuote bevat geen uitleg, geen advies, geen bullets en geen vriendelijke AI-taal.
- shareQuote volgt duidelijk het gekozen roastniveau en is memorabel.
- Bij Stijlcoach is shareQuote zelfverzekerd, positief en goed deelbaar.
- Bij Stijlcoach mogen shareQuote en alternativeQuotes nooit kritiek, correcties of roasttaal bevatten.
- shareQuote roast alleen outfit/stijlkeuzes, nooit iemands identiteit, lichaam of beschermde kenmerken.
- shareQuote is meme-waardig, direct begrijpelijk en belangrijker dan de volledige roast.
- Voorbeelden shareQuote, alleen als stijlrichting: "Je schoenen hebben dit niet vooraf besproken.", "Deze outfit zit nog in de conceptfase.", "Hier is vergaderd maar niet besloten.", "Je look heeft meerdere projectleiders.", "Dit oogt als een groepsproject."
- Analyse en stylingtips zijn direct, uitgesproken en modegericht.
- Vermijd zachte algemene zinnen zoals "past goed bij de outfit" of "goede combinatie"; schrijf concreet welk item wat doet.
- Voorbeeld goed: "De witte sneakers houden de outfit fris en eigentijds. Sterke keuze."
- Voorbeeld goed: "De broek breekt het silhouet. Een slankere pasvorm maakt het geheel direct scherper."
- Gebruik actuele modecontext als dat helpt, maar verzin geen merken of exacte trends die je niet uit de foto kunt afleiden
- Bij Pittig en Genadeloos bevatten worksWell, canImprove en stylingTips elk 3 tot 5 concrete punten.
- Bij Stijlcoach bevat worksWell 3 tot 5 concrete stijlwinsten en zijn canImprove en stylingTips standaard lege arrays.
- Shopping suggestions bevatten alleen title, reason, category en searchQuery.
- Gebruik voor category uitsluitend: schoenen, broeken, tops, jassen, accessoires of sportkleding.
- Genereer geen productUrl, affiliateUrl, imageUrl, domeinnaam of willekeurige Zalando-link; de server vult gecontroleerde Zalando-links in.
- Laat de reden voor iedere shopsuggestie expliciet aansluiten op een item uit de inventaris, zonder een bestaand kledingstuk opnieuw te benoemen als een ander type.
- Bij Stijlcoach zijn shopsuggesties optionele aanvullingen op een sterke look, nooit correcties op fouten.
- Geef 3 tot 5 shopping suggestions die passen bij de outfit, gelegenheid en actuele modecontext
- Voorbeeld searchQuery: "minimalistische witte sneakers heren", "donkere rechte jeans", "overshirt in crème"
- Geen seksuele opmerkingen
- Geen bodyshaming
- Geen beoordeling van uiterlijk
- Alleen outfit beoordelen
- Scorekalibratie: 7 of hoger betekent goed met kleine verbeterpunten; 8 of hoger is sterk; 9 of hoger is uitzonderlijk deelbaar; 10 alleen bij een oprecht uitzonderlijke outfit. Geef geen overdreven hoge score.
- Output altijd als geldige JSON volgens exact dit format:
{
  "roast": "string",
  "shareQuote": "string",
  "alternativeQuotes": ["string", "string"],
  "worksWell": ["string"],
  "canImprove": ["string"],
  "stylingTips": ["string"],
  "shoppingSuggestions": [
    {
      "title": "string",
      "reason": "string",
      "category": "schoenen | broeken | tops | jassen | accessoires | sportkleding",
      "searchQuery": "string"
    }
  ],
  "score": number
}
`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          // Privacy: uploaded outfit images are only used for the AI analysis request and are not stored by this application.
          { type: "image_url", image_url: { url: body.image } },
        ],
      },
    ];

    async function generateResult(
      activeMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: number,
    ) {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: activeMessages,
        response_format: { type: "json_object" },
        temperature,
      });

      return completion.choices[0]?.message.content;
    }

    let content = await generateResult(messages, 0.9);
    if (!content) {
      console.error("OpenAI returned an empty outfit response.");
      return Response.json({ error: "Empty response" }, { status: 500 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content) as unknown;
    } catch {
      parsed = null;
    }

    let parsedObject = getResultObject(parsed);
    let roastText = getRoastText(parsed);
    const needsDutchRewrite = generatedResultNeedsCorrection(
      parsed,
      clothingInventory,
    );

    if (needsDutchRewrite) {
      const correctionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...messages,
        { role: "assistant", content },
        {
          role: "user",
          content: `Herschrijf dit volledige JSON-resultaat nu strikt volgens de regels.
Gebruik uitsluitend deze kledinginventaris:
${formatClothingInventory(clothingInventory)}

Behoud duidelijk roastniveau ${roastLevel}, gelegenheid ${occasion} en de keuze "Voor wie": ${profile}. Leid gender nooit af uit de foto. Noem geen enkel ander kledingstuk en herclassificeer niets. Gebruik bij twijfel alleen een generieke term die letterlijk in de inventaris staat. Schrijf natuurlijk Nederlands. Behoud het exacte JSON-format. Maak shareQuote één complete zin van 6 tot 12 woorden. Voeg exact 2 unieke alternativeQuotes toe, ook complete Nederlandse zinnen van 6 tot 12 woorden. Geen quote eindigt met ..., …, :, ; of een onafgemaakte bijzin. Maak het veld roast exact 3 korte feedbackzinnen, elk op een eigen regel en met een duidelijke clou. Bij Stijlcoach zijn alle regels en quotes positief, zelfverzekerd en niet-corrigerend; laat canImprove en stylingTips dan leeg. Pas de overige velden aan op de inventaris.`,
        },
      ];

      content =
        (await generateResult(correctionMessages, 0.65)) ??
        "";

      try {
        parsed = JSON.parse(content) as unknown;
      } catch {
        parsed = null;
      }

      parsedObject = getResultObject(parsed);
      roastText = getRoastText(parsed);
    }

    if (!parsedObject) {
      console.error("OpenAI returned an invalid or non-Dutch outfit response.", parsed);
      return Response.json({ error: "Invalid AI response" }, { status: 500 });
    }

    if (
      hasValidRoast(parsed) &&
      typeof roastText === "string" &&
      !containsLikelyEnglish(roastText)
    ) {
      return Response.json(
        normalizeOutfitResult(
          parsedObject,
          roastText,
          clothingInventory,
          roastLevel,
          profile,
        ),
      );
    }

    if (typeof roastText === "string" && containsLikelyEnglish(roastText)) {
      console.error("OpenAI returned a likely English outfit response.", parsed);
      return Response.json({ error: "Invalid AI response" }, { status: 500 });
    }

    console.warn("OpenAI response did not include a roast; using Dutch fallback.", parsed);
    return Response.json(
      normalizeOutfitResult(
        parsedObject,
        ROAST_LEVEL_FALLBACKS[roastLevel].roast,
        clothingInventory,
        roastLevel,
        profile,
      ),
    );
  } catch (error) {
    console.error("Outfit check API error:", error);
    return Response.json({ error: "Outfit check failed" }, { status: 500 });
  }
}
