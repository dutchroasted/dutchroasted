import { createSupabaseServiceClient } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadRequestBody = {
  email?: unknown;
  source?: unknown;
  occasion?: unknown;
  intensity?: unknown;
  score?: unknown;
  marketingConsent?: unknown;
  consentText?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequestBody;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = optionalString(body.source) || "outfit_check";
    const occasion = optionalString(body.occasion);
    const intensity = optionalString(body.intensity);
    const consentText = optionalString(body.consentText);
    const score = optionalScore(body.score);

    if (!email || !emailPattern.test(email)) {
      return Response.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });
    }

    if (body.marketingConsent !== true) {
      return Response.json(
        { error: "Vink toestemming aan als je updates wilt ontvangen." },
        { status: 400 },
      );
    }

    if (!consentText) {
      return Response.json({ error: "Toestemmingstekst ontbreekt." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      return Response.json(
        { error: "Opslaan lukt niet. Probeer het later opnieuw." },
        { status: 500 },
      );
    }

    const { error } = await supabase.from("leads").insert({
      email,
      source,
      occasion,
      intensity,
      score,
      marketing_consent: true,
      consent_text: consentText,
    });

    if (error) {
      console.error("Supabase lead insert failed:", error.message);
      return Response.json(
        { error: "Opslaan lukt niet. Probeer het opnieuw." },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return Response.json({ error: "Opslaan lukt niet. Probeer het opnieuw." }, { status: 500 });
  }
}

function optionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue || null;
}

function optionalScore(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}
