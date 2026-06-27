// JWT mínimo con Web Crypto (funciona en Vercel Edge)
const ALGO  = { name: 'HMAC', hash: 'SHA-256' };
export const OWNER = 'zaswear';

// base64 estándar → base64url
function b64url(str) { return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); }
// base64url → base64 estándar con padding (para atob)
function b64decode(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return b64 + '='.repeat((4 - b64.length % 4) % 4);
}

async function key(secret) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), ALGO, false, ['sign', 'verify']);
}

export async function signJWT(payload, secret, ttl = 60 * 60 * 24 * 30) {
  const now  = Math.floor(Date.now() / 1000);
  const data = b64url(btoa(JSON.stringify({ ...payload, iat: now, exp: now + ttl })));
  const sig  = b64url(btoa(String.fromCharCode(
    ...new Uint8Array(await crypto.subtle.sign(ALGO, await key(secret), new TextEncoder().encode(data)))
  )));
  return `${data}.${sig}`;
}

export async function verifyJWT(token, secret) {
  if (!token) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  try {
    const sigBytes = Uint8Array.from(atob(b64decode(sig)), c => c.charCodeAt(0));
    if (!await crypto.subtle.verify(ALGO, await key(secret), sigBytes, new TextEncoder().encode(data)))
      return null;
    const payload = JSON.parse(atob(b64decode(data)));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

export function bearerToken(req) {
  const h = req.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}
