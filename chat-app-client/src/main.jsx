import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./ui/theme/ThemeProvider.jsx";
import { ToastProvider } from "./ui/toast/ToastProvider.jsx";
import { IntroShell } from "./ui/IntroSplash.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <IntroShell>
          <App />
        </IntroShell>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
