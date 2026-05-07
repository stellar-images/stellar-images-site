import type { VercelRequest, VercelResponse } from "./vercel-types.js";
import { verifyState } from "./auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const stateSecret = process.env.OAUTH_STATE_SECRET || clientSecret;
  const code = queryValue(req.query.code);
  const state = queryValue(req.query.state);

  if (!clientId || !clientSecret || !stateSecret) {
    return sendPopupError(res, "GitHub OAuth is not configured.");
  }

  if (!code || !verifyState(state, stateSecret)) {
    return sendPopupError(res, "Invalid OAuth response.");
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: process.env.OAUTH_REDIRECT_URI,
    }),
  });

  const tokenPayload = (await tokenResponse.json().catch(() => null)) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  } | null;

  if (!tokenResponse.ok || !tokenPayload?.access_token) {
    return sendPopupError(res, tokenPayload?.error_description || tokenPayload?.error || "Unable to authorize GitHub.");
  }

  return sendPopupSuccess(res, tokenPayload.access_token);
}

function sendPopupSuccess(res: VercelResponse, token: string) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).send(`
    <!doctype html>
    <html>
      <body>
        <script>
          (function () {
            var message = 'authorization:github:success:' + JSON.stringify({ token: ${JSON.stringify(token)}, provider: 'github' });
            function receiveMessage(event) {
              window.opener && window.opener.postMessage(message, event.origin);
              window.close();
            }
            window.addEventListener('message', receiveMessage, false);
            window.opener && window.opener.postMessage('authorizing:github', '*');
          })();
        </script>
      </body>
    </html>
  `);
}

function sendPopupError(res: VercelResponse, message: string) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(400).send(`
    <!doctype html>
    <html>
      <body>
        <script>
          (function () {
            var message = 'authorization:github:error:' + JSON.stringify({ message: ${JSON.stringify(message)} });
            window.opener && window.opener.postMessage(message, '*');
            window.close();
          })();
        </script>
        <p>${escapeHtml(message)}</p>
      </body>
    </html>
  `);
}

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
