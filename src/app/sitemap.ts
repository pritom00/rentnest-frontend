import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rentnest.example.com";
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1 },
    { url: `${base}/properties`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/auth/login`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/auth/register`, lastModified: new Date(), priority: 0.3 },
  ];
}
