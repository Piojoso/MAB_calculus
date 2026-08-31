import { Button } from "@/components/ui/button";
import { CircleCheck, Pencil } from "lucide-react";

import { useState } from "react";
import { CustomInput } from "@/components/custom/CustomInput";

interface Props {
  name: string;
  address: string;
  phone: string;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}

export const ClientData = (props: Props) => {
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
            <div className="flex gap-1 text-sm">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium text-foreground">{props.name}</span>
            </div>

            <div className="flex gap-1 text-sm">
              <span className="text-muted-foreground">Dirección:</span>
              <span className="font-medium text-foreground">
                {props.address}
              </span>
            </div>

            <div className="flex gap-1 text-sm">
              <span className="text-muted-foreground">Teléfono:</span>
              <span className="font-medium text-foreground">{props.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edits */}
      {isEditing && (
        <div className="space-y-2">
          <div className="grid grid-rows gap-2">
            <CustomInput
              placeholder="Nombre"
              onChange={(e) => props.setName(e.target.value || "")}
              value={props.name || ""}
            />

            <CustomInput
              inputMode="text"
              placeholder="Dirección"
              value={props.address || ""}
              onChange={(e) => props.setAddress(e.target.value || "")}
            />

            <CustomInput
              placeholder="Teléfono"
              inputMode="tel"
              value={props.phone || ""}
              onChange={(e) => props.setPhone(e.target.value || "")}
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
