"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Rocket } from "lucide-react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import StackTemplateCard from "@/components/StackTemplateCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Toast from "@/components/Toast";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [predefinedStacks, setPredefinedStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, stacksRes] = await Promise.all([
        axios.get("/api/projects"),
        axios.get("/api/stacks/predefined"),
      ]);
      setProjects(projectsRes.data.projects);
      setPredefinedStacks(stacksRes.data.stacks);
    } catch (error) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleCreateNew = async () => {
    try {
      const res = await axios.post("/api/projects", {
        projectName: "Nuevo Proyecto",
        description: "",
        stack: {},
        template: "custom",
      });
      router.push(`/builder/${res.data.project._id}`);
    } catch (error) {
      showToast("Failed to create project", "error");
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      const res = await axios.post("/api/projects", {
        projectName: template.name,
        description: template.description,
        stack: template.stack,
        template: template.id,
      });
      router.push(`/builder/${res.data.project._id}`);
    } catch (error) {
      showToast("Failed to create project from template", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      showToast("Project deleted successfully");
    } catch (error) {
      showToast("Failed to delete project", "error");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await axios.post(`/api/projects/${id}/duplicate`);
      setProjects([res.data.project, ...projects]);
      showToast("Project duplicated successfully");
    } catch (error) {
      showToast("Failed to duplicate project", "error");
    }
  };

  return (
    <div className="min-h-screen bg-segundo">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* My Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-tercero mb-1">
                Mis Proyectos
              </h2>
              <p className="text-gray-500 font-mono text-sm">
                {projects.length} proyecto{projects.length !== 1 ? "s" : ""}{" "}
                total
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-segundo text-tercero font-semibold px-6 py-3 rounded-lg hover:bg-tercero/10 transition-all hover:shadow-lg hover:shadow-tercero/10"
            >
              <Plus className="w-5 h-5" />
              Crear nuevo proyecto
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton count={3} />
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-segundo border border-tercero/20 rounded-lg"
            >
              <Rocket className="w-16 h-16 text-tercero/50 mx-auto mb-4" />
              <h3 className="text-xl text-tercero mb-2">No projects yet</h3>
              <p className="text-primero/70 mb-6">
                Create your first project or use a template below
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-segundo text-tercero font-semibold px-6 py-3 rounded-lg hover:bg-tercero/10 transition-all"
              >
                Empezar
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </section>

        {/* Predefined Stacks Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-tercero mb-1">
              Stacks Predefinidos
            </h2>
            <p className="text-primero/70 font-mono text-sm">
              Comienza con un template y personaliza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {predefinedStacks.map((stack) => (
              <StackTemplateCard
                key={stack.id}
                stack={stack}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        </section>
      </main>

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
