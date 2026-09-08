import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { SavedProvider } from "./context/SavedContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SavedProvider>
      <App />
    </SavedProvider>
  </StrictMode>
);