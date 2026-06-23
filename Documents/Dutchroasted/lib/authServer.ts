import { FREE_DAILY_ROAST_LIMIT } from "./roastTypes";

export type Plan = "free" | "premium" | "pro";

export type CurrentUser = {
  id: string;
  email: string | null;
};

export type UserProfile = {
  id: string;
  email: string | null;
  plan: Plan;
  subscription_status: "active" | "inactive";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  daily_roast_count: number;
  daily_roast_date: string | null;
  created_at: string;
};

export type RoastUsage = {
  authenticated: boolean;
  plan: Plan | "anonymous";
  used: number;
  limit: number | null;
  unlimited: boolean;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return null;
  }

  return { url, anonKey, serviceRoleKey };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

export async function getCurrentUser(request: Request): Promise<CurrentUser | null> {
  const config = getSupabaseConfig();
  const token = getBearerToken(request);
  if (!config || !token) {
    return null;
  }

  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const user = (await response.json()) as { id?: unknown; email?: unknown };
  if (typeof user.id !== "string") {
    return null;
  }

  return {
    id: user.id,
    email: typeof user.email === "string" ? user.email : null,
  };
}

export async function getUserProfile(user: CurrentUser): Promise<UserProfile> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase server config is missing");
  }

  const encodedId = encodeURIComponent(user.id);
  const response = await fetch(`${config.url}/rest/v1/profiles?id=eq.${encodedId}&select=*`, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch user profile");
  }

  const profiles = (await response.json()) as UserProfile[];
  if (profiles[0]) {
    return normalizeDailyCount(normalizeProfile(profiles[0]));
  }

  const created = await createUserProfile(user);
  return normalizeDailyCount(normalizeProfile(created));
}

async function createUserProfile(user: CurrentUser): Promise<UserProfile> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase server config is missing");
  }

  const response = await fetch(`${config.url}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      plan: "free",
      daily_roast_count: 0,
      daily_roast_date: today(),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("Could not create profile:", message);
    throw new Error("Could not create user profile");
  }

  const profiles = (await response.json()) as UserProfile[];
  if (!profiles[0]) {
    throw new Error("Profile creation returned no row");
  }

  return profiles[0];
}

function normalizeProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    plan: profile.plan ?? "free",
    subscription_status:
      profile.subscription_status === "active" ? "active" : "inactive",
    stripe_customer_id: profile.stripe_customer_id ?? null,
    stripe_subscription_id: profile.stripe_subscription_id ?? null,
  };
}

async function updateProfile(userId: string, patch: Partial<UserProfile>) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase server config is missing");
  }

  const response = await fetch(
    `${config.url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(patch),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    console.error("Could not update profile:", message);
    throw new Error("Could not update user profile");
  }

  const profiles = (await response.json()) as UserProfile[];
  if (!profiles[0]) {
    throw new Error("Profile update returned no row");
  }

  return profiles[0];
}

async function normalizeDailyCount(profile: UserProfile) {
  if (profile.daily_roast_date === today()) {
    return profile;
  }

  return updateProfile(profile.id, {
    daily_roast_count: 0,
    daily_roast_date: today(),
  });
}

export function canUserRoast(profile: UserProfile) {
  if (hasActivePremium(profile)) {
    return true;
  }

  return profile.daily_roast_count < FREE_DAILY_ROAST_LIMIT;
}

export async function incrementRoastCount(profile: UserProfile) {
  if (hasActivePremium(profile)) {
    return normalizeDailyCount(profile);
  }

  const normalized = await normalizeDailyCount(profile);
  return updateProfile(normalized.id, {
    daily_roast_count: normalized.daily_roast_count + 1,
    daily_roast_date: today(),
  });
}

export function toRoastUsage(profile: UserProfile): RoastUsage {
  const unlimited = hasActivePremium(profile);

  return {
    authenticated: true,
    plan: profile.plan,
    used: profile.daily_roast_count,
    limit: unlimited ? null : FREE_DAILY_ROAST_LIMIT,
    unlimited,
  };
}

export function hasActivePremium(profile: UserProfile) {
  return profile.subscription_status === "active";
}
