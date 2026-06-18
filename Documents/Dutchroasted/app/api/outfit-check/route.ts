import OpenAI from "openai";
import {
  OUTFIT_INTENSITIES,
  OUTFIT_OCCASIONS,
  type OutfitResultData,
} from "@/lib/outfitTypes";

const MODEL = "gpt-4o-mini";

const currentFashionContext = `
Actuele modecontext:
- Gebruik trends van nu als referentiekader, maar alleen wanneer ze zichtbaar en relevant zijn voor de outfit.
- Let op rustige luxe, minimalistische jaren-90 sandalen, rechte denim, zachte tailoring, tonal layering, sterke texturen, crochet/haakwerk als city-ready detail en literary/preppy styling met slimme basics.
- Maak advies draagbaar voor Nederlandse situaties: fietsbaar, weerbestendig, niet te overdreven tenzij de gelegenheid daarom vraagt.
- Shop suggesties moeten concreet en algemeen zijn, bijvoorbeeld: "minimalistische leren sneaker", "rechte donkere jeans", "crochet overshirt", "slanke jaren-90 sandaal".
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
- Maak de roast vermakelijk: flamboyant, dramatisch, modebewust en citeerbaar, met een originele stem.
- Maak de roast specifieker dan "dit is saai": verwijs naar kledingstukken, combinaties, kleuren of stylingkeuzes die je ziet.
- Schrijf direct en modegericht. Vermijd generieke AI-taal zoals "goede balans" zonder concreet kledingstuk of effect.
- Benoem wat een kledingstuk doet voor de outfit: silhouet, laagjes, contrast, materiaal, proportie, kleur, schoenen of accessoires.
- Formuleer analysepunten als duidelijke mode-observaties, bijvoorbeeld: "De jas draagt de outfit en maakt het premium" of "De broek breekt het silhouet; een slankere fit tilt dit meteen op."
- Bij feedbackstijl "rotterdams": schrijf als een Rotterdamse steek: droog, direct, straatwijs en met een knipoog. Denk "niet lullen, stylen", maar zonder schelden op de persoon. Je mag woorden gebruiken als "maat", "gozer" of "schat" als dat natuurlijk voelt. Altijd kleding roasten, nooit het lichaam.

Output altijd als geldige JSON:
{
  "roast": "string",
  "shareQuote": "string",
  "worksWell": ["string"],
  "canImprove": ["string"],
  "stylingTips": ["string"],
  "shoppingSuggestions": [
    {
      "label": "string",
      "reason": "string",
      "searchQuery": "string"
    }
  ],
  "score": number
}
`;

function isValidOccasion(value: unknown): value is string {
  return typeof value === "string" && OUTFIT_OCCASIONS.includes(value as never);
}

function isValidIntensity(value: unknown): value is string {
  return typeof value === "string" && OUTFIT_INTENSITIES.includes(value as never);
}

function isValidImage(value: unknown): value is string {
  return typeof value === "string" && /^data:image\/jpeg;base64,/.test(value);
}

function isOutfitResult(value: unknown): value is OutfitResultData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<OutfitResultData>;
  return (
    typeof result.roast === "string" &&
    typeof result.shareQuote === "string" &&
    Array.isArray(result.worksWell) &&
    result.worksWell.every((item) => typeof item === "string") &&
    Array.isArray(result.canImprove) &&
    result.canImprove.every((item) => typeof item === "string") &&
    Array.isArray(result.stylingTips) &&
    result.stylingTips.every((item) => typeof item === "string") &&
    Array.isArray(result.shoppingSuggestions) &&
    result.shoppingSuggestions.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as { label?: unknown }).label === "string" &&
        typeof (item as { reason?: unknown }).reason === "string" &&
        typeof (item as { searchQuery?: unknown }).searchQuery === "string",
    ) &&
    typeof result.score === "number" &&
    result.score >= 1 &&
    result.score <= 10
  );
}

function getAllText(result: OutfitResultData) {
  return [
    result.roast,
    result.shareQuote,
    ...result.worksWell,
    ...result.canImprove,
    ...result.stylingTips,
    ...result.shoppingSuggestions.flatMap((item) => [
      item.label,
      item.reason,
      item.searchQuery,
    ]),
  ].join(" ");
}

function containsLikelyEnglish(text: string) {
  const normalized = ` ${text.toLowerCase().replace(/[^a-zà-ÿ]+/g, " ")} `;
  const englishSignals = [
    " the ",
    " this ",
    " that ",
    " your ",
    " outfit is ",
    " shoes are ",
    " could be ",
    " would ",
    " should ",
    " looks ",
    " with the ",
    " and the ",
    " good choice ",
  ];

  return englishSignals.some((signal) => normalized.includes(signal));
}

function hasValidShareQuote(result: OutfitResultData) {
  const words = result.shareQuote.trim().split(/\s+/).filter(Boolean);
  const sentenceMarks = result.shareQuote.match(/[.!?]/g) ?? [];
  return words.length > 0 && words.length <= 12 && sentenceMarks.length <= 1;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      image?: unknown;
      occasion?: unknown;
      intensity?: unknown;
    };

    if (!isValidImage(body.image) || !isValidOccasion(body.occasion) || !isValidIntensity(body.intensity)) {
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
Gelegenheid: ${body.occasion}
Feedbackstijl: ${body.intensity}

Regels:
- Schrijf alle feedback altijd in het Nederlands, inclusief shareQuote.
- Genereer nooit Engelse quotes en mix nooit Nederlands met Engels.
- Schrijf voor een Nederlands publiek.
- Score is 1 t/m 10
- De langere roast is 3 tot 5 korte regels of zinnen: grappig, beeldend, praktisch en specifiek voor deze outfit.
- De langere roast heeft flamboyante, theatrale stylistenergie en bevat minstens één bruikbare stylingobservatie.
- Schrijf origineel en imiteer geen echte stylist of televisiepersoonlijkheid.
- Genereer altijd een apart veld shareQuote.
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
- Analyse en stylingtips zijn direct, opinionated en fashion-focused.
- Vermijd zachte algemene zinnen zoals "past goed bij de outfit" of "goede combinatie"; schrijf concreet welk item wat doet.
- Voorbeeld goed: "De witte sneakers houden de outfit clean en modern. Sterke keuze."
- Voorbeeld goed: "De broek breekt het silhouet. Een slankere fit maakt de look direct scherper."
- Gebruik actuele modecontext als dat helpt, maar verzin geen merken of exacte trends die je niet uit de foto kunt afleiden
- Werkt goed, kan beter en stylingtips bevatten elk 3 tot 5 concrete punten
- Shopping suggestions zijn algemeen, geen echte affiliate links
- Shopping suggestions hebben label, reason en searchQuery
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
  "worksWell": ["string"],
  "canImprove": ["string"],
  "stylingTips": ["string"],
  "shoppingSuggestions": [
    {
      "label": "string",
      "reason": "string",
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

    const needsDutchRewrite =
      !isOutfitResult(parsed) ||
      containsLikelyEnglish(getAllText(parsed)) ||
      !hasValidShareQuote(parsed);

    if (needsDutchRewrite) {
      const correctionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...messages,
        { role: "assistant", content },
        {
          role: "user",
          content:
            "Herschrijf dit volledige JSON-resultaat nu strikt in natuurlijk Nederlands. Gebruik nergens Engelse zinnen of gemengde taal. Behoud het exacte JSON-format. Maak shareQuote precies één scherpe Nederlandse zin van maximaal 12 woorden. Maak roast 3 tot 5 korte, grappige en praktisch bruikbare Nederlandse zinnen. Controleer alle arrays en shopsuggesties.",
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
    }

    if (
      !isOutfitResult(parsed) ||
      containsLikelyEnglish(getAllText(parsed)) ||
      !hasValidShareQuote(parsed)
    ) {
      console.error("OpenAI returned an invalid or non-Dutch outfit response.", parsed);
      return Response.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Outfit check API error:", error);
    return Response.json({ error: "Outfit check failed" }, { status: 500 });
  }
}
