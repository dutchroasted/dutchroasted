import OpenAI from "openai";
import {
  OUTFIT_INTENSITIES,
  OUTFIT_OCCASIONS,
  type OutfitResultData,
} from "@/lib/outfitTypes";

const MODEL = "gpt-4o-mini";
const LEGACY_PARTY_OCCASION = "Feest";
const FALLBACK_SHARE_QUOTE = "Deze outfit twijfelt harder dan nodig.";
const FALLBACK_ALTERNATIVE_QUOTES = [
  "Je schoenen en kleding zitten duidelijk niet in dezelfde groepsapp.",
  "De basis staat, maar de styling mist nog een eindredacteur.",
  "Deze look heeft potentie, maar wacht nog op een duidelijke beslissing.",
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
- Geen seksuele opmerkingen, geen bodyshaming, geen discriminatie.
- De roast mag scherp en grappig zijn, maar nooit gemeen of persoonlijk kwetsend.
- Schrijf uitsluitend Nederlands. Gebruik geen Engelse zinnen en meng geen Nederlands met Engels.
- Schrijf de roast als exact 3 korte Nederlandse zinnen, elk op een eigen regel.
- Iedere roastzin heeft een duidelijke clou en moet zelfstandig deelbaar zijn.
- Klink als een scherpe Nederlandse vriend: direct, gevat en een tikje brutaal, maar vriendelijk.
- Maak de roast vermakelijk, modebewust en citeerbaar, met een originele stem.
- Maak de roast specifieker dan "dit is saai": verwijs naar kledingstukken, combinaties, kleuren of stylingkeuzes die je ziet.
- Noem waar mogelijk zichtbare details zoals schoenen, shirt, broek, kleuren, pasvorm of uitstraling.
- Vermijd algemene feedback zoals "je outfit is leuk" of "dit past niet goed".
- Schrijf nooit een vierde roastzin of extra roastregel.
- Voorbeelden zijn alleen stijlreferenties; neem ze niet letterlijk over:
  "Die sneakers zijn klaar voor Basic-Fit, maar je shirt denkt dat jullie naar kantoor gaan."
  "Deze outfit heeft meer twijfel dan een groepsapp waar niemand durft te kiezen."
  "Je broek zegt casual, je schoenen zeggen: ik ben per ongeluk meegekomen."
- Geef precies 3 deelbare quotes totaal: 1 shareQuote en exact 2 unieke alternativeQuotes.
- Alle quotes zijn Nederlands, maximaal 12 woorden en dupliceren elkaar niet.
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
): OutfitResultData {
  const roast = normalizeRoast(roastText);
  const providedQuotes = toStringArray(source.alternativeQuotes);
  const shareQuote = normalizeQuote(
    toNonEmptyString(source.shareQuote) ??
      toNonEmptyString(source.title) ??
      makeShareQuote(roast),
    FALLBACK_SHARE_QUOTE,
  );
  const stylingTips = firstNonEmptyStringArray(
    source.stylingTips,
    source.tips,
    source.advice,
  );

  return {
    roast,
    shareQuote,
    alternativeQuotes: fillAlternativeQuotes(providedQuotes, shareQuote),
    worksWell: withFallback(
      toStringArray(source.worksWell),
      "De outfit heeft een duidelijke basis waarop je verder kunt stylen.",
    ),
    canImprove: withFallback(
      toStringArray(source.canImprove),
      "Meer samenhang in kleur, pasvorm en accessoires maakt het geheel sterker.",
    ),
    stylingTips: withFallback(
      stylingTips,
      "Kies één duidelijke stijlrichting en laat kleuren en accessoires daarop aansluiten.",
    ),
    shoppingSuggestions: normalizeShoppingSuggestions(source.shoppingSuggestions),
    score: normalizeScore(source.score ?? source.rating),
  };
}

function normalizeRoast(value: string) {
  const candidates = extractRoastSentences(value);
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

function normalizeShoppingSuggestions(value: unknown): OutfitResultData["shoppingSuggestions"] {
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
    if (!title) {
      return [];
    }
    const category = normalizeShopCategory(suggestion.category);
    const searchQuery =
      toNonEmptyString(suggestion.searchQuery) ??
      `${title} ${SHOP_CATEGORY_CONFIG[category]}`;
    const productUrl = createControlledZalandoUrl(searchQuery);

    return [{
      title,
      reason:
        toNonEmptyString(suggestion.reason) ??
        "Dit item kan meer samenhang en richting aan de outfit geven.",
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

function makeShareQuote(roast: string) {
  const firstSentence = roast.split(/(?<=[.!?])\s+/)[0] ?? roast;
  const words = firstSentence.trim().split(/\s+/).filter(Boolean);
  const shortened = words.slice(0, 12).join(" ");
  return words.length > 12 ? `${shortened.replace(/[.!?]+$/, "")}…` : shortened;
}

function fillAlternativeQuotes(quotes: string[], shareQuote: string) {
  const normalizedQuotes = quotes.map((quote) => normalizeQuote(quote, ""));
  const uniqueQuotes = [...normalizedQuotes, ...FALLBACK_ALTERNATIVE_QUOTES].filter(
    (quote, index, allQuotes) =>
      quote.length > 0 &&
      quote.toLowerCase() !== shareQuote.toLowerCase() &&
      allQuotes.findIndex((item) => item.toLowerCase() === quote.toLowerCase()) === index,
  );

  return uniqueQuotes.slice(0, 2);
}

function normalizeQuote(value: string, fallback: string) {
  const firstSentence = value.split(/(?<=[.!?])\s+/)[0]?.trim() ?? "";
  const words = firstSentence.split(/\s+/).filter(Boolean);
  const shortened = words.slice(0, 12).join(" ");
  const quote = words.length > 12
    ? `${shortened.replace(/[.!?]+$/, "")}…`
    : shortened;

  return quote && !containsLikelyEnglish(quote, 1) ? quote : fallback;
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      image?: unknown;
      occasion?: unknown;
      intensity?: unknown;
    };
    const occasion = normalizeOccasion(body.occasion);

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

    const userPrompt = `
Gelegenheid: ${occasion}
Feedbackstijl: ${body.intensity}

Regels:
- Beoordeel de outfit specifiek voor de gekozen gelegenheid.
- Bij Sportschool: herken sportkleding, trainingsschoenen, ademende materialen, bewegingsvrijheid en praktische laagjes. Beoordeel of de outfit logisch en stijlvol werkt voor trainen.
- Schrijf alle feedback altijd in het Nederlands, inclusief shareQuote en alternativeQuotes.
- Genereer nooit Engelse quotes en mix nooit Nederlands met Engels.
- Schrijf voor een Nederlands publiek.
- Score is 1 t/m 10
- Het veld roast bevat exact 3 korte Nederlandse zinnen, elk op een eigen regel.
- Iedere roastzin heeft een duidelijke clou en is scherp, grappig en zelfstandig deelbaar.
- Klink als een scherpe Nederlandse vriend: direct, gevat en een tikje brutaal, maar niet gemeen.
- Noem waar mogelijk zichtbare details zoals schoenen, shirt, broek, kleuren, pasvorm of uitstraling.
- Vermijd algemene feedback zoals "je outfit is leuk" of "dit past niet goed".
- Schrijf nooit 4 of meer roastzinnen of roastregels.
- Roast uitsluitend kleding, styling en geschiktheid voor de gelegenheid; nooit lichaam, gezicht, leeftijd, gewicht, gender, afkomst of aantrekkelijkheid.
- Gebruik deze voorbeelden alleen als stijlreferentie en neem ze niet letterlijk over:
  "Die sneakers zijn klaar voor Basic-Fit, maar je shirt denkt dat jullie naar kantoor gaan."
  "Deze outfit heeft meer twijfel dan een groepsapp waar niemand durft te kiezen."
  "Je broek zegt casual, je schoenen zeggen: ik ben per ongeluk meegekomen."
- Schrijf origineel en imiteer geen echte stylist of televisiepersoonlijkheid.
- Genereer altijd een apart veld shareQuote.
- Genereer daarnaast exact 2 verschillende alternativeQuotes.
- Kies de sterkste en meest deelbare quote als shareQuote.
- De 3 quotes totaal zijn uitsluitend Nederlands, maximaal 12 woorden en precies één zin.
- Gebruik geen Engelse woorden in de quotes.
- Laat iedere quote waar mogelijk een zichtbaar kledingdetail noemen, zoals jas, broek, schoenen, kleur, pasvorm of silhouet.
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
    const needsDutchRewrite =
      !hasValidRoast(parsed) ||
      (typeof roastText === "string" && containsLikelyEnglish(roastText));

    if (needsDutchRewrite) {
      const correctionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...messages,
        { role: "assistant", content },
        {
          role: "user",
          content:
            "Herschrijf dit volledige JSON-resultaat nu strikt in natuurlijk Nederlands. Gebruik nergens Engelse zinnen of gemengde taal. Behoud het exacte JSON-format. Maak shareQuote de beste scherpe Nederlandse zin van maximaal 12 woorden. Voeg exact 2 unieke alternativeQuotes toe, ook uitsluitend Nederlands en maximaal 12 woorden. De 3 quotes totaal mogen elkaar niet dupliceren. Laat de quotes waar mogelijk een zichtbaar kledingdetail noemen. Maak roast exact 3 korte zinnen, elk op een eigen regel en met een duidelijke clou. Klink direct, gevat en een tikje brutaal, maar roast alleen kleding en styling. Schrijf nooit een vierde roastzin. Controleer alle arrays en shopsuggesties.",
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
      return Response.json(normalizeOutfitResult(parsedObject, roastText));
    }

    if (typeof roastText === "string" && containsLikelyEnglish(roastText)) {
      console.error("OpenAI returned a likely English outfit response.", parsed);
      return Response.json({ error: "Invalid AI response" }, { status: 500 });
    }

    console.warn("OpenAI response did not include a roast; using Dutch fallback.", parsed);
    return Response.json(normalizeOutfitResult(parsedObject, FALLBACK_ROAST));
  } catch (error) {
    console.error("Outfit check API error:", error);
    return Response.json({ error: "Outfit check failed" }, { status: 500 });
  }
}
