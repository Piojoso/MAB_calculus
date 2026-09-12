import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { CustomInput } from "@/components/custom/CustomInput";
import type { DraftClientData } from "../interfaces";

interface Props {
  name: string;
  address: string;
  phone: string;
  isEditing: boolean;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;

  handleAddClientData: (clientData: DraftClientData) => void;
}

export const MabClientData = (props: Props) => {
  const [localName, setLocalName] = useState(props.name);
  const [localAddress, setLocalAddress] = useState(props.address);
  const [localPhone, setLocalPhone] = useState(props.phone);

  const handleToggleEditing = () => {
    setLocalName(props.name);
    setLocalAddress(props.address);
    setLocalPhone(props.phone);
    props.setIsEditing((prev) => !prev);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Información del Cliente
        </h3>
        <Button
          onClick={handleToggleEditing}
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-primary"
        >
          <Pencil className="mr-1 h-3 w-3.5" />
          Editar
        </Button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-rows gap-2">
          <div className="flex gap-1 text-sm">
            <span className="text-muted-foreground">Nombre:</span>
            <span className="font-medium text-foreground">{props.name}</span>
          </div>

          <div className="flex gap-1 text-sm">
            <span className="text-muted-foreground">Dirección:</span>
            <span className="font-medium text-foreground">{props.address}</span>
          </div>

          <div className="flex gap-1 text-sm">
            <span className="text-muted-foreground">Teléfono:</span>
            <span className="font-medium text-foreground">{props.phone}</span>
          </div>
        </div>
      </div>

      <Dialog open={props.isEditing} onOpenChange={props.setIsEditing}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Agregar Información del Cliente</DialogTitle>
            <DialogDescription>
              Se usará para reconocerlo facilmente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <Label htmlFor="client-name" className="text-sm">
                Nombre
              </Label>
              <CustomInput
                id="client-name"
                placeholder="Ej: Miguel Angel"
                value={localName || ""}
                defaultValue={props.name || ""}
                onChange={(e) => setLocalName(e.target.value || "")}
              />
            </div>

            <div>
              <Label htmlFor="client-address" className="text-sm">
                Dirección
              </Label>
              <CustomInput
                id="client-address"
                inputMode="text"
                placeholder="Ej: Calle falsa 123"
                value={localAddress || ""}
                defaultValue={props.address || ""}
                onChange={(e) => setLocalAddress(e.target.value || "")}
              />
            </div>

            <div>
              <Label htmlFor="client-phone" className="text-sm">
                Teléfono
              </Label>
              <CustomInput
                id="client-phone"
                placeholder="Ej: 0303 456 1111"
                inputMode="tel"
                value={localPhone || ""}
                defaultValue={props.phone || ""}
                onChange={(e) => setLocalPhone(e.target.value || "")}
              />
            </div>
            <Button
              onClick={() =>
                props.handleAddClientData({
                  name: localName,
                  address: localAddress,
                  phone: localPhone,
                })
              }
              disabled={
                !localName.trim() || !localAddress.trim() || !localPhone.trim()
              }
              className="w-full"
            >
              Actualizar Información
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
