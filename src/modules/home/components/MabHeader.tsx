import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  isTakingPicture: boolean;
  quoteDate: string;

  handleOpenCleanDialog: () => void;
}

export const MabCalculusHeader = ({
  isTakingPicture,
  quoteDate,

  handleOpenCleanDialog,
}: Props) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-lg font-bold text-card-foreground">
          Presupuesto de reparación
        </h2>

        <p className="text-xs text-muted-foreground">{quoteDate}</p>
      </div>

      {!isTakingPicture && (
        <Button
          onClick={handleOpenCleanDialog}
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Limpiar
        </Button>
      )}
    </div>
  );
};
