import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { MabCalculus } from "./modules/home/view/MabCalculus";
import { AlertDialogProvider } from "./providers/AlertDialogProvider";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertDialogProvider>
      <MabCalculus />
    </AlertDialogProvider>
  </StrictMode>,
);
