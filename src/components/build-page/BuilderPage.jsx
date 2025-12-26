"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Save,
  X,
  Plus,
  Code,
  Layers,
  DollarSign,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Header from "@/components/Header";
import TechnologyCard from "@/components/TechnologyCard";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { calculateTotalCost } from "@/lib/utils";
import { TECHNOLOGIES } from "@/lib/mockData";
import axios from "axios";

const LAYER_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  api: "API",
  database: "Database",
  realtime: "Real-time",
  storage: "Storage",
  auth: "Authentication",
};

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showTechModal, setShowTechModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [projectName, setProjectName] = useState("");

  // DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${params.id}`);
      setProject(res.data.project);
      setProjectName(res.data.project.projectName);
    } catch (error) {
      showToast("Failed to load project", "error");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const toggleLayer = (layerKey) => {
    setProject({
      ...project,
      stack: {
        ...project.stack,
        [layerKey]: {
          ...project.stack[layerKey],
          enabled: !project.stack[layerKey]?.enabled,
        },
      },
    });
  };

  const openTechModal = (layerKey) => {
    setSelectedLayer(layerKey);
    setShowTechModal(true);
  };

  const selectTechnology = (tech) => {
    setProject({
      ...project,
      stack: {
        ...project.stack,
        [selectedLayer]: {
          enabled: true,
          technology: tech.name,
          hosting: tech.hosting || [],
          cost: tech.cost || "Gratis",
          storage: tech.storage || "",
          notes: tech.description || "",
        },
      },
    });
    setShowTechModal(false);
    showToast(`${tech.name} added to ${LAYER_LABELS[selectedLayer]}`);
  };

  const removeLayer = (layerKey) => {
    setProject({
      ...project,
      stack: {
        ...project.stack,
        [layerKey]: {
          enabled: false,
          technology: "",
          hosting: [],
          cost: "Gratis",
          notes: "",
        },
      },
    });
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      showToast("Project name is required", "error");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/api/projects/${params.id}`, {
        projectName,
        description: project.description,
        stack: project.stack,
        template: project.template,
      });
      showToast("Project saved successfully");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      showToast("Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm("Discard changes and return to dashboard?")) {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-segundo flex items-center justify-center">
        <div className="text-tercero font-mono">cargando proyectos...</div>
      </div>
    );
  }

  const enabledLayers = Object.entries(project.stack).filter(
    ([_, layer]) => layer.enabled
  );

  return (
    <div className="min-h-screen bg-segundo">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Top Bar */}
        <div className="bg-segundo border border-tercero/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 bg-segundo border border-tercero/20 rounded px-4 py-2 text-sexto focus:outline-none focus:border-tercero/50 transition-colors font-semibold text-lg"
              placeholder="Project Name"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 bg-segundo hover:bg-tercero/10 text-tercero px-4 py-2 rounded border border-tercero/20 hover:border-tercero/50 transition-all font-mono text-sm"
              >
                <Code className="w-4 h-4" />
                {showPreview ? "Ocultar JSON" : "Mostrar JSON"}
              </button>
              <button
                onClick={handleDiscard}
                className="flex items-center gap-2 bg-segundo hover:bg-red-900/20 text-tercero hover:text-red-400 px-4 py-2 rounded border border-tercero/20 hover:border-red-500/50 transition-all font-mono text-sm"
              >
                <X className="w-4 h-4" />
                Descartar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-segundo text-tercero font-bold px-6 py-2 rounded hover:bg-tercero/10 transition-all disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Layers */}
          <div className="lg:col-span-1">
            <div className="bg-segundo border border-tercero/20 rounded-lg p-4 sticky top-24">
              <h3 className="text-tercero font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Stack Layers
              </h3>
              <div className="space-y-2">
                {Object.entries(LAYER_LABELS).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-segundo rounded border border-tercero/20 hover:border-tercero/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-mono text-tercero">{label}</p>
                      {project.stack[key]?.technology && (
                        <p className="text-xs text-primero truncate">
                          {project.stack[key].technology}
                        </p>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={project.stack[key]?.enabled || false}
                        onChange={() => toggleLayer(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-tercero/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-tercero after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tercero after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tercero peer-checked:after:bg-cuarto"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="mt-6 pt-4 border-t border-tercero/20">
                <div className="flex items-center gap-2 text-tercero mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-mono text-sm font-semibold">
                    Total Cost
                  </span>
                </div>
                <p className="text-xs text-primero/70 font-mono">
                  {calculateTotalCost(project.stack)}
                </p>
              </div>
            </div>
          </div>

          {/* Main Area - Technologies */}
          <div className="lg:col-span-3">
            {enabledLayers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-segundo border border-tercero/20 rounded-lg p-12 text-center"
              >
                <Layers className="w-16 h-16 text-tercero/50 mx-auto mb-4" />
                <h3 className="text-xl text-tercero mb-2">No layers enabled</h3>
                <p className="text-xs text-primero/70">
                  Enable layers from the sidebar to start building your stack
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {enabledLayers.map(([layerKey, layer]) => (
                  <div
                    key={layerKey}
                    className="bg-segundo border border-tercero/20 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-tercero">
                        {LAYER_LABELS[layerKey]}
                      </h3>
                      {!layer.technology && (
                        <button
                          onClick={() => openTechModal(layerKey)}
                          className="flex items-center gap-2 bg-tercero text-segundo font-bold px-4 py-2 rounded hover:bg-tercero/80 transition-all text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Technology
                        </button>
                      )}
                    </div>

                    {layer.technology ? (
                      <TechnologyCard
                        tech={layer}
                        onRemove={() => removeLayer(layerKey)}
                        id={layerKey}
                      />
                    ) : (
                      <p className="text-primero/70 text-sm font-mono">
                        No technology selected
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* JSON Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-segundo border border-tercero/20 rounded-lg p-6"
          >
            <h3 className="text-tercero font-bold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Stack Configuración (JSON)
            </h3>
            <pre className="bg-segundo p-4 rounded overflow-x-auto text-xs text-tercero font-mono">
              {JSON.stringify(project.stack, null, 2)}
            </pre>
          </motion.div>
        )}
      </main>

      {/* Technology Selection Modal */}
      <Modal
        isOpen={showTechModal}
        onClose={() => setShowTechModal(false)}
        title={`Select Technology for ${
          selectedLayer ? LAYER_LABELS[selectedLayer] : ""
        }`}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedLayer &&
            TECHNOLOGIES[selectedLayer]?.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => selectTechnology(tech)}
                className="bg-segundo border border-tercero/20 rounded-lg p-4 hover:border-tercero/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-tercero/10"
              >
                <h4 className="text-tercero font-bold mb-2">{tech.name}</h4>
                <p className="text-xs text-primero/70 mb-3">
                  {tech.description}
                </p>
                <div className="space-y-2">
                  {tech.hosting && tech.hosting.length > 0 && (
                    <div>
                      <p className="text-xs text-primero/70 font-mono mb-1">
                        Hosting:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tech.hosting.map((host, i) => (
                          <span
                            key={i}
                            className="text-xs text-primero px-2 py-1 rounded font-mono"
                          >
                            {host}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-primero/70 font-mono">
                    Cost: <span className="text-tercero">{tech.cost}</span>
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </Modal>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
