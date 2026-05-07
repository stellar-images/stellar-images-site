import site from "../content/site.json";

const routes = ["/", "/portfolio", "/services", "/about", "/contact"];

export function GET() {
  const urls = routes
    .map((route) => {
      const loc = new URL(route, site.seo.siteUrl).toString();

      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        "    <changefreq>monthly</changefreq>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
