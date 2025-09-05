import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 👈 importa o provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="337060969671-1s05i8dgi6bgilr7t2la0pq8vbnkimfa.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>

);
