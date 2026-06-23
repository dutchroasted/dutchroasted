import {
  getCurrentUser,
  getUserProfile,
  toRoastUsage,
} from "@/lib/authServer";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);

  if (!user) {
    return Response.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  try {
    const profile = await getUserProfile(user);
    return Response.json({
      profile,
      usage: toRoastUsage(profile),
    });
  } catch (error) {
    console.error("Account profile load failed:", error);
    return Response.json({ error: "Profiel laden lukt niet." }, { status: 500 });
  }
}
