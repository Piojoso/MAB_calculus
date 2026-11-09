import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface CleanDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const CleanDialog = ({ onConfirm, onCancel }: CleanDialogProps) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Limpiar la operación?</AlertDialogTitle>
        <AlertDialogDescription>
          Se borrarán los repuestos, la mano de obra y el pago por adelantado.
          El catálogo de repuestos se mantiene.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground"
          onClick={onConfirm}
        >
          Limpiar
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};
