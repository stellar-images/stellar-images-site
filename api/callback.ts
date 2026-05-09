import type { VercelRequest, VercelResponse } from "./vercel-types.js";
import { getOrigin, verifyState } from "./auth.js";

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

  const redirectUri = process.env.OAUTH_REDIRECT_URI || `${getOrigin(req)}/api/callback`;
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
      redirect_uri: redirectUri,
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
  const decapUser = {
    backendName: "github",
    token,
  };

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).send(`
    <!doctype html>
    <html>
      <body>
        <script>
          (function () {
            var adminPath = '/admin/#/';
            var decapUser = ${JSON.stringify(decapUser)};
            var message = 'authorization:github:success:' + JSON.stringify({ token: ${JSON.stringify(token)}, provider: 'github' });
            var completed = false;

            function storeUser(targetWindow) {
              try {
                targetWindow.localStorage.setItem('decap-cms-user', JSON.stringify(decapUser));
                return true;
              } catch (error) {
                return false;
              }
            }

            function sendUserToAdmin(targetWindow) {
              try {
                targetWindow.location.replace(adminPath);
              } catch (error) {
                targetWindow.location.href = adminPath;
              }
            }

            function receiveMessage(event) {
              if (event.origin !== window.location.origin || event.data !== 'authorizing:github') {
                return;
              }

              completed = true;
              window.opener && window.opener.postMessage(message, event.origin);
              window.close();
            }

            if (window.opener && !window.opener.closed) {
              window.addEventListener('message', receiveMessage, false);
              window.opener.postMessage('authorizing:github', window.location.origin);

              window.setTimeout(function () {
                if (completed) return;

                if (storeUser(window.opener)) {
                  sendUserToAdmin(window.opener);
                  window.close();
                }
              }, 1500);

              return;
            }

            if (storeUser(window)) {
              sendUserToAdmin(window);
              return;
            }

            document.body.textContent = 'Authorization complete. Return to /admin/.';
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
