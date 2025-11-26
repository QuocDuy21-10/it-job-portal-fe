/**
 * Dashboard Statistics Types
 * Định nghĩa các type cho dashboard statistics API
 */

export interface IDashboardStats {
  /** Số lượng việc làm được đăng trong 24h gần nhất */
  countJobs24h: number;

  /** Tổng số việc làm đang tuyển */
  countActiveJobs: number;

  /** Tổng số công ty đang tuyển dụng */
  countHiringCompanies: number;

  /** Phân bố theo mức lương */
  salaryDistribution: ISalaryDistribution[];

  /** Xu hướng việc làm theo ngày (7 ngày gần nhất) */
  jobTrend: IJobTrend[];

  /** Thời điểm sinh dữ liệu */
  generatedAt: Date;

  /** Dữ liệu lấy từ cache hay không */
  fromCache: boolean;
}

export interface ISalaryDistribution {
  /** Khoảng lương (VD: "0-10M", "10M-20M") */
  range: string;

  /** Số lượng việc làm trong khoảng này */
  count: number;
}

export interface IJobTrend {
  /** Ngày (format: YYYY-MM-DD) */
  date: string;

  /** Số lượng việc làm được đăng trong ngày */
  count: number;
}

/**
 * Refresh cache response
 */
export interface IRefreshCacheResponse {
  message: string;
}
