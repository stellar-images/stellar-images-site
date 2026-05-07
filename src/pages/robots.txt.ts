import site from "../content/site.json";

const sitemapUrl = new URL("/sitemap.xml", site.seo.siteUrl).toString();

export function GET() {
  const body = site.seo.noIndex
    ? ["User-agent: *", "Disallow: /", "", `Sitemap: ${sitemapUrl}`, ""].join("\n")
    : ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl}`, ""].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
