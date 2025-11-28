import { Request, Response } from "express";
import { taskService } from "../services/TaskService";
import { CreateTaskDTO, UpdateTaskDTO, TaskStatus } from "../models/Task";
import { ApiResponse } from "../models/Common";
import { logger } from "../utils/logger";

export class TaskController {
  /**
   * Creates a new task
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const taskData: CreateTaskDTO = {
        ...req.body,
        dueDate: new Date(req.body.dueDate),
      };
      const task = await taskService.createTask(taskData);

      const response: ApiResponse = {
        success: true,
        data: task,
        message: "Task created successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error("Error creating task", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Gets all tasks
   */
  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const { userId, status } = req.query;

      let tasks;
      if (userId) {
        tasks = await taskService.getTasksByUser(userId as string);
      } else if (status) {
        tasks = await taskService.getTasksByStatus(status as TaskStatus);
      } else {
        tasks = await taskService.getAllTasks();
      }

      const response: ApiResponse = {
        success: true,
        data: tasks,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching tasks", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Gets a task by ID
   */
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);

      if (!task) {
        const response: ApiResponse = {
          success: false,
          error: "Task not found",
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: task,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching task", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Updates a task
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskDTO = req.body;

      if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
      }

      const task = await taskService.updateTask(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: task,
        message: "Task updated successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error updating task", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Deletes a task
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await taskService.deleteTask(id);

      const response: ApiResponse = {
        success: true,
        message: "Task deleted successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error deleting task", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Gets task statistics
   */
  async getTaskStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await taskService.getTaskStatistics();

      const response: ApiResponse = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching task statistics", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Gets overdue tasks
   */
  async getOverdueTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getOverdueTasks();

      const response: ApiResponse = {
        success: true,
        data: tasks,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching overdue tasks", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }
}

export const taskController = new TaskController();
