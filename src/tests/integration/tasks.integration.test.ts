import request from "supertest";
import app from "../../app";

describe("Task Integration Tests", () => {
  let testUserId: string;
  let testTaskId: string;

  beforeAll(async () => {
    // Create a test user first
    const userResponse = await request(app).post("/api/users").send({
      name: "Task Test User",
      email: "tasktest@example.com",
      role: "user",
    });
    testUserId = userResponse.body.data.id;
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Implementar autenticação",
          description: "Criar sistema de login e registro",
          priority: "high",
          assignedTo: testUserId,
          createdBy: testUserId,
          dueDate: new Date("2025-12-31T23:59:59.000Z").toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe("Implementar autenticação");
      expect(response.body.data.status).toBe("todo");

      testTaskId = response.body.data.id;
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app).post("/api/tasks").send({
        title: "Incomplete Task",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should create task with default priority", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "Task with default priority",
          description: "Testing default values",
          assignedTo: testUserId,
          createdBy: testUserId,
          dueDate: new Date("2025-12-31").toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe("medium");
    });
  });

  describe("GET /api/tasks", () => {
    it("should get all tasks", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should filter tasks by userId", async () => {
      const response = await request(app).get(
        `/api/tasks?userId=${testUserId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach((task: any) => {
        expect(task.assignedTo).toBe(testUserId);
      });
    });

    it("should filter tasks by status", async () => {
      const response = await request(app).get("/api/tasks?status=todo");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach((task: any) => {
        expect(task.status).toBe("todo");
      });
    });
  });

  describe("GET /api/tasks/statistics", () => {
    it("should get task statistics", async () => {
      const response = await request(app).get("/api/tasks/statistics");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("total");
      expect(response.body.data).toHaveProperty("byStatus");
      expect(response.body.data).toHaveProperty("byPriority");
      expect(typeof response.body.data.total).toBe("number");
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should get task by ID", async () => {
      const response = await request(app).get(`/api/tasks/${testTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testTaskId);
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).get("/api/tasks/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task", async () => {
      const response = await request(app).put(`/api/tasks/${testTaskId}`).send({
        status: "in_progress",
        priority: "urgent",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("in_progress");
      expect(response.body.data.priority).toBe("urgent");
    });

    it("should return 400 for non-existent task update", async () => {
      const response = await request(app)
        .put("/api/tasks/non-existent-id")
        .send({
          status: "done",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .send({
          title: "Task to delete",
          description: "This will be deleted",
          assignedTo: testUserId,
          createdBy: testUserId,
          dueDate: new Date("2025-12-31").toISOString(),
        });

      const taskId = createResponse.body.data.id;

      const response = await request(app).delete(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app).get(`/api/tasks/${taskId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
