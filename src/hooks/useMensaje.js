// hooks/useMensaje.js
import { botonWhatsapp } from "@/data/boton-wp";
import { toast } from "sonner";

const useMensaje = () => {
  const handleMensaje = (mensajePersonalizado, indexNum = 0) => {
    // Usa un mensaje por defecto si no se pasa ninguno
    const mensaje = mensajePersonalizado?.trim() || "Hola, Necesito ayuda.";

    if (mensaje === "") {
      toast.error("Por favor, escribe un mensaje antes de enviar.", {
        position: "bottom-right",
      });
      return;
    }

    toast.success("Mensaje enviado correctamente.", {
      position: "top-right",
    });

    // Espera un poco antes de abrir WhatsApp
    setTimeout(() => {
      const numero = botonWhatsapp.numeros[indexNum];
      if (!numero) {
        toast.error("No hay número de WhatsApp configurado.", {
          position: "bottom-right",
        });
        return;
      }

      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
    }, 1500);
  };

  return { handleMensaje };
};

export default useMensaje;
