import OpenAI from "openai";
import {
  ApiRequestError,
  enforceRateLimit,
  enforceSameOrigin,
  getDataUrlByteSize,
  hasJpegSignature,
  jsonNoStore,
  readJsonWithLimit,
} from "@/lib/apiSecurity";
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
const MAX_OUTFIT_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_OUTFIT_REQUEST_BYTES = 9 * 1024 * 1024;
const RECENT_OUTPUT_LIMIT = 40;
const LEGACY_OCCASION_MAP: Record<string, (typeof OUTFIT_OCCASIONS)[number]> = {
  Casual: "School",
  Bruiloft: "Date",
  Sollicitatie: "Werk",
  Anders: "School",
  Sportschool: "Gym",
};
const FALLBACK_SHARE_QUOTES = [
  "Deze fit kwam binnen als plan B.",
  "De spiegel vraagt om een teamoverleg.",
  "Deze styling mist een volwassen besluit.",
];
const FALLBACK_ALTERNATIVE_QUOTES = [
  "Zelfs de paskamer vraagt om uitleg.",
  "De outfit zoekt nog een duidelijke eindbaas.",
  "Zelfs de paskamer dacht: succes ermee.",
];
const RECOVERY_SHARE_QUOTES = [
  "De paskamer vraagt hier om een tweede lezing.",
  "Deze fit heeft de briefing hard genegeerd.",
  "De styling kwam binnen zonder eindredacteur.",
  "Dit plan verloor onderweg zijn manager.",
  "De outfit zoekt nog een volwassen besluit.",
  "Ergens knippert een moodboard in paniek.",
  "De spiegel wacht nog op de ondertiteling.",
  "Deze look heeft de vergadering gemist.",
  "De kledingstukken voeren elk hun eigen campagne.",
  "Dit begon als plan en eindigde als bijlage.",
  "De styling heeft de afslag zelfvertrouwen gemist.",
  "Deze outfit vraagt om crisisoverleg.",
];
const FALLBACK_ROAST = [
  "Deze outfit kwam binnen zonder plan en bleef uit koppigheid.",
  "De styling voert overleg, maar niemand heeft de agenda gelezen.",
  "De styling is een groepsproject waar iedereen zichzelf een tien gaf.",
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
    shareQuote: "De styling kwam binnen zonder eindredacteur.",
    alternativeQuotes: [
      "Deze fit heeft de briefing hard genegeerd.",
      "De spiegel vraagt om een teamoverleg.",
    ],
  },
  Genadeloos: {
    roast: [
      "Deze outfit is gevonden in de map concepten.",
      "De styling heeft ruzie met zichzelf en filmt het gevecht.",
      "Zelfs de paskamer keek weg uit plaatsvervangende schaamte.",
    ].join("\n"),
    shareQuote: "Je spiegel heeft vandaag officieel ontslag genomen.",
    alternativeQuotes: [
      "De paskamer vraagt hier om een tweede lezing.",
      "Deze fit kwam binnen zonder toestemming.",
    ],
  },
};
const SOFT_FEEDBACK_TERMS = /\b(misschien|beetje|redelijk|best|aardig|lijkt|lijken|kan|kunnen|zou|zouden|probeer|advies|verbeter|meer samenhang|mist samenhang|kan beter|past niet helemaal|leuke look|simpele look|interessante keuze|goede balans|oogt netjes|komt goed over|prima basis|goede basis|past bij|werkt goed)\b/i;
const FORBIDDEN_PERSON_TERMS = /\b(lichaam|gewicht|dik|dun|mager|gezicht|leeftijd|oud|jong|afkomst|etniciteit|ras|genderidentiteit|seksualiteit|homoseksueel|handicap|beperking|gezondheid|ziek|religie|geloof|aantrekkelijk|lelijk|knap)\b/i;
const COMEDY_SIGNALS = /\b(alsof|zelfs|willekeurig|crisis|groepsapp|powerpoint|software-update|google maps|paskamer|spiegel|vergadering|projectleider|groepsproject|ontslag|conceptfase|persoonlijkheden|leider|toestemming|agenda|ruzie|plan|verdwaald|auditie|stage|teamoverleg|kringloop|action|hema|ikea|marktplaats|vrijmibo|lowlands|pinkpop|scheidsrechter|wedstrijd|competitie|champions league|finale|film|filmtrailer|hoofdrol|figurant|reality|seizoen|storing|internetstoring|moodboard|dresscode|publiek|applaus|deadline|laptop|handtekening|huur|mainstage|camping|garderobe|borrel|sollicitatie|linkedin|teams|basic-fit|warming-up|klas|huiswerk|reserveren|rekening|entree|uitnodiging|briefing|manager|directeur|hoofdkantoor|rij|plattegrond)\b/i;
const PUNCHLINE_STRUCTURES = /\b(alsof|zelfs|niet eens|maar|zonder|terwijl|en niemand|kwam binnen|vraagt om|heeft.*nodig|zoekt nog|mist nog|vergat|verdwaalt|huilt|ontslaat|kijkt mee|geen leider|conceptfase|crisis|ontslag|toestemming|vragen over|PowerPoint|software-update)\b/i;
const OVERUSED_ROAST_TEMPLATES = /\b(drie persoonlijkheden|geen leider|willekeurig gedrukt|powerpoint zonder inhoud|powerpoint zonder spreker|google maps|diplomatieke crisis|software-update die niemand wilde)\b/i;
const HUMOR_ANGLES = [
  "droog sarcasme",
  "absurde metafoor",
  "kantoorhumor",
  "sportcommentaar",
  "technologievergelijking",
  "reality-tv-energie",
  "filmtrailer",
  "dagelijkse situatie",
  "internetcultuur",
  "overdramatische crisis",
] as const;
const QUOTE_OPENING_PATTERNS = [
  "Begin met een botsing tussen twee zichtbare kledingonderdelen.",
  "Begin met: Dit heeft de energie van...",
  "Begin met: Alsof...",
  "Begin met een actie van iemand: Iemand heeft...",
  "Begin met een gevolg: Ergens huilt...",
  "Begin als sportcommentator of wedstrijdverslag.",
  "Begin als kantoor-, project- of vergaderobservatie.",
  "Begin als technologie-, app- of softwarevergelijking.",
  "Begin als reality-tv- of filmtrailercommentaar.",
  "Begin met een overdreven conclusie zonder 'Deze outfit'.",
] as const;
type RoastVariation = {
  id: string;
  angles: string[];
  openingPatterns: string[];
  fallbackOffset: number;
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
  "Jurk",
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
  Jurk: ["jurk", "dress"],
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
Je bent OutfitRoaster. Je klinkt niet als een AI, docent of mode-expert met moeilijke woorden. Je bent die scherpe Nederlandse vriend die binnen drie seconden ziet wat kleding, kleuren, pasvorm of gelegenheid met elkaar doen en daar TikTok-roast comedy van maakt. Je bent snel, brutaal, sarcastisch, onverwacht en nooit gemeen. Je roast uitsluitend de outfit, nooit de persoon.

De gewenste reactie is: "Hahaha, verdomme... daar heeft ie wel gelijk in."

Gouden regel:
- Eerst een concrete zichtbare observatie, daarna humor. Nooit andersom.
- Humor komt uitsluitend uit zichtbare kleuren, schoenen, pasvorm, accessoires, botsende stijlen, gelegenheid of uitstraling.
- Een sterke roastregel bevat waar mogelijk observatie, contrast, vergelijking en punchline.
- Gebruik rake onverwachte vergelijkingen en absurde metaforen die onmiddellijk begrijpelijk zijn. Nederlandse referenties zoals Action, HEMA, IKEA, VrijMiBo, Koningsdag, Lowlands, Pinkpop, bedrijfsuitje, voetbalteam, barbecue, verjaardag, tankstation, kringloop, Marktplaats, groepsapp, buurtfeest of teamoverleg mogen alleen wanneer ze logisch uit de zichtbare outfit volgen.
- Vermijd willekeurige metaforen die niets met de zichtbare outfit te maken hebben.
- Humor gaat vóór uitgebreide modecorrectheid. Een roast is geen stylingles.

${currentFashionContext}

Belangrijke grenzen:
- Focus alleen op kleding, styling, kleuren, pasvorm van kleding, silhouet, accessoires en de gekozen gelegenheid.
- Beoordeel nooit iemands lichaam, gewicht, lichaamsvorm, gezicht, aantrekkelijkheid, leeftijd, afkomst, gender, genderidentiteit, seksualiteit, handicap, gezondheid of religie.
- Leid gender nooit af uit de foto, kleding, lichaamsbouw, gezicht, haar of andere zichtbare kenmerken.
- Gebruik uitsluitend de expliciet meegegeven gender voorkeur voor mannelijke, vrouwelijke of neutrale modebewoording.
- Geen seksuele opmerkingen, geen bodyshaming, geen discriminatie.
- De roast mag hard zijn voor de outfit, maar nooit gemeen of persoonlijk kwetsend voor de drager.
- Schrijf uitsluitend Nederlands. Gebruik geen Engelse zinnen en meng geen Nederlands met Engels.
- Schrijf het veld roast als exact 3 korte Nederlandse feedbackzinnen, elk op een eigen regel.
- Bij Pittig en Genadeloos zijn dit roastregels; bij Stijlcoach zijn dit eerlijke coachingsregels.
- Iedere feedbackzin is kort, punchy en heeft een duidelijke clou.
- Iedere roastregel moet werken als losse TikTok-comment: observatie, botsing en punchline in één zin.
- Als een regel alleen beschrijft wat er mis is, is hij mislukt. Herschrijf hem naar een grap.
- Gebruik vaker concrete situaties als punchline: iemand die binnenkomt, een meeting die ontspoort, een campingrij, een groepsapp, een manager die ontbreekt, een paskamer die vragen stelt.
- Eindig roastregels niet met advies of conclusie, maar met de grap.
- Voor Pittig en Genadeloos geldt: geen enkele roastregel mag klinken als normale stijlanalyse.
- Pas de toon strikt aan het gekozen roastniveau aan; Stijlcoach blijft positief, eerlijk en praktisch.
- Maak de roast sneller, harder en grappiger dan normale modefeedback.
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
- Bedenk intern eerst minimaal 30 verschillende kandidaat-shareQuotes vanuit minstens 5 verschillende humorhoeken. Rangschik ze op scherpte, verrassing, humor, originaliteit en deelbaarheid. Zet uitsluitend de beste kandidaat in shareQuote en gebruik twee duidelijk anders opgebouwde kandidaten als alternativeQuotes. Toon de overige kandidaten nergens.
- De drie teruggegeven quotes mogen niet met hetzelfde zinsformat beginnen en mogen niet dezelfde metafoor herhalen.
- Vermijd dominante vaste openingen. Gebruik niet automatisch steeds "Deze outfit", "Je kledingkast" of "Zelfs de spiegel".
- Gebruik in quotes nooit verzachtende woorden zoals misschien, beetje, redelijk, best, kan of zou.
- Een quote die klinkt als normale modefeedback is ongeldig.
- Schrijf quotes in de sfeer van: "De schoenen hebben de briefing gemist.", "Deze fit kwam binnen als plan B.", "Zelfs de paskamer vraagt om uitleg.", "De styling zoekt nog een volwassen besluit.", "De outfit vraagt om crisisoverleg." Gebruik deze voorbeelden nooit letterlijk.
- Schrijf direct en modegericht. Vermijd generieke AI-taal zoals "goede balans" zonder concreet kledingstuk of effect.
- Benoem wat een kledingstuk doet voor de outfit: silhouet, laagjes, contrast, materiaal, proportie, kleur, schoenen of accessoires.
- Formuleer analysepunten als duidelijke mode-observaties, bijvoorbeeld: "De jas draagt de outfit en geeft hem een luxe uitstraling" of "De broek breekt het silhouet; een slankere pasvorm tilt dit meteen op."
- Laat intensiteit en woordkeuze bepalen door het gekozen roastniveau én de score.
- Score 1-3: genadeloos grappig; de outfit krijgt de volle punchline.
- Score 4-6: scherp en sarcastisch; roast de twijfel en mismatch.
- Score 7-8: geef een compliment met humor; de outfit wint zonder slijmerige taal.
- Score 9-10: hype de outfit alsof die de kamer binnenloopt en huur betaalt.
- Scorekalibratie op 10: 7+ is goed, 8+ is sterk, 9+ is social-mediawaardig en 10 is uitzonderlijk. Geef niet automatisch hoge scores.

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

function createRoastVariation(): RoastVariation {
  const id = crypto.randomUUID();
  const fallbackOffset = hashString(`${id}:${Date.now()}`);

  return {
    id,
    angles: pickRotatedItems(HUMOR_ANGLES, fallbackOffset, 5),
    openingPatterns: pickRotatedItems(
      QUOTE_OPENING_PATTERNS,
      Math.floor(fallbackOffset / 7),
      5,
    ),
    fallbackOffset,
  };
}

function pickRotatedItems<T>(
  items: readonly T[],
  offset: number,
  count: number,
) {
  return Array.from(
    { length: Math.min(count, items.length) },
    (_, index) => items[(offset + index * 3) % items.length],
  );
}

function hashString(value: string) {
  let hash = 0;
  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function isValidImage(value: unknown): value is string {
  return typeof value === "string" &&
    /^data:image\/jpeg;base64,/.test(value) &&
    getDataUrlByteSize(value) <= MAX_OUTFIT_IMAGE_BYTES &&
    hasJpegSignature(value);
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
  variationOffset = 0,
  recentQuotes: string[] = [],
  recentScores: number[] = [],
  occasion: OutfitOccasion = "Date",
): OutfitResultData {
  const score = calibrateRoastScore(
    normalizeRoastScore(source.score ?? source.rating),
    recentScores,
    roastLevel,
  );
  const levelFallback = getScoreAwareFallback(
    roastLevel,
    score,
    variationOffset,
    occasion,
  );
  const isStyleCoach = roastLevel === "Stijlcoach";
  const normalizedRoastText = isStyleCoach
    ? extractRoastSentences(roastText).filter(isPositiveStyleCoachText).join("\n")
    : roastText;
  const roast = normalizeRoast(
    normalizedRoastText || levelFallback.roast,
    inventory,
    levelFallback.roast,
    roastLevel,
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
    [levelFallback.shareQuote, ...FALLBACK_SHARE_QUOTES, ...RECOVERY_SHARE_QUOTES],
    isStyleCoach,
    recentQuotes,
    occasion,
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
      [...levelFallback.alternativeQuotes, ...RECOVERY_SHARE_QUOTES],
      isStyleCoach,
      recentQuotes,
      occasion,
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
    score,
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
  roastLevel: OutfitRoastLevel,
) {
  const candidates = extractRoastSentences(value).filter(
    (sentence) =>
      referencesOnlyDetectedClothing(sentence, inventory) &&
      isSafeOutfitOnlyText(sentence) &&
      sentence.split(/\s+/).length <= 22 &&
      !SOFT_FEEDBACK_TERMS.test(sentence) &&
      !OVERUSED_ROAST_TEMPLATES.test(sentence) &&
      (roastLevel === "Stijlcoach" ||
        (COMEDY_SIGNALS.test(sentence) && PUNCHLINE_STRUCTURES.test(sentence))),
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
  const comedyScore = COMEDY_SIGNALS.test(sentence) ? 4 : 0;
  const blandPenalty = SOFT_FEEDBACK_TERMS.test(sentence) ? -6 : 0;
  const unsafePenalty = FORBIDDEN_PERSON_TERMS.test(sentence) ? -100 : 0;
  const conciseScore = sentence.split(/\s+/).length <= 20 ? 1 : 0;
  return detailScore + punchlineScore + comedyScore + blandPenalty + unsafePenalty + conciseScore;
}

function getOccasionFallbacks(
  occasion: OutfitOccasion,
  score: number,
): { quotes: string[]; roastLines: string[] } {
  const isWeak = score <= 5;
  const isStrong = score >= 8;
  const fallbacks: Record<OutfitOccasion, { quotes: string[]; roastLines: string[] }> = {
    Date: {
      quotes: isStrong
        ? [
            "Deze datefit komt binnen alsof reserveren overbodig was.",
            "De eerste indruk heeft vandaag duidelijk voorrang gekregen.",
            "Deze look betaalt de rekening met zelfvertrouwen.",
          ]
        : [
            "Deze datefit kwam binnen zonder openingszin.",
            "De eerste indruk zoekt nog naar bereik.",
            "Deze outfit flirt vooral met twijfel.",
          ],
      roastLines: isWeak
        ? [
            "De date-vibe staat klaar, maar de styling komt te laat.",
            "De eerste indruk heeft potentie, alleen mist de entree.",
            "Deze outfit wil romantiek, maar vergeet de openingszin.",
          ]
        : [
            "De date-vibe komt rustig binnen en pakt alsnog aandacht.",
            "De styling doet niet te hard en dat werkt verrassend goed.",
            "Deze outfit geeft eerste indruk zonder te gaan schreeuwen.",
          ],
    },
    Werk: {
      quotes: isStrong
        ? [
            "Deze werkfit opent de meeting zonder twijfel.",
            "LinkedIn zet deze outfit zelf bovenaan.",
            "Deze look vraagt om promotie zonder te solliciteren.",
          ]
        : [
            "Deze werkfit staat nog in concept bij HR.",
            "De meeting begint, maar de outfit zoekt agenda.",
            "LinkedIn heeft deze look nog niet goedgekeurd.",
          ],
      roastLines: isWeak
        ? [
            "De werkfit wil professioneel zijn, maar mist overtuigingskracht.",
            "De styling schuift aan bij de meeting zonder agendapunt.",
            "LinkedIn kijkt mee en vraagt om meer autoriteit.",
          ]
        : [
            "De werkfit houdt het netjes en verliest de geloofwaardigheid niet.",
            "De styling komt vergaderruimte-proof binnen zonder overwerk.",
            "LinkedIn hoeft vandaag niet zenuwachtig mee te kijken.",
          ],
    },
    School: {
      quotes: isStrong
        ? [
            "Deze schoolfit haalt aanwezigheid zonder moeite.",
            "De klas kijkt, maar de outfit blijft rustig.",
            "Deze look snapt casual zonder huiswerk.",
          ]
        : [
            "Deze schoolfit heeft de lesbrief gemist.",
            "De klas begint, maar de styling zoekt lokaal.",
            "Deze outfit kwam te laat en zonder uitleg.",
          ],
      roastLines: isWeak
        ? [
            "De schoolfit wil relaxed zijn, maar mist richting.",
            "De styling zit in de klas zonder het hoofdstuk te kennen.",
            "Deze look probeert casual, maar vergeet de samenvatting.",
          ]
        : [
            "De schoolfit blijft relaxed zonder volledig weg te zakken.",
            "De styling doet casual en houdt genoeg zelfvertrouwen over.",
            "Deze look haalt de dag zonder drama of overprestatie.",
          ],
    },
    Gym: {
      quotes: isStrong
        ? [
            "Deze gymfit heeft de warming-up al gewonnen.",
            "Basic-Fit geeft deze look direct een rondleiding.",
            "De training begint, maar de outfit is klaar.",
          ]
        : [
            "Deze gymfit heeft cardio met twijfel gedaan.",
            "Basic-Fit vraagt voorzichtig om uitleg.",
            "De warming-up ziet de outfit al twijfelen.",
          ],
      roastLines: isWeak
        ? [
            "De gymfit wil trainen, maar de styling doet cooling-down.",
            "De schoenen lijken klaar, de rest zoekt motivatie.",
            "Basic-Fit kijkt mee en mist nog wedstrijdmentaliteit.",
          ]
        : [
            "De gymfit is praktisch zonder meteen sporttas-chaos te worden.",
            "De styling kan bewegen en houdt toch genoeg lijn.",
            "Basic-Fit hoeft vandaag geen interventie te plannen.",
          ],
    },
    Feest: {
      quotes: isStrong
        ? [
            "Deze feestfit komt binnen voordat de muziek start.",
            "De borrel heeft zojuist een dresscode gekregen.",
            "Deze look pakt de entree zonder toestemming.",
          ]
        : [
            "Deze feestfit staat nog bij de garderobe.",
            "De borrel wacht, maar de styling twijfelt.",
            "Deze entree mist nog applaus en richting.",
          ],
      roastLines: isWeak
        ? [
            "De feestfit wil binnenkomen, maar blijft bij de garderobe hangen.",
            "De styling zoekt sfeer, maar vergeet de entree.",
            "De borrel is begonnen en deze look leest nog de uitnodiging.",
          ]
        : [
            "De feestfit heeft entree zonder meteen lawaai te maken.",
            "De styling pakt sfeer en houdt het draagbaar.",
            "De borrel krijgt genoeg energie zonder noodverlichting.",
          ],
    },
    Festival: {
      quotes: isStrong
        ? [
            "Deze festivalfit vindt de mainstage zonder plattegrond.",
            "Lowlands laat deze look direct door.",
            "Deze fit overleeft modder en groepsfoto’s.",
          ]
        : [
            "Deze festivalfit zoekt nog de mainstage.",
            "Lowlands vraagt waar de rest van de vibe bleef.",
            "Deze look verdwaalt al vóór de camping.",
          ],
      roastLines: isWeak
        ? [
            "De festivalfit wil mainstage, maar komt binnen als dagplanning.",
            "De styling zoekt vibe, maar staat nog bij de ingang.",
            "Lowlands kijkt mee en mist nog een reden om te dansen.",
          ]
        : [
            "De festivalfit heeft genoeg vibe zonder campingpaniek te worden.",
            "De styling kan een lange dag aan zonder de mainstage te missen.",
            "Lowlands haalt dit niet meteen uit de rij.",
          ],
    },
  };

  return fallbacks[occasion];
}

function getScoreAwareFallback(
  roastLevel: OutfitRoastLevel,
  score: number,
  variationOffset: number,
  occasion: OutfitOccasion = "Date",
) {
  const occasionFallback = getOccasionFallbacks(occasion, score);

  if (roastLevel === "Stijlcoach") {
    const positiveOccasionFallback = getOccasionFallbacks(occasion, Math.max(score, 8));
    const quotes = [
      ...rotateFallbacks(positiveOccasionFallback.quotes, variationOffset),
      ...rotateFallbacks([
      "Rustig binnenkomen en alsnog de hele kamer winnen.",
      "Alsof zelfvertrouwen vandaag gewoon in de styling zat.",
      "De spiegel heeft dit zonder discussie goedgekeurd.",
      "Iemand heeft eenvoud vandaag onverwacht hoofdrolspeler gemaakt.",
      "Dit heeft de energie van moeiteloos gelijk krijgen.",
      "De styling speelt thuis en het publiek weet dat.",
      ], variationOffset),
    ];
    const roastLines = [
      ...rotateFallbacks(positiveOccasionFallback.roastLines, variationOffset + 2),
      ...rotateFallbacks([
      "De styling speelt thuis en kent elke hoek van het veld.",
      "Alsof alle kledingstukken vooraf eindelijk dezelfde groepsapp lazen.",
      "De kleuren kwamen rustig binnen en pakten alsnog de hoofdrol.",
      "Iemand heeft eenvoud hier verrassend veel zelfvertrouwen gegeven.",
      "De spiegel hoeft vandaag werkelijk geen second opinion.",
      "Dit heeft de energie van winnen zonder zichtbaar te zweten.",
      ], variationOffset + 2),
    ];
    return {
      roast: roastLines.slice(0, 3).join("\n"),
      shareQuote: quotes[0],
      alternativeQuotes: quotes.slice(1, 3),
    };
  }

  if (score <= 3) {
    const quotes = [
      ...rotateFallbacks(occasionFallback.quotes, variationOffset),
      ...rotateFallbacks([
      "Deze fit kwam binnen zonder eindredactie.",
      "Ergens huilt een paskamer zachtjes om deze beslissing.",
      "Zelfs de routeplanner zoekt hier een stijlrichting.",
      "Alsof drie kledingkasten tegelijk op verzenden drukten.",
      "De styling speelt vandaag een wedstrijd zonder scheidsrechter.",
      "Iemand heeft de styling live tijdens de storing afgerond.",
      "Dit heeft de energie van een mislukte seizoensfinale.",
      "De broek en schoenen zitten duidelijk in rivaliserende teams.",
      ], variationOffset),
    ];
    const roastLines = [
      ...rotateFallbacks(occasionFallback.roastLines, variationOffset + 3),
      ...rotateFallbacks([
      "Ergens huilt een paskamer en niemand durft te vragen waarom.",
      "Alsof drie kledingkasten tegelijk hun nooduitgang zochten.",
      "De styling speelt een finale zonder regels of scheidsrechter.",
      "Iemand heeft deze styling tijdens een internetstoring afgerond.",
      "Dit kwam binnen als filmtrailer en eindigde als storing.",
      "De kledingonderdelen zitten samen, maar duidelijk niet vrijwillig.",
      ], variationOffset + 3),
    ];
    return {
      roast: roastLines.slice(0, 3).join("\n"),
      shareQuote: quotes[0],
      alternativeQuotes: quotes.slice(1, 3),
    };
  }

  if (score <= 6) {
    const quotes = [
      ...rotateFallbacks(occasionFallback.quotes, variationOffset),
      ...rotateFallbacks([
      "De styling kwam binnen zonder eindredacteur.",
      "De styling houdt teamoverleg zonder een agenda.",
      "Alsof een moodboard halverwege ontslag heeft genomen.",
      "Iemand heeft twijfel hier tot dresscode gepromoveerd.",
      "Dit heeft de energie van een groepsproject zonder manager.",
      "De schoenen en broek spelen duidelijk verschillende competities.",
      "Ergens wacht een stylist nog steeds op uitleg.",
      "Niet eens de groepsapp begrijpt wie hier stuurt.",
      ], variationOffset),
    ];
    const roastLines = [
      ...rotateFallbacks(occasionFallback.roastLines, variationOffset + 4),
      ...rotateFallbacks([
      "De styling houdt overleg, maar niemand noteert de besluiten.",
      "Alsof de styling halverwege zijn eigen briefing vergat.",
      "Iemand heeft twijfel hier verrassend overtuigend aangekleed.",
      "De kleding speelt samen, alleen wel in verschillende competities.",
      "Dit heeft groepsprojectenergie en niemand beheert de deadline.",
      "Ergens wacht een paskamer nog steeds op de plotwending.",
      ], variationOffset + 4),
    ];
    return {
      roast: roastLines.slice(0, 3).join("\n"),
      shareQuote: quotes[0],
      alternativeQuotes: quotes.slice(1, 3),
    };
  }

  if (score <= 8) {
    const quotes = [
      ...rotateFallbacks(occasionFallback.quotes, variationOffset),
      ...rotateFallbacks([
      "Deze outfit probeert niks en wint alsnog de groepsapp.",
      "Alsof moeiteloos vandaag gewoon een officiële dresscode werd.",
      "De styling speelt thuis en kent elke publieksfavoriet.",
      "Iemand heeft eenvoud hier een verrassend sterke finale gegeven.",
      "Dit kwam binnen als bijrol en stal de film.",
      "Zelfs het teamoverleg stemt unaniem vóór deze styling.",
      "De styling doet rustig en pakt alsnog alle aandacht.",
      "Ergens schrijft een moodboard jaloers deze combinatie over.",
      ], variationOffset),
    ];
    const roastLines = [
      ...rotateFallbacks(occasionFallback.roastLines, variationOffset + 1),
      ...rotateFallbacks([
      "Alsof de outfit niks probeert en precies daarom wint.",
      "De styling speelt thuis en het publiek kent het refrein.",
      "Iemand heeft eenvoud hier onverwacht de hoofdrol gegeven.",
      "Dit kwam binnen als bijrol en stal zonder moeite de film.",
      "De styling praat zacht en krijgt alsnog alle aandacht.",
      "Ergens maakt een moodboard haastig aantekeningen van deze combinatie.",
      ], variationOffset + 1),
    ];
    return {
      roast: roastLines.slice(0, 3).join("\n"),
      shareQuote: quotes[0],
      alternativeQuotes: quotes.slice(1, 3),
    };
  }

  const quotes = [
    ...rotateFallbacks(occasionFallback.quotes, variationOffset),
    ...rotateFallbacks([
    "Deze outfit loopt binnen alsof hij huur betaalt.",
    "Alsof de rode loper vandaag persoonlijk werd uitgenodigd.",
    "De styling heeft hoofdrolenergie en weigert auditie te doen.",
    "Iemand heeft zelfvertrouwen hier perfect op maat geleverd.",
    "Dit kwam binnen en maakte de rest figurant.",
    "Zelfs de spiegel vraagt vandaag om een handtekening.",
    "De styling speelt Champions League zonder zichtbaar te zweten.",
    "Ergens annuleert een stylist de concurrentie uit respect.",
    ], variationOffset),
  ];
  const roastLines = [
    ...rotateFallbacks(occasionFallback.roastLines, variationOffset + 5),
    ...rotateFallbacks([
    "Alsof de outfit de locatie bezit en iedereen huur vraagt.",
    "De styling heeft hoofdrolenergie zonder auditie of toestemming.",
    "Iemand heeft zelfvertrouwen hier akelig precies op maat geleverd.",
    "Dit kwam binnen en degradeerde de rest direct tot figurant.",
    "De styling speelt Champions League en viert al de finale.",
    "Ergens sluit een stylist de laptop uit pure tevredenheid.",
    ], variationOffset + 5),
  ];
  return {
    roast: roastLines.slice(0, 3).join("\n"),
    shareQuote: quotes[0],
    alternativeQuotes: quotes.slice(1, 3),
  };
}

function rotateFallbacks(items: string[], offset: number) {
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
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

function toScoreArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "number" ? item : Number(item)))
    .filter((score) => Number.isFinite(score) && score >= 1 && score <= 10)
    .map((score) => Math.round(score * 10) / 10)
    .slice(0, 20);
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

function normalizeRoastScore(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value.replace(",", "."))
        : Number.NaN;

  const baseScore = Number.isFinite(parsed)
    ? Math.min(10, Math.max(1, parsed))
    : 5.4;
  const roundedScore = Math.round(baseScore * 10) / 10;

  if (!Number.isInteger(roundedScore) || roundedScore >= 10) {
    return roundedScore;
  }

  const decimalByScore: Record<number, number> = {
    1: 0.1,
    2: 0.2,
    3: 0.4,
    4: 0.6,
    5: 0.3,
    6: 0.7,
    7: 0.4,
    8: 0.2,
    9: 0.1,
  };

  return Math.round((roundedScore + (decimalByScore[roundedScore] ?? 0.3)) * 10) / 10;
}

function calibrateRoastScore(
  score: number,
  recentScores: number[],
  roastLevel: OutfitRoastLevel,
) {
  if (roastLevel === "Stijlcoach" || recentScores.length < 5) {
    return score;
  }

  const lowScoreRatio =
    recentScores.filter((recentScore) => recentScore <= 3).length /
    recentScores.length;

  if (lowScoreRatio <= 0.4 || score > 3) {
    return score;
  }

  return Math.max(score, 4.2);
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
  excludedQuotes: string[] = [],
  occasion: OutfitOccasion = "Date",
) {
  const validQuotes = quotes.filter(
    (quote) =>
      isValidShareQuote(quote) &&
      !containsMismatchedOccasionMetaphor(quote, occasion) &&
      !containsUnsupportedColorCombinationClaim(quote, inventory) &&
      referencesOnlyDetectedClothing(quote, inventory) &&
      (positiveOnly
        ? isPositiveStyleCoachText(quote)
        : isTikTokWorthyQuote(quote)),
  );
  const uniqueQuotes = [
    ...validQuotes,
    ...styleFallbacks,
    ...FALLBACK_ALTERNATIVE_QUOTES,
  ].filter(
    (quote) =>
      !OVERUSED_ROAST_TEMPLATES.test(quote) &&
      isValidShareQuote(quote) &&
      !containsUnsupportedColorCombinationClaim(quote, inventory) &&
      (positiveOnly
        ? isPositiveStyleCoachText(quote)
        : isTikTokWorthyQuote(quote)) &&
      !containsMismatchedOccasionMetaphor(quote, occasion),
  )
    .filter(
    (quote, index, allQuotes) =>
      quote.toLowerCase() !== shareQuote.toLowerCase() &&
      allQuotes.findIndex((item) => item.toLowerCase() === quote.toLowerCase()) === index,
  );

  const freshQuotes = uniqueQuotes.filter(
    (quote) => !excludedQuotes.some((excluded) => areQuotesTooSimilar(quote, excluded)),
  );

  return selectDiverseQuotes(
    freshQuotes.length >= 2 ? freshQuotes : uniqueQuotes,
    [shareQuote],
    2,
  );
}

function selectDiverseQuotes(
  candidates: string[],
  selected: string[],
  limit: number,
) {
  const result: string[] = [];

  for (const candidate of candidates) {
    const comparisons = [...selected, ...result];
    if (comparisons.every((quote) => !areQuotesTooSimilar(candidate, quote))) {
      result.push(candidate);
    }
    if (result.length === limit) {
      return result;
    }
  }

  for (const candidate of candidates) {
    if (
      !result.includes(candidate) &&
      !selected.some((quote) => quote.toLowerCase() === candidate.toLowerCase())
    ) {
      result.push(candidate);
    }
    if (result.length === limit) {
      break;
    }
  }

  return result;
}

function areQuotesTooSimilar(left: string, right: string) {
  const leftWords = normalizeQuoteWords(left);
  const rightWords = normalizeQuoteWords(right);
  const sharedWords = leftWords.filter((word) => rightWords.includes(word));
  const unionSize = new Set([...leftWords, ...rightWords]).size;
  const similarity = unionSize === 0 ? 1 : sharedWords.length / unionSize;
  const sameOpening =
    leftWords.slice(0, 2).join(" ") === rightWords.slice(0, 2).join(" ");

  return sameOpening || similarity >= 0.42;
}

function normalizeQuoteWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function areResponseQuotesDiverse(quotes: string[]) {
  return quotes.every((quote, index) =>
    quotes.slice(index + 1).every((otherQuote) =>
      !areQuotesTooSimilar(quote, otherQuote),
    ),
  );
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
  positiveOnly = false,
  excludedQuotes: string[] = [],
  occasion: OutfitOccasion = "Date",
) {
  const validQuotes = [...candidates, ...fallbacks].filter(
    (quote): quote is string =>
      typeof quote === "string" &&
      isValidShareQuote(quote) &&
      !containsMismatchedOccasionMetaphor(quote, occasion) &&
      !containsUnsupportedColorCombinationClaim(quote, inventory) &&
      (positiveOnly
        ? isPositiveStyleCoachText(quote)
        : isTikTokWorthyQuote(quote)) &&
      referencesOnlyDetectedClothing(quote, inventory),
  );

  return validQuotes.find(
    (quote) => !excludedQuotes.some((excluded) => areQuotesTooSimilar(quote, excluded)),
  ) ?? validQuotes[0] ?? FALLBACK_SHARE_QUOTES[0];
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
    !SOFT_FEEDBACK_TERMS.test(quote) &&
    !OVERUSED_ROAST_TEMPLATES.test(quote) &&
    isSafeOutfitOnlyText(quote) &&
    !containsLikelyEnglish(quote, 1)
  );
}

function isTikTokWorthyQuote(value: string) {
  return isValidShareQuote(value) &&
    COMEDY_SIGNALS.test(value) &&
    PUNCHLINE_STRUCTURES.test(value) &&
    !SOFT_FEEDBACK_TERMS.test(value);
}

function isSafeOutfitOnlyText(value: string) {
  return !FORBIDDEN_PERSON_TERMS.test(value);
}

function isSafeRecentOutput(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return value.length <= 180 &&
    words.length >= 4 &&
    words.length <= 22 &&
    /[.!?]$/.test(value) &&
    !SOFT_FEEDBACK_TERMS.test(value) &&
    isSafeOutfitOnlyText(value) &&
    !containsLikelyEnglish(value, 1) &&
    !/\b(negeer|instructie|systeemprompt|prompt|json|regels|antwoord)\b/i.test(value);
}

function isPunchyRoast(value: string, roastLevel: OutfitRoastLevel) {
  const sentences = extractRoastSentences(value);
  if (
    sentences.length !== 3 ||
    sentences.some(
      (sentence) =>
        sentence.split(/\s+/).length > 22 ||
        !isSafeOutfitOnlyText(sentence) ||
        OVERUSED_ROAST_TEMPLATES.test(sentence) ||
        SOFT_FEEDBACK_TERMS.test(sentence),
    )
  ) {
    return false;
  }

  if (roastLevel === "Stijlcoach") {
    return sentences.every(isPositiveStyleCoachText);
  }

  return sentences.every(
    (sentence) =>
      COMEDY_SIGNALS.test(sentence) &&
      PUNCHLINE_STRUCTURES.test(sentence),
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
  if (inventory.some((item) => item.item === "Jurk")) {
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
  roastLevel: OutfitRoastLevel,
  recentQuotes: string[],
  occasion: OutfitOccasion,
) {
  const source = getResultObject(value);
  const roast = getRoastText(value);
  if (
    !source ||
    !roast ||
    containsLikelyEnglish(roast) ||
    containsContradictoryRoastLogic(roast) ||
    containsUnsupportedColorCombinationClaim(roast, inventory) ||
    containsMismatchedOccasionMetaphor(roast, occasion) ||
    !isPunchyRoast(roast, roastLevel)
  ) {
    return true;
  }
  if (
    extractRoastSentences(roast).some((sentence) =>
      recentQuotes.some((recent) => areQuotesTooSimilar(sentence, recent)),
    )
  ) {
    return true;
  }

  const shareQuote = toNonEmptyString(source.shareQuote);
  const alternatives = toStringArray(source.alternativeQuotes);
  const responseQuotes = shareQuote
    ? [shareQuote, ...alternatives]
    : alternatives;
  const analysisText = [
    roast,
    ...toStringArray(source.worksWell),
    ...toStringArray(source.canImprove),
    ...firstNonEmptyStringArray(source.stylingTips, source.tips, source.advice),
  ];

  return (
    !shareQuote ||
    !isValidShareQuote(shareQuote) ||
    recentQuotes.some((quote) => areQuotesTooSimilar(shareQuote, quote)) ||
    containsContradictoryRoastLogic(shareQuote) ||
    containsUnsupportedColorCombinationClaim(shareQuote, inventory) ||
    containsMismatchedOccasionMetaphor(shareQuote, occasion) ||
    (roastLevel !== "Stijlcoach" && !isTikTokWorthyQuote(shareQuote)) ||
    (roastLevel === "Stijlcoach" && !isPositiveStyleCoachText(shareQuote)) ||
    !referencesOnlyDetectedClothing(shareQuote, inventory) ||
    alternatives.length !== 2 ||
    !areResponseQuotesDiverse(responseQuotes) ||
    alternatives.some(
      (quote) =>
        !isValidShareQuote(quote) ||
        containsContradictoryRoastLogic(quote) ||
        containsUnsupportedColorCombinationClaim(quote, inventory) ||
        containsMismatchedOccasionMetaphor(quote, occasion) ||
        recentQuotes.some((recentQuote) => areQuotesTooSimilar(quote, recentQuote)) ||
        (roastLevel !== "Stijlcoach" && !isTikTokWorthyQuote(quote)) ||
        (roastLevel === "Stijlcoach" && !isPositiveStyleCoachText(quote)) ||
        !referencesOnlyDetectedClothing(quote, inventory),
    ) ||
    analysisText.some(
      (text) =>
        !referencesOnlyDetectedClothing(text, inventory) ||
        containsUnsupportedColorCombinationClaim(text, inventory),
    )
  );
}

function containsMismatchedOccasionMetaphor(text: string, occasion: OutfitOccasion) {
  const normalized = text.toLowerCase();
  const occasionSignals: Record<OutfitOccasion, RegExp[]> = {
    Date: [
      /\b(date|daten|tinder|romantisch|flirt|eerste indruk)\b/,
    ],
    Werk: [
      /\b(kantoor|sollicitatie|teams|zoom|linkedin|functioneringsgesprek|onboarding)\b/,
    ],
    School: [
      /\b(school|college|les|klas|huiswerk|mentor|tentamen)\b/,
    ],
    Gym: [
      /\b(gym|sportschool|basic-fit|training|workout|squat|dumbbell|warming-up)\b/,
    ],
    Feest: [
      /\b(feest|verjaardag|uitgaan|club|dansvloer|drankjes)\b/,
    ],
    Festival: [
      /\b(festival|lowlands|pinkpop|mainstage|camping|modder|tent)\b/,
    ],
  };

  return (Object.entries(occasionSignals) as [OutfitOccasion, RegExp[]][])
    .filter(([signalOccasion]) => signalOccasion !== occasion)
    .some(([, signals]) => signals.some((signal) => signal.test(normalized)));
}

function containsContradictoryRoastLogic(text: string) {
  const normalized = text.toLowerCase();
  const basicSignals = /\b(saai|basic|rustig|vlak|simpel|stil|weinig|niks|geen spanning|zonder spanning)\b/.test(
    normalized,
  );
  const busySignals = /\b(afleiding|druk|chaos|chaotisch|overprikkeling|schreeuwt|herrie|lawaaierig|te veel)\b/.test(
    normalized,
  );

  return basicSignals && busySignals;
}

function containsUnsupportedColorCombinationClaim(
  text: string,
  inventory: ClothingInventoryItem[],
) {
  const normalized = text.toLowerCase();
  const claimsColorConflict = /\b(kleurencombinatie|kleurcombinatie|kleurcrisis|kleurconflict|botsende kleuren|kleuren.*(ruzie|crisis|bots|botsen|vechten|wedstrijd|scheidsrechter)|kleur.*(ruzie|crisis|bots|botsen|vechten))\b/i.test(
    normalized,
  );

  if (!claimsColorConflict) {
    return false;
  }

  return getDistinctDetectedColors(inventory).length < 2;
}

function getDistinctDetectedColors(inventory: ClothingInventoryItem[]) {
  return Array.from(
    new Set(
      inventory
        .map((item) => normalizeDetectedColor(item.color))
        .filter((color): color is string => Boolean(color)),
    ),
  );
}

function normalizeDetectedColor(color: string) {
  const normalized = color.toLowerCase().trim();
  if (!normalized || normalized.includes("onbekend")) {
    return null;
  }

  if (/\b(wit|witte|crème|creme|ivoor|ivory)\b/.test(normalized)) {
    return "wit";
  }
  if (/\b(zwart|zwarte)\b/.test(normalized)) {
    return "zwart";
  }
  if (/\b(blauw|blauwe|donkerblauw|lichtblauw)\b/.test(normalized)) {
    return "blauw";
  }
  if (/\b(grijs|grijze)\b/.test(normalized)) {
    return "grijs";
  }
  if (/\b(beige|camel|zand)\b/.test(normalized)) {
    return "beige";
  }
  if (/\b(bruin|bruine)\b/.test(normalized)) {
    return "bruin";
  }
  if (/\b(rood|rode)\b/.test(normalized)) {
    return "rood";
  }
  if (/\b(groen|groene)\b/.test(normalized)) {
    return "groen";
  }
  if (/\b(geel|gele)\b/.test(normalized)) {
    return "geel";
  }
  if (/\b(roze|pink)\b/.test(normalized)) {
    return "roze";
  }

  return normalized;
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
            "Je bent een nauwkeurige kledingherkenner. Identificeer uitsluitend kleding en accessoires die zichtbaar op het lichaam worden gedragen. Negeer auto's, deuren, stoelen, gebouwen, schaduwen, tassen op de achtergrond en andere omgeving. Leid nooit gender, lichaamstype, leeftijd of identiteit af. Bij twijfel tussen specifieke typen kies je de veilige generieke term bovenlaag, schoenen, broek of accessoire. Een witte jurk of avondjurk classificeer je als Jurk, nooit als Jas. Een jas detecteer je alleen als die zichtbaar gedragen wordt. Verzin niets.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Maak eerst een interne kledinginventaris voor latere stylingfeedback.

Toegestane items, in herkenningsprioriteit:
T-shirt, Polo, Overhemd, Vest, Trui, Hoodie, Jurk, Jas, Blazer, Jeans, Chino, Sneakers, Nette schoenen, Boots, Tas, Horloge.

Bij lage zekerheid gebruik je alleen:
bovenlaag, schoenen, broek, accessoire.

Regels:
- OutfitRoaster-formule voor iedere roastregel: begin met een zichtbaar detail, maak daarna een logisch contrast of vergelijking en eindig met de clou.
- Minimaal één van de drie roastregels gebruikt een rake vergelijking die direct uit de zichtbare outfit volgt.
- Humor zonder zichtbare observatie is verboden.
- Laat het klinken als een snelle scherpe vriend, nooit als een AI-analyse.
- Neem alleen items op die werkelijk zichtbaar zijn.
- Onderscheid Polo, Overhemd, Vest, Jurk, Jas en Blazer zorgvuldig.
- Negeer de omgeving volledig. Een zwarte auto, autodeur of donkere achtergrond is nooit een Jas.
- Als één wit kledingstuk als jurk/avondjurk zichtbaar is, detecteer "Jurk" met kleur "wit".
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
- Dit is GEEN modeadvies. Dit is entertainment.
- Jij bent geen mode-expert. Jij bent een Nederlandse roast comedian met verstand van kleding.
- Schrijf alsof je een scherpe TikTok-commentator bent die binnen 3 seconden de grappigste outfitobservatie ziet.
- Prioriteit: 1 grappig, 2 deelbaar, 3 verrassend, 4 pas daarna mode.
- Het doel is niet dat iemand iets leert. Het doel is dat iemand hardop lacht, screenshot en deelt.
- Gebruik maximale roastenergie, droge humor, sarcasme, overdrijving, onverwachte vergelijkingen en absurde metaforen.
- Wissel humorstijlen willekeurig af: kantoorhumor, sport, voetbal, Nederlandse cultuur, internetmemes, technologie, films, series, supermarkt, vakantie, festivals, dating, openbaar vervoer, school, werk en gaming.
- Gebruik nooit twee keer dezelfde grapstructuur of dominante opening.
- Bedenk intern minimaal 30 compleet verschillende shareQuote-kandidaten. Maak ze allemaal anders, gooi de saaie weg, kies de grappigste, maak hem scherper en controleer of hij uniek voelt. Toon dit denkproces nooit.
- shareQuote is het belangrijkste onderdeel van de response: maximaal 12 woorden, één harde one-liner, geen uitleg, geen advies, geen emoji en geen modeanalyse.
- alternativeQuotes zijn ook harde, deelbare one-liners en gebruiken een andere graphoek dan shareQuote.
- Het veld roast bevat maximaal 3 korte zinnen. Iedere zin is een punchline. Geen uitleg, geen tips, geen stylingles.
- Iedere roastzin moet klinken als een comment die iemand los onder een TikTok kan plaatsen.
- Formule per regel: zichtbaar detail + botsing met gelegenheid/stijl + onverwachte clou.
- Als de zin geen lachmoment heeft, is hij ongeldig. Maak hem harder, korter en specifieker.
- Geef geen samenvatting zoals "mist samenhang"; schrijf de grap die dat laat voelen.
- worksWell, canImprove en stylingTips blijven bestaan voor het JSON-schema, maar schrijf ze kort, direct en entertainment-first. Geen lange modeanalyse.
- Gebruik nooit de woorden: misschien, beetje, redelijk, best, aardig, lijkt, kan, zou, "niet helemaal", "past niet goed" of "mist samenhang".
- Goede energie: "De schoenen hebben de briefing gemist.", "De schoenen en broek hebben elkaar vandaag ontmoet.", "De outfit vraagt om crisisoverleg.", "Alles klopt. Alleen niet tegelijk."
- Slechte energie: "De kleuren passen niet goed.", "Misschien andere schoenen.", "Deze outfit kan beter.", "De combinatie voelt rommelig."
- Werkvolgorde voor humor: analyseer de outfit zorgvuldig, bepaal de 2 of 3 meest opvallende kenmerken, kies het opvallendste kenmerk en maak dáár de grap over.
- Iedere grap moet voortkomen uit een echte zichtbare observatie van de outfit, kleding, schoenen, accessoires, kleuren, stijl, combinatie of gelegenheid.
- Iedere grap moet logisch kloppen met die observatie. Zeg niet dat een saaie, rustige of basic outfit "te veel afleiding" geeft; roast dan juist de afwezigheid van spanning, plan, richting of entree.
- De gekozen gelegenheid moet voelbaar zijn in minimaal één roastregel of quote. Maak duidelijk waarom de outfit wel of niet werkt voor Date, Werk, School, Gym, Feest of Festival.
- Gebruik nooit een willekeurige metafoor die niet logisch uit de outfit volgt.
- Controleer intern: als de grap ook op een totaal andere outfit zou passen, herschrijf hem specifieker op basis van de zichtbare outfit.
- Controleer intern: als de grap het tegenovergestelde zegt van wat zichtbaar is, herschrijf hem. Saai blijft saai, druk blijft druk, sportief blijft sportief, netjes blijft netjes.
- Een roast hoeft geen lage score te hebben. Ook een sterke 8/10 of 9/10 krijgt een grappige roast.
- Gebruik de volledige scoreschaal met één decimaal: 2.2, 4.8, 6.7, 8.3 of 9.1. Gebruik geen vaste hele cijfers zoals 2, 3 of 4.
- Score 0-1 is alleen extreem slecht, 2-3 slecht, 4-5 gemiddeld, 6-7 goed, 8 sterk, 9 heel stijlvol, 10 bijna perfect.
- Als meer dan 40% van de recente scores 0-3 is, herkalibreer automatisch en gebruik de volledige schaal realistischer.
- De score moet geloofwaardig aansluiten bij wat zichtbaar is, niet bij hoe hard de grap klinkt.
- Score 0-3: genadeloos grappig. Score 4-6: sarcastisch. Score 7-8: compliment met humor. Score 9-10: alsof de outfit de hoofdrol speelt.
- Roast uitsluitend outfit, kleding, schoenen, accessoires, kleuren, stijl, combinatie en gelegenheid.
- Roast nooit gezicht, lichaam, gewicht, leeftijd, afkomst, religie, gezondheid, handicap, gender, seksualiteit of andere persoonskenmerken.
`;
    default:
      return `
Roastniveau: Pittig
- Gebruik scherpe, grappige en directe Nederlandse humor.
- Gebruik Nederlandse humor en plaag direct, maar nooit hatelijk.
- Balanceer de roast met bruikbare observatie, maar roastregels blijven punchlines, geen stijladvies.
- Wees scherper dan Stijlcoach, maar minder extreem dan Genadeloos.
- Iedere regel heeft een duidelijke punchline en eindigt met de grap.
- Een zin zonder verrassende vergelijking, botsing of clou is ongeldig.
- Roast uitsluitend de outfit en nooit de persoon.
`;
  }
}

function getOccasionRoastGuardrails(occasion: OutfitOccasion) {
  const shared = `
- Gebruik geen metafoor uit een andere gelegenheid als die niet logisch uit de zichtbare outfit volgt.
- Als de outfit rustig, basic of saai oogt, roast het gebrek aan spanning, entree, richting of onthoudbaarheid; noem het niet druk, chaotisch of afleidend.
- Als de outfit juist druk of kleurrijk oogt, roast dan de drukte of botsing; noem het niet saai.
- Maak de categorie voelbaar als punchline, niet als label. Dus niet "past niet bij Werk", maar een grap over meeting, LinkedIn, agenda of sollicitatie.
- Iedere categorie-grap moet een concrete scène oproepen die bij die gelegenheid hoort.
`;

  const byOccasion: Record<OutfitOccasion, string> = {
    Date: `
- Date-context: eerste indruk, spanning, zelfvertrouwen en date-vibe.
- Punchline-hoeken: reservering, eerste indruk, ongemakkelijke stilte, rekening, openingszin, Tinder zonder dat je Tinder letterlijk hoeft te noemen.
- Voorbeeldenergie: "De bovenlaag wil romantiek, maar de schoenen hebben de reservering geannuleerd."
- Vermijd kantoor-, gym-, school-, feest- of festivalgrappen tenzij een zichtbaar kledingstuk die vergelijking logisch maakt.
`,
    Werk: `
- Werk-context: professionaliteit, geloofwaardigheid, netheid, kantoor, meeting, presentatie, LinkedIn, Teams of sollicitatie.
- Punchline-hoeken: agenda zonder besluit, LinkedIn-profiel, sollicitatiegesprek, Teams-call, manager die ontbreekt, promotie die wegloopt.
- Voorbeeldenergie: "De bovenlaag komt naar de meeting, maar de schoenen hebben ontslag genomen."
- Vermijd feest-, festival-, date-, school- en gymmetaforen. Bij een saaie werkfit: roast dat de outfit weinig autoriteit, entree of promotie-energie heeft.
`,
    School: `
- School-context: college, klas, comfort, casual fit, zelfvertrouwen en niet te hard proberen.
- Punchline-hoeken: eerste uur, huiswerk vergeten, mentor, groepsproject, toetsweek, lokaal zoeken.
- Voorbeeldenergie: "De broek doet college, maar de schoenen zoeken nog het juiste lokaal."
- Vermijd werk-, date-, feest-, festival- en gymmetaforen tenzij het zichtbaar logisch is.
`,
    Gym: `
- Gym-context: sportiviteit, praktische pasvorm, schoenen, training en Basic-Fit-energie.
- Punchline-hoeken: warming-up, leg day overslaan, bidon vergeten, Basic-Fit-tour, cooling-down, sporttas zonder plan.
- Voorbeeldenergie: "De schoenen doen warming-up, maar de bovenlaag heeft rustdag aangevraagd."
- Vermijd kantoor-, date-, school-, feest- en festivalmetaforen tenzij het zichtbaar logisch is.
`,
    Feest: `
- Feest-context: verjaardag, borrel, uitgaan, diner, sociale energie, comfort en entree.
- Punchline-hoeken: garderobe, borrel, verjaardagscirkel, eerste drankje, entree, dansvloer die nog twijfelt.
- Voorbeeldenergie: "De outfit wil naar binnen, maar de vibe staat nog bij de garderobe."
- Vermijd kantoor-, school-, gym-, date- en festivalmetaforen tenzij het zichtbaar logisch is.
`,
    Festival: `
- Festival-context: Lowlands/Pinkpop-vibe, comfort, expressie, statementstukken, modderbestendigheid en lange dag.
- Punchline-hoeken: mainstage, camping, modder, polsbandje, plattegrond kwijt, groepsfoto, rij bij de munten.
- Voorbeeldenergie: "De outfit zoekt de mainstage, maar de vibe staat nog in de muntenrij."
- Vermijd kantoor-, school-, gym-, date- en gewone feestmetaforen tenzij het zichtbaar logisch is.
`,
  };

  return `${shared}${byOccasion[occasion]}`;
}

export async function POST(request: Request) {
  try {
    enforceSameOrigin(request);
    enforceRateLimit(request, "outfit-check", 10, 10 * 60_000);
    const body = await readJsonWithLimit<{
      image?: unknown;
      mode?: unknown;
      occasion?: unknown;
      roastLevel?: unknown;
      feedbackStyle?: unknown;
      persona?: unknown;
      intensity?: unknown;
      profile?: unknown;
      recentQuotes?: unknown;
      recentScores?: unknown;
    }>(request, MAX_OUTFIT_REQUEST_BYTES);
    const mode: OutfitCheckMode =
      body.mode === "pro-analysis" ? "pro-analysis" : "roast";
    const occasion = normalizeOccasion(body.occasion);
    const roastLevel = normalizeRoastLevel(
      body.roastLevel,
      body.feedbackStyle ?? body.intensity,
      body.persona,
    );
    const profile = normalizeProfile(body.profile);
    const recentQuotes = toStringArray(body.recentQuotes)
      .filter(isSafeRecentOutput)
      .slice(0, RECENT_OUTPUT_LIMIT);
    const recentScores = toScoreArray(body.recentScores);
    const roastVariation = createRoastVariation();

    if (
      typeof body.image === "string" &&
      getDataUrlByteSize(body.image) > MAX_OUTFIT_IMAGE_BYTES
    ) {
      return jsonNoStore(
        { error: "De foto is te groot voor de outfitcheck." },
        { status: 413 },
      );
    }

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

Unieke variatiecontext voor deze aanvraag:
- Variatiecode: ${roastVariation.id}
- Gebruik vooral deze verschillende humorhoeken: ${roastVariation.angles.join(", ")}.
- Spreid de 30 interne quote-kandidaten over deze openingsvormen:
${roastVariation.openingPatterns.map((pattern) => `  - ${pattern}`).join("\n")}
- De variatiecode is alleen creatieve ruis. Noem hem nooit in de output.
- Vermijd formuleringen uit eerdere antwoorden; schrijf alsof dit de eerste roast in een nieuwe comedyset is.
- Gebruik geen grap, metafoor of zinsopening die te veel lijkt op deze recente quotes:
${recentQuotes.length > 0 ? recentQuotes.map((quote) => `  - ${quote}`).join("\n") : "  - Geen recente quotes beschikbaar."}
- Recente scores op dit apparaat, nieuw naar oud: ${recentScores.length > 0 ? recentScores.join(", ") : "geen"}.

${getRoastLevelInstructions(roastLevel)}

Gelegenheids-vangrails:
${getOccasionRoastGuardrails(occasion)}

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
- Maak de gekozen gelegenheid concreet voelbaar in minimaal één van deze onderdelen: roast, shareQuote of alternativeQuotes.
- Roasts zonder duidelijke link met de gekozen gelegenheid zijn ongeldig en moeten vóór output worden herschreven.
- Bij Date: beoordeel eerste indruk, zelfvertrouwen en date-vibe.
- Bij Werk: beoordeel professionaliteit, geloofwaardigheid en netheid.
- Bij School: beoordeel comfort, zelfvertrouwen en een casual passende uitstraling.
- Bij Gym: beoordeel sportieve pasvorm, praktisch gebruik en gym-vibe.
- Bij Feest: beoordeel de outfit voor verjaardagen, borrels, uitgaan, diners en sociale evenementen. Focus op uitstraling, comfort en een sterke entree.
- Bij Festival: beoordeel vibe, expressie, comfort en opvallende kledingdetails.
- Schrijf alle feedback altijd in het Nederlands, inclusief shareQuote en alternativeQuotes.
- Genereer nooit Engelse quotes en mix nooit Nederlands met Engels.
- Schrijf voor een Nederlands publiek.
- Score is een getal van 1 t/m 10, gebruikt de volledige schaal en heeft bij voorkeur één decimaal.
- Geef scores zoals 2.2, 4.8, 6.7, 8.3 of 9.1; vermijd vaste hele cijfers zoals 2, 3 of 4.
- Score 1 is alleen voor extreem slechte outfits; 2-3 is slecht; 4-5 gemiddeld; 6-7 goed; 8 sterk; 9 heel stijlvol; 10 bijna perfect.
- Een grappige roast betekent niet automatisch een lage score. Een 8/10 of 9/10 mag nog steeds hard en grappig worden geroast.
- Als meer dan 40% van de recente scores 1-3 is, herkalibreer automatisch zodat je niet opnieuw onterecht laag scoort.
- Laat de score aansluiten bij zichtbare kwaliteit van kleding, kleuren, pasvorm, schoenen, samenhang en gelegenheid.
- Het veld roast bevat exact 3 korte Nederlandse feedbackzinnen, elk op een eigen regel.
- Bij Stijlcoach zijn dit positieve confidence-regels over sterke punten en stijlwinsten.
- Bij Pittig en Genadeloos zijn roastregels toegestaan.
- Iedere feedbackregel is kort, snel en heeft een duidelijke clou.
- Bij Pittig en Genadeloos moet elke regel een echte punchline zijn: geen beschrijving, geen advies, geen samenvatting.
- Gebruik voor elke roastregel één van deze vormen: "X wil Y, maar Z", "X doet alsof Y", "X kwam binnen als Y en eindigde als Z", "Zelfs X vraagt om Y", "X zoekt nog Y".
- De laatste 3 tot 5 woorden van elke roastregel moeten de grap afmaken.
- Als een regel niet grappig klinkt wanneer je hem hardop voorleest, herschrijf hem intern.
- Schrijf geen lange modeanalyse of stylingles in roast.
- Humor gaat vóór nuance: gebruik scherpe observaties, onverwachte vergelijkingen en absurde maar logische metaforen.
- Humor moet altijd voortkomen uit een echte observatie van de outfit.
- Werkvolgorde voor humor: analyseer zorgvuldig, kies de 2 of 3 meest opvallende kenmerken, pak het opvallendste kenmerk en maak dáár de grap over.
- Maak daarna pas de vergelijking. De vergelijking moet de observatie versterken, niet vervangen.
- Gebruik nooit een willekeurige metafoor die niet logisch uit de outfit volgt.
- Controleer intern: als een grap op vrijwel elke outfit geplakt kan worden, herschrijf hem op basis van een zichtbaar kledingstuk, kleur, schoen, accessoire, combinatie of gelegenheid.
- Controleer intern: als de grap niet klopt met het zichtbare probleem, herschrijf hem. Voorbeeld fout: een saaie outfit "meer afleiding dan een Zoom-vergadering" noemen. Beter: de outfit mist spanning, entree, richting of een reden om onthouden te worden.
- Verwar basic/rustig nooit met druk/chaotisch. Verwar kleurrijk/druk nooit met saai.
- Als de inventaris één duidelijke kleur bevat, maak nooit een grap over kleurencombinatie, botsende kleuren, kleurcrisis of kleurconflict. Roast dan stof, silhouet, snit, gelegenheid, schoenen, accessoire of entree.
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
- Bedenk intern minimaal 30 verschillende shareQuote-kandidaten vanuit minstens 5 humorhoeken.
- Rangschik die kandidaten intern op scherpte, verrassing, humor, originaliteit en screenshotwaarde.
- Zet alleen de beste kandidaat in shareQuote.
- Zet twee inhoudelijk en structureel andere sterke kandidaten in alternativeQuotes.
- De drie teruggegeven quotes gebruiken verschillende openingen en verschillende grappen.
- Toon de overige kandidaten nergens en voeg geen extra JSON-veld toe.
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
- Gebruik in shareQuote en alternativeQuotes nooit misschien, beetje, redelijk, best, kan of zou.
- Een quote die klinkt als gewone modefeedback is ongeldig en moet vóór output worden herschreven.
- shareQuote volgt duidelijk het gekozen roastniveau en is memorabel.
- Bij Stijlcoach is shareQuote zelfverzekerd, positief en goed deelbaar.
- Bij Stijlcoach mogen shareQuote en alternativeQuotes nooit kritiek, correcties of roasttaal bevatten.
- shareQuote roast alleen outfit/stijlkeuzes, nooit iemands identiteit, lichaam of beschermde kenmerken.
- shareQuote is meme-waardig, direct begrijpelijk en belangrijker dan de volledige roast.
- Voorbeelden shareQuote, alleen als stijlrichting: "De schoenen hebben de briefing gemist.", "Deze fit kwam binnen als plan B.", "Zelfs de paskamer vraagt om uitleg.", "De broek en schoenen hebben elkaar net ontmoet.", "De outfit vraagt om crisisoverleg.", "De styling zoekt nog een volwassen besluit.", "Deze fit kwam binnen zonder toestemming.", "Je spiegel heeft vandaag ontslag genomen."
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
- Noem nooit lichaam, gewicht, gezicht, leeftijd, afkomst, genderidentiteit, seksualiteit, handicap, gezondheid, religie of aantrekkelijkheid.
- Score 1: alleen extreem slecht. Score 2-3: slecht. Score 4-5: gemiddeld. Score 6-7: goed. Score 8: sterk. Score 9: heel stijlvol. Score 10: bijna perfect.
- Score 1-3: roast genadeloos grappig, maar gebruik deze range alleen als de outfit zichtbaar echt zwak is.
- Score 4-6: schrijf scherp en sarcastisch.
- Score 7-8: geef een compliment met humor.
- Score 9-10: hype de outfit alsof die de kamer binnenloopt.
- Scorekalibratie: gebruik de volledige schaal. Een roast hoeft geen lage score te hebben. Geef geen overdreven hoge score, maar straf een goede outfit niet omdat de grap hard is.
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
      topP: number,
    ) {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: activeMessages,
        response_format: { type: "json_object" },
        temperature,
        top_p: topP,
        presence_penalty: 0.45,
        frequency_penalty: 0.35,
      });

      return completion.choices[0]?.message.content;
    }

    let content = await generateResult(messages, 1.05, 0.96);
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
      roastLevel,
      recentQuotes,
      occasion,
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

Behoud duidelijk roastniveau ${roastLevel}, gelegenheid ${occasion} en de keuze "Voor wie": ${profile}. Leid gender nooit af uit de foto. Noem geen enkel ander kledingstuk en herclassificeer niets. Gebruik bij twijfel alleen een generieke term die letterlijk in de inventaris staat. Schrijf natuurlijk Nederlands en behoud het exacte JSON-format.

Gelegenheids-vangrails:
${getOccasionRoastGuardrails(occasion)}

De vorige versie was te braaf, te lang, onvoldoende grappig, onveilig of niet deelbaar genoeg. Herschrijf daarom als snelle Nederlandse TikTok-roast comedy. Roast uitsluitend kleding, styling, kleuren, schoenen, accessoires en de mismatch met de gelegenheid. Noem nooit lichaam, gewicht, gezicht, leeftijd, afkomst, genderidentiteit, seksualiteit, handicap, gezondheid, religie of aantrekkelijkheid.

Bedenk intern minimaal 30 compleet nieuwe shareQuote-kandidaten vanuit minstens 5 verschillende humorhoeken. Gebruik opnieuw deze variatiecontext: ${roastVariation.angles.join(", ")}. Kies de scherpste als shareQuote en gebruik twee structureel en inhoudelijk andere kandidaten als alternativeQuotes. De drie quotes mogen niet met hetzelfde format beginnen en mogen niet dezelfde metafoor herhalen. Toon geen overige kandidaten en voeg geen velden toe. Alle drie zijn complete zinnen van 6 tot 12 woorden, screenshotwaardig, onverwacht en zonder uitleg of advies. Gebruik nooit misschien, beetje, redelijk, best, aardig, lijkt, kan of zou. Geen quote eindigt met ..., …, :, ; of een onafgemaakte bijzin.

${roastLevel === "Genadeloos" ? `Omdat roastniveau Genadeloos is: behandel dit als entertainment, niet als modeadvies. Bedenk intern minimaal 30 shareQuote-kandidaten, kies de grappigste, maak hem scherper en geef alleen de beste JSON terug. Roasttekst is exact 3 korte punchlines zonder tips, uitleg of stylingles. Gebruik droge humor, sarcasme, overdrijving, onverwachte vergelijkingen en Nederlandse TikTok-commentaarenergie. Wissel humorhoeken af tussen kantoor, sport, voetbal, Nederlandse cultuur, internetmemes, technologie, films, series, supermarkt, vakantie, festivals, dating, openbaar vervoer, school, werk en gaming. Vermijd ook "niet helemaal", "past niet goed" en "mist samenhang".` : ""}

Vermijd ook iedere grap, metafoor en opening die lijkt op deze recente quotes:
${recentQuotes.length > 0 ? recentQuotes.map((quote) => `- ${quote}`).join("\n") : "- Geen recente quotes beschikbaar."}

Recente scores op dit apparaat: ${recentScores.length > 0 ? recentScores.join(", ") : "geen"}. Gebruik de volledige schaal met één decimaal: 1 alleen extreem slecht, 2-3 slecht, 4-5 gemiddeld, 6-7 goed, 8 sterk, 9 heel stijlvol, 10 bijna perfect. Vermijd vaste hele cijfers zoals 2, 3 of 4. Als meer dan 40% recent 1-3 is, herkalibreer realistischer. Een grappige roast hoeft geen lage score te hebben.

Maak roast exact 3 korte punchy zinnen, elk op een eigen regel. Geen stylingles. Iedere regel moet een losse punchline zijn met zichtbaar detail + botsing + clou. Gebruik vormen zoals "X wil Y, maar Z", "X kwam binnen als Y en eindigde als Z", "Zelfs X vraagt om Y" of "X zoekt nog Y". Iedere grap moet voortkomen uit een echte zichtbare observatie: kies intern de 2 of 3 meest opvallende kenmerken en maak de grap over het opvallendste kenmerk. Maak de gekozen gelegenheid ${occasion} concreet voelbaar in minimaal één roastregel of quote. Als de grap op een totaal andere outfit zou passen, herschrijf hem. Als de grap het zichtbare probleem tegenspreekt, herschrijf hem. Noem een basic/saaie outfit niet druk of afleidend; roast dan juist het gebrek aan spanning, entree, richting of onthoudbaarheid. Gebruik bij score 1-3 maximale roastenergie, bij 4-6 scherpe sarcasme, bij 7-8 complimenten met humor en bij 9-10 zelfverzekerde hype. Bij Stijlcoach blijven alle regels en quotes positief, zelfverzekerd en niet-corrigerend; laat canImprove en stylingTips dan leeg. Pas de overige velden aan op de inventaris.`,
        },
      ];

      content =
        (await generateResult(correctionMessages, 0.95, 0.98)) ??
        "";

      try {
        parsed = JSON.parse(content) as unknown;
      } catch {
        parsed = null;
      }

      parsedObject = getResultObject(parsed);
      roastText = getRoastText(parsed);

      if (
        generatedResultNeedsCorrection(
          parsed,
          clothingInventory,
          roastLevel,
          recentQuotes,
          occasion,
        )
      ) {
        console.warn("Corrected roast still failed quality checks; using varied safe fallback.", parsed);
        if (parsedObject) {
          const fallbackScore = calibrateRoastScore(
            normalizeRoastScore(parsedObject.score ?? parsedObject.rating),
            recentScores,
            roastLevel,
          );
          parsedObject.roast = getScoreAwareFallback(
            roastLevel,
            fallbackScore,
            roastVariation.fallbackOffset,
            occasion,
          ).roast;
        }
        roastText = getRoastText(parsed);
      }
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
          roastVariation.fallbackOffset,
          recentQuotes,
          recentScores,
          occasion,
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
        roastVariation.fallbackOffset,
        recentQuotes,
        recentScores,
        occasion,
      ),
    );
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    console.error("Outfit check API error:", error);
    return Response.json({ error: "Outfit check failed" }, { status: 500 });
  }
}
