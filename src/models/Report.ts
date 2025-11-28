export enum ReportType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  CUSTOM = "custom",
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  generatedBy: string; // User ID
  dateRange: {
    start: Date;
    end: Date;
  };
  data: ReportData;
  createdAt: Date;
}

export interface ReportData {
  totalUsers: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  completionRate: number;
}

export interface GenerateReportDTO {
  type: ReportType;
  generatedBy: string;
  startDate: Date;
  endDate: Date;
}
