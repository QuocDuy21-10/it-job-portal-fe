# Endpoint Statistics

Trang này liệt kê 2 endpoint thống kê trong `statistics.api.ts`: số liệu cho dashboard quản trị và dashboard nhà tuyển dụng. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao có hai endpoint

Quản trị viên cần cái nhìn toàn hệ thống (số việc làm, công ty, người dùng, xu hướng, kỹ năng được cần nhiều). Nhà tuyển dụng chỉ cần số liệu của công ty mình (tin đang mở, hồ sơ nhận được, tỷ lệ phản hồi). Backend tách hai route và giới hạn vai trò riêng cho từng route.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetAdminDashboardStatsQuery` | `GET /statistics/admin-dashboard` | Không | Cung cấp `Statistics` | `components/statistics/admin-statistics-page.tsx` |
| `useGetHrDashboardStatsQuery` | `GET /statistics/hr-dashboard` | Không | Cung cấp `Statistics` | `components/statistics/hr-statistics-page.tsx` |

Đường dẫn được lấy từ `DASHBOARD_API_ENDPOINTS` trong `src/shared/config/dashboard.config.ts`.

## Đối chiếu với backend

Hai route có trong `statistics.controller.ts`. Theo controller, `admin-dashboard` chỉ cho `SUPER ADMIN` và `hr-dashboard` chỉ cho `HR`; chưa kiểm tra backend có cho `SUPER ADMIN` gọi route của HR hay không.

## Dữ liệu

Cả hai phản hồi có `generatedAt` (thời điểm tạo) và `fromCache` (backend trả bản đã cache hay không). Giao diện dùng hai trường này để hiện độ mới của số liệu.

| Dạng | Field chính |
| --- | --- |
| `IAdminDashboardStats` | `countActiveJobs`, `countPendingApprovalJobs`, `countHiringCompanies`, `countCompanies`, `countUsers`, `jobTrend`, `applicationTrend`, `topDemandedSkills`, `resumeProcessingHealth`, `generatedAt`, `fromCache` |
| `IHrDashboardStats` | `countActiveJobs`, `countPendingApprovalJobs`, `countExpiredJobs`, `totalApplications`, `applicationStatusDistribution`, `applicationTrend`, `topJobsByApplications`, `responseRate`, `averageFirstResponseHours`, `averageMatchingScore`, `generatedAt`, `fromCache` |

Các type nằm ở `src/shared/types/dashboard.d.ts` và là type TypeScript thuần, không có schema Zod kiểm tra lúc chạy. `IAdminDashboardStats` còn có thêm `countJobs24h`; xem file để biết đủ field.

## Source code liên quan

- [`src/features/statistics/redux/statistics.api.ts`](../../../src/features/statistics/redux/statistics.api.ts): khai báo endpoint
- [`src/shared/config/dashboard.config.ts`](../../../src/shared/config/dashboard.config.ts): đường dẫn endpoint
- [`src/shared/types/dashboard.d.ts`](../../../src/shared/types/dashboard.d.ts): kiểu dữ liệu
- [`src/components/statistics/admin-statistics-page.tsx`](../../../src/components/statistics/admin-statistics-page.tsx): dashboard quản trị
- [`src/components/statistics/hr-statistics-page.tsx`](../../../src/components/statistics/hr-statistics-page.tsx): dashboard HR

Hợp đồng đầy đủ: [API Statistics của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/statistics.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/statistics/statistics.controller.ts).

Đọc tiếp: [Cache và invalidation](../cache-and-invalidation.md), [Endpoint Resumes](resumes.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
