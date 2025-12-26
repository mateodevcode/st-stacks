// lib/validateApiKey.js
import { NextResponse } from "next/server";

export function validateApiKey(request) {
  const API_SECRET_KEY = process.env.API_SECRET_KEY;

  // Opción 1: Header x-api-key (JSON requests)
  const headerApiKey = request.headers.get("x-api-key");

  const apiKeyValida = headerApiKey;

  if (!apiKeyValida || apiKeyValida !== API_SECRET_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "No autorizado. Acceso restringido a clientes autorizados.",
      },
      { status: 401 }
    );
  }

  return true;
}
