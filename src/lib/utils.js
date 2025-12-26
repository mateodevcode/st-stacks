/**
 * Calculate total cost estimate from stack
 */
export function calculateTotalCost(stack) {
  const costs = [];

  Object.values(stack).forEach((layer) => {
    if (layer.enabled && layer.cost) {
      costs.push(layer.cost);
    }
  });

  // Check if all are free
  const allFree = costs.every(
    (cost) =>
      cost.toLowerCase().includes("gratis") ||
      cost.toLowerCase().includes("free") ||
      cost.toLowerCase().includes("incluido")
  );

  if (allFree) {
    return "Gratis (Tier gratuito)";
  }

  return "Variable (revisar costos individuales)";
}

/**
 * Get enabled layers count
 */
export function getEnabledLayersCount(stack) {
  return Object.values(stack).filter((layer) => layer.enabled).length;
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get stack summary for display
 */
export function getStackSummary(stack) {
  const enabled = Object.entries(stack)
    .filter(([_, layer]) => layer.enabled)
    .map(([key, layer]) => ({
      type: key,
      tech: layer.technology || "No configurado",
    }));

  return enabled;
}

/**
 * Truncate text
 */
export function truncate(text, length = 100) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}
