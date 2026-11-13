import cors from "cors";
import express from "express";
import helmet from "helmet";
import { setupSwagger } from "./docs";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { paymentController } from "./controllers";
import routes from "./routes";

export const app = express();

// Trust Render's reverse proxy
app.set("trust proxy", 1);

// Mounted before helmet: Swagger UI needs inline scripts that helmet's default CSP blocks.
setupSwagger(app);

app.use(helmet());
app.use(cors());

// Stripe webhook must receive raw request bytes
app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentController.webhook
);

app.use(express.json({ limit: "100kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);
