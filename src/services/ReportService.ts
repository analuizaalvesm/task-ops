import {
  Report,
  GenerateReportDTO,
  ReportType,
  ReportData,
} from "../models/Report";
import { userService } from "./UserService";
import { taskService } from "./TaskService";
import { logger } from "../utils/logger";

// Simulated in-memory database
let reports: Report[] = [];

export class ReportService {
  /**
   * Generates a new report
   */
  async generateReport(reportData: GenerateReportDTO): Promise<Report> {
    logger.info("Generating report", { type: reportData.type });

    const data = await this.calculateReportData(
      reportData.startDate,
      reportData.endDate
    );

    const newReport: Report = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: this.generateReportTitle(
        reportData.type,
        reportData.startDate,
        reportData.endDate
      ),
      type: reportData.type,
      generatedBy: reportData.generatedBy,
      dateRange: {
        start: reportData.startDate,
        end: reportData.endDate,
      },
      data,
      createdAt: new Date(),
    };

    reports.push(newReport);
    logger.info("Report generated successfully", { reportId: newReport.id });
    return newReport;
  }

  /**
   * Retrieves all reports
   */
  async getAllReports(): Promise<Report[]> {
    logger.debug("Fetching all reports");
    return reports;
  }

  /**
   * Retrieves a report by ID
   */
  async getReportById(id: string): Promise<Report | null> {
    logger.debug("Fetching report by ID", { reportId: id });
    const report = reports.find((r) => r.id === id);
    return report || null;
  }

  /**
   * Deletes a report
   */
  async deleteReport(id: string): Promise<void> {
    logger.info("Deleting report", { reportId: id });

    const reportIndex = reports.findIndex((r) => r.id === id);
    if (reportIndex === -1) {
      throw new Error("Report not found");
    }

    reports.splice(reportIndex, 1);
    logger.info("Report deleted successfully", { reportId: id });
  }

  /**
   * Gets reports by type
   */
  async getReportsByType(type: ReportType): Promise<Report[]> {
    logger.debug("Fetching reports by type", { type });
    return reports.filter((r) => r.type === type);
  }

  /**
   * Calculates report data
   */
  private async calculateReportData(
    startDate: Date,
    endDate: Date
  ): Promise<ReportData> {
    const allUsers = await userService.getAllUsers();
    const allTasks = await taskService.getAllTasks();
    const stats = await taskService.getTaskStatistics();

    // Filter tasks within date range
    const tasksInRange = allTasks.filter(
      (task) => task.createdAt >= startDate && task.createdAt <= endDate
    );

    const completedTasks = tasksInRange.filter(
      (t) => t.status === "done"
    ).length;
    const completionRate =
      tasksInRange.length > 0 ? completedTasks / tasksInRange.length : 0;

    return {
      totalUsers: allUsers.length,
      totalTasks: tasksInRange.length,
      tasksByStatus: stats.byStatus,
      tasksByPriority: stats.byPriority,
      completionRate,
    };
  }

  /**
   * Generates a title for the report
   */
  private generateReportTitle(
    type: ReportType,
    startDate: Date,
    endDate: Date
  ): string {
    const start = startDate.toLocaleDateString("pt-BR");
    const end = endDate.toLocaleDateString("pt-BR");
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    return `${typeLabel} Report: ${start} - ${end}`;
  }

  /**
   * Gets summary statistics
   */
  async getSummaryStatistics(): Promise<{
    totalReports: number;
    reportsByType: Record<string, number>;
  }> {
    const reportsByType: Record<string, number> = {};

    reports.forEach((report) => {
      reportsByType[report.type] = (reportsByType[report.type] || 0) + 1;
    });

    return {
      totalReports: reports.length,
      reportsByType,
    };
  }
}

export const reportService = new ReportService();
