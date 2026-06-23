import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY ontbreekt.");
  }

  return new Stripe(secretKey);
}

export function getPremiumPriceId() {
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;

  if (!priceId) {
    throw new Error("STRIPE_PREMIUM_PRICE_ID ontbreekt.");
  }

  return priceId;
}

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL ontbreekt.");
  }

  return siteUrl.replace(/\/+$/, "");
}
