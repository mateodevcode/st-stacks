"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-segundo/90 border-tercero/50 text-tercero",
    error: "bg-red-900/90 border-red-500/50 text-red-400",
    warning: "bg-yellow-900/90 border-yellow-500/50 text-yellow-400",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-4 left-1/2 z-100 min-w-[300px] max-w-md"
        >
          <div
            className={`${colors[type]} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              {icons[type]}
              <p className="flex-1 font-mono text-sm">{message}</p>
              <button
                onClick={onClose}
                className="text-current hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
