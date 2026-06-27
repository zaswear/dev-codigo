// Edge Function: /api/progress
// GET  → Obtiene el progreso del usuario autenticado
// POST → Guarda/Actualiza el progreso del usuario autenticado
export const config = { runtime: 'edge' };

import { getSql } from './_db.js';
import { jsonResponse, errorResponse } from './_utils.js';
import { verifyJWT, bearerToken } from './_jwt.js';

async function requireUser(req) {
  const token = bearerToken(req);
  if (!token) return null;
  const payload = await verifyJWT(token, process.env.JWT_SECRET);
  return payload; // { id: db_user_id, login: username, avatar }
}

export default async function handler(req) {
  const user = await requireUser(req);
  if (!user) return errorResponse('No autorizado', 401);

  const sql = getSql();

  // ── GET ────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT course_id, completed_days 
        FROM progress 
        WHERE user_id = ${user.id}
      `;
      
      const progressMap = {};
      rows.forEach(r => {
        progressMap[r.course_id] = Array.isArray(r.completed_days) ? r.completed_days : [];
      });

      return jsonResponse({ results: progressMap });
    } catch (err) {
      return errorResponse(err.message, 500);
    }
  }

  // ── POST ────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { return errorResponse('JSON inválido'); }

    const { course_id, completed_days } = body;
    if (!course_id || !Array.isArray(completed_days)) {
      return errorResponse('Faltan parámetros course_id o completed_days (array)');
    }

    // Validar días enteros
    const days = completed_days.map(d => parseInt(d, 10)).filter(Number.isInteger);
    const uniqueDays = [...new Set(days)];
    const daysJson = JSON.stringify(uniqueDays);

    try {
      await sql`
        INSERT INTO progress (user_id, course_id, completed_days)
        VALUES (${user.id}, ${course_id}, ${daysJson}::jsonb)
        ON CONFLICT (user_id, course_id) 
        DO UPDATE SET completed_days = EXCLUDED.completed_days, updated_at = now()
      `;

      return jsonResponse({ success: true, course_id, completed_days: uniqueDays }, 200, 'no-store');
    } catch (err) {
      return errorResponse(err.message, 500);
    }
  }

  return errorResponse('Método no permitido', 405);
}
