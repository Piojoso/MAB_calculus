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
import { Plus, X } from "lucide-react";

import { useMabCalculus } from "../hooks/useMabCalculus";

const ADD_NEW = "__add_new__";
const EMPTY_PART = "__empty__";

export const RepairParts = () => {
  const {
    // State
    rows,
    parts,

    // Actions
    handlePartSelect,
    updateRow,
    removeRow,
    addRow,

    addDialogOpen,
    setAddDialogOpen,
    newPartName,
    setNewPartName,
    newPartPrice,
    setNewPartPrice,
    handleAddPart,
  } = useMabCalculus();

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Repuestos
          </h3>
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_7rem_auto] items-center gap-2"
            >
              <select
                value={row.partId ?? EMPTY_PART}
                onChange={(e) => handlePartSelect(row.id, e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value={EMPTY_PART}>Seleccionar repuesto</option>
                {parts.map((part) => (
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
                  updateRow(row.id, {
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
                onClick={() => removeRow(row.id)}
                aria-label="Eliminar repuesto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={addRow}
          className="w-full"
        >
          <Plus className="mr-1 h-4 w-4" />
          Agregar repuesto
        </Button>
      </section>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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
                value={newPartName}
                onChange={(e) => setNewPartName(e.target.value)}
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
                value={newPartPrice}
                onChange={(e) => setNewPartPrice(e.target.value)}
                placeholder="0"
                className="mt-1 h-11 text-right"
              />
            </div>
            <Button
              onClick={handleAddPart}
              disabled={!newPartName.trim() || !Number.parseFloat(newPartPrice)}
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
