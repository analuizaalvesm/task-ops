import request from "supertest";
import app from "../../app";

describe("Report Integration Tests", () => {
  let testUserId: string;
  let testReportId: string;

  beforeAll(async () => {
    // Create a test user
    const userResponse = await request(app).post("/api/users").send({
      name: "Report Test User",
      email: "reporttest@example.com",
      role: "admin",
    });
    testUserId = userResponse.body.data.id;

    // Create some tasks to generate meaningful reports
    await request(app)
      .post("/api/tasks")
      .send({
        title: "Task 1",
        description: "First task for reports",
        assignedTo: testUserId,
        createdBy: testUserId,
        dueDate: new Date("2025-06-30").toISOString(),
        priority: "high",
      });

    await request(app)
      .post("/api/tasks")
      .send({
        title: "Task 2",
        description: "Second task for reports",
        assignedTo: testUserId,
        createdBy: testUserId,
        dueDate: new Date("2025-07-31").toISOString(),
        status: "in_progress",
        priority: "medium",
      });
  });

  describe("POST /api/reports", () => {
    it("should generate a monthly report", async () => {
      const response = await request(app)
        .post("/api/reports")
        .send({
          type: "monthly",
          generatedBy: testUserId,
          startDate: new Date("2025-11-01T00:00:00.000Z").toISOString(),
          endDate: new Date("2025-11-30T23:59:59.000Z").toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.type).toBe("monthly");
      expect(response.body.data).toHaveProperty("title");
      expect(response.body.data.title).toContain("Monthly Report");

      testReportId = response.body.data.id;
    });

    it("should generate a weekly report", async () => {
      const response = await request(app)
        .post("/api/reports")
        .send({
          type: "weekly",
          generatedBy: testUserId,
          startDate: new Date("2025-11-01T00:00:00.000Z").toISOString(),
          endDate: new Date("2025-11-07T23:59:59.000Z").toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.type).toBe("weekly");
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app).post("/api/reports").send({
        type: "daily",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should generate a daily report", async () => {
      const response = await request(app)
        .post("/api/reports")
        .send({
          type: "daily",
          generatedBy: testUserId,
          startDate: new Date("2025-11-28T00:00:00.000Z").toISOString(),
          endDate: new Date("2025-11-28T23:59:59.000Z").toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.data.type).toBe("daily");
    });
  });

  describe("GET /api/reports", () => {
    it("should get all reports", async () => {
      const response = await request(app).get("/api/reports");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it("should filter reports by type", async () => {
      const response = await request(app).get("/api/reports?type=monthly");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      response.body.data.forEach((report: any) => {
        expect(report.type).toBe("monthly");
      });
    });
  });

  describe("GET /api/reports/statistics", () => {
    it("should get summary statistics", async () => {
      const response = await request(app).get("/api/reports/statistics");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalReports");
      expect(response.body.data).toHaveProperty("reportsByType");
      expect(typeof response.body.data.totalReports).toBe("number");
      expect(typeof response.body.data.reportsByType).toBe("object");
    });
  });

  describe("GET /api/reports/:id", () => {
    it("should get report by ID", async () => {
      const response = await request(app).get(`/api/reports/${testReportId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testReportId);
      expect(response.body.data).toHaveProperty("data");
    });

    it("should return 404 for non-existent report", async () => {
      const response = await request(app).get("/api/reports/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/reports/:id", () => {
    it("should delete a report", async () => {
      const createResponse = await request(app)
        .post("/api/reports")
        .send({
          type: "custom",
          generatedBy: testUserId,
          startDate: new Date("2025-11-01T00:00:00.000Z").toISOString(),
          endDate: new Date("2025-11-15T23:59:59.000Z").toISOString(),
        });

      const reportId = createResponse.body.data.id;

      const response = await request(app).delete(`/api/reports/${reportId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const getResponse = await request(app).get(`/api/reports/${reportId}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 400 when deleting non-existent report", async () => {
      const response = await request(app).delete(
        "/api/reports/non-existent-id"
      );

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
