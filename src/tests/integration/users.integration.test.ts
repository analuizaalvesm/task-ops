import request from "supertest";
import app from "../../app";

describe("User Integration Tests", () => {
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/api/users").send({
        name: "João Silva",
        email: "joao.silva@example.com",
        role: "user",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toBe("João Silva");
      expect(response.body.data.email).toBe("joao.silva@example.com");
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Invalid User",
        email: "invalid-email",
        role: "user",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("email");
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Test User",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 400 for duplicate email", async () => {
      await request(app).post("/api/users").send({
        name: "First User",
        email: "duplicate@example.com",
        role: "user",
      });

      const response = await request(app).post("/api/users").send({
        name: "Second User",
        email: "duplicate@example.com",
        role: "user",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Email already exists");
    });
  });

  describe("GET /api/users", () => {
    it("should get all users", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should get user by ID", async () => {
      const createResponse = await request(app).post("/api/users").send({
        name: "Maria Santos",
        email: "maria.santos@example.com",
        role: "manager",
      });

      const userId = createResponse.body.data.id;

      const response = await request(app).get(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.name).toBe("Maria Santos");
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app).get("/api/users/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user", async () => {
      const createResponse = await request(app).post("/api/users").send({
        name: "Pedro Lima",
        email: "pedro.lima@example.com",
        role: "user",
      });

      const userId = createResponse.body.data.id;

      const response = await request(app).put(`/api/users/${userId}`).send({
        name: "Pedro Lima Atualizado",
        role: "admin",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Pedro Lima Atualizado");
      expect(response.body.data.role).toBe("admin");
    });

    it("should return 400 for invalid update data", async () => {
      const createResponse = await request(app).post("/api/users").send({
        name: "Test User",
        email: "test@example.com",
        role: "user",
      });

      const userId = createResponse.body.data.id;

      const response = await request(app).put(`/api/users/${userId}`).send({
        email: "invalid-email-format",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user", async () => {
      const createResponse = await request(app).post("/api/users").send({
        name: "User to Delete",
        email: "delete@example.com",
        role: "user",
      });

      const userId = createResponse.body.data.id;

      const response = await request(app).delete(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app).get(`/api/users/${userId}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 400 for non-existent user deletion", async () => {
      const response = await request(app).delete("/api/users/non-existent-id");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
