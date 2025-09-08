// src/config.js

// 🔹 Troque apenas uma letra aqui para alternar entre local e produção
const ambiente = "local";  // use "local" ou "prod"

// Backend
export const URL =
    ambiente === "loal"
        ? "http://localhost:8899"
        : "https://backendig-2.onrender.com";

// Frontend
export const FRONT_URL =
    ambiente === "local"
        ? "http://localhost:5173"
        : "https://irongoals.vercel.app";  // coloque aqui o link real do seu frontend no Vercel
