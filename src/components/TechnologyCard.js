"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { motion } from "framer-motion";

export default function TechnologyCard({ tech, onRemove, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-segundo border border-tercero/30 rounded-lg p-4 ${
        isDragging ? "shadow-lg shadow-tercero/20" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-primero/70 hover:text-tercero cursor-grab active:cursor-grabbing mt-1"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-primero font-bold mb-2">{tech.technology}</h4>

          {tech.hosting && tech.hosting.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-primero/70 font-mono mb-1">Hosting:</p>
              <div className="flex flex-wrap gap-1">
                {tech.hosting.map((host, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-segundo text-tercero/80 px-2 py-1 rounded font-mono"
                  >
                    {host}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tech.cost && (
            <p className="text-xs text-primero/70 font-mono">
              Cost: <span className="text-tercero">{tech.cost}</span>
            </p>
          )}

          {tech.notes && (
            <p className="text-xs text-primero/70 mt-2 italic">{tech.notes}</p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="text-primero/70 hover:text-red-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
