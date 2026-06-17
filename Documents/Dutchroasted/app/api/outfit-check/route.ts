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
Je bent DutchRoasted, een scherpe maar behulpzame Nederlandse AI-stylist. Je geeft eerlijke outfitfeedback met humor. Je focust alleen op kleding, styling, kleuren, pasvorm van kleding, accessoires en de gekozen gelegenheid. Je beoordeelt nooit iemands lichaam, gewicht, lichaamsvorm, aantrekkelijkheid, leeftijd, gender, afkomst of gezondheid. Je maakt geen seksueel getinte opmerkingen. Je bent grappig en uitgesproken, maar niet kwetsend of discriminerend. Maak duidelijk dat feedback over de outfit gaat, niet over de persoon.

${currentFashionContext}

Belangrijke grenzen:
- Focus alleen op kleding, styling, kleuren, pasvorm van kleding, silhouet, accessoires en de gekozen gelegenheid.
- Beoordeel nooit iemands lichaam, gewicht, lichaamsvorm, aantrekkelijkheid, leeftijd, gender, afkomst, gezondheid of seksuele uitstraling.
- Geen seksuele opmerkingen, geen bodyshaming, geen discriminatie.
- De roast mag scherp en grappig zijn, maar nooit gemeen of persoonlijk kwetsend.
- Maak de roast specifieker dan "dit is saai": verwijs naar kledingstukken, combinaties, kleuren of stylingkeuzes die je ziet.
- Bij feedbackstijl "rotterdams": schrijf als een Rotterdamse steek: droog, direct, straatwijs en met een knipoog. Denk "niet lullen, stylen", maar zonder schelden op de persoon. Je mag woorden gebruiken als "maat", "gozer" of "schat" als dat natuurlijk voelt. Altijd kleding roasten, nooit het lichaam.

Output altijd als geldige JSON:
{
  "roast": "string",
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
- Schrijf altijd Nederlands
- Score is 1 t/m 10
- De roast is 2 tot 4 zinnen, grappig, beeldend en specifiek voor deze outfit
- Bij feedbackstijl "roast": maak het flamboyant, modisch en theatraal.
- Bij feedbackstijl "rotterdams": maak het directer, droger en volkser. Het mag voelen als een Rotterdamse steek, maar blijft behulpzaam en nooit kwetsend.
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

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            // Privacy: uploaded outfit images are only used for the AI analysis request and are not stored by this application.
            { type: "image_url", image_url: { url: body.image } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: body.intensity === "rotterdams" ? 0.9 : 0.95,
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      console.error("OpenAI returned an empty outfit response.");
      return Response.json({ error: "Empty response" }, { status: 500 });
    }

    const parsed = JSON.parse(content) as unknown;
    if (!isOutfitResult(parsed)) {
      console.error("OpenAI returned an invalid outfit response shape.", parsed);
      return Response.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Outfit check API error:", error);
    return Response.json({ error: "Outfit check failed" }, { status: 500 });
  }
}
