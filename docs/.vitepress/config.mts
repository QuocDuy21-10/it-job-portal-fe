import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import path from 'node:path'

const REPO_BLOB_URL = 'https://github.com/QuocDuy21-10/it-job-portal-fe/blob/main'

export default withMermaid(
  defineConfig({
    title: 'DevLink Frontend',
    description: 'Tài liệu Kỹ thuật & Kiến trúc Hệ thống DevLink Frontend',
    lang: 'vi-VN',
    lastUpdated: true,
    cleanUrls: true,
    ignoreDeadLinks: true,
    base: '/it-job-portal-fe/',
    sitemap: { hostname: 'https://quocduy21-10.github.io/it-job-portal-fe/' },
    head: [
      ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }],
      ['link', { rel: 'icon', type: 'image/png', href: '/it-job-portal-fe/favicon.png' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'DevLink Docs' }],
      ['meta', { property: 'og:description', content: 'Tài liệu Kỹ thuật & Kiến trúc Hệ thống DevLink Frontend' }],
      ['meta', { property: 'og:image', content: 'https://quocduy21-10.github.io/it-job-portal-fe/hero.png' }],
    ],

    markdown: {
      config(md) {
        const renderLinkOpen = md.renderer.rules.link_open!
        // Link tới source chỉ chạy trên GitHub; trên site phải đổi sang URL tuyệt đối.
        md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
          const href = tokens[idx].attrGet('href')
          if (href && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(href)) {
            const target = path.posix.join('docs', path.posix.dirname(env.relativePath), decodeURI(href))
            if (!target.startsWith('docs/')) tokens[idx].attrSet('href', `${REPO_BLOB_URL}/${encodeURI(target)}`)
          }
          return renderLinkOpen(tokens, idx, options, env, self)
        }
      },
    },

    srcExclude: [
      'ui/**',
      'BE-Plan/**',
      'FE-Plan/**',
      'requirement/**',
      'superpowers/**',
      '!(index).md',
    ],

    themeConfig: {
      siteTitle: 'Docs',
      logo: '/logo.png',

      nav: [
        { text: 'Trang chủ', link: '/' },
        { text: 'Bắt đầu', link: '/00-start-here/introduction' },
        { text: 'Cài đặt', link: '/01-getting-started/prerequisites' },
        { text: 'Kiến trúc', link: '/02-architecture/overview' },
        { text: 'Tech Stack', link: '/03-tech-stack/overview' },
        { text: 'Tính năng', link: '/04-features/README' },
        { text: 'Luồng nghiệp vụ', link: '/05-business-flows/README' },
        { text: 'API & Dữ liệu', link: '/06-api-and-data/overview' },
        { text: 'Quy tắc viết', link: '/00-start-here/writing-guide' },
      ],

      sidebar: {
        '/00-start-here/': [
          {
            text: '00. Bắt đầu',
            items: [
              { text: 'Giới thiệu', link: '/00-start-here/introduction' },
              { text: 'Tổng quan dự án', link: '/00-start-here/project-overview' },
              { text: 'Tổng quan tính năng', link: '/00-start-here/features-overview' },
              { text: 'Vai trò người dùng', link: '/00-start-here/user-roles' },
              { text: 'Bảng thuật ngữ', link: '/00-start-here/glossary' },
              { text: 'Ảnh giao diện', link: '/00-start-here/screenshots' },
              { text: 'Quy tắc viết tài liệu', link: '/00-start-here/writing-guide' },
            ],
          },
        ],
        '/01-getting-started/': [
          {
            text: '01. Cài đặt và Chạy',
            items: [
              { text: 'Yêu cầu tiên quyết', link: '/01-getting-started/prerequisites' },
              { text: 'Cài đặt dependencies', link: '/01-getting-started/installation' },
              { text: 'Biến môi trường', link: '/01-getting-started/environment-variables' },
              { text: 'Chạy cục bộ', link: '/01-getting-started/run-locally' },
              { text: 'Các lệnh có sẵn', link: '/01-getting-started/available-commands' },
              { text: 'Khắc phục sự cố', link: '/01-getting-started/troubleshooting' },
            ],
          },
        ],
        '/02-architecture/': [
          {
            text: '02. Kiến trúc Hệ thống',
            items: [
              { text: 'Tổng quan kiến trúc', link: '/02-architecture/overview' },
              { text: 'Bối cảnh hệ thống', link: '/02-architecture/system-context' },
              { text: 'Các lớp của frontend', link: '/02-architecture/frontend-layers' },
              { text: 'Cấu trúc thư mục', link: '/02-architecture/folder-structure' },
              { text: 'Routing và layout', link: '/02-architecture/routing-and-layouts' },
              { text: 'Server & Client Components', link: '/02-architecture/server-client-components' },
              { text: 'Rendering và SEO', link: '/02-architecture/rendering-and-seo' },
              { text: 'Quản lý state', link: '/02-architecture/state-management' },
              { text: 'Giao tiếp API', link: '/02-architecture/api-communication' },
              { text: 'Xác thực (Authentication)', link: '/02-architecture/authentication' },
              { text: 'Phân quyền (Authorization)', link: '/02-architecture/authorization' },
              { text: 'Thời gian thực (Realtime)', link: '/02-architecture/realtime-communication' },
              { text: 'Đa ngôn ngữ (i18n)', link: '/02-architecture/internationalization' },
              { text: 'Chiến lược cache', link: '/02-architecture/caching-strategy' },
            ],
          },
          {
            text: 'Sơ đồ Kiến trúc',
            items: [
              { text: 'Bối cảnh hệ thống (C4)', link: '/02-architecture/diagrams/system-context' },
              { text: 'Container Diagram', link: '/02-architecture/diagrams/container-diagram' },
              { text: 'Component Diagram', link: '/02-architecture/diagrams/component-diagram' },
              { text: 'Luồng dữ liệu (Data Flow)', link: '/02-architecture/diagrams/data-flow' },
            ],
          },
        ],
        '/03-tech-stack/': [
          {
            text: '03. Tech Stack',
            items: [
              { text: 'Tổng quan công nghệ', link: '/03-tech-stack/overview' },
              { text: 'Framework (Next.js/React)', link: '/03-tech-stack/framework' },
              { text: 'UI & Styling (Tailwind/Radix)', link: '/03-tech-stack/ui-and-styling' },
              { text: 'Quản lý State (Redux Toolkit)', link: '/03-tech-stack/state-management' },
              { text: 'Lấy dữ liệu (RTK Query & Axios)', link: '/03-tech-stack/data-fetching' },
              { text: 'Form & Validation (RHF & Zod)', link: '/03-tech-stack/forms-and-validation' },
              { text: 'Thời gian thực & AI', link: '/03-tech-stack/realtime-and-ai' },
              { text: 'Kiểm thử (Testing)', link: '/03-tech-stack/testing' },
              { text: 'Các quyết định công nghệ', link: '/03-tech-stack/technology-decisions' },
            ],
          },
        ],
        '/04-features/': [
          {
            text: '04. Tính năng',
            items: [
              { text: 'Tổng quan tính năng', link: '/04-features/README' },
              { text: 'Xác thực', link: '/04-features/authentication' },
              { text: 'Tìm kiếm việc làm', link: '/04-features/job-search' },
              { text: 'Việc làm từ nguồn ngoài', link: '/04-features/external-job-aggregation' },
              { text: 'Ứng tuyển', link: '/04-features/job-application' },
              { text: 'Tạo CV', link: '/04-features/cv-builder' },
              { text: 'Xuất CV ra PDF', link: '/04-features/cv-pdf-export' },
              { text: 'Trợ lý AI', link: '/04-features/ai-career-assistant' },
              { text: 'Việc làm đã lưu', link: '/04-features/saved-jobs' },
              { text: 'Danh bạ công ty', link: '/04-features/company-directory' },
              { text: 'Theo dõi công ty', link: '/04-features/company-following' },
              { text: 'Theo dõi hồ sơ', link: '/04-features/application-tracking' },
              { text: 'Đăng ký nhận việc', link: '/04-features/job-subscriptions' },
              { text: 'Thông báo', link: '/04-features/notifications' },
              { text: 'Hồ sơ người dùng', link: '/04-features/user-profile' },
              { text: 'Xóa tài khoản', link: '/04-features/account-deletion' },
              { text: 'Dashboard HR', link: '/04-features/hr-dashboard' },
              { text: 'Trang quản trị', link: '/04-features/admin-dashboard' },
              { text: 'Duyệt tin tuyển dụng', link: '/04-features/job-approval' },
            ],
          },
        ],
        '/05-business-flows/': [
          {
            text: '05. Luồng nghiệp vụ',
            items: [{ text: 'Tổng quan', link: '/05-business-flows/README' }],
          },
          {
            text: 'Use case',
            items: [
              { text: 'Khách', link: '/05-business-flows/use-cases/guest' },
              { text: 'Ứng viên', link: '/05-business-flows/use-cases/candidate' },
              { text: 'Nhà tuyển dụng', link: '/05-business-flows/use-cases/hr' },
              { text: 'Quản trị viên', link: '/05-business-flows/use-cases/administrator' },
            ],
          },
          {
            text: 'Sequence',
            items: [
              { text: 'Đăng nhập và làm mới token', link: '/05-business-flows/sequences/login-and-refresh-token' },
              { text: 'Tìm kiếm và lọc việc làm', link: '/05-business-flows/sequences/search-and-filter-jobs' },
              { text: 'Chuyển tới tin bên ngoài', link: '/05-business-flows/sequences/external-job-redirect' },
              { text: 'Ứng tuyển', link: '/05-business-flows/sequences/apply-for-job' },
              { text: 'Tạo và xuất CV', link: '/05-business-flows/sequences/create-and-export-cv' },
              { text: 'Stream chat AI', link: '/05-business-flows/sequences/ai-chat-streaming' },
              { text: 'Thông báo thời gian thực', link: '/05-business-flows/sequences/realtime-notifications' },
            ],
          },
          {
            text: 'State machine',
            items: [
              { text: 'Trạng thái hồ sơ', link: '/05-business-flows/state-machines/application-status' },
              { text: 'Trạng thái stream chat', link: '/05-business-flows/state-machines/chat-streaming-status' },
              { text: 'Trạng thái duyệt tin', link: '/05-business-flows/state-machines/job-approval-status' },
            ],
          },
        ],
        '/06-api-and-data/': [
          {
            text: '06. API & Dữ liệu',
            items: [
              { text: 'Tổng quan', link: '/06-api-and-data/overview' },
              { text: 'Quy ước API', link: '/06-api-and-data/api-conventions' },
              { text: 'Xử lý lỗi', link: '/06-api-and-data/error-handling' },
              { text: 'Phân trang và lọc', link: '/06-api-and-data/pagination-filtering' },
              { text: 'Cache và invalidation', link: '/06-api-and-data/cache-and-invalidation' },
              { text: 'Tham chiếu dữ liệu backend', link: '/06-api-and-data/backend-data-reference' },
            ],
          },
          {
            text: 'Endpoints',
            items: [
              { text: 'Auth', link: '/06-api-and-data/endpoints/auth' },
              { text: 'Jobs', link: '/06-api-and-data/endpoints/jobs' },
              { text: 'Job Search', link: '/06-api-and-data/endpoints/job-search' },
              { text: 'Resumes', link: '/06-api-and-data/endpoints/resumes' },
              { text: 'CV Profiles', link: '/06-api-and-data/endpoints/cv-profiles' },
              { text: 'Chat', link: '/06-api-and-data/endpoints/chat' },
              { text: 'Companies', link: '/06-api-and-data/endpoints/companies' },
              { text: 'Users', link: '/06-api-and-data/endpoints/users' },
              { text: 'Notifications', link: '/06-api-and-data/endpoints/notifications' },
              { text: 'Subscribers', link: '/06-api-and-data/endpoints/subscribers' },
              { text: 'Skills', link: '/06-api-and-data/endpoints/skills' },
              { text: 'Statistics', link: '/06-api-and-data/endpoints/statistics' },
              { text: 'Files', link: '/06-api-and-data/endpoints/files' },
            ],
          },
          {
            text: 'Models',
            items: [
              { text: 'User', link: '/06-api-and-data/models/user' },
              { text: 'Job', link: '/06-api-and-data/models/job' },
              { text: 'JobSearchItem', link: '/06-api-and-data/models/job-search-item' },
              { text: 'Resume', link: '/06-api-and-data/models/resume' },
              { text: 'CV Profile', link: '/06-api-and-data/models/cv-profile' },
              { text: 'Chat Message', link: '/06-api-and-data/models/chat-message' },
              { text: 'Company', link: '/06-api-and-data/models/company' },
            ],
          },
        ],
      },

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: 'Tìm kiếm',
              buttonAriaLabel: 'Tìm kiếm tài liệu',
            },
            modal: {
              noResultsText: 'Không tìm thấy kết quả cho',
              resetButtonTitle: 'Xóa tìm kiếm',
              footer: {
                selectText: 'để chọn',
                navigateText: 'để chuyển',
                closeText: 'để đóng',
              },
            },
          },
        },
      },

      editLink: {
        pattern: 'https://github.com/QuocDuy21-10/it-job-portal-fe/edit/main/docs/:path',
        text: 'Sửa trang này trên GitHub',
      },
      lastUpdated: { text: 'Cập nhật lần cuối' },

      outline: {
        level: [2, 3],
        label: 'Mục lục trang',
      },

      docFooter: {
        prev: 'Trang trước',
        next: 'Trang tiếp theo',
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/QuocDuy21-10/it-job-portal-fe' },
      ],

      footer: {
        message: 'Tài liệu kỹ thuật xây dựng theo chuẩn Documentation as Code',
        copyright: 'Bản quyền © 2026 DevLink Team',
      },
    },

    mermaid: {
      // Cấu hình theme cho Mermaid phù hợp cả Dark & Light
    },
  })
)
