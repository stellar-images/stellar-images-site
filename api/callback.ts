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
    return sendPopupError(
      res,
      "GitHub login expired or was already used. Return to the admin page and click Login with GitHub again.",
    );
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Admin login did not complete</title>
        <style>
          body {
            align-items: center;
            background: #f7f3ec;
            color: #221f1a;
            display: flex;
            font-family: Georgia, serif;
            justify-content: center;
            margin: 0;
            min-height: 100vh;
            padding: 24px;
          }

          main {
            background: #fffaf1;
            border: 1px solid #d8c9ad;
            border-radius: 18px;
            box-shadow: 0 18px 50px rgb(70 55 35 / 14%);
            max-width: 520px;
            padding: 32px;
          }

          h1 {
            font-size: clamp(1.75rem, 5vw, 2.5rem);
            line-height: 1;
            margin: 0 0 16px;
          }

          p {
            font: 18px/1.55 ui-sans-serif, system-ui, sans-serif;
            margin: 0 0 18px;
          }

          a {
            background: #221f1a;
            border-radius: 999px;
            color: #fffaf1;
            display: inline-block;
            font: 700 15px/1 ui-sans-serif, system-ui, sans-serif;
            padding: 14px 18px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <script>
          (function () {
            var message = 'authorization:github:error:' + JSON.stringify({ message: ${JSON.stringify(message)} });
            window.opener && window.opener.postMessage(message, '*');
            window.close();
          })();
        </script>
        <main>
          <h1>Admin login did not complete</h1>
          <p>${escapeHtml(message)}</p>
          <a href="/admin/">Return to admin login</a>
        </main>
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
