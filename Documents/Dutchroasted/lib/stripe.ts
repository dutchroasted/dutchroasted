// TODO: Install and configure the Stripe SDK once pricing is validated.
// TODO: Keep all Stripe secret keys server-side only.
// TODO: Replace placeholder price IDs with real Stripe price IDs before launch.

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PRICE_PREMIUM_MONTHLY = process.env.STRIPE_PRICE_PREMIUM_MONTHLY;
export const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY;
