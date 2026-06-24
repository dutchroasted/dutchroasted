import { getPremiumPriceId, getSiteUrl, getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/authServer";
import {
  ApiRequestError,
  enforceRateLimit,
  enforceSameOrigin,
  jsonNoStore,
} from "@/lib/apiSecurity";

export async function POST(request: Request) {
  try {
    enforceSameOrigin(request);
    enforceRateLimit(request, "checkout", 5, 10 * 60_000);
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonNoStore(
        { error: "Log eerst in om Premium te activeren." },
        { status: 401 },
      );
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: getPremiumPriceId(),
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/account?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      customer_email: user.email ?? undefined,
      metadata: { userId: user.id },
      subscription_data: {
        metadata: { userId: user.id },
      },
    });

    if (!session.url) {
      throw new Error("Stripe Checkout gaf geen URL terug.");
    }

    return jsonNoStore({ url: session.url });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return jsonNoStore({ error: error.message }, { status: error.status });
    }

    console.error("Stripe Checkout Session failed:", error);
    return jsonNoStore(
      { error: "Stripe Checkout starten lukt niet. Probeer het opnieuw." },
      { status: 500 },
    );
  }
}
