import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

export const {
  Link,
  getPathname,
  permanentRedirect,
  redirect,
  usePathname,
  useRouter,
} = createNavigation(routing);

export type AppHref = Parameters<typeof getPathname>[0]["href"];
