// app/api/usuarios/route.js
import { connectMongoDB } from "@/lib/db";
import { validateApiKey } from "@/lib/validateApiKey";
import Usuario from "@/models/Usuario";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registrarseValidate } from "@/validations/registrarse";
import { registerLimiter, defaultLimiter } from "@/lib/rateLimit";

export async function GET(req) {
  const isValid = validateApiKey(req);
  if (isValid !== true) return isValid;

  // 2. Aplicar rate limiting
  const rateLimitCheck = defaultLimiter(req);
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

  try {
    await connectMongoDB();

    const usuarios = await Usuario.find({});
    return NextResponse.json(
      {
        success: true,
        message: "Usuarios obtenidos correctamente.",
        data: usuarios,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const isValid = validateApiKey(req);
  if (isValid !== true) return isValid;

  // 2. Aplicar rate limiting
  const rateLimitCheck = registerLimiter(req);
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

  try {
    await connectMongoDB();
    const data = await req.json();

    const errores = registrarseValidate(data);
    if (errores.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: errores[0],
        },
        { status: 400 }
      );
    }

    const pass = await bcrypt.hash(data.password, 10);
    const nuevoUsuario = await Usuario.create({
      ...data,
      password: pass,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado con éxito.",
        data: nuevoUsuario,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
