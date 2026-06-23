import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return Response.json({ error: "Stripe webhook is niet geconfigureerd." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return Response.json({ error: "Ongeldige Stripe webhook." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.info("Stripe checkout completed:", session.id);
      // TODO: Koppel Checkout veilig aan auth.user.id en zet profiles.plan op "premium".
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      console.info("Stripe subscription updated:", subscription.id, subscription.status);
      // TODO: Synchroniseer profiles.plan zodra stripe_customer_id veilig is opgeslagen.
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.info("Stripe subscription deleted:", subscription.id);
      // TODO: Zet profiles.plan terug op "free" zodra de klantkoppeling beschikbaar is.
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
