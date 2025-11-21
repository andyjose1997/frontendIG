import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 👈 importa o provider

// DESATIVADO NO LOCALHOST
if (window.location.hostname !== "localhost" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")

      .then(() => console.log("✅ Service Worker registrado com sucesso"))
      .catch((err) => console.error("❌ Erro ao registrar Service Worker:", err));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="337060969671-1s05i8dgi6bgilr7t2la0pq8vbnkimfa.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
