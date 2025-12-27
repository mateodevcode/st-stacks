// app/api/usuarios/route.js ok
import { connectMongoDB } from "@/lib/db";
import { validateApiKey } from "@/lib/validateApiKey";
import Usuario from "@/models/Usuario";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registrarseValidate } from "@/validations/registrarse";
import {
  registerLimiter,
  defaultLimiter,
  checkRateLimit,
} from "@/lib/rateLimit";

export async function GET(req) {
  try {
    const isValid = validateApiKey(req);
    if (isValid !== true) return isValid;

    const rateLimitResponse = checkRateLimit(req, defaultLimiter);
    if (rateLimitResponse !== true) return rateLimitResponse;
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
  try {
    const isValid = validateApiKey(req);
    if (isValid !== true) return isValid;

    const rateLimitResponse = checkRateLimit(req, registerLimiter);
    if (rateLimitResponse !== true) return rateLimitResponse;

    await connectMongoDB();
    const data = await req.json();

    if (data.codigo !== process.env.CODIGO) {
      return NextResponse.json(
        {
          success: false,
          error: "Código inválido.",
        },
        { status: 401 }
      );
    }

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
