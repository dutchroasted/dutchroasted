import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
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
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return Response.json({ error: "Ongeldige Stripe webhook." }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return Response.json({ error: "Supabase is niet geconfigureerd." }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await activateCheckout(supabase, event.data.object);
        break;
      case "customer.subscription.updated":
        await syncSubscription(supabase, event.data.object);
        break;
      case "customer.subscription.deleted":
        await deactivateSubscription(supabase, event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Stripe webhook handling failed for ${event.type}:`, error);
    return Response.json({ error: "Webhook verwerken mislukt." }, { status: 500 });
  }

  return Response.json({ received: true });
}

async function activateCheckout(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.userId;
  const email = session.customer_details?.email ?? session.customer_email;
  const stripeCustomerId = getStripeId(session.customer);
  const stripeSubscriptionId = getStripeId(session.subscription);
  const patch = {
    subscription_status: "active",
    plan: "premium",
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
  };

  const query = userId
    ? supabase.from("profiles").update(patch).eq("id", userId)
    : email
      ? supabase.from("profiles").update(patch).eq("email", email)
      : null;

  if (!query) {
    throw new Error(`Checkout ${session.id} bevat geen userId of e-mail.`);
  }

  const { error } = await query;
  if (error) {
    throw error;
  }
}

async function syncSubscription(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
) {
  const active = subscription.status === "active" || subscription.status === "trialing";
  await updateProfileByStripeIds(supabase, subscription, {
    subscription_status: active ? "active" : "inactive",
    plan: active ? "premium" : "free",
    stripe_customer_id: getStripeId(subscription.customer),
    stripe_subscription_id: subscription.id,
  });
}

async function deactivateSubscription(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
) {
  await updateProfileByStripeIds(supabase, subscription, {
    subscription_status: "inactive",
    plan: "free",
  });
}

async function updateProfileByStripeIds(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
  patch: Record<string, string | null>,
) {
  const customerId = getStripeId(subscription.customer);
  const filters = [`stripe_subscription_id.eq.${subscription.id}`];

  if (customerId) {
    filters.push(`stripe_customer_id.eq.${customerId}`);
  }

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .or(filters.join(","));

  if (error) {
    throw error;
  }
}

function getStripeId(value: string | { id: string } | null) {
  return typeof value === "string" ? value : value?.id ?? null;
}
