/**
 * Dashboard Statistics Types
 * Định nghĩa các type cho dashboard statistics API
 */

export interface IStatisticsTrendPoint {
  /** Ngày (format: YYYY-MM-DD) */
  date: string;

  /** Số lượng bản ghi trong ngày */
  count: number;
}

export interface IStatisticsStatusBucket {
  /** Trạng thái hiện tại */
  status: string;

  /** Số lượng bản ghi theo trạng thái */
  count: number;
}

export interface IStatisticsTopSkill {
  /** Tên kỹ năng */
  skill: string;

  /** Số lượng công việc yêu cầu kỹ năng này */
  count: number;
}

export interface IStatisticsTopJob {
  /** ID công việc */
  jobId: string;

  /** Tên công việc */
  jobName: string;

  /** Số lượng hồ sơ ứng tuyển */
  applicationsCount: number;
}

export interface IResumeProcessingHealth {
  totalResumes: number;
  parsedResumes: number;
  parseFailedResumes: number;
  parseSuccessRate: number;
  analyzedResumes: number;
  analysisFailedResumes: number;
  analysisSuccessRate: number;
}

export interface IAdminDashboardStats {
  /** Số lượng việc làm được đăng trong 24h gần nhất */
  countJobs24h: number;

  /** Tổng số việc làm đang tuyển */
  countActiveJobs: number;

  /** Tổng số việc làm chờ duyệt */
  countPendingApprovalJobs: number;

  /** Tổng số công ty đang tuyển dụng */
  countHiringCompanies: number;

  /** Tổng số công ty */
  countCompanies: number;

  /** Tổng số người dùng */
  countUsers: number;

  /** Xu hướng việc làm theo ngày (7 ngày gần nhất) */
  jobTrend: IStatisticsTrendPoint[];

  /** Xu hướng ứng tuyển theo ngày (7 ngày gần nhất) */
  applicationTrend: IStatisticsTrendPoint[];

  /** Kỹ năng được yêu cầu nhiều nhất */
  topDemandedSkills: IStatisticsTopSkill[];

  /** Tình trạng xử lý hồ sơ bởi pipeline AI */
  resumeProcessingHealth: IResumeProcessingHealth;

  /** Thời điểm sinh dữ liệu */
  generatedAt: string;

  /** Dữ liệu lấy từ cache hay không */
  fromCache: boolean;
}

export interface IHrDashboardStats {
  /** Tổng số việc làm đang tuyển */
  countActiveJobs: number;

  /** Tổng số việc làm chờ duyệt */
  countPendingApprovalJobs: number;

  /** Tổng số việc làm đã hết hạn */
  countExpiredJobs: number;

  /** Tổng số hồ sơ ứng tuyển */
  totalApplications: number;

  /** Số lượng hồ sơ trong 24h gần nhất */
  countApplications24h: number;

  /** Phân bố trạng thái hồ sơ */
  applicationStatusDistribution: IStatisticsStatusBucket[];

  /** Xu hướng ứng tuyển theo ngày (7 ngày gần nhất) */
  applicationTrend: IStatisticsTrendPoint[];

  /** Top công việc có nhiều ứng viên nhất */
  topJobsByApplications: IStatisticsTopJob[];

  /** Tỷ lệ đã phản hồi hồ sơ */
  responseRate: number;

  /** Thời gian phản hồi đầu tiên trung bình theo giờ */
  averageFirstResponseHours: number | null;

  /** Điểm matching trung bình */
  averageMatchingScore: number | null;

  /** Thời điểm sinh dữ liệu */
  generatedAt: string;

  /** Dữ liệu lấy từ cache hay không */
  fromCache: boolean;
}
