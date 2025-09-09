// src/config.js

const ambiente = "local";  // "local" ou "prod"

// Backend
export const URL =
    ambiente === "local"
        ? "http://localhost:8899"
        : "https://backendig-2.onrender.com";

// Frontend
export const FRONT_URL =
    ambiente === "local"
        ? "http://localhost:5173"
        : "https://irongoals.vercel.app";
