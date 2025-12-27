// hooks/useProjects.js
import { apiServer } from "@/app/actions/apiServer";
import { AppContext } from "@/context/AppContext";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { LAYER_LABELS } from "@/data/layer.labels";

const useProjects = () => {
  const { projects, setProjects, setFormDataProject, setPredefinedStacks } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [showTechModal, setShowTechModal] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const params = useParams();

  const handleCreateNew = async () => {
    try {
      const res = await apiServer("/api/projects", "POST", {
        projectName: "Nuevo Proyecto",
        description: "",
        stack: {},
        template: "custom",
      });
      router.push(`/builder/${res.data._id}`);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }
  };

  const fetchData = async () => {
    try {
      const [projectsRes, stacksRes] = await Promise.all([
        apiServer("/api/projects", "GET"),
        apiServer("/api/stacks/predefined", "GET"),
      ]);
      setProjects(projectsRes.data);
      setPredefinedStacks(stacksRes.data);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { success, message } = await apiServer(
        `/api/projects/${id}`,
        "DELETE"
      );
      if (success) {
        setProjects(projects.filter((p) => p._id !== id));
        toast.success(message, {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      const res = await apiServer("/api/projects", "POST", {
        projectName: template.name,
        description: template.description,
        stack: template.stack,
        template: template.id,
      });
      router.push(`/builder/${res.data._id}`);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const { success, message, data } = await apiServer(
        `/api/projects/${id}/duplicate`,
        "POST"
      );
      setProjects([data.project, ...projects]);
      toast.success(message, {
        position: "top-right",
      });
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }
  };

  const fetchProject = async () => {
    try {
      const { data } = await apiServer(`/api/projects/${params.id}`, "GET");
      setProject(data);
      setProjectName(data.projectName);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast.error("El nombre del proyecto es requerido", {
        position: "bottom-right",
      });
      return;
    }

    setLoading(true);
    try {
      await apiServer(`/api/projects/${params.id}`, "PUT", {
        projectName,
        description: project.description,
        stack: project.stack,
        template: project.template,
      });
      toast.success("Proyecto guardado exitosamente", {
        position: "top-right",
      });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
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
    toast.success(`${tech.name} added to ${LAYER_LABELS[selectedLayer]}`);
  };

  const handleDiscard = () => {
    if (confirm("Discard changes and return to dashboard?")) {
      router.push("/dashboard");
    }
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

  const openTechModal = (layerKey) => {
    setSelectedLayer(layerKey);
    setShowTechModal(true);
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

  return {
    handleChange,
    loading,
    handleCreateNew,
    fetchData,
    handleDelete,
    handleUseTemplate,
    handleDuplicate,
    fetchProject,
    project,
    projectName,
    setProject,
    setProjectName,
    setLoading,
    handleSave,
    showTechModal,
    setShowTechModal,
    selectTechnology,
    selectedLayer,
    setSelectedLayer,
    handleDiscard,
    removeLayer,
    openTechModal,
    toggleLayer,
  };
};
export default useProjects;
