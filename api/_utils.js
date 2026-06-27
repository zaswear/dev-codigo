// Shared helpers for dev-codigo Edge Functions

export function jsonResponse(data, status = 200, cache = 'public, max-age=300') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cache,
    },
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status, 'no-store');
}

export function getBaseUrl(req) {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
