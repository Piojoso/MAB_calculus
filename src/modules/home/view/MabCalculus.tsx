import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMabCalculus } from "../hooks/useMabCalculus";

import { X, Plus, Share2, Trash2 } from "lucide-react";
import { formatMoney } from "../helpers/helpers";

const ADD_NEW = "__add_new__";
const EMPTY_PART = "__empty__";

export const MabCalculus = () => {
  const {
    // Props
    loading,
    rows,
    receiptRef,
    parts,
    partsSubtotal,
    advance,
    balance,
    labor,
    total,
    addDialogOpen,
    newPartName,
    newPartPrice,
    handleAddPart,

    // Actions
    handlePartSelect,
    todayLabel,
    updateRow,
    removeRow,
    addRow,
    setAdvance,
    setLabor,
    setAddDialogOpen,
    setNewPartName,
    setNewPartPrice,
    handleShare,
    handleOpenCleanDialog,
  } = useMabCalculus();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-sm text-muted-foreground">Cargando…</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 pb-32">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-lg font-semibold text-foreground">M A B</h1>
          <p className="text-xs text-muted-foreground">
            Calculadora de reparación
          </p>
        </div>

        <div ref={receiptRef} className="rounded-2xl bg-card p-5 shadow-lg">
          <div className="mb-4 flex items-start justify-between border-b border-border pb-3">
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

          <div className="mt-5 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total repuestos</span>
              <span className="font-medium text-foreground">
                {formatMoney(partsSubtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pago por adelantado</span>
              <span className="font-medium text-foreground">
                − {formatMoney(advance)}
              </span>
            </div>

            <div className="border-t border-dashed border-border pt-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">Saldo</span>
                <span className="font-semibold text-foreground">
                  {formatMoney(balance)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mano de obra</span>
              <span className="font-medium text-foreground">
                + {formatMoney(labor)}
              </span>
            </div>

            <div className="border-t-2 border-primary pt-3">
              <div className="flex justify-between">
                <span className="text-base font-bold text-primary">
                  TOTAL A PAGAR
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs for labor and advance live outside the receipt so they don't show on the screenshot. */}
        <div className="mt-5 space-y-4 rounded-xl bg-card p-4 shadow-sm">
          <div>
            <Label htmlFor="advance" className="text-sm text-muted-foreground">
              Pago por adelantado
            </Label>
            <Input
              id="advance"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              value={advance || ""}
              onChange={(e) =>
                setAdvance(Number.parseFloat(e.target.value) || 0)
              }
              placeholder="0"
              className="mt-1 h-11 text-right text-base"
            />
          </div>

          <div>
            <Label htmlFor="labor" className="text-sm text-muted-foreground">
              Mano de obra
            </Label>
            <Input
              id="labor"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              value={labor || ""}
              onChange={(e) => setLabor(Number.parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="mt-1 h-11 text-right text-base"
            />
          </div>
        </div>
      </div>

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

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 p-4 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md">
          <Button size="lg" className="w-full" onClick={handleShare}>
            <Share2 className="mr-2 h-5 w-5" />
            Enviar presupuesto
          </Button>
        </div>
      </div>
    </main>
  );
};
