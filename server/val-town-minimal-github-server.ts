/**
This is a very minimal server for getting a gist token to the frontend-only app.
Unlisted here: https://www.val.town/v/forresto/meemoo_org_share
Accessed like this in iframework.js: https://forresto-meemoo_org_share.web.val.run/login
*/

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const GITHUB_CLIENT_ID = Deno.env.get('GITHUB_CLIENT_ID') as string;
const GITHUB_CLIENT_SECRET = Deno.env.get('GITHUB_CLIENT_SECRET') as string;

if (!GITHUB_CLIENT_ID) throw new Error('Missing GITHUB_CLIENT_ID');
if (!GITHUB_CLIENT_SECRET) throw new Error('Missing GITHUB_CLIENT_SECRET');

// Configure allowed origin for CORS
const ALLOWED_ORIGIN = 'https://app.meemoo.org';

export default async function server(request: Request): Promise<Response> {
  // CORS Preflight Handling
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const url = new URL(request.url);

  // New Login Redirect Route
  if (url.pathname === '/login') {
    const redirectUri = url.searchParams.get('redirect') || ALLOWED_ORIGIN;
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');

    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set(
      'redirect_uri',
      `${new URL(request.url).origin}/oauth/callback?redirect=${encodeURIComponent(redirectUri)}`
    );
    githubAuthUrl.searchParams.set('scope', 'gist'); // Adjust scopes as needed
    githubAuthUrl.searchParams.set('state', crypto.randomUUID()); // CSRF protection

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl.toString(),
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      },
    });
  }

  // OAuth Callback Handler (unchanged from previous implementation)
  if (url.pathname === '/oauth/callback') {
    const code = url.searchParams.get('code');
    const redirectUri = url.searchParams.get('redirect') || ALLOWED_ORIGIN;
    const redirectURL = new URL(redirectUri);

    if (!code) {
      return new Response('No code provided', {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
          }),
        }
      );

      const tokenData = await tokenResponse.json();

      // Redirect with token, allowing cross-origin
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${redirectURL.origin}${redirectURL.pathname}?token=${tokenData.access_token}${redirectURL.hash}`,
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    } catch (error) {
      return new Response(`Authentication failed: ${error.message}`, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    }
  }

  // Default 404 response for any unhandled routes
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
  });
}
