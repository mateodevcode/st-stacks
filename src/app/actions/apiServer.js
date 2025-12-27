// app/actions/apiServer.js ok
"use server";

import { cookies } from "next/headers";

const API_SECRET_KEY = process.env.API_SECRET_KEY;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// 🔒 Validar que la API Key existe
if (!API_SECRET_KEY) {
  throw new Error(
    "API_SECRET_KEY no está configurada en las variables de entorno"
  );
}

export async function apiServer(endpoint, metodo = "GET", datos = null) {
  try {
    // 🔒 Validar que endpoint no sea malicioso
    if (!endpoint || !endpoint.startsWith("/")) {
      throw new Error("Endpoint inválido");
    }

    // ⭐ Obtener cookies para pasar la sesión
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const url = `${NEXTAUTH_URL}${endpoint}`;

    const res = await fetch(url, {
      method: metodo,
      headers: {
        "x-api-key": API_SECRET_KEY,
        "Content-Type": "application/json",
        Cookie: cookieHeader, // ⭐ Pasar las cookies (incluye session-token)
      },
      cache: "no-cache",
      body: metodo !== "GET" ? JSON.stringify(datos) : null,
    });

    const data = await res.json();
    return {
      success: data.success ?? false,
      message: data.message,
      data: data.data,
      error: data.error,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      error: error.message,
      data: null,
      status: 500,
    };
  }
}
