// Equipment service configuration
export const EQUIPMENT_SERVICE_URL =
  import.meta.env.VITE_EQUIPMENT_SERVICE_URL ||
  "http://localhost:3000/api/equipment";

// Auth service configuration
export const AUTH_SERVICE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8080/api/auth";

// Borrow service configuration
export const BORROW_SERVICE_URL =
  import.meta.env.VITE_BORROW_SERVICE_URL || "http://localhost:3010/api/v1";
