import mongoose, { models, Schema } from "mongoose";

const usuarioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telefono: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    estado: {
      type: String,
      default: "activo",
    },
    role: {
      type: String,
      default: "Usuario",
    },
    intentos_fallidos: {
      type: Number,
      default: 0,
    },
    bloqueado: {
      type: Boolean,
      default: false,
    },
    codigo_verificacion: {
      type: String,
      default: "",
    },
    date_codigo_verificacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Usuario = models.Usuario || mongoose.model("Usuario", usuarioSchema);
export default Usuario;
