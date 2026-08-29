import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MabCalculus } from "./modules/home/view/MabCalculus";
import { AlertDialogProvider } from "./providers/AlertDialogProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertDialogProvider>
      <MabCalculus />
    </AlertDialogProvider>
  </StrictMode>,
);
