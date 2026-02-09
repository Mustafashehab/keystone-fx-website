import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://keystone-fx.com";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/execution`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/execution/fix-api`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/execution/latency`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/execution/slippage`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/liquidity`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explained/is-keystone-fx-a-broker`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}
