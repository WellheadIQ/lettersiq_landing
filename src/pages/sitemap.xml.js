import { site } from "../data/site.js";

// Hand-rolled rather than via @astrojs/sitemap: the Astro 2-compatible release of
// that integration passes an absolute destination dir, which sitemap >=7.1.3 rejects.
const PRIORITY = { "/": "1.0" };

const routes = Object.keys(import.meta.glob("./**/*.astro"))
  .filter((file) => !file.includes("[") && !file.endsWith("/404.astro"))
  .map((file) =>
    file
      .replace(/^\./, "")
      .replace(/\/index\.astro$/, "/")
      .replace(/\.astro$/, "")
  )
  .map((path) => (path === "" ? "/" : path))
  .sort((a, b) => a.length - b.length);

export async function get() {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = routes
    .map(
      (path) => `  <url>
    <loc>${new URL(path, site.url).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${path === "/" ? "weekly" : "yearly"}</changefreq>
    <priority>${PRIORITY[path] ?? "0.4"}</priority>
  </url>`
    )
    .join("\n");

  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
  };
}
