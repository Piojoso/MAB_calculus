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

import { Share2 } from "lucide-react";
import { formatMoney } from "../helpers/helpers";
import { MabCalculusHeader } from "../components/MabCalculusHeader";
import { RepairParts } from "../components/RepairParts";
import { ClientData } from "../components/ClientData";

export const MabCalculus = () => {
  const {
    // Props
    loading,
    receiptRef,
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
    setAdvance,
    setLabor,
    setAddDialogOpen,
    setNewPartName,
    setNewPartPrice,
    handleShare,
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
          {/* Header */}
          <MabCalculusHeader />

          <hr className="my-4" />

          <ClientData />

          <hr className="my-4" />

          <RepairParts />

          <hr className="my-4" />

          <div className=" space-y-2">
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
