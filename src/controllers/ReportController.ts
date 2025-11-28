import { Request, Response } from "express";
import { reportService } from "../services/ReportService";
import { GenerateReportDTO, ReportType } from "../models/Report";
import { ApiResponse } from "../models/Common";
import { logger } from "../utils/logger";

export class ReportController {
  /**
   * Generates a new report
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { type, generatedBy, startDate, endDate } = req.body;

      // Validate required fields
      if (!type || !generatedBy || !startDate || !endDate) {
        const response: ApiResponse = {
          success: false,
          error:
            "Missing required fields: type, generatedBy, startDate, endDate",
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const reportData: GenerateReportDTO = {
        type,
        generatedBy,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      const report = await reportService.generateReport(reportData);

      const response: ApiResponse = {
        success: true,
        data: report,
        message: "Report generated successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error("Error generating report", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Gets all reports
   */
  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.query;

      let reports;
      if (type) {
        reports = await reportService.getReportsByType(type as ReportType);
      } else {
        reports = await reportService.getAllReports();
      }

      const response: ApiResponse = {
        success: true,
        data: reports,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching reports", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Gets a report by ID
   */
  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = await reportService.getReportById(id);

      if (!report) {
        const response: ApiResponse = {
          success: false,
          error: "Report not found",
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: report,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching report", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }

  /**
   * Deletes a report
   */
  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await reportService.deleteReport(id);

      const response: ApiResponse = {
        success: true,
        message: "Report deleted successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error deleting report", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  }

  /**
   * Gets summary statistics
   */
  async getSummaryStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await reportService.getSummaryStatistics();

      const response: ApiResponse = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error: any) {
      logger.error("Error fetching summary statistics", error);

      const response: ApiResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }
}

export const reportController = new ReportController();
