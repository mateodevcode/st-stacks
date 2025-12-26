// hooks/useIniciarSesion.js
import { AppContext } from "@/context/AppContext";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";
import useResetForm from "./useResetForm";

const useIniciarSesion = () => {
  const { formDataUsuario, setFormDataUsuario, loading, setLoading } =
    useContext(AppContext);
  const router = useRouter();
  const { resetFormDataUsuario } = useResetForm();

  const handleLoginCredenciales = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formDataUsuario.email,
        password: formDataUsuario.password,
        redirect: false,
      });

      if (result.error) {
        // El error viene del backend (NextAuth)
        toast.error(result.error, {
          position: "bottom-right",
        });
        return;
      }

      if (result.ok) {
        toast.success("¡Inicio de sesión exitoso!", {
          position: "bottom-right",
        });
        resetFormDataUsuario();
        setLoading(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("🚨 Error al manejar login:", error);
      toast.error(error.message, {
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

  const handleLoginGoogle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    signIn("google", {
      callbackUrl: "/",
    });
  };

  const handleLoginFacebook = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    signIn("google", {
      callbackUrl: "/",
    });
  };

  const handleCerrarSesion = () => {
    signOut({
      callbackUrl: `/`,
    });
  };

  return {
    handleChange,
    handleLoginGoogle,
    handleLoginCredenciales,
    handleLoginFacebook,
    handleCerrarSesion,
    loading,
  };
};

export default useIniciarSesion;
