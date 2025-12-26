"use client";

import { motion } from "framer-motion";
import { Calendar, Edit, Trash2, Copy, Layers } from "lucide-react";
import { formatDate, getStackSummary, truncate } from "@/lib/utils";
import Link from "next/link";

export default function ProjectCard({ project, onDelete, onDuplicate }) {
  const stackSummary = getStackSummary(project.stack);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-segundo border border-tercero/20 rounded-lg p-6 hover:border-tercero/50 transition-all hover:shadow-lg hover:shadow-tercero/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-tercero mb-1">
            {project.projectName}
          </h3>
          <p className="text-xs text-primero/70 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(project.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-1 text-tercero/70">
          <Layers className="w-4 h-4" />
          <span className="text-sm font-mono">{stackSummary.length}</span>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-primero/70 mb-4">
          {truncate(project.description, 80)}
        </p>
      )}

      {/* Stack Summary */}
      <div className="mb-4 space-y-1">
        {stackSummary.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="text-xs font-mono text-primero/70 flex items-center gap-2"
          >
            <span className="text-tercero">▸</span>
            <span className="capitalize">{item.type}:</span>
            <span className="text-tercero/80">{item.tech}</span>
          </div>
        ))}
        {stackSummary.length > 3 && (
          <p className="text-xs text-primero/70 font-mono">
            +{stackSummary.length - 3} más...
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-tercero/10">
        <Link
          href={`/builder/${project._id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-segundo text-tercero font-bold py-2 px-4 rounded hover:bg-tercero/10 transition-colors text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
        <button
          onClick={() => onDuplicate(project._id)}
          className="bg-segundo hover:bg-tercero/10 text-tercero p-2 rounded border border-tercero/20 hover:border-tercero/50 transition-all"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="bg-tercero/10 hover:bg-red-900/20 text-tercero hover:text-red-400 p-2 rounded border border-tercero/20 hover:border-red-500/50 transition-all"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
