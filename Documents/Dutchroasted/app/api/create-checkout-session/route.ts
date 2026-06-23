import { getPremiumPriceId, getSiteUrl, getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/authServer";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return Response.json(
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

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Session failed:", error);
    return Response.json(
      { error: "Stripe Checkout starten lukt niet. Probeer het opnieuw." },
      { status: 500 },
    );
  }
}
