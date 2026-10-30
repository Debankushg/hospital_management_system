import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi";

/** Mounts Swagger UI at /api/docs and the raw spec at /api/docs.json. */
export function setupSwagger(app: Express) {
  app.get("/api/docs.json", (_req, res) => res.json(openApiSpec));
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: "Hospital API Docs",
      swaggerOptions: { persistAuthorization: true },
    }),
  );
}
