import { toSlugId } from "@/lib/seo/slug";
import type { AppHref } from "@/i18n/navigation";
import type { routing } from "@/i18n/routing";

type AppPathname = keyof typeof routing.pathnames;
type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

// A known static route, optionally with a query string: "/profile?tab=my-cv".
export type StaticHref = StaticPathname | `${StaticPathname}?${string}`;

export const toAppHref = (href: StaticHref): AppHref => {
  const [pathname, search] = href.split("?") as [StaticPathname, string?];

  return search
    ? { pathname, query: Object.fromEntries(new URLSearchParams(search)) }
    : pathname;
};

// Without a name the URL holds the bare id; the detail page redirects it to the slug form.
export const jobHref = (id: string, name?: string): AppHref => ({
  pathname: "/jobs/[id]",
  params: { id: name ? toSlugId(name, id) : id },
});

export const companyHref = (id: string, name?: string): AppHref => ({
  pathname: "/companies/[id]",
  params: { id: name ? toSlugId(name, id) : id },
});

export const externalJobHref = (id: string): AppHref => ({
  pathname: "/jobs/external/[id]",
  params: { id },
});
