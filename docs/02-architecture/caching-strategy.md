# Chiến lược cache trong DevLink

Tài liệu này giải thích toàn diện chiến lược lưu trữ tạm thời (caching) của DevLink Frontend. Hệ thống kết hợp 3 lớp cache độc lập nhằm mang lại trải nghiệm tải trang tức thì cho ứng viên, đồng thời giảm thiểu áp lực truy vấn lên máy chủ backend.

---

## 1. Tại sao DevLink cần cache? (Giải thích trước)

### Bài toán thực tế
Trên nền tảng tuyển dụng IT như DevLink, hành vi phổ biến nhất của ứng viên là:
- Tìm kiếm từ khóa, đổi qua lại giữa các trang danh sách việc làm.
- Xem chi tiết một công việc, sau đó bấm nút **Back** để quay lại danh sách kết quả trước đó.
- Chuyển tab giữa "Việc làm đề xuất", "Việc làm đã lưu" và "Công ty nổi bật".

Nếu mọi thao tác lướt việc làm đều gửi HTTP request trực tiếp về backend MongoDB:
1. **Trải nghiệm ứng viên bị đứt quãng**: Mỗi lần chuyển trang phải đợi 200–500ms (hoặc lâu hơn nếu mạng yếu), kèm theo hiện tượng nhấp nháy màn hình (layout shift / skeleton flicker).
2. **Backend quá tải không cần thiết**: Hàng ngàn ứng viên cùng xem một số lượng tin tuyển dụng giống nhau, khiến cơ sở dữ liệu phải thực hiện lại cùng một truy vấn `db.jobs.find(...)` hàng triệu lần mỗi ngày.

### Lợi ích mang lại cho người dùng
- **Tốc độ phản hồi tức thì (< 50ms)**: Khi quay lại trang danh sách hoặc chuyển đổi bộ lọc đã xem, giao diện render ngay lập tức từ bộ nhớ RAM trình duyệt.
- **Tối ưu SEO Core Web Vitals**: Lớp cache server giúp chỉ số TTFB (Time to First Byte) và LCP (Largest Contentful Paint) của các trang tin việc làm công khai luôn đạt điểm xanh Google Lighthouse.
- **Tiết kiệm dữ liệu di động**: Tránh tải lại dữ liệu trùng lặp khi ứng viên dùng mạng 4G/5G.

### Rủi ro và đánh đổi (Trade-offs & Stale Data)
> [!WARNING]
> Đánh đổi lớn nhất của việc sử dụng cache là **nguy cơ hiển thị dữ liệu cũ (Stale Data)**:
> - **Kịch bản**: Một nhà tuyển dụng vừa bấm "Đóng tin tuyển dụng" trên dashboard admin.
> - **Hệ quả**: Một ứng viên đang duyệt trang danh sách việc làm bên ngoài có thể vẫn thấy tin tuyển dụng này hiển thị thêm tối đa **5 phút** (do thời gian `revalidate: 300` của Server Cache) trước khi hệ thống cập nhật bản mới.
> - **Giải pháp xử lý**: Khi ứng viên bấm "Nộp đơn" vào một việc làm đã đóng, API backend sẽ từ chối nộp đơn với mã lỗi 400 rõ ràng và frontend lập tức làm mới dữ liệu tại chỗ.

---

## 2. Sơ đồ luồng 3 lớp Cache (Trực quan hóa)

Dữ liệu di chuyển qua 3 lớp phòng thủ trước khi một request thực sự chạm tới backend server:

```mermaid
flowchart TD
    User([Ứng viên tương tác giao diện]) --> CheckBrowserMemory{Lớp 2: RTK Query Cache\n(Bộ nhớ RAM trình duyệt)}

    CheckBrowserMemory -- "Còn trong cache (< 60s)" --> RenderInstant[Hiển thị kết quả ngay lập tức < 10ms]
    
    CheckBrowserMemory -- "Hết hạn hoặc chưa có" --> CheckServerCache{Lớp 1: Next.js Cache\n(Server CDN / Edge)}
    
    CheckServerCache -- "Hit revalidate (còn hạn 300s)" --> ReturnCachedServer[Server trả về HTML/Data có sẵn < 80ms]
    CheckServerCache -- "Miss / Quá 300s" --> CallBE[Gửi request tới Backend API / MongoDB]
    
    CallBE --> UpdateServerCache[Cập nhật lại Server Cache]
    UpdateServerCache --> ReturnFresh[Trả về trình duyệt & nạp vào RTK Query RAM]
    ReturnFresh --> RenderFinal[Hiển thị trên màn hình]

    subgraph Browser_Storage["Lớp 3: Lưu trữ bền vững (LocalStorage)"]
        ReduxPersist["Redux Persist\n(Lưu phiên đăng nhập & hạn mức Chatbot)"]
    end
    User -. Đóng trình duyệt & mở lại .-> ReduxPersist
    ReduxPersist -. Khôi phục phiên .-> CheckBrowserMemory
```

---

## 3. Chi tiết kỹ thuật 3 tầng Cache

| Tầng cache | Vị trí lưu trữ | Công nghệ triển khai | Dữ liệu quản lý | Thời gian sống (TTL) | Cơ chế làm mới (Invalidation) |
| --- | --- | --- | --- | --- | --- |
| **Lớp 1** | Server Next.js | `fetch` + `cache()` React | Dữ liệu việc làm, công ty công khai (`fetchPublic*`) | 300 giây (5 phút) | Tự động revalidate sau 300s hoặc on-demand |
| **Lớp 2** | Bộ nhớ RAM trình duyệt | RTK Query (`baseApi`) | API responses danh sách việc làm, hồ sơ cá nhân, danh mục | 60 giây mặc định (1h - 1d cho danh mục) | Tự làm mới khi có action tạo/sửa/xóa qua `invalidatesTags` |
| **Lớp 3** | LocalStorage trình duyệt | Redux Persist | Thông tin user, trạng thái auth, quota AI chatbot | Lưu vĩnh viễn đến khi logout / hết hạn | Xóa khi người dùng đăng xuất hoặc token hết hạn |

### 3.1. Lớp 1 — Cache phía Server (Next.js Data Cache & React `cache()`)
Triển khai tại `src/lib/utils/public-content.ts`:
- Sử dụng tùy chọn `next: { revalidate: 300 }` để lưu phản hồi của các trang public.
- Kết hợp với hàm `cache()` của React: Khi trang vừa gọi `generateMetadata()` vừa render `Page()` cho cùng một Job ID, chỉ phát sinh đúng **1 lời gọi mạng duy nhất** trong chu kỳ render.

```typescript
// src/lib/utils/public-content.ts
export const fetchPublicJobById = cache(async (id: string) => {
  return fetchPublicEntity<Job>(`/api/v1/jobs/${id}`, {
    next: { revalidate: 300, tags: [`job-${id}`] }
  });
});
```

### 3.2. Lớp 2 — Cache bộ nhớ trình duyệt (RTK Query In-Memory)
Triển khai tại `src/lib/redux/api.ts`:
- Định nghĩa các cache tags: `Auth`, `User`, `Company`, `Job`, `Resume`, `CVProfile`, `Subscriber`, `Statistics`, `Notification`, `Skill`.
- **Tự động đồng bộ (Auto Invalidation)**: Khi người dùng thực hiện một hành động sửa đổi (Mutation), RTK Query tự động xóa cache liên quan và fetch lại dữ liệu mới nhất trong nền mà không làm giật màn hình:

| Thao tác ghi (Mutation) | Thẻ bị mất hiệu lực (Invalidated Tags) | Ảnh hưởng hiển thị |
| --- | --- | --- |
| `createJob` / `updateJob` | `['Job']` | Danh sách tin tuyển dụng tự động nạp lại |
| `applyJob` (nộp CV) | `['Resume']` | Danh sách lịch sử nộp hồ sơ cập nhật ngay |
| `updateProfile` | `['User', 'CVProfile']` | Avatar, thông tin cá nhân trên header tự đổi |

### 3.3. Lớp 3 — Cache bền vững (Redux Persist)
Triển khai tại `src/lib/redux/store.ts`:
- Chỉ cho phép lưu giữ những trạng thái tối thiểu để tránh phình dung lượng bộ nhớ:
  - `auth`: Giữ `user` và cờ `isAuthenticated` để tránh nhấp nháy trạng thái khi người dùng F5 tải lại trang.
  - `chatBot`: Giữ `quota` (hạn mức câu hỏi còn lại), đã đi qua bộ biến đổi lọc hạn mức hết hạn.
- Cache dữ liệu API của RTK Query **không lưu vào LocalStorage** để đảm bảo sau khi mở tab mới, người dùng luôn nhận dữ liệu đồng bộ nhất.

---

## 4. Cache tài nguyên tĩnh (Proxy Ảnh)

Tại route `src/app/api/proxy-image/route.ts`:
Ảnh avatar công ty và logo tuyển dụng được phục vụ qua proxy với header:
```http
Cache-Control: public, max-age=31536000, immutable
```
> [!NOTE]
> Header `immutable` báo hiệu cho trình duyệt biết file ảnh này sẽ không bao giờ thay đổi nội dung trong suốt 1 năm, giúp loại bỏ hoàn toàn các request xác thực `304 Not Modified`.

---

## 5. Source code và Tài liệu liên quan

### Mã nguồn triển khai
- [`src/lib/utils/public-content.ts`](../../src/lib/utils/public-content.ts): Cấu hình `revalidate: 300` và React `cache()`
- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): Khai báo danh sách thẻ cache RTK Query
- [`src/features/job/redux/job.api.ts`](../../src/features/job/redux/job.api.ts): Ví dụ sử dụng `providesTags` và `invalidatesTags`
- [`src/lib/redux/store.ts`](../../src/lib/redux/store.ts): Cấu hình Redux Persist whitelist
- [`src/app/api/proxy-image/route.ts`](../../src/app/api/proxy-image/route.ts): Thiết lập HTTP cache headers cho proxy ảnh

### Chủ đề kế tiếp
- [Quản lý State trong DevLink](state-management.md)
- [Giao tiếp API & Xử lý Token](api-communication.md)
- [Chiến lược Rendering và SEO](rendering-and-seo.md)
