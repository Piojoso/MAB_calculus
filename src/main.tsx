import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { MabCalculus } from "./modules/home/view/MabCalculus";
import { AlertDialogProvider } from "./providers/AlertDialogProvider";
import { Toaster } from "sonner";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertDialogProvider>
      <MabCalculus />
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "!border-2 !border-indigo-500 !space-x-4 !rounded-md !shadow-lg",
            icon: "!px-1 !text-indigo-500",
            title: "!font-bold !text-indigo-500",
          },
        }}
      />
    </AlertDialogProvider>
  </StrictMode>,
);
