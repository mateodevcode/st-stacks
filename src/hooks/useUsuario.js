// hooks/useUsuario.js
import { apiServer } from "@/app/actions/apiServer";
import { AppContext } from "@/context/AppContext";
import { useContext, useState } from "react";
import { toast } from "sonner";
import useResetForm from "./useResetForm";
import { useRouter } from "next/navigation";

const useUsuario = () => {
  const { setUsuarios, setFormDataUsuario } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { resetFormDataUsuario } = useResetForm();
  const handleActualizarUsuario = async (id, nuevoEstado) => {
    if (!id || !nuevoEstado) {
      toast.error("Falta el ID o el estado a actualizar", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const res = await apiServer(`/api/usuarios/${id}`, "PUT", {
        estado: nuevoEstado,
      });
      const { success, message, error, data } = res;

      if (success) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario._id === id ? { ...usuario, estado: nuevoEstado } : usuario
          )
        );

        toast.success(message || "Estado actualizado exitosamente", {
          position: "bottom-right",
        });
      } else {
        console.error("❌ Error al actualizar el estado:", error);
        toast.error("No se pudo actualizar el estado", {
          description: error,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Error al actualizar el estado. Inténtalo de nuevo.", {
        position: "bottom-right",
      });
    }
  };

  const crearUsuario = async (usuario) => {
    setLoading(true);

    try {
      const res = await apiServer(`/api/usuarios`, "POST", usuario);
      const { success, message, error, data } = res;

      if (success) {
        setUsuarios((prevUsuarios) => [...prevUsuarios, data]);

        toast.success(message || "Usuario creado exitosamente", {
          position: "bottom-right",
        });
        setLoading(false);
        resetFormDataUsuario();
        router.push("/auth/signin");
      } else {
        toast.error(error, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Error al crear el usuario. Inténtalo de nuevo.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    handleActualizarUsuario,
    crearUsuario,
    handleChange,
    loading,
  };
};
export default useUsuario;
