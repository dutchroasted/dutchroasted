import { getPremiumPriceId, getSiteUrl, getStripe } from "@/lib/stripe";

export async function POST() {
  try {
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
