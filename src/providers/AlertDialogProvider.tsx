import React, {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

/* Context */
export interface AlertDialogContext {
  isOpen: boolean;

  openDialog: (content: React.ReactNode) => void;
  closeDialog: () => void;
}

export const AlertDialogContext = createContext<AlertDialogContext | undefined>(
  undefined,
);

/* Provider */
export const AlertDialogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);

  const openDialog = (content: React.ReactNode) => {
    setDialogContent(content);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    // Limpiamos el contenido después de que termine la animación de cierre
    setTimeout(() => setDialogContent(null), 200);
  };

  return (
    <AlertDialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      {children}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        {dialogContent && (
          <AlertDialogContent>{dialogContent}</AlertDialogContent>
        )}
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

/* Hook */
export const useAlert = () => {
  const context = useContext(AlertDialogContext);

  if (!context)
    throw new Error("useAlert debe usarse dentro de un AlertDialogProvider");

  return context;
};
