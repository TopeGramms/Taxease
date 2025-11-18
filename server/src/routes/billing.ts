import { Router } from "express";
import Stripe from "stripe";
import { authMiddleware } from "../auth";
import { getSubscriptionForUser, upsertSubscription } from "../db";

export const billingRouter = Router();
export const billingWebhookRouter = Router();

const USE_MOCK = process.env.USE_MOCK_PAYMENTS === "true";
const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

billingRouter.post("/checkout", authMiddleware, async (req: any, res) => {
  if (USE_MOCK || !stripe) {
    // Immediately activate in mock mode
    upsertSubscription({ userId: req.user.id, status: "active", stripeCustomerId: null, stripeSubscriptionId: null });
    return res.json({ url: "/billing/success" });
  }
  const domain = process.env.APP_DOMAIN || "http://localhost:5173";
  const customer = await stripe.customers.create({ email: req.user.email });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID as string,
        quantity: 1
      }
    ],
    success_url: `${domain}/billing/success`,
    cancel_url: `${domain}/billing/cancel`
  });
  return res.json({ url: session.url });
});

billingWebhookRouter.post("/", async (req, res) => {
  if (!stripe) return res.status(200).json({ ok: true });
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;
  try {
    // req.body is raw Buffer because express.raw() is applied at mount site
    event = stripe.webhooks.constructEvent(req.body as any, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        // In a real app, map customerId to userId; for demo, skip lookup
        // Here we cannot resolve userId from webhooks without storing mapping; noop
      }
      break;
    default:
      break;
  }
  res.json({ received: true });
});

billingRouter.get("/status", authMiddleware, (req: any, res) => {
  const sub = getSubscriptionForUser(req.user.id);
  return res.json({ subscription: sub ?? { status: "none" } });
});

export default billingRouter;

