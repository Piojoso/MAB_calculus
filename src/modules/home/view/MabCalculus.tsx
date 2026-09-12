import { useMabCalculus } from "../hooks/useMabCalculus";
import { MabCalculusHeader } from "../components/MabHeader";
import { MabRepairParts } from "../components/MabRepairParts";
import { MabClientData } from "../components/MabClientData";
import { MabTotals } from "../components/MabTotals";

import { Button } from "@/components/ui/button";
import { Save, Share2 } from "lucide-react";
import { MabInputs } from "../components/MabInputs";
import { HistoryDrawer } from "../components/HistoryDrawer";

export const MabCalculus = () => {
  const { repairParts, clientData, ...store } = useMabCalculus();

  if (store.state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-sm text-muted-foreground">Cargando…</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-6 pb-32">
      <div className="mx-auto w-full max-w-md">
        <div ref={store.state.receiptRef} className="space-y-4 py-4 px-4">
          <div className="relative">
            <HistoryDrawer {...store.actions} />

            <div className="text-center">
              <h1 className="text-2xl font-semibold text-indigo-500 ">M A B</h1>
              <p className="text-xs text-muted-foreground">
                {store.state.isTakingPicture
                  ? "Reparación de lavarropas"
                  : "Calculadora costos de reparación"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-5 shadow-lg">
            {/* Header */}
            <MabCalculusHeader {...store.state} {...store.actions} />

            <hr className="my-4" />

            <MabClientData {...clientData.state} {...clientData.actions} />

            <hr className="my-4" />

            <MabRepairParts {...repairParts.state} {...repairParts.actions} />

            <hr className="my-4" />

            <MabTotals {...store.state} {...store.actions} />
          </div>
        </div>

        {/* Inputs for labor and advance live outside the receipt so they don't show on the screenshot. */}
        <MabInputs {...store.state} {...store.actions} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 p-4 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md px-4">
          {store.state.quoteStatus === "new" && (
            <Button
              size="lg"
              className="w-full border-indigo-500 text-indigo-500"
              variant="outline"
              onClick={store.actions.handleSaveRepairQuote}
            >
              <Save className="mr-2 h-5 w-5" />
              Guardar presupuesto
            </Button>
          )}
          {store.state.quoteStatus === "saved" && (
            <Button
              size="lg"
              className="w-full"
              variant="default"
              onClick={store.actions.handleShare}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Enviar presupuesto
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};
