import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useMabCalculus } from "../hooks/useMabCalculus";

export const CleanDialog = () => {
  const { handleClean, setCleanDialogOpen } = useMabCalculus();

  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Limpiar la operación?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borrarán los repuestos, la mano de obra y el pago por adelantado.
            El catálogo de repuestos se mantiene.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCleanDialogOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClean}
            className="bg-destructive text-destructive-foreground"
          >
            Limpiar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
};
