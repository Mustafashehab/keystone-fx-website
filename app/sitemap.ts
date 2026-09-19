import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://keystone-fx.com/en", lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
