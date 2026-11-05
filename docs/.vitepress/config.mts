import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'DevLink Frontend',
    description: 'Tài liệu Kỹ thuật & Kiến trúc Hệ thống DevLink Frontend',
    lang: 'vi-VN',
    lastUpdated: true,
    cleanUrls: true,
    ignoreDeadLinks: true,

    srcExclude: [
      'ui/**',
      'BE-Plan/**',
      'FE-Plan/**',
      'requirement/**',
      'superpowers/**',
      '*.md',
      '!index.md',
    ],

    themeConfig: {
      siteTitle: 'DevLink Docs',
      logo: undefined,

      nav: [
        { text: 'Trang chủ', link: '/' },
        { text: 'Bắt đầu', link: '/00-start-here/introduction' },
        { text: 'Cài đặt', link: '/01-getting-started/prerequisites' },
        { text: 'Kiến trúc', link: '/02-architecture/overview' },
        { text: 'Tech Stack', link: '/03-tech-stack/overview' },
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
