import mongoose from "mongoose";

const LayerSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    technology: {
      type: String,
      default: "",
    },
    hosting: {
      type: [String],
      default: [],
    },
    cost: {
      type: String,
      default: "Gratis",
    },
    storage: String,
    notes: String,
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    stack: {
      frontend: {
        type: LayerSchema,
        default: () => ({}),
      },
      backend: {
        type: LayerSchema,
        default: () => ({}),
      },
      api: {
        type: LayerSchema,
        default: () => ({}),
      },
      database: {
        type: LayerSchema,
        default: () => ({}),
      },
      realtime: {
        type: LayerSchema,
        default: () => ({}),
      },
      storage: {
        type: LayerSchema,
        default: () => ({}),
      },
      auth: {
        type: LayerSchema,
        default: () => ({}),
      },
    },
    template: {
      type: String,
      default: "custom",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProjectSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
