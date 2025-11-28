import { Router } from "express";
import { reportController } from "../controllers/ReportController";

const router = Router();

/**
 * @swagger
 * /api/reports:
 *   post:
 *     tags: [Reports]
 *     summary: Gera um novo relatório
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, generatedBy, startDate, endDate]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [daily, weekly, monthly, custom]
 *                 example: weekly
 *               generatedBy:
 *                 type: string
 *                 example: user_123
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-01T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-30T23:59:59.000Z
 *     responses:
 *       201:
 *         description: Relatório gerado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", (req, res) => reportController.generateReport(req, res));

/**
 * @swagger
 * /api/reports:
 *   get:
 *     tags: [Reports]
 *     summary: Lista todos os relatórios
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, custom]
 *         description: Filtrar por tipo de relatório
 *     responses:
 *       200:
 *         description: Lista de relatórios
 *       500:
 *         description: Erro interno
 */
router.get("/", (req, res) => reportController.getAllReports(req, res));

/**
 * @swagger
 * /api/reports/statistics:
 *   get:
 *     tags: [Reports]
 *     summary: Retorna estatísticas dos relatórios
 *     responses:
 *       200:
 *         description: Estatísticas dos relatórios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalReports:
 *                       type: number
 *                     reportsByType:
 *                       type: object
 */
router.get("/statistics", (req, res) =>
  reportController.getSummaryStatistics(req, res)
);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     tags: [Reports]
 *     summary: Busca um relatório por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do relatório
 *     responses:
 *       200:
 *         description: Relatório encontrado
 *       404:
 *         description: Relatório não encontrado
 */
router.get("/:id", (req, res) => reportController.getReportById(req, res));

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     tags: [Reports]
 *     summary: Deleta um relatório
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório deletado
 *       400:
 *         description: Erro ao deletar
 */
router.delete("/:id", (req, res) => reportController.deleteReport(req, res));

export default router;
