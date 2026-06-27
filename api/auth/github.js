// GET /api/auth/github — redirige al flujo OAuth de GitHub
export const config = { runtime: 'edge' };

export default function handler(req) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('GITHUB_CLIENT_ID no configurado', { status: 500 });
  }

  const url   = new URL(req.url);
  const state = crypto.randomUUID();
  const next  = url.searchParams.get('next') || '/';

  const params = new URLSearchParams({
    client_id:    clientId,
    scope:        'read:user',
    state:        `${state}|${next}`,
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
