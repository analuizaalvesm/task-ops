import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { logger } from "./utils/logger";
import { swaggerSpec } from "./config/swagger";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation (disabled in production)
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "GCS DevOps API Docs",
    })
  );
  logger.info("Swagger UI habilitado em /api-docs");
} else {
  app.get("/api-docs", (_req: Request, res: Response) => {
    res.status(403).json({ error: "Documentação não disponível em produção" });
  });
}

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.method !== "GET" ? req.body : undefined,
  });
  next();
});

// API Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  const response: Record<string, any> = {
    message: "GCS DevOps API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      tasks: "/api/tasks",
      reports: "/api/reports",
      health: "/api/health",
    },
    environment: process.env.NODE_ENV || "development",
  };

  if (!isProd) {
    response.endpoints.documentation = "/api-docs";
  }

  res.json(response);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error", err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

export default app;
