"use client";

import { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiServer } from "@/app/actions/apiServer";
import { toast } from "sonner";

const THEME_STORAGE_KEY = "app-theme";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { data: session } = useSession();
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [formDataUsuario, setFormDataUsuario] = useState({
    name: "",
    email: "",
    telefono: "",
    password: "",
    imageUrl: "",
    publicId: "",
    estado: "activo",
    role: "Usuario",
    opcion: "crear",
  });
  const [formDataProject, setFormDataProject] = useState({
    projectName: "Nuevo Proyecto",
    description: "",
    stack: {},
    template: "custom",
  });
  const [projects, setProjects] = useState([]);
  const [predefinedStacks, setPredefinedStacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar todos los usuarios al iniciar el componente
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await apiServer(`/api/usuarios`, "GET");
        const { data: usuariosRes, message, success, error } = res;
        if (success === true) {
          setUsuarios(usuariosRes);
        } else {
          console.warn("⚠️ No se pudo cargar usuarios:", error);
          toast.error("No se pudo cargar los usuarios:", {
            description: error,
            position: "bottom-right",
          });
        }
      } catch (error) {
        console.error("🚨 Error al cargar los usuarios:", error);
      }
    };

    cargarUsuario();
  }, []);

  // Cargar usuario al iniciar el componente o cuando la sesión cambie
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!session?.user?.id) return; // Espera a que la sesión esté lista

      try {
        const res = await apiServer(`/api/usuarios/${session.user.id}`, "GET");
        const { success, message, data: usuarioRes, error } = res;
        if (success === true) {
          setUsuario(usuarioRes);
        } else {
          console.warn("⚠️ No se pudo cargar el usuario:", error);
          toast.error("No se pudo cargar el usuario:", {
            description: error,
            position: "bottom-right",
          });
        }
      } catch (error) {
        console.error("🚨 Error al cargar el usuario:", error);
      }
    };

    cargarUsuario();
  }, [session]);

  return (
    <AppContext.Provider
      value={{
        formDataUsuario,
        setFormDataUsuario,
        usuario,
        setUsuario,
        usuarios,
        setUsuarios,
        loading,
        setLoading,
        formDataProject,
        setFormDataProject,
        projects,
        setProjects,
        predefinedStacks,
        setPredefinedStacks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
