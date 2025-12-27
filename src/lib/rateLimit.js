// lib/rateLimit.js
import { NextResponse } from "next/server";

const rateLimitMap = new Map();

export function createRateLimiter(maxRequests = 10, windowMs = 60000) {
  // maxRequests: cantidad de solicitudes permitidas
  // windowMs: ventana de tiempo en ms (default: 1 minuto)

  return (req) => {
    const identifier = req.headers.get("x-api-key") || req.ip || "anonymous";
    const now = Date.now();
    const key = `${identifier}-${Math.floor(now / windowMs)}`;

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, 0);
    }

    const count = rateLimitMap.get(key);

    if (count >= maxRequests) {
      return {
        isLimited: true,
        message: `Límite de ${maxRequests} solicitudes por minuto excedido`,
        retryAfter: Math.ceil((windowMs - (now % windowMs)) / 1000),
      };
    }

    rateLimitMap.set(key, count + 1);

    // Limpiar entradas antiguas cada 10 minutos
    if (Math.random() < 0.01) {
      const cutoff = now - windowMs * 2;
      for (const [mapKey] of rateLimitMap) {
        if (parseInt(mapKey.split("-")[1]) * windowMs < cutoff) {
          rateLimitMap.delete(mapKey);
        }
      }
    }

    return { isLimited: false };
  };
}

// Crear instancias específicas para diferentes rutas
export const registerLimiter = createRateLimiter(5, 60000); // 5 por minuto
export const loginLimiter = createRateLimiter(5, 60000); // 5 por minuto
export const defaultLimiter = createRateLimiter(30, 60000); // 30 por minuto

// ✨ Nueva función helper que retorna NextResponse directamente
export function checkRateLimit(req, limiter) {
  const rateLimitCheck = limiter(req);

  if (rateLimitCheck.isLimited) {
    return NextResponse.json(
      {
        success: false,
        error: rateLimitCheck.message,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitCheck.retryAfter,
        },
      }
    );
  }

  return true; // Permitido, continuar
}
