import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useMabCalculus } from "../hooks/useMabCalculus";
import { todayLabel } from "../helpers/helpers";

export const MabCalculusHeader = () => {
  const { handleOpenCleanDialog } = useMabCalculus();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-lg font-bold text-card-foreground">
          Presupuesto de reparación
        </h2>

        <p className="text-xs text-muted-foreground">{todayLabel()}</p>
      </div>

      <Button
        onClick={handleOpenCleanDialog}
        variant="ghost"
        size="sm"
        className="h-8 text-xs text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" />
        Limpiar
      </Button>
    </div>
  );
};
