import {
  getCurrentUser,
  getUserProfile,
  toRoastUsage,
} from "@/lib/authServer";
import {
  ApiRequestError,
  enforceRateLimit,
  jsonNoStore,
} from "@/lib/apiSecurity";

export async function GET(request: Request) {
  try {
    enforceRateLimit(request, "account-profile", 60, 60_000);
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonNoStore({ error: "Niet ingelogd." }, { status: 401 });
    }

    const profile = await getUserProfile(user);
    return jsonNoStore({
      profile,
      usage: toRoastUsage(profile),
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    console.error("Account profile load failed:", error);
    return jsonNoStore({ error: "Profiel laden lukt niet." }, { status: 500 });
  }
}
