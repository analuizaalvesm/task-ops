import { Router } from "express";
import { taskController } from "../controllers/TaskController";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Cria uma nova tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, assignedTo, createdBy, dueDate]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Implementar API de autenticação
 *               description:
 *                 type: string
 *                 example: Criar endpoints de login e registro
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: high
 *               assignedTo:
 *                 type: string
 *                 example: user_123
 *               createdBy:
 *                 type: string
 *                 example: user_456
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T23:59:59.000Z
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", (req, res) => taskController.createTask(req, res));

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Lista todas as tarefas
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done, cancelled]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *       500:
 *         description: Erro interno
 */
router.get("/", (req, res) => taskController.getAllTasks(req, res));

/**
 * @swagger
 * /api/tasks/statistics:
 *   get:
 *     tags: [Tasks]
 *     summary: Retorna estatísticas das tarefas
 *     responses:
 *       200:
 *         description: Estatísticas das tarefas
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
 *                     total:
 *                       type: number
 *                     byStatus:
 *                       type: object
 *                     byPriority:
 *                       type: object
 */
router.get("/statistics", (req, res) =>
  taskController.getTaskStatistics(req, res)
);

/**
 * @swagger
 * /api/tasks/overdue:
 *   get:
 *     tags: [Tasks]
 *     summary: Lista tarefas atrasadas
 *     responses:
 *       200:
 *         description: Lista de tarefas atrasadas
 */
router.get("/overdue", (req, res) => taskController.getOverdueTasks(req, res));

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Busca uma tarefa por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *       404:
 *         description: Tarefa não encontrada
 */
router.get("/:id", (req, res) => taskController.getTaskById(req, res));

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Atualiza uma tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done, cancelled]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               assignedTo:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *       400:
 *         description: Erro de validação
 */
router.put("/:id", (req, res) => taskController.updateTask(req, res));

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Deleta uma tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa deletada
 *       400:
 *         description: Erro ao deletar
 */
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));

export default router;
