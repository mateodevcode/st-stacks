// hooks/useResetForm.js
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

const useResetForm = () => {
  const { setFormDataUsuario } = useContext(AppContext);

  const resetFormDataUsuario = () => {
    setFormDataUsuario({
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
  };

  const resetFormData = () => {
    resetFormDataUsuario();
  };

  return {
    resetFormData,
    resetFormDataUsuario,
  };
};
export default useResetForm;
