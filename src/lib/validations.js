import { z } from "zod";

// Layer schema for stack components
const LayerSchema = z.object({
  enabled: z.boolean().default(false),
  technology: z.string().default(""),
  hosting: z.array(z.string()).default([]),
  cost: z.string().default("Gratis"),
  storage: z.string().optional(),
  notes: z.string().optional(),
});

// Project validation schema
export const ProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  stack: z.object({
    frontend: LayerSchema,
    backend: LayerSchema,
    api: LayerSchema,
    database: LayerSchema,
    realtime: LayerSchema,
    storage: LayerSchema,
    auth: LayerSchema,
  }),
  template: z.string().default("custom"),
});

// Login validation schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Signup validation schema
export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
