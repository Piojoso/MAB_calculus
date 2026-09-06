import { useMabCalculus } from "../hooks/useMabCalculus";
import { MabCalculusHeader } from "../components/MabHeader";
import { MabRepairParts } from "../components/MabRepairParts";
import { MabClientData } from "../components/MabClientData";
import { MabTotals } from "../components/MabTotals";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { MabInputs } from "../components/MabInputs";

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
    <main className="min-h-screen bg-background py-6 pb-32">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">M A B</h1>
          <p className="text-xs text-muted-foreground">
            Calculadora de reparación
          </p>
        </div>

        <div ref={store.state.receiptRef} className="py-4 px-4">
          <div className="rounded-2xl bg-card p-5 shadow-lg">
            {/* Header */}
            <MabCalculusHeader {...store.actions} />

            <hr className="my-4" />
            {clientData.state.name}
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
        <div className="mx-auto w-full max-w-md">
          <Button
            size="lg"
            className="w-full"
            onClick={store.actions.handleShare}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Enviar presupuesto
          </Button>
        </div>
      </div>
    </main>
  );
};
