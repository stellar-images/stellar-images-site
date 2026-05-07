import { createHmac, randomBytes } from "node:crypto";
import type { VercelRequest, VercelResponse } from "./vercel-types.js";

const TEN_MINUTES_MS = 10 * 60 * 1000;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const stateSecret = process.env.OAUTH_STATE_SECRET || process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !stateSecret) {
    return res.status(503).send("GitHub OAuth is not configured.");
  }

  const origin = getOrigin(req);
  const redirectUri = process.env.OAUTH_REDIRECT_URI || `${origin}/api/callback`;
  const state = signState({ nonce: randomBytes(16).toString("hex"), createdAt: Date.now() }, stateSecret);
  const scope = process.env.GITHUB_OAUTH_SCOPE || "repo";
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");

  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("state", state);

  res.setHeader("Cache-Control", "no-store");
  return res.redirect(authorizeUrl.toString());
}

export function getOrigin(req: VercelRequest) {
  const proto = getHeader(req, "x-forwarded-proto") || "https";
  const host = getHeader(req, "x-forwarded-host") || getHeader(req, "host");
  return `${proto}://${host}`;
}

export function signState(payload: Record<string, unknown>, secret: string) {
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyState(state: string | undefined, secret: string) {
  if (!state) return false;

  const [encodedPayload, signature] = state.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      createdAt?: number;
    };

    return typeof payload.createdAt === "number" && Date.now() - payload.createdAt < TEN_MINUTES_MS;
  } catch {
    return false;
  }
}

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function getHeader(req: VercelRequest, name: string) {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}
