import type { VercelRequest, VercelResponse } from "./vercel-types.js";

type IntakePayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  squareFootageRange?: string;
  propertyAddress?: string;
  unit?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  mlsNumber?: string;
  bedrooms?: string;
  bathrooms?: string;
  lotSize?: string;
  servicesNeeded?: string[];
  additionalDetails?: string;
  website?: string;
};

const requiredEnv = ["RESEND_API_KEY", "INTAKE_TO_EMAIL", "INTAKE_FROM_EMAIL"] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    return res.status(503).json({
      error: "Email delivery is not configured yet.",
      missingEnv,
    });
  }

  const payload = normalizePayload(req.body);
  const validationError = validatePayload(payload);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (payload.website) {
    return res.status(200).json({ ok: true });
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.INTAKE_FROM_EMAIL,
      to: process.env.INTAKE_TO_EMAIL,
      reply_to: payload.email,
      subject: `New shoot request from ${payload.fullName}`,
      text: renderTextEmail(payload),
      html: renderHtmlEmail(payload),
    }),
  });

  if (!emailResponse.ok) {
    const details = await emailResponse.text();
    return res.status(502).json({
      error: "Email provider rejected the request.",
      details,
    });
  }

  return res.status(200).json({ ok: true });
}

function normalizePayload(body: unknown): IntakePayload {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as IntakePayload;
    } catch {
      return {};
    }
  }

  if (!body || typeof body !== "object") {
    return {};
  }

  const input = body as Record<string, unknown>;

  return {
    fullName: asString(input.fullName),
    email: asString(input.email),
    phone: asString(input.phone),
    squareFootageRange: asString(input.squareFootageRange),
    propertyAddress: asString(input.propertyAddress),
    unit: asString(input.unit),
    city: asString(input.city),
    state: asString(input.state),
    zipCode: asString(input.zipCode),
    mlsNumber: asString(input.mlsNumber),
    bedrooms: asString(input.bedrooms),
    bathrooms: asString(input.bathrooms),
    lotSize: asString(input.lotSize),
    servicesNeeded: asStringArray(input.servicesNeeded),
    additionalDetails: asString(input.additionalDetails),
    website: asString(input.website),
  };
}

function validatePayload(payload: IntakePayload) {
  if (!payload.fullName) return "Full name is required.";
  if (!payload.email || !payload.email.includes("@")) return "A valid email is required.";
  if (!payload.propertyAddress) return "Property address is required.";
  if (!payload.city) return "City is required.";
  if (!payload.state) return "State is required.";
  if (!payload.zipCode) return "Zip code is required.";
  if (!payload.servicesNeeded || payload.servicesNeeded.length === 0) {
    return "At least one service is required.";
  }

  return null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : undefined;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function renderTextEmail(payload: IntakePayload) {
  return [
    "New shoot request",
    "",
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Property Address: ${payload.propertyAddress}`,
    `Apartment / Unit: ${payload.unit || "Not provided"}`,
    `City: ${payload.city}`,
    `State: ${payload.state}`,
    `Zip Code: ${payload.zipCode}`,
    `MLS Number: ${payload.mlsNumber || "Not provided"}`,
    `Bedrooms: ${payload.bedrooms || "Not provided"}`,
    `Bathrooms: ${payload.bathrooms || "Not provided"}`,
    `Lot Size: ${payload.lotSize || "Not provided"}`,
    `Square Footage: ${payload.squareFootageRange || "Not provided"}`,
    `Services Needed: ${payload.servicesNeeded?.join(", ")}`,
    "",
    "Additional Details:",
    payload.additionalDetails || "None provided",
  ].join("\n");
}

function renderHtmlEmail(payload: IntakePayload) {
  const rows: Array<[string, string]> = [
    ["Name", payload.fullName || ""],
    ["Email", payload.email || ""],
    ["Phone", payload.phone || "Not provided"],
    ["Property Address", payload.propertyAddress || ""],
    ["Apartment / Unit", payload.unit || "Not provided"],
    ["City", payload.city || ""],
    ["State", payload.state || ""],
    ["Zip Code", payload.zipCode || ""],
    ["MLS Number", payload.mlsNumber || "Not provided"],
    ["Bedrooms", payload.bedrooms || "Not provided"],
    ["Bathrooms", payload.bathrooms || "Not provided"],
    ["Lot Size", payload.lotSize || "Not provided"],
    ["Square Footage", payload.squareFootageRange || "Not provided"],
    ["Services Needed", payload.servicesNeeded?.join(", ") || ""],
    ["Additional Details", payload.additionalDetails || "None provided"],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #17212f;">
      <h1 style="font-size: 24px;">New shoot request</h1>
      <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th align="left" style="border-bottom: 1px solid #e5e7eb;">${escapeHtml(label)}</th>
                <td style="border-bottom: 1px solid #e5e7eb;">${escapeHtml(value || "")}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
