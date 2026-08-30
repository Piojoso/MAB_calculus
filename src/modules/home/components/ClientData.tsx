import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleCheck, Pencil } from "lucide-react";

import { useClientData } from "../hooks/useClientData";
import { useState } from "react";

export const ClientData = () => {
  const { name, address, phone, setName, setAddress, setPhone } =
    useClientData();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Información del Cliente
        </h3>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-destructive"
        >
          <Pencil className="mr-1 h-3 w-3.5" />
          Editar
        </Button>
      </div>

      {/* View */}
      {!isEditing && (
        <div className="space-y-2">
          <div className="grid grid-rows gap-2">
            <div className="flex justify-between h-10 text-sm">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium text-foreground">
                {/* {formatMoney(partsSubtotal)} */}
              </span>
            </div>

            <div className="flex justify-between h-10 text-sm">
              <span className="text-muted-foreground">Dirección:</span>
              <span className="font-medium text-foreground">
                {/* − {formatMoney(advance)} */}
              </span>
            </div>

            <div className="flex justify-between h-10 text-sm">
              <span className="text-muted-foreground">Teléfono:</span>
              <span className="font-medium text-foreground">
                {/* − {formatMoney(advance)} */}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edits */}
      {isEditing && (
        <div className="space-y-2">
          <div className="grid grid-rows gap-2">

            <Input
              className="h-10 px-2 text-sm"
              inputMode="text"
              placeholder="Dirección"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value || "")}
            />

            <Input
              placeholder="Teléfono"
              className="h-10 px-2 text-sm"
              inputMode="tel"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value || "")}
            />
          </div>

          <Button variant="secondary" size="sm" className="w-full">
            <CircleCheck className="mr-1 h-4 w-4" />
            Actualizar Información
          </Button>
        </div>
      )}
    </section>
  );
};
