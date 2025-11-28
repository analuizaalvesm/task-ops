import { Router } from "express";
import userRoutes from "./users";
import taskRoutes from "./tasks";
import reportRoutes from "./reports";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Verifica o status da API
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Tempo de atividade em segundos
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/reports", reportRoutes);

export default router;
