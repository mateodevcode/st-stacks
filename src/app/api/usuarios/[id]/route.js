// app/api/usuarios/[id]/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import { validateApiKey } from "@/lib/validateApiKey";
import Usuario from "@/models/Usuario";

export async function GET(req, { params }) {
  const isValid = validateApiKey(req);
  if (isValid !== true) return isValid;

  try {
    await connectMongoDB();
    const { id } = await params;
    const UsuarioEncontrado = await Usuario.findById(id);
    if (!UsuarioEncontrado)
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Usuario obtenido correctamente.",
        data: UsuarioEncontrado,
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

export async function PUT(req, { params }) {
  const isValid = validateApiKey(req);
  if (isValid !== true) return isValid;

  try {
    const { id } = await params;
    await connectMongoDB();
    const data = await req.json();
    const UsuarioActualizado = await Usuario.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Usuario modificado con éxito.",
        data: UsuarioActualizado,
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

export async function DELETE(req, { params }) {
  const isValid = validateApiKey(req);
  if (isValid !== true) return isValid;

  try {
    const { id } = await params;
    await connectMongoDB();

    // Verificar si el usuario existe antes de eliminar
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    // Ahora eliminar el usuario
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Usuario y todos sus datos han sido eliminados correctamente.",
        data: {
          usuario: usuarioEliminado,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error eliminando usuario y datos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor: " + error.message,
      },
      { status: 500 }
    );
  }
}
