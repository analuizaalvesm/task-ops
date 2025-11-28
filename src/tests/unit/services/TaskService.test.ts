import { TaskService } from "../../../services/TaskService";
import { CreateTaskDTO, TaskStatus, TaskPriority } from "../../../models/Task";

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  describe("createTask", () => {
    it("should create a new task with valid data", async () => {
      const taskData: CreateTaskDTO = {
        title: "Test Task",
        description: "This is a test task",
        priority: TaskPriority.HIGH,
        assignedTo: "user1",
        createdBy: "user2",
        dueDate: new Date("2025-12-31"),
      };

      const task = await taskService.createTask(taskData);

      expect(task).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.priority).toBe(TaskPriority.HIGH);
    });

    it("should use default priority if not specified", async () => {
      const taskData: CreateTaskDTO = {
        title: "Test Task",
        description: "This is a test task",
        assignedTo: "user1",
        createdBy: "user2",
        dueDate: new Date("2025-12-31"),
      };

      const task = await taskService.createTask(taskData);
      expect(task.priority).toBe(TaskPriority.MEDIUM);
    });
  });

  describe("getTasksByStatus", () => {
    it("should return tasks with specified status", async () => {
      const taskData: CreateTaskDTO = {
        title: "Test Task",
        description: "Description",
        assignedTo: "user1",
        createdBy: "user2",
        dueDate: new Date("2025-12-31"),
      };

      await taskService.createTask(taskData);
      const tasks = await taskService.getTasksByStatus(TaskStatus.TODO);

      expect(tasks.length).toBeGreaterThan(0);
      tasks.forEach((task) => {
        expect(task.status).toBe(TaskStatus.TODO);
      });
    });
  });

  describe("getTaskStatistics", () => {
    it("should return task statistics", async () => {
      const stats = await taskService.getTaskStatistics();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byStatus");
      expect(stats).toHaveProperty("byPriority");
    });
  });
});
