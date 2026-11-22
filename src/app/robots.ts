import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/shared/constants/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private pages are not listed: the middleware sends them an X-Robots-Tag noindex header,
      // and Google never reads the noindex of a page that robots.txt blocks.
      disallow: "/api/",
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
