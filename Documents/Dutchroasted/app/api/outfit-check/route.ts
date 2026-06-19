import OpenAI from "openai";
import {
  OUTFIT_INTENSITIES,
  OUTFIT_OCCASIONS,
  OUTFIT_PROFILES,
  type OutfitProfile,
  type OutfitResultData,
} from "@/lib/outfitTypes";

const MODEL = "gpt-4o-mini";
const LEGACY_PARTY_OCCASION = "Feest";
const FALLBACK_SHARE_QUOTES = [
  "Deze outfit heeft meer twijfel dan een volle groepsapp.",
  "De styling mist richting, maar blijft opvallend overeind.",
  "Deze look heeft potentie, maar wacht nog op een besluit.",
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
  "top",
  "schoenen",
  "broek",
  "bovenlaag",
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
  top: ["top"],
  schoenen: ["schoenen"],
  broek: ["broek"],
  bovenlaag: ["bovenlaag"],
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
Je bent Outfit Roaster, een scherpe maar behulpzame Nederlandse AI-stylist met een originele, flamboyante televisie-energie. Je bent modisch, theatraal, gevat, speels en direct, zonder een echte persoon te imiteren of bestaande uitspraken over te nemen. Je geeft eerlijke outfitfeedback met humor. Je focust alleen op kleding, styling, kleuren, pasvorm van kleding, accessoires en de gekozen gelegenheid. Je beoordeelt nooit iemands lichaam, gewicht, lichaamsvorm, aantrekkelijkheid, leeftijd, gender, afkomst of gezondheid. Je maakt geen seksueel getinte opmerkingen. Je bent uitgesproken, maar niet kwetsend of discriminerend. Maak duidelijk dat feedback over de outfit gaat, niet over de persoon.

${currentFashionContext}

Belangrijke grenzen:
- Focus alleen op kleding, styling, kleuren, pasvorm van kleding, silhouet, accessoires en de gekozen gelegenheid.
- Beoordeel nooit iemands lichaam, gewicht, lichaamsvorm, aantrekkelijkheid, leeftijd, gender, afkomst, gezondheid of seksuele uitstraling.
- Leid gender nooit af uit de foto, kleding, lichaamsbouw, gezicht, haar of andere zichtbare kenmerken.
- Gebruik alleen een expliciet meegegeven profiel voor mannelijke of vrouwelijke formuleringen.
- Bij profiel "Verras me" gebruik je volledig neutrale Nederlandse formuleringen en noem je nergens gender.
- Geen seksuele opmerkingen, geen bodyshaming, geen discriminatie.
- De roast mag scherp en grappig zijn, maar nooit gemeen of persoonlijk kwetsend.
- Schrijf uitsluitend Nederlands. Gebruik geen Engelse zinnen en meng geen Nederlands met Engels.
- Schrijf de roast als exact 3 korte Nederlandse zinnen, elk op een eigen regel.
- Iedere roastzin heeft een duidelijke clou en moet zelfstandig deelbaar zijn.
- Klink als een scherpe Nederlandse vriend: direct, gevat en een tikje brutaal, maar vriendelijk.
- Maak de roast vermakelijk, modebewust en citeerbaar, met een originele stem.
- Gebruik uitsluitend kledingstukken uit de vooraf aangeleverde kledinginventaris.
- Noem nooit een specifiek kledingstuk dat niet in die inventaris staat.
- Als de inventaris een generieke term gebruikt, neem exact die generieke term over: top, schoenen, broek of bovenlaag.
- Maak de roast specifieker dan "dit is saai": verwijs naar gedetecteerde kledingstukken, combinaties, kleuren of stylingkeuzes.
- Vermijd algemene feedback zoals "je outfit is leuk" of "dit past niet goed".
- Schrijf nooit een vierde roastzin of extra roastregel.
- Voorbeelden zijn alleen stijlreferenties; neem ze niet letterlijk over:
  "De schoenen zijn klaar voor actie, maar de top plant een vergadering."
  "Deze outfit heeft meer twijfel dan een groepsapp waar niemand durft te kiezen."
  "Je broek zegt casual, je schoenen zeggen: ik ben per ongeluk meegekomen."
- Geef precies 3 deelbare quotes totaal: 1 shareQuote en exact 2 unieke alternativeQuotes.
- Iedere quote is één volledige Nederlandse zin van 6 tot 12 woorden.
- Quotes eindigen altijd met een punt, vraagteken of uitroepteken.
- Quotes eindigen nooit met ..., …, een dubbele punt, puntkomma of onafgemaakte bijzin.
- Alle quotes lezen natuurlijk wanneer ze zonder verdere context op een deelkaart staan.
- Alle quotes dupliceren elkaar niet.
- Schrijf direct en modegericht. Vermijd generieke AI-taal zoals "goede balans" zonder concreet kledingstuk of effect.
- Benoem wat een kledingstuk doet voor de outfit: silhouet, laagjes, contrast, materiaal, proportie, kleur, schoenen of accessoires.
- Formuleer analysepunten als duidelijke mode-observaties, bijvoorbeeld: "De jas draagt de outfit en geeft hem een luxe uitstraling" of "De broek breekt het silhouet; een slankere pasvorm tilt dit meteen op."
- Bij feedbackstijl "rotterdams": schrijf als een Rotterdamse steek: droog, direct, straatwijs en met een knipoog. Denk "niet lullen, stylen", maar zonder schelden op de persoon. Je mag woorden gebruiken als "maat", "gozer" of "schat" als dat natuurlijk voelt. Altijd kleding roasten, nooit het lichaam.

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

function normalizeOccasion(value: unknown) {
  if (value === LEGACY_PARTY_OCCASION) {
    return "Sportschool" as const;
  }

  return typeof value === "string" && OUTFIT_OCCASIONS.includes(value as never)
    ? value
    : null;
}

function isValidIntensity(value: unknown): value is string {
  return typeof value === "string" && OUTFIT_INTENSITIES.includes(value as never);
}

function normalizeProfile(value: unknown): OutfitProfile {
  return typeof value === "string" && OUTFIT_PROFILES.includes(value as never)
    ? value as OutfitProfile
    : "Verras me";
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
  profile: OutfitProfile = "Verras me",
  inventory: ClothingInventoryItem[] = [],
): OutfitResultData {
  const roast = normalizeRoast(roastText, inventory);
  const providedQuotes = toStringArray(source.alternativeQuotes);
  const shareQuote = selectValidQuote(
    [
      toNonEmptyString(source.shareQuote),
      toNonEmptyString(source.title),
      ...extractRoastSentences(roast),
    ],
    inventory,
    FALLBACK_SHARE_QUOTES,
  );
  const stylingTips = firstNonEmptyStringArray(
    source.stylingTips,
    source.tips,
    source.advice,
  );

  const result: OutfitResultData = {
    roast,
    shareQuote,
    alternativeQuotes: fillAlternativeQuotes(providedQuotes, shareQuote, inventory),
    worksWell: withFallback(
      filterInventoryConsistentText(toStringArray(source.worksWell), inventory),
      "De outfit heeft een duidelijke basis waarop je verder kunt stylen.",
    ),
    canImprove: withFallback(
      filterInventoryConsistentText(toStringArray(source.canImprove), inventory),
      "Meer samenhang in kleur, pasvorm en accessoires maakt het geheel sterker.",
    ),
    stylingTips: withFallback(
      filterInventoryConsistentText(stylingTips, inventory),
      "Kies één duidelijke stijlrichting en laat kleuren en accessoires daarop aansluiten.",
    ),
    shoppingSuggestions: normalizeShoppingSuggestions(
      source.shoppingSuggestions,
      inventory,
    ),
    score: normalizeScore(source.score ?? source.rating),
  };

  return profile === "Verras me" ? neutralizeOutfitResult(result) : result;
}

function neutralizeOutfitResult(result: OutfitResultData): OutfitResultData {
  const neutralize = (text: string) =>
    text
      .replace(/\b(mannen|heren)\b/gi, "neutrale")
      .replace(/\b(vrouwen|dames)\b/gi, "neutrale")
      .replace(/\b(man|vrouw|jongen|meisje|meneer|mevrouw)\b/gi, "outfit")
      .replace(/\b(hij|zij)\b/gi, "de outfit")
      .replace(/\b(hem|haar)\b/gi, "de styling");

  return {
    ...result,
    roast: neutralize(result.roast),
    shareQuote: neutralize(result.shareQuote),
    alternativeQuotes: result.alternativeQuotes.map(neutralize),
    worksWell: result.worksWell.map(neutralize),
    canImprove: result.canImprove.map(neutralize),
    stylingTips: result.stylingTips.map(neutralize),
    shoppingSuggestions: result.shoppingSuggestions.map((suggestion) => {
      const searchQuery = neutralize(suggestion.searchQuery);
      const productUrl = createControlledZalandoUrl(searchQuery);
      return {
        ...suggestion,
        title: neutralize(suggestion.title),
        reason: neutralize(suggestion.reason),
        searchQuery,
        productUrl,
        affiliateUrl: productUrl,
      };
    }),
  };
}

function normalizeRoast(value: string, inventory: ClothingInventoryItem[]) {
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

  const fallbackSentences = extractRoastSentences(FALLBACK_ROAST);
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
) {
  const validQuotes = quotes.filter(
    (quote) =>
      isValidShareQuote(quote) &&
      referencesOnlyDetectedClothing(quote, inventory),
  );
  const uniqueQuotes = [...validQuotes, ...FALLBACK_ALTERNATIVE_QUOTES].filter(
    (quote, index, allQuotes) =>
      quote.toLowerCase() !== shareQuote.toLowerCase() &&
      allQuotes.findIndex((item) => item.toLowerCase() === quote.toLowerCase()) === index,
  );

  return uniqueQuotes.slice(0, 2);
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

  if (inventory.some((item) => ["T-shirt", "Polo", "Overhemd", "Trui", "Hoodie", "top"].includes(item.item))) {
    allowedItems.add("top");
  }
  if (inventory.some((item) => ["Jeans", "Chino", "broek"].includes(item.item))) {
    allowedItems.add("broek");
  }
  if (inventory.some((item) => ["Sneakers", "Nette schoenen", "Boots", "schoenen"].includes(item.item))) {
    allowedItems.add("schoenen");
  }
  if (inventory.some((item) => ["Vest", "Jas", "Blazer", "bovenlaag"].includes(item.item))) {
    allowedItems.add("bovenlaag");
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
            "Je bent een nauwkeurige kledingherkenner. Identificeer uitsluitend duidelijk zichtbare kleding en accessoires. Leid nooit gender, lichaamstype, leeftijd of identiteit af. Bij twijfel tussen specifieke typen kies je de veilige generieke term top, schoenen, broek of bovenlaag. Verzin niets.",
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
top, schoenen, broek, bovenlaag.

Regels:
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      image?: unknown;
      occasion?: unknown;
      intensity?: unknown;
      profile?: unknown;
    };
    const occasion = normalizeOccasion(body.occasion);
    const profile = normalizeProfile(body.profile);

    if (!isValidImage(body.image) || !occasion || !isValidIntensity(body.intensity)) {
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

    const userPrompt = `
Gelegenheid: ${occasion}
Feedbackstijl: ${body.intensity}
Profielvoorkeur: ${profile}

Gedetecteerde kledinginventaris — dit is de enige bron voor kledingnamen:
${formatClothingInventory(clothingInventory)}

Regels:
- Gebruik de kledinginventaris hierboven consequent voor roast, shareQuote, alternativeQuotes, worksWell, canImprove, stylingTips en redenen bij shopsuggesties.
- Noem nooit een kledingstuk dat niet in de inventaris staat.
- Als een specifiek type niet zeker is, gebruik uitsluitend de generieke inventaristerm top, schoenen, broek of bovenlaag.
- Herclassificeer de kleding niet opnieuw tijdens het schrijven.
- Leid gender nooit af uit de foto. De profielvoorkeur hierboven is de enige toegestane bron.
- Bij profiel "Man": gebruik in minstens één roastzin een natuurlijk mannelijk modewoord zoals herenstijl, herenkleding of herenpasvorm, zonder de persoon zelf te beoordelen.
- Bij profiel "Vrouw": gebruik in minstens één roastzin een natuurlijk vrouwelijk modewoord zoals damesstijl, dameskleding of damespasvorm, zonder de persoon zelf te beoordelen.
- Bij profiel "Verras me": schrijf volledig genderneutraal. Gebruik geen man, vrouw, jongen, meisje, meneer, mevrouw, hij, hem, zijn, zij of haar als persoonsverwijzing.
- Roast altijd de outfit, kledingcombinatie en styling; nooit de persoon.
- Beoordeel de outfit specifiek voor de gekozen gelegenheid.
- Bij Sportschool: herken sportkleding, trainingsschoenen, ademende materialen, bewegingsvrijheid en praktische laagjes. Beoordeel of de outfit logisch en stijlvol werkt voor trainen.
- Schrijf alle feedback altijd in het Nederlands, inclusief shareQuote en alternativeQuotes.
- Genereer nooit Engelse quotes en mix nooit Nederlands met Engels.
- Schrijf voor een Nederlands publiek.
- Score is 1 t/m 10
- Het veld roast bevat exact 3 korte Nederlandse zinnen, elk op een eigen regel.
- Iedere roastzin heeft een duidelijke clou en is scherp, grappig en zelfstandig deelbaar.
- Klink als een scherpe Nederlandse vriend: direct, gevat en een tikje brutaal, maar niet gemeen.
- Noem waar mogelijk zichtbare details die letterlijk in de kledinginventaris staan.
- Vermijd algemene feedback zoals "je outfit is leuk" of "dit past niet goed".
- Schrijf nooit 4 of meer roastzinnen of roastregels.
- Roast uitsluitend kleding, styling en geschiktheid voor de gelegenheid; nooit lichaam, gezicht, leeftijd, gewicht, gender, afkomst of aantrekkelijkheid.
- Gebruik deze voorbeelden alleen als stijlreferentie en neem ze niet letterlijk over:
  "De schoenen zijn klaar voor actie, maar de top plant een vergadering."
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
- Alle quotes zijn scherp, grappig, modieus en geschikt voor sociale media.
- De 3 quotes mogen niet hetzelfde idee of dezelfde formulering herhalen.
- shareQuote is een korte, harde one-liner voor het deelbeeld.
- shareQuote is maximaal 12 woorden, precies 1 zin en bevat geen tweede zin.
- shareQuote bevat geen uitleg, geen advies, geen bullets en geen vriendelijke AI-taal.
- Bij feedbackstijl "roast": shareQuote is Nederlands, scherp, grappig en memorabel.
- Bij feedbackstijl "rotterdams": shareQuote is Nederlands, direct, grappig en Rotterdams van toon.
- shareQuote roast alleen outfit/stijlkeuzes, nooit iemands identiteit, lichaam of beschermde kenmerken.
- Voorbeelden shareQuote roast: "Je schoenen doen overuren om deze outfit te redden.", "Net niet fout, maar zeker niet goed.", "Dit oogt als haastwerk met ambitie."
- Voorbeelden shareQuote rotterdams: "Gozer, zelfs de tram zou je voorbijrijden.", "Niet lelijk, maar ook niet bepaald Coolsingel-materiaal.", "Je outfit staat in de file op de A20.", "Je schoenen kwamen opdagen, de rest niet."
- Bij feedbackstijl "roast": maak het flamboyant, modisch en theatraal.
- Bij feedbackstijl "rotterdams": maak het directer, droger en volkser. Het mag voelen als een Rotterdamse steek, maar blijft behulpzaam en nooit kwetsend.
- Analyse en stylingtips zijn direct, uitgesproken en modegericht.
- Vermijd zachte algemene zinnen zoals "past goed bij de outfit" of "goede combinatie"; schrijf concreet welk item wat doet.
- Voorbeeld goed: "De witte sneakers houden de outfit fris en eigentijds. Sterke keuze."
- Voorbeeld goed: "De broek breekt het silhouet. Een slankere pasvorm maakt het geheel direct scherper."
- Gebruik actuele modecontext als dat helpt, maar verzin geen merken of exacte trends die je niet uit de foto kunt afleiden
- Werkt goed, kan beter en stylingtips bevatten elk 3 tot 5 concrete punten
- Shopping suggestions bevatten alleen title, reason, category en searchQuery.
- Gebruik voor category uitsluitend: schoenen, broeken, tops, jassen, accessoires of sportkleding.
- Genereer geen productUrl, affiliateUrl, imageUrl, domeinnaam of willekeurige Zalando-link; de server vult gecontroleerde Zalando-links in.
- Laat de reden voor iedere shopsuggestie expliciet aansluiten op een item uit de inventaris, zonder een bestaand kledingstuk opnieuw te benoemen als een ander type.
- Geef 3 tot 5 shopping suggestions die passen bij de outfit, gelegenheid en actuele modecontext
- Voorbeeld searchQuery: "minimalistische witte sneakers heren", "donkere rechte jeans", "overshirt in crème"
- Geen seksuele opmerkingen
- Geen bodyshaming
- Geen beoordeling van uiterlijk
- Alleen outfit beoordelen
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

    let content = await generateResult(
      messages,
      body.intensity === "rotterdams" ? 0.9 : 0.95,
    );
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

Noem geen enkel ander kledingstuk en herclassificeer niets. Gebruik bij twijfel alleen een generieke term die letterlijk in de inventaris staat. Schrijf natuurlijk Nederlands. Behoud het exacte JSON-format. Maak shareQuote één complete zin van 6 tot 12 woorden. Voeg exact 2 unieke alternativeQuotes toe, ook complete Nederlandse zinnen van 6 tot 12 woorden. Geen quote eindigt met ..., …, :, ; of een onafgemaakte bijzin. Maak roast exact 3 korte zinnen, elk op een eigen regel en met een duidelijke clou. Pas ook worksWell, canImprove, stylingTips en shopsuggesties aan op de inventaris.`,
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
        normalizeOutfitResult(parsedObject, roastText, profile, clothingInventory),
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
        FALLBACK_ROAST,
        profile,
        clothingInventory,
      ),
    );
  } catch (error) {
    console.error("Outfit check API error:", error);
    return Response.json({ error: "Outfit check failed" }, { status: 500 });
  }
}
