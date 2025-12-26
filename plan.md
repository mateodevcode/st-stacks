# Stack Builder Pro - Prompt Completo

## 🎯 Objetivo

Crear una aplicación web full-stack para diseñar, guardar y gestionar stacks tecnológicos de proyectos con autenticación, drag-and-drop, y persistencia en MongoDB.

## 📋 Especificaciones Técnicas

### Stack Tecnológico Requerido

- **Framework**: Next.js 15+ (App Router)
- **Auth**: NextAuth.js v5
- **BD**: MongoDB Atlas
- **Estilos**: Tailwind CSS
- **UI Interactiva**: React DND (Drag and Drop)
- **Animaciones**: Framer Motion
- **Validación**: Zod
- **HTTP Client**: Axios o Fetch nativo
- **Iconos**: Lucide React

### Paleta de Colores

```
Primario: #00FF41 (Verde Hacking - Neon)
Secundario: #000000 (Negro Puro)
Acentos:
  - #1A1A1A (Gris oscuro)
  - #0D0D0D (Negro más oscuro)
  - #00DD38 (Verde más oscuro)
  - #FFD700 (Amarillo para alertas)
```

---

## 🏗️ Estructura de Base de Datos (MongoDB)

### Schema: Project

```javascript
{
  _id: ObjectId,
  userId: String, // ID del usuario autenticado
  projectName: String, // Nombre del proyecto
  description: String,
  stack: {
    frontend: {
      enabled: Boolean,
      technology: String, // ej: "Next.js"
      hosting: [String], // ["Vercel"]
      cost: String,
      notes: String
    },
    backend: {
      enabled: Boolean,
      technology: String,
      hosting: [String],
      cost: String,
      notes: String
    },
    api: {
      enabled: Boolean,
      technology: String,
      hosting: [String],
      cost: String,
      notes: String
    },
    database: {
      enabled: Boolean,
      technology: String,
      hosting: [String],
      cost: String,
      storage: String,
      notes: String
    },
    realtime: {
      enabled: Boolean,
      technology: String,
      hosting: [String],
      cost: String,
      notes: String
    },
    storage: {
      enabled: Boolean,
      technology: String,
      hosting: [String],
      cost: String,
      notes: String
    },
    auth: {
      enabled: Boolean,
      technology: String,
      hosting: [String],
      cost: String,
      notes: String
    }
  },
  createdAt: Date,
  updatedAt: Date,
  template: String // "custom", "landing", "pwa", "ecommerce", etc.
}
```

---

## 📱 Páginas y Componentes

### 1. **/auth/signin** - Login

- Formulario simple (email/password)
- NextAuth con proveedor de credenciales (o GitHub/Google)
- Estilos dark/hacking
- Redirige a /dashboard si está autenticado

### 2. **/dashboard** - Página Principal

**Layout:**

- **Header**: Logo, usuario logueado, botón logout
- **Sección Superior (60% alto)**: "Mis Proyectos"
  - Grid de tarjetas con proyectos guardados
  - Cada tarjeta muestra: nombre, fecha, stack resumido, botones (editar, eliminar, duplicar)
  - Botón "Crear Nuevo Proyecto" (grande, destacado)
- **Sección Inferior (40% alto)**: "Stacks Predefinidos"
  - Carrusel/grid de stacks predefinidos (plantillas)
  - Cada plantilla muestra: ícono, nombre, descripción, botón "Usar esta plantilla"

### 3. **/builder/[id]** - Stack Builder

**Layout:**

- **Header**: Nombre del proyecto (editable), botón guardar, botón descartar
- **Sidebar Izquierdo** (25%): Lista de capas (Frontend, Backend, API, DB, Realtime, Storage, Auth)
  - Toggle para habilitar/deshabilitar capa
  - Cada capa muestra qué tecnología está seleccionada (si hay)
- **Área Principal** (75%):
  - **Sección Activa**: Muestra las capas habilitadas en grid drag-and-drop
  - Cada tecnología es una tarjeta arrastrableque muestra:
    - Nombre de la tecnología
    - Hosting options
    - Costo
    - Botón eliminar (X)
  - Botón "+ Agregar Tecnología" para cada capa
- **Panel Desplegable Derecho**:
  - Resumen del stack completo
  - Cálculo automático de costo total
  - Preview JSON del stack

### 4. **/builder/[id]/select-tech** - Modal para seleccionar tecnologías

- Modal grande con grid de tecnologías por capa
- Búsqueda/filtro
- Cada tech muestra detalles (hosting, costo, descripción)
- Click = agregar al stack y cerrar modal

---

## 🎮 Interactividad y Comportamiento

### Drag and Drop

- Las tarjetas de tecnología deben ser **arrastrables** dentro del área del builder
- Posibilidad de **reordenar** dentro de la misma capa
- Posibilidad de **mover** entre capas (opcional, avanzado)
- Visual feedback durante el arrastre (sombra, opacity, highlight de zona de drop)

### Acciones Principales

**En Dashboard:**

- Click en proyecto → abre `/builder/[projectId]`
- Click "Crear Nuevo" → crea proyecto vacío y abre builder
- Click "Usar Plantilla" → copia la plantilla y abre builder
- Click eliminar → confirma y elimina
- Click duplicar → crea copia del proyecto

**En Builder:**

- Toggle capa → habilita/deshabilita esa sección
- Click "Agregar Tech" → abre modal de selección
- Arrastra → reordena tecnologías
- Click X en tech → elimina
- Click "Guardar" → valida, envía a MongoDB, resetea UI, redirige a dashboard
- Click "Descartar" → confirma y vuelve a dashboard sin guardar

### Estados Visuales

- **Cargando**: Skeleton loaders
- **Error**: Toast notifications (rojo/amarillo)
- **Éxito**: Toast notifications (verde)
- **Validación**: Campos con errores destacados en rojo

---

## 🗂️ Mock Data (Local)

```javascript
// lib/mockTechnologies.ts
export const TECHNOLOGIES = {
  frontend: [
    {
      name: 'Vite + React',
      hosting: ['Vercel', 'Netlify'],
      cost: 'Gratis',
      build: '~2 min',
      description: 'Rápido, moderno, ideal MVPs'
    },
    {
      name: 'Next.js',
      hosting: ['Vercel'],
      cost: 'Gratis',
      build: '~3 min',
      description: 'Full-stack, SSR, excelente para SEO'
    },
    // ... más tecnologías
  ],
  backend: [
    // ...
  ],
  // ... más capas
};

export const PREDEFINED_STACKS = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Sitio informativo rápido y optimizado',
    icon: '📄',
    stack: {
      frontend: { enabled: true, technology: 'Astro', ... },
      backend: { enabled: false },
      // ...
    }
  },
  // ... más stacks
];
```

---

## 🔐 Autenticación (NextAuth.js)

```javascript
// auth.ts - Configuración básica
- Proveedor: CredentialsProvider (email/password)
- O: GitHub/Google OAuth
- Guardar usuario en MongoDB
- JWT para sesiones
- Proteger rutas: /dashboard, /builder/* requieren autenticación
- Middleware para redirigir no autenticados a /auth/signin
```

---

## 📡 API Routes Requeridas

```
GET    /api/projects              - Listar proyectos del usuario
POST   /api/projects              - Crear nuevo proyecto
GET    /api/projects/[id]         - Obtener proyecto específico
PUT    /api/projects/[id]         - Actualizar proyecto
DELETE /api/projects/[id]         - Eliminar proyecto
POST   /api/projects/[id]/duplicate - Duplicar proyecto
GET    /api/technologies          - Listar todas las tecnologías (mock)
GET    /api/stacks/predefined     - Listar stacks predefinidos (mock)
```

---

## ✨ Detalles de Diseño y UX

### Colores en Tailwind

```css
/* Agregar a tailwind.config.ts */
colors: {
  'hacker-green': '#00FF41',
  'hacker-dark': '#000000',
  'hacker-gray': '#1A1A1A',
  'hacker-darker': '#0D0D0D',
  'hacker-light-green': '#00DD38',
}
```

### Animaciones

- Entrada de página: fade-in + slide-in
- Tarjetas: hover lift + glow verde
- Arrastre: smooth transform
- Toasts: slide-in from top
- Modal: fade + scale

### Tipografía

- Headings: Font bold, verde neon
- Body: Gris claro sobre negro
- Monospace para código/json

### Espaciado

- Generoso pero compacto
- Mucho padding en tarjetas
- Gap consistente entre elementos

---

## 🚀 Flujo Completo de Usuario

1. Usuario accede a `/auth/signin` (si no está autenticado)
2. Se loguea → redirige a `/dashboard`
3. Ve sus proyectos guardados arriba
4. Ve stacks predefinidos abajo
5. Click "Crear Nuevo" o "Usar Plantilla"
6. Abre `/builder/[id]` con editor visual
7. Habilita capas, selecciona tecnologías, arrastra para ordenar
8. Click "Guardar" → valida → envía a MongoDB → resetea → vuelve a dashboard
9. Nuevo proyecto aparece en la lista "Mis Proyectos"

---

## 📦 Dependencias NPM

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "next-auth": "^5.0.0",
  "mongodb": "^6.0.0",
  "mongoose": "^8.0.0",
  "tailwindcss": "^3.4.0",
  "react-beautiful-dnd": "^13.1.1",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.263.1",
  "zod": "^3.22.0",
  "axios": "^1.6.0"
}
```

---

## ✅ Checklist de Implementación

- [ ] Estructura de carpetas Next.js (app router)
- [ ] Conexión a MongoDB
- [ ] Esquema Mongoose para Project
- [ ] Autenticación NextAuth.js
- [ ] Página de login
- [ ] Dashboard con grid de proyectos + stacks
- [ ] Página builder con drag-and-drop
- [ ] API routes CRUD
- [ ] Modal de selección de tecnologías
- [ ] Validación con Zod
- [ ] Toasts de éxito/error
- [ ] Responsive design (mobile-friendly)
- [ ] Animaciones Framer Motion
- [ ] Deploy (Vercel)

---

## 🎨 Inspiración Visual

- Estética hackerscene (Matrix-like)
- Neon green on pure black
- Glowing effects en hover
- Código/JSON visible en lugares estratégicos
- Tipografía monospace en detalles técnicos
