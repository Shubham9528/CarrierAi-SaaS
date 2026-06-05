import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const server = import.meta.env.VITE_SERVER_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AppProvider>
  </StrictMode>
);
