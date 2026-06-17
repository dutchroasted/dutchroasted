export type LeadInput = {
  email: string;
  source?: string;
  category?: string;
  intensity?: string;
  wantsUpdates?: boolean;
};

export async function createLead(input: LeadInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Supabase lead capture is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    );
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email: input.email,
      source: input.source || null,
      category: input.category || null,
      intensity: input.intensity || null,
      wants_updates: Boolean(input.wantsUpdates),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("Supabase lead insert failed:", message);
    throw new Error("Failed to create lead");
  }
}
