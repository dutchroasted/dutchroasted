import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin is niet geconfigureerd.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return Response.json(
      { error: "Stripe webhook is niet geconfigureerd." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return Response.json(
      { error: "Ongeldige Stripe webhook." },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const email =
        session.customer_details?.email ?? session.customer_email;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!email) {
        console.error(
          "Geen e-mail gevonden in checkout session:",
          session.id,
        );
        break;
      }

      const supabase = getSupabaseAdmin();

      const { error } = await supabase.from("profiles").upsert(
        {
          id: crypto.randomUUID(),
          email,
          subscription_status: "active",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        },
        {
          onConflict: "email",
        },
      );

      if (error) {
        console.error("Supabase profile upsert failed:", error);
      } else {
        console.info("Premium geactiveerd voor:", email);
      }

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      console.info(
        "Stripe subscription updated:",
        subscription.id,
        subscription.status,
      );

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      console.info(
        "Stripe subscription deleted:",
        subscription.id,
      );

      break;
    }

    default:
      break;
  }

  return Response.json({ received: true });
}