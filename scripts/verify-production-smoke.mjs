#!/usr/bin/env node

import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));
const site = readJson(new URL("../src/content/site.json", import.meta.url));
const pages = readJson(new URL("../src/content/pages.json", import.meta.url));
const formConfig = readJson(new URL("../src/content/form-config.json", import.meta.url));

const baseUrl = String(args.values.url ?? site.seo?.siteUrl ?? "https://stellar-images-site.vercel.app").replace(
  /\/+$/,
  "",
);
const expectedCalendlyUrl = String(args.values["calendly-url"] ?? site.booking?.calendlyUrl ?? "");
const sendIntake = args.flags.has("send-intake");
const failures = [];

console.log(`Production smoke target: ${baseUrl}`);
if (expectedCalendlyUrl) {
  console.log(`Expected Calendly URL: ${expectedCalendlyUrl}`);
}
if (sendIntake) {
  console.log("Intake POST enabled: this will send a real production test email.");
}

await checkHtml("/", [site.businessName, site.hero.heading, pages.home.cta.primaryLabel]);
await checkHtml("/portfolio", [pages.portfolio.hero.heading, pages.portfolio.hero.description]);
await checkHtml("/services", [pages.services.hero.heading, pages.services.overview.title]);
await checkHtml("/about", [pages.about.hero.heading, site.aboutImage.captionTitle]);
const contactHtml = await checkHtml("/contact", [
  pages.contact.hero.heading,
  formConfig.submitLabel,
  formConfig.fields.find((field) => field.name === "propertyAddress")?.label,
]);

if (contactHtml) {
  expect(contactHtml.includes("Calendly URL placeholder"), false, "/contact should not show the Calendly placeholder");
  if (expectedCalendlyUrl) {
    expect(contactHtml.includes(expectedCalendlyUrl), true, `/contact should include ${expectedCalendlyUrl}`);
  }
  expect(contactHtml.includes('title="Schedule your shoot"'), true, "/contact should render the scheduling iframe");
}

const adminHtml = await checkHtml("/admin/", []);
if (adminHtml) {
  expect(adminHtml.includes("Reset CMS Login"), true, "/admin/ should include the CMS login reset control");
  expect(adminHtml.includes("decap-cms@3.12.2"), true, "/admin/ should pin the Decap CMS script version");
}
await checkText("/robots.txt", ["User-agent"]);
await checkText("/sitemap.xml", ["<urlset"]);
await checkAuthStart();
await checkApiGet();

if (sendIntake) {
  await checkIntakePost();
}

if (failures.length > 0) {
  console.error("\nProduction smoke failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nProduction smoke passed.");

async function checkHtml(pathname, expectedText) {
  const response = await request(pathname, { headers: { Accept: "text/html" } });
  if (!expect(response.status, 200, `${pathname} should return 200`)) return "";

  const body = await response.text();
  for (const text of expectedText.filter(Boolean)) {
    expect(includesHtmlText(body, text), true, `${pathname} should include ${JSON.stringify(text)}`);
  }
  return body;
}

async function checkText(pathname, expectedText) {
  const response = await request(pathname);
  if (!expect(response.status, 200, `${pathname} should return 200`)) return "";

  const body = await response.text();
  for (const text of expectedText.filter(Boolean)) {
    expect(body.includes(text), true, `${pathname} should include ${JSON.stringify(text)}`);
  }
  return body;
}

async function checkApiGet() {
  const response = await request("/api/intake", { headers: { Accept: "application/json" } });
  expect(response.status, 405, "/api/intake GET should return 405");
  expect(response.headers.get("allow")?.includes("POST"), true, "/api/intake GET should advertise Allow: POST");
}

async function checkAuthStart() {
  const response = await request("/api/auth", {
    headers: { Accept: "text/html" },
    redirect: "manual",
  });
  const location = response.headers.get("location") ?? "";

  expect([302, 307, 308].includes(response.status), true, "/api/auth should redirect to GitHub");
  expect(location.startsWith("https://github.com/login/oauth/authorize"), true, "/api/auth should use GitHub OAuth");
  expect(location.includes("redirect_uri="), true, "/api/auth should include a redirect URI");
}

async function checkIntakePost() {
  const timestamp = new Date().toISOString();
  const payload = {
    fullName: String(args.values.name ?? `Production Smoke ${timestamp}`),
    email: String(args.values.email ?? "lyle.jensen95+stellar-smoke@gmail.com"),
    phone: "(925) 555-0100",
    propertyAddress: "123 Verification Way",
    unit: "Smoke Test",
    city: "Beaufort",
    state: "SC",
    zipCode: "29902",
    mlsNumber: `SMOKE-${Date.now()}`,
    bedrooms: "3",
    bathrooms: "2",
    lotSize: "0.25 acres",
    squareFootageRange: "Under 2,000 sq ft",
    servicesNeeded: ["Professional Listing Photos"],
    additionalDetails: `Automated production smoke test created at ${timestamp}.`,
    website: "",
  };

  const response = await request("/api/intake", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();

  expect(response.status, 200, `/api/intake POST should return 200. Body: ${body}`);
  expect(body.includes('"ok":true') || body.includes('"ok": true'), true, "/api/intake POST should return ok: true");
}

async function request(pathname, init = {}) {
  const url = new URL(pathname, baseUrl);
  try {
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    failures.push(`${pathname} request failed: ${error instanceof Error ? error.message : String(error)}`);
    return new Response("", { status: 599 });
  }
}

function expect(actual, expected, message) {
  const passed = actual === expected;
  if (passed) {
    console.log(`PASS ${message}`);
    return true;
  }

  failures.push(`${message}; expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  console.error(`FAIL ${message}`);
  return false;
}

function readJson(fileUrl) {
  return JSON.parse(fs.readFileSync(fileUrl, "utf8"));
}

function includesHtmlText(body, text) {
  return body.includes(text) || decodeHtmlEntities(body).includes(text);
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseArgs(argv) {
  const values = {};
  const flags = new Set();

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;

    const withoutPrefix = arg.slice(2);
    const equalsIndex = withoutPrefix.indexOf("=");
    if (equalsIndex >= 0) {
      const key = withoutPrefix.slice(0, equalsIndex);
      const value = withoutPrefix.slice(equalsIndex + 1);
      values[key] = value;
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      values[withoutPrefix] = next;
      index += 1;
      continue;
    }

    flags.add(withoutPrefix);
  }

  return { values, flags };
}
