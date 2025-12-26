// lib/auth.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Obtiene la sesión del usuario en el servidor (API routes)
 * @returns {Promise<Session|null>} La sesión del usuario o null si no está autenticado
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Verifica si el usuario está autenticado
 * @returns {Promise<boolean>} true si está autenticado, false si no
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user?.id;
}

/**
 * Obtiene el ID del usuario autenticado
 * @returns {Promise<string|null>} El ID del usuario o null si no está autenticado
 */
export async function getUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}
