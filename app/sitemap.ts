import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://keystone-fx.com";
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/en`,
      lastModified,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en/platforms`,
      lastModified,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/accounts`,
      lastModified,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/execution`,
      lastModified,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/execution/fix-api`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/execution/latency`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/execution/slippage`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/liquidity`,
      lastModified,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/explained/is-keystone-fx-a-broker`,
      lastModified,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/products`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified,
      priority: 0.6,
    },
  ];
}
