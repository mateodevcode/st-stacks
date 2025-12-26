/** @type {import('next').NextConfig} */
import packageJson from "./package.json" with { type: "json" };

const nextConfig = {
  // Otras opciones de configuración...

  // Exponer variables públicas (disponibles en cliente y servidor)
  env: {
    NEXT_PUBLIC_APP_NAME: packageJson.name,
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default nextConfig;
