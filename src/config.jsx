// 📂 src/config.js

// Detecta se está rodando local ou produção
const isLocalhost = window.location.hostname === "localhost";

// Backend
export const URL = isLocalhost
    ? "http://localhost:8899"
    : "https://backendig-2.onrender.com";

// Frontend
export const FRONT_URL = isLocalhost
    ? "http://localhost:5173"
    : "https://irongoals.com";
