"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { getEnabledLayersCount } from "@/lib/utils";

export default function StackTemplateCard({ stack, onUse }) {
  const layersCount = getEnabledLayersCount(stack.stack);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-segundo border border-tercero/20 rounded-lg p-6 hover:border-tercero/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-tercero/10"
      onClick={() => onUse(stack)}
    >
      {/* Icon */}
      <div className="text-4xl mb-3">{stack.icon}</div>

      {/* Title */}
      <h3 className="text-lg font-bold text-tercero mb-2">{stack.name}</h3>

      {/* Description */}
      <p className="text-sm text-primero/70 mb-4 min-h-[40px]">
        {stack.description}
      </p>

      {/* Layers Count */}
      <div className="flex items-center justify-between pt-4 border-t border-tercero/10">
        <div className="flex items-center gap-2 text-primero/70 text-sm font-mono">
          <Layers className="w-4 h-4" />
          <span>{layersCount} layers</span>
        </div>
        <button className="text-tercero hover:text-tercero/50 font-mono text-sm font-semibold transition-colors">
          Usar Template →
        </button>
      </div>
    </motion.div>
  );
}
