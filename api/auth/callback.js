// GET /api/auth/callback?code=...&state=...
export const config = { runtime: 'edge' };

import { signJWT } from '../_jwt.js';
import { getSql } from '../_db.js';

export default async function handler(req) {
  const url    = new URL(req.url);
  const code   = url.searchParams.get('code');
  const state  = url.searchParams.get('state') || '';
  const next   = state.split('|')[1] || '/';
  const origin = `${url.protocol}//${url.host}`;

  if (!code) return Response.redirect(`${origin}${next}?error=no_code`, 302);

  try {
    const sql = getSql();

    // 1. Intercambiar code por access_token de GitHub
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) return Response.redirect(`${origin}${next}?error=oauth`, 302);

    // 2. Obtener datos del perfil de usuario de GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent':  'dev-codigo/1.0',
      },
    });
    const user = await userRes.json();

    if (!user.id || !user.login) {
      return Response.redirect(`${origin}${next}?error=profile`, 302);
    }

    // 3. Guardar/Actualizar usuario en la base de datos PostgreSQL
    const rows = await sql`
      INSERT INTO users (github_id, username, avatar_url)
      VALUES (${user.id}, ${user.login}, ${user.avatar_url})
      ON CONFLICT (github_id) 
      DO UPDATE SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url
      RETURNING id, username
    `;
    const dbUser = rows[0];

    // 4. Emitir JWT de sesión (30 días)
    const jwt = await signJWT(
      { id: dbUser.id, login: dbUser.username, avatar: user.avatar_url },
      process.env.JWT_SECRET
    );

    // 5. Redirigir a la app con el token
    return Response.redirect(`${origin}${next}?token=${encodeURIComponent(jwt)}`, 302);

  } catch (err) {
    console.error('OAuth Callback Error:', err);
    return Response.redirect(`${origin}${next}?error=server`, 302);
  }
}
