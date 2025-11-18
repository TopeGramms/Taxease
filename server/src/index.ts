import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import authRoutes from "./routes/auth";
import billingRoutes, { billingWebhookRouter } from "./routes/billing";
import resultsRoutes from "./routes/results";
import { raw } from "express";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Mount Stripe webhook FIRST with raw body to preserve signature verification
app.use("/billing/webhook", raw({ type: "application/json" }), billingWebhookRouter);

// Use JSON parser for the rest of the API
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/billing", billingRoutes);
app.use("/results", resultsRoutes);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Paywall server listening on http://localhost:${port}`);
});

