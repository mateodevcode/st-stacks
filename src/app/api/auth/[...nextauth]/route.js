// app/api/auth/[...nextauth]/route.js ok
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import Usuario from "@/models/Usuario";
import { connectMongoDB } from "@/lib/db";
import { iniciarSesionValidate } from "@/validations/iniciarSesion";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();

          const errores = iniciarSesionValidate({ email, password });

          if (errores.length > 0) {
            throw new Error(errores[0]);
          }

          // Buscar usuario por email (convertir a minúsculas para consistencia)
          const usuario = await Usuario.findOne({
            email: email.toLowerCase(),
          });

          if (!usuario) {
            throw new Error("Correo no registrado");
          }

          // Verificar si la cuenta está bloqueada
          if (usuario.bloqueado) {
            throw new Error("Cuenta bloqueada. Contacta al administrador");
          }

          // Verificar contraseña
          const verificarPassword = await bcrypt.compare(
            password,
            usuario.password
          );

          if (!verificarPassword) {
            // Incrementar intentos fallidos
            usuario.intentos_fallidos = (usuario.intentos_fallidos || 0) + 1;

            // Bloquear cuenta después de 3 intentos
            if (usuario.intentos_fallidos >= 3) {
              usuario.bloqueado = true;
              await usuario.save();
              throw new Error(
                "Usuario bloqueado por múltiples intentos fallidos"
              );
            }

            await usuario.save();
            throw new Error("Contraseña incorrecta");
          }

          // Login exitoso: reiniciar intentos fallidos
          usuario.intentos_fallidos = 0;
          usuario.ultimo_login = new Date();
          await usuario.save();

          return {
            id: usuario._id.toString(),
            name: usuario.name,
            email: usuario.email,
            image: usuario.imageUrl,
            role: usuario.role,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectMongoDB();

        let usuarioExistente = await Usuario.findOne({
          email: user.email.toLowerCase(),
        });

        if (!usuarioExistente) {
          usuarioExistente = await Usuario.create({
            name: user.name,
            email: user.email.toLowerCase(),
            imageUrl: user.image,
            provider: account.provider,
            role: "Usuario",
            bloqueado: false,
            intentos_fallidos: 0,
          });
        }

        // Verificar si usuario OAuth está bloqueado
        if (usuarioExistente.bloqueado) {
          throw new Error("Cuenta bloqueada");
        }

        user.id = usuarioExistente._id.toString();
        user.role = usuarioExistente.role;
        return true;
      } catch (error) {
        console.error("Error en signIn:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
