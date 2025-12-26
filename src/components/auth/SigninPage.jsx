"use client";

import { AppContext } from "@/context/AppContext";
import useIniciarSesion from "@/hooks/useIniciarSesion";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const { formDataUsuario } = useContext(AppContext);
  const { handleChange, handleLoginCredenciales, loading } = useIniciarSesion();
  const searchParams = useSearchParams();
  const emailUrl = searchParams.get("email");
  const router = useRouter();

  useEffect(() => {
    if (emailUrl) {
      formDataUsuario.email = emailUrl;
    }
  }, [emailUrl, formDataUsuario]);

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
            className="inline-flex items-center justify-center w-16 h-16 bg-primero/10 rounded-lg mb-4"
          >
            <Image src="/logo/logo.png" alt="Logo" width={40} height={40} />
          </motion.div>
          <h1 className="text-3xl font-semibold text-primero mb-2">
            Stack Builder Pro
          </h1>
          <p className="text-primero/70">Acceder al sistema</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-segundo border border-tercero/20 rounded-lg p-8 shadow-lg"
        >
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-tercero text-sm font-mono mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formDataUsuario.email}
                name="email"
                onChange={handleChange}
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
                name="password"
                onChange={handleChange}
                className="w-full bg-segundo border border-tercero/30 rounded px-4 py-3 text-tercero focus:outline-none focus:border-tercero transition-colors font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                if (formDataUsuario.email === "admin@stack.dev") {
                  toast.success("jajajaja ahora intenta con un usuario real");
                  return;
                }

                handleLoginCredenciales(e);
              }}
              className="w-full bg-tercero text-segundo font-bold py-3 rounded hover:bg-tercero/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-segundo/50"
            >
              {loading ? "AUTENTICANDO..." : "ACCEDER AL SISTEMA"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-tercero/20">
            <p className="text-xs text-primero/70 font-mono text-center">
              Demo: admin@stack.dev / password123
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p
          className="text-center text-primero/70 text-sm mt-6 font-mono hover:text-tercero cursor-pointer select-none"
          onClick={() => router.push("/auth/signup")}
        >
          &gt; Secure authentication protocol v5.0
        </p>
      </motion.div>
    </div>
  );
}
