import { ReportService } from "../../../services/ReportService";
import { GenerateReportDTO, ReportType } from "../../../models/Report";

describe("ReportService", () => {
  let reportService: ReportService;

  beforeEach(() => {
    reportService = new ReportService();
  });

  describe("generateReport", () => {
    it("should generate a report with valid data", async () => {
      const reportData: GenerateReportDTO = {
        type: ReportType.WEEKLY,
        generatedBy: "user_123",
        startDate: new Date("2025-11-01"),
        endDate: new Date("2025-11-30"),
      };

      const report = await reportService.generateReport(reportData);

      expect(report).toBeDefined();
      expect(report.type).toBe(ReportType.WEEKLY);
      expect(report.generatedBy).toBe("user_123");
      expect(report.data).toBeDefined();
      expect(report.data.totalUsers).toBeGreaterThanOrEqual(0);
      expect(report.data.totalTasks).toBeGreaterThanOrEqual(0);
      expect(report.data.completionRate).toBeGreaterThanOrEqual(0);
    });

    it("should include statistics in report data", async () => {
      const reportData: GenerateReportDTO = {
        type: ReportType.MONTHLY,
        generatedBy: "user_456",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-31"),
      };

      const report = await reportService.generateReport(reportData);

      expect(report.data).toHaveProperty("tasksByStatus");
      expect(report.data).toHaveProperty("tasksByPriority");
      expect(typeof report.data.tasksByStatus).toBe("object");
      expect(typeof report.data.tasksByPriority).toBe("object");
    });
  });

  describe("getAllReports", () => {
    it("should return all reports", async () => {
      const reports = await reportService.getAllReports();
      expect(Array.isArray(reports)).toBe(true);
    });
  });

  describe("getReportById", () => {
    it("should return report if found", async () => {
      const reportData: GenerateReportDTO = {
        type: ReportType.DAILY,
        generatedBy: "user_789",
        startDate: new Date("2025-11-28"),
        endDate: new Date("2025-11-28"),
      };

      const createdReport = await reportService.generateReport(reportData);
      const foundReport = await reportService.getReportById(createdReport.id);

      expect(foundReport).toBeDefined();
      expect(foundReport?.id).toBe(createdReport.id);
    });

    it("should return null if report not found", async () => {
      const report = await reportService.getReportById("non-existent-id");
      expect(report).toBeNull();
    });
  });

  describe("getReportsByType", () => {
    it("should filter reports by type", async () => {
      const weeklyReportData: GenerateReportDTO = {
        type: ReportType.WEEKLY,
        generatedBy: "user_123",
        startDate: new Date("2025-11-01"),
        endDate: new Date("2025-11-07"),
      };

      await reportService.generateReport(weeklyReportData);
      const weeklyReports = await reportService.getReportsByType(
        ReportType.WEEKLY
      );

      expect(weeklyReports.length).toBeGreaterThan(0);
      weeklyReports.forEach((report) => {
        expect(report.type).toBe(ReportType.WEEKLY);
      });
    });
  });

  describe("deleteReport", () => {
    it("should delete an existing report", async () => {
      const reportData: GenerateReportDTO = {
        type: ReportType.CUSTOM,
        generatedBy: "user_123",
        startDate: new Date("2025-11-01"),
        endDate: new Date("2025-11-30"),
      };

      const createdReport = await reportService.generateReport(reportData);
      await reportService.deleteReport(createdReport.id);

      const foundReport = await reportService.getReportById(createdReport.id);
      expect(foundReport).toBeNull();
    });

    it("should throw error when deleting non-existent report", async () => {
      await expect(
        reportService.deleteReport("non-existent-id")
      ).rejects.toThrow("Report not found");
    });
  });

  describe("getSummaryStatistics", () => {
    it("should return summary statistics", async () => {
      const stats = await reportService.getSummaryStatistics();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalReports");
      expect(stats).toHaveProperty("reportsByType");
      expect(typeof stats.totalReports).toBe("number");
      expect(typeof stats.reportsByType).toBe("object");
    });
  });
});
