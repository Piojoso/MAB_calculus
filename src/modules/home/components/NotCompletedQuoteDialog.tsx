import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  emptyItems?: string[];

  onConfirm: () => void;
  onCancel: () => void;
}

export const NotCompletedQuoteDialog = ({
  emptyItems,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          La Proforma no se encuentra completa. <br /> ¿Desea continuar?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Detectamos que hay información en la factura faltante:
        </AlertDialogDescription>
        <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-muted-foreground">
          {emptyItems?.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="bg-primary text-primary-foreground"
          onClick={onConfirm}
        >
          Continuar
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};
