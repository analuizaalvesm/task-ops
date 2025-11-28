import dotenv from "dotenv";
import app from "./app";
import { logger } from "./utils/logger";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Starts the server
 */
function startServer(): void {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode`);
      logger.info(`📡 Listening on port ${PORT}`);
      logger.info(`🌐 API URL: http://localhost:${PORT}/api`);
      logger.info(`💚 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
function gracefulShutdown(): void {
  logger.info("Received shutdown signal, closing server...");
  process.exit(0);
}

// Handle shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start the server
startServer();
