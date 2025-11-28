import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskStatus,
  TaskPriority,
} from "../models/Task";
import { hasRequiredFields, isNotEmpty } from "../utils/validators";
import { logger } from "../utils/logger";

// Simulated in-memory database
let tasks: Task[] = [];

export class TaskService {
  /**
   * Creates a new task
   */
  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    logger.info("Creating new task", { title: taskData.title });

    // Validation
    if (
      !hasRequiredFields(taskData, [
        "title",
        "description",
        "assignedTo",
        "createdBy",
        "dueDate",
      ])
    ) {
      throw new Error("Missing required fields");
    }

    if (!isNotEmpty(taskData.title)) {
      throw new Error("Title cannot be empty");
    }

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title,
      description: taskData.description,
      status: TaskStatus.TODO,
      priority: taskData.priority || TaskPriority.MEDIUM,
      assignedTo: taskData.assignedTo,
      createdBy: taskData.createdBy,
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    logger.info("Task created successfully", { taskId: newTask.id });
    return newTask;
  }

  /**
   * Retrieves all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    logger.debug("Fetching all tasks");
    return tasks;
  }

  /**
   * Retrieves a task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    logger.debug("Fetching task by ID", { taskId: id });
    const task = tasks.find((t) => t.id === id);
    return task || null;
  }

  /**
   * Updates a task
   */
  async updateTask(id: string, updateData: UpdateTaskDTO): Promise<Task> {
    logger.info("Updating task", { taskId: id });

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;
    logger.info("Task updated successfully", { taskId: id });
    return updatedTask;
  }

  /**
   * Deletes a task
   */
  async deleteTask(id: string): Promise<void> {
    logger.info("Deleting task", { taskId: id });

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks.splice(taskIndex, 1);
    logger.info("Task deleted successfully", { taskId: id });
  }

  /**
   * Gets tasks by user ID
   */
  async getTasksByUser(userId: string): Promise<Task[]> {
    logger.debug("Fetching tasks by user", { userId });
    return tasks.filter((t) => t.assignedTo === userId);
  }

  /**
   * Gets tasks by status
   */
  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    logger.debug("Fetching tasks by status", { status });
    return tasks.filter((t) => t.status === status);
  }

  /**
   * Gets overdue tasks
   */
  async getOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    return tasks.filter(
      (t) =>
        t.status !== TaskStatus.DONE &&
        t.status !== TaskStatus.CANCELLED &&
        t.dueDate < now
    );
  }

  /**
   * Gets task statistics
   */
  async getTaskStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    tasks.forEach((task) => {
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    });

    return {
      total: tasks.length,
      byStatus,
      byPriority,
    };
  }
}

export const taskService = new TaskService();
