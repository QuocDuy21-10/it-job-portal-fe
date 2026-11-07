# Endpoint Skills

Trang này liệt kê 2 endpoint kỹ năng trong `skill.api.ts`: danh mục kỹ năng để gợi ý khi gõ và danh sách kỹ năng phổ biến. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao có thời gian cache riêng

Danh mục kỹ năng ít thay đổi nhưng được dùng ở nhiều ô nhập. Vì vậy hai endpoint này không dùng cache tag mà đặt `keepUnusedDataFor`: danh mục giữ 1 ngày, kỹ năng phổ biến giữ 1 giờ.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetSkillCatalogQuery` | `GET /skills/catalog` | `search?`, `limit?` (chỉ thêm vào query khi có) | `keepUnusedDataFor` 86400 giây (1 ngày), không có tag | `hooks/use-skill-catalog.ts`, gọi với `limit: 200` |
| `useGetPopularSkillsQuery` | `GET /skills/popular` | `limit?` | `keepUnusedDataFor` 3600 giây (1 giờ), không có tag | `hooks/use-popular-skills.ts`, gọi với `limit` 10 |

`useSkillCatalog` đổi mỗi mục thành `{ label, value }` để dùng cho ô chọn nhiều và ô gợi ý tìm kiếm.

## Đối chiếu với backend

Cả hai route có trong `skills.controller.ts` và được gắn `@Public()`, nên khách cũng gọi được. Các route còn lại của controller (`POST`, `GET`, `GET :id`, `PATCH`, `DELETE`, `DELETE bulk`) chỉ cho `SUPER ADMIN` và frontend không gọi.

## Dữ liệu

| Dạng | Field |
| --- | --- |
| `SkillCatalogItem` | `label`, `slug`, `aliases?`, `category?`, `description?` |
| `PopularSkill` | `skill`, `count` |

## Source code liên quan

- [`src/features/skill/redux/skill.api.ts`](../../../src/features/skill/redux/skill.api.ts): khai báo endpoint và thời gian cache
- [`src/features/skill/schemas/skill.schema.ts`](../../../src/features/skill/schemas/skill.schema.ts): kiểu dữ liệu
- [`src/hooks/use-skill-catalog.ts`](../../../src/hooks/use-skill-catalog.ts): `useSkillCatalog`
- [`src/hooks/use-popular-skills.ts`](../../../src/hooks/use-popular-skills.ts): `usePopularSkills`
- [`src/components/ui/search-suggest-input.tsx`](../../../src/components/ui/search-suggest-input.tsx): ô gợi ý dùng cả hai

Hợp đồng đầy đủ: [API Skills của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/skills.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/skills/skills.controller.ts).

Đọc tiếp: [Cache và invalidation](../cache-and-invalidation.md), [Chiến lược cache](../../02-architecture/caching-strategy.md), [Tìm kiếm việc làm](../../04-features/job-search.md).
