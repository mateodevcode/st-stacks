"use client";

import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import useUsuario from "@/hooks/useUsuario";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const { formDataUsuario } = useContext(AppContext);
  const { crearUsuario, loading, handleChange } = useUsuario();

  return (
    <div className="min-h-screen flex items-center justify-center bg-segundo p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-segundo rounded-lg mb-4"
          >
            <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
          </motion.div>
          <h1 className="text-3xl font-bold text-tercero mb-2">
            Crea una cuenta
          </h1>
          <p className="text-primero/70">Stack Builder Pro</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-segundo border border-tercero/20 rounded-lg p-8 shadow-lg"
        >
          <form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-tercero text-sm font-mono mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Name
              </label>
              <input
                type="text"
                value={formDataUsuario.name}
                onChange={handleChange}
                name="name"
                className="w-full bg-segundo border border-tercero/30 rounded px-4 py-3 text-tercero focus:outline-none focus:border-tercero transition-colors font-mono"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-tercero text-sm font-mono mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formDataUsuario.email}
                onChange={handleChange}
                name="email"
                className="w-full bg-segundo border border-tercero/30 rounded px-4 py-3 text-tercero focus:outline-none focus:border-tercero transition-colors font-mono"
                placeholder="user@domain.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-tercero text-sm font-mono mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                value={formDataUsuario.password}
                onChange={handleChange}
                name="password"
                className="w-full bg-segundo border border-tercero/30 rounded px-4 py-3 text-tercero focus:outline-none focus:border-tercero transition-colors font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={() => crearUsuario(formDataUsuario)}
              className="w-full bg-tercero text-segundo font-semibold py-3 rounded hover:bg-tercero/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-hacker-green/50"
            >
              {loading ? "CREANDO UNA CUENTA..." : "CREAR UNA CUENTA"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-tercero/20 text-center">
            <p className="text-sm text-primero/70 font-mono">
              Ya tienes una cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-tercero hover:text-tercero/80 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
