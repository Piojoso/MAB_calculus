import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, X } from "lucide-react";
import { CustomSummaryLine } from "@/components/custom/CustomSummaryLine";

import type { RepairPart, Row } from "../interfaces";
import { formatMoney } from "../helpers/helpers";

const ADD_NEW = "__add_new__";
const EMPTY_PART = "__empty__";

interface Props {
  rows: Row[];
  parts: RepairPart[];
  addDialogOpen: boolean;
  newPartName: string;
  newPartPrice: string;
  isEditing: boolean;

  handlePartSelect: (rowId: string, value: string) => void;
  updateRow: (id: string, patch: Partial<Row>) => void;
  removeRow: (id: string) => void;
  addRow: () => void;
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPartName: React.Dispatch<React.SetStateAction<string>>;
  setNewPartPrice: React.Dispatch<React.SetStateAction<string>>;
  handleAddNewPart: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MabRepairParts = (props: Props) => {
  const getPartPrice = useCallback(
    (row: Row) => formatMoney(row.price),
    [props.rows],
  );

  const getPartName = useCallback(
    (row: Row) => {
      if (!row.partId && props.rows.length === 1)
        return "Sin repuestos registrados.";

      return props.parts.find((part) => row.partId === part.id)?.name ?? "";
    },
    [props.rows],
  );

  const handleToggleIsEditing = () => {
    const lastPart = props.rows.at(props.rows.length - 1);

    if (lastPart?.partId === null) {
      props.removeRow(lastPart.id);
    }

    props.setIsEditing((prev) => !prev);
  };

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Repuestos
          </h3>
          <Button
            onClick={handleToggleIsEditing}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-primary"
          >
            <Pencil className="mr-1 h-3 w-3.5" />
            Editar
          </Button>
        </div>

        {!props.isEditing &&
          props.rows.map((row) => (
            <div key={row.id}>
              <CustomSummaryLine
                rightLabel={getPartPrice(row)}
                leftLabel={getPartName(row)}
              />
            </div>
          ))}

        {props.isEditing && (
          <div className="space-y-2">
            {props.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_7rem_auto] items-center gap-2"
              >
                <select
                  value={row.partId ?? EMPTY_PART}
                  onChange={(e) =>
                    props.handlePartSelect(row.id, e.target.value)
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={EMPTY_PART}>Seleccionar repuesto</option>
                  {props.parts.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name}
                    </option>
                  ))}
                  <option value={ADD_NEW}>+ Agregar nuevo repuesto</option>
                </select>

                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  value={row.price || ""}
                  onChange={(e) =>
                    props.updateRow(row.id, {
                      price: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Precio"
                  className="h-10 px-2 text-right text-sm"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive"
                  onClick={() => props.removeRow(row.id)}
                  aria-label="Eliminar repuesto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="secondary"
              size="sm"
              disabled={props.rows[props.rows.length - 1].partId === null}
              onClick={props.addRow}
              className="w-full"
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar repuesto
            </Button>
          </div>
        )}
      </section>

      <Dialog open={props.addDialogOpen} onOpenChange={props.setAddDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Agregar nuevo repuesto</DialogTitle>
            <DialogDescription>
              Se guardará en el catálogo para usarlo siempre.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <Label htmlFor="new-part-name" className="text-sm">
                Nombre
              </Label>
              <Input
                id="new-part-name"
                value={props.newPartName}
                onChange={(e) => props.setNewPartName(e.target.value)}
                placeholder="Ej: Compresor"
                className="mt-1 h-11"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="new-part-price" className="text-sm">
                Precio
              </Label>
              <Input
                id="new-part-price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                value={props.newPartPrice}
                onChange={(e) => props.setNewPartPrice(e.target.value)}
                placeholder="0"
                className="mt-1 h-11 text-right"
              />
            </div>
            <Button
              onClick={props.handleAddNewPart}
              disabled={
                !props.newPartName.trim() ||
                !Number.parseFloat(props.newPartPrice)
              }
              className="w-full"
            >
              Guardar repuesto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
