import type { AppHref } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { JobSearchParams } from "@/features/job/schemas/job-search.schema";

export type LandingType = "skill" | "city" | "level";

export type LandingPage = {
  type: LandingType;
  slug: string;
  // Skill tag, location code or level enum value, as the backend filters.
  filter: string;
  name: Record<AppLocale, string>;
  intro: Record<AppLocale, string>;
};

export const LANDING_MIN_JOBS = 5;
export const LANDING_PAGE_SIZE = 20;

// Keys in the `landingPage` message namespace.
export const LANDING_TEXT_KEYS: Record<
  LandingType,
  { h1: string; link: string }
> = {
  skill: { h1: "h1Skill", link: "linkSkill" },
  city: { h1: "h1City", link: "linkCity" },
  level: { h1: "h1Level", link: "linkLevel" },
};

const skill = (
  slug: string,
  filter: string,
  name: string,
  vi: string,
  en: string
): LandingPage => ({
  type: "skill",
  slug,
  filter,
  name: { vi: name, en: name },
  intro: { vi, en },
});

export const LANDING_PAGES: readonly LandingPage[] = [
  skill(
    "react",
    "React",
    "React",
    "Tổng hợp việc làm yêu cầu React, thư viện JavaScript để xây dựng giao diện web. Các vị trí phổ biến là lập trình viên frontend và fullstack.",
    "Jobs that require React, the JavaScript library for building web interfaces. Common roles are frontend and full-stack developer."
  ),
  skill(
    "nodejs",
    "Node.js",
    "Node.js",
    "Việc làm yêu cầu Node.js, môi trường chạy JavaScript phía máy chủ dùng cho API và dịch vụ backend.",
    "Jobs that require Node.js, the server-side JavaScript runtime used for APIs and backend services."
  ),
  skill(
    "python",
    "Python",
    "Python",
    "Việc làm yêu cầu Python, ngôn ngữ dùng nhiều cho backend, xử lý dữ liệu và trí tuệ nhân tạo.",
    "Jobs that require Python, a language widely used for backend, data processing and AI."
  ),
  skill(
    "java",
    "Java",
    "Java",
    "Việc làm yêu cầu Java, ngôn ngữ phổ biến cho hệ thống backend doanh nghiệp. Danh sách chỉ gồm tin có kỹ năng Java, không gồm JavaScript.",
    "Jobs that require Java, a common language for enterprise backend systems. The list only includes jobs tagged Java, not JavaScript."
  ),
  skill(
    "typescript",
    "TypeScript",
    "TypeScript",
    "Việc làm yêu cầu TypeScript, JavaScript có kiểu tĩnh, dùng cho cả frontend và backend.",
    "Jobs that require TypeScript, typed JavaScript used on both frontend and backend."
  ),
  skill(
    "nextjs",
    "Next.js",
    "Next.js",
    "Việc làm yêu cầu Next.js, framework React để xây dựng website render trên máy chủ.",
    "Jobs that require Next.js, the React framework for server-rendered websites."
  ),
  skill(
    "nestjs",
    "NestJS",
    "NestJS",
    "Việc làm yêu cầu NestJS, framework Node.js viết bằng TypeScript cho ứng dụng backend.",
    "Jobs that require NestJS, the TypeScript framework for Node.js backend applications."
  ),
  skill(
    "golang",
    "Go",
    "Go (Golang)",
    "Việc làm yêu cầu Go (Golang), ngôn ngữ thường dùng cho dịch vụ backend hiệu năng cao và hạ tầng.",
    "Jobs that require Go (Golang), often used for high-performance backend services and infrastructure."
  ),
  skill(
    "kotlin",
    "Kotlin",
    "Kotlin",
    "Việc làm yêu cầu Kotlin, ngôn ngữ chính để phát triển ứng dụng Android.",
    "Jobs that require Kotlin, the main language for Android app development."
  ),
  skill(
    "swift",
    "Swift",
    "Swift",
    "Việc làm yêu cầu Swift, ngôn ngữ phát triển ứng dụng iOS.",
    "Jobs that require Swift, the language for iOS app development."
  ),
  skill(
    "react-native",
    "React Native",
    "React Native",
    "Việc làm yêu cầu React Native, framework xây dựng ứng dụng di động cho cả iOS và Android bằng JavaScript.",
    "Jobs that require React Native, for building iOS and Android apps with JavaScript."
  ),
  skill(
    "docker",
    "Docker",
    "Docker",
    "Việc làm yêu cầu Docker, công cụ đóng gói và chạy ứng dụng trong container.",
    "Jobs that require Docker, the tool for packaging and running applications in containers."
  ),
  skill(
    "kubernetes",
    "Kubernetes",
    "Kubernetes",
    "Việc làm yêu cầu Kubernetes, nền tảng điều phối container, thường gặp ở vị trí DevOps và backend.",
    "Jobs that require Kubernetes, the container orchestration platform common in DevOps and backend roles."
  ),
  skill(
    "aws",
    "AWS",
    "AWS",
    "Việc làm yêu cầu AWS (Amazon Web Services), dịch vụ điện toán đám mây của Amazon.",
    "Jobs that require AWS (Amazon Web Services), Amazon's cloud platform."
  ),
  skill(
    "postgresql",
    "PostgreSQL",
    "PostgreSQL",
    "Việc làm yêu cầu PostgreSQL, hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở.",
    "Jobs that require PostgreSQL, the open-source relational database."
  ),
  skill(
    "spring-boot",
    "Spring Boot",
    "Spring Boot",
    "Việc làm yêu cầu Spring Boot, framework Java để xây dựng ứng dụng và API backend.",
    "Jobs that require Spring Boot, the Java framework for backend applications and APIs."
  ),
  {
    type: "city",
    slug: "ha-noi",
    filter: "ha-noi",
    name: { vi: "Hà Nội", en: "Hanoi" },
    intro: {
      vi: "Việc làm IT tại Hà Nội từ các công ty công nghệ đang tuyển trên DevLink.",
      en: "IT jobs in Hanoi from tech companies hiring on DevLink.",
    },
  },
  {
    type: "city",
    slug: "ho-chi-minh",
    filter: "ho-chi-minh",
    name: { vi: "TP. Hồ Chí Minh", en: "Ho Chi Minh City" },
    intro: {
      vi: "Việc làm IT tại TP. Hồ Chí Minh từ các công ty công nghệ đang tuyển trên DevLink.",
      en: "IT jobs in Ho Chi Minh City from tech companies hiring on DevLink.",
    },
  },
  {
    type: "city",
    slug: "da-nang",
    filter: "da-nang",
    name: { vi: "Đà Nẵng", en: "Da Nang" },
    intro: {
      vi: "Việc làm IT tại Đà Nẵng từ các công ty công nghệ đang tuyển trên DevLink.",
      en: "IT jobs in Da Nang from tech companies hiring on DevLink.",
    },
  },
  {
    type: "level",
    slug: "intern",
    filter: "Internship",
    name: { vi: "Intern", en: "Intern" },
    intro: {
      vi: "Vị trí thực tập IT dành cho sinh viên và người mới bắt đầu, phù hợp để tích lũy kinh nghiệm dự án thực tế.",
      en: "IT internships for students and beginners who want real project experience.",
    },
  },
  {
    type: "level",
    slug: "junior",
    filter: "Junior",
    name: { vi: "Junior", en: "Junior" },
    intro: {
      vi: "Việc làm IT cấp Junior, dành cho lập trình viên đã có kinh nghiệm làm việc ban đầu.",
      en: "Junior IT jobs for developers with some first working experience.",
    },
  },
  {
    type: "level",
    slug: "middle",
    filter: "Mid",
    name: { vi: "Middle", en: "Middle" },
    intro: {
      vi: "Việc làm IT cấp Middle, dành cho người đã làm việc độc lập trên dự án.",
      en: "Mid-level IT jobs for people who already work independently on projects.",
    },
  },
  {
    type: "level",
    slug: "senior",
    filter: "Senior",
    name: { vi: "Senior", en: "Senior" },
    intro: {
      vi: "Việc làm IT cấp Senior, dành cho người có nhiều năm kinh nghiệm và có thể dẫn dắt phần việc kỹ thuật.",
      en: "Senior IT jobs for experienced people who can lead technical work.",
    },
  },
  {
    type: "level",
    slug: "lead",
    filter: "Lead",
    name: { vi: "Lead", en: "Lead" },
    intro: {
      vi: "Vị trí Tech Lead và Team Lead IT, kết hợp chuyên môn kỹ thuật với dẫn dắt nhóm.",
      en: "Tech Lead and Team Lead IT roles that combine technical depth with leading a team.",
    },
  },
  {
    type: "level",
    slug: "manager",
    filter: "Manager",
    name: { vi: "Manager", en: "Manager" },
    intro: {
      vi: "Vị trí quản lý trong ngành IT như Engineering Manager và quản lý dự án.",
      en: "IT management roles such as Engineering Manager and project management.",
    },
  },
];

export const getLandingPagesByType = (type: LandingType) =>
  LANDING_PAGES.filter((page) => page.type === type);

export const getLandingPage = (type: LandingType, slug: string) =>
  LANDING_PAGES.find((page) => page.type === type && page.slug === slug);

export const findSkillLanding = (tag: string) =>
  LANDING_PAGES.find(
    (page) =>
      page.type === "skill" && page.filter.toLowerCase() === tag.toLowerCase()
  );

export const findCityLanding = (code?: string | null) =>
  LANDING_PAGES.find((page) => page.type === "city" && page.filter === code);

export const findLevelLanding = (level?: string | null) =>
  LANDING_PAGES.find((page) => page.type === "level" && page.filter === level);

const ROUTE_PATHNAMES = {
  skill: "/jobs/skill/[skill]",
  city: "/jobs/city/[city]",
  level: "/jobs/level/[level]",
} as const;

export const landingHref = (landing: LandingPage, page = 1): AppHref =>
  ({
    pathname: ROUTE_PATHNAMES[landing.type],
    params: { [landing.type]: landing.slug },
    ...(page > 1 ? { query: { page: String(page) } } : {}),
  }) as AppHref;

export const landingSearchFilter = (
  landing: LandingPage
): Pick<JobSearchParams, "skills" | "locationCode" | "level"> => {
  if (landing.type === "skill") return { skills: landing.filter };
  if (landing.type === "city") return { locationCode: landing.filter };
  return { level: landing.filter };
};

// /jobs has no skill filter, so skill pages refine with the keyword.
export const landingRefineHref = (landing: LandingPage): AppHref => {
  const query =
    landing.type === "skill"
      ? { q: landing.filter }
      : landing.type === "city"
        ? { locationCode: landing.filter }
        : { experience: landing.filter };

  return { pathname: "/jobs", query };
};

export const matchesLanding = (
  landing: LandingPage,
  job: { skills: string[]; locationCode?: string; level?: string }
) => {
  if (landing.type === "skill") {
    return job.skills.some(
      (tag) => tag.toLowerCase() === landing.filter.toLowerCase()
    );
  }

  return landing.type === "city"
    ? job.locationCode === landing.filter
    : job.level === landing.filter;
};
