import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { History, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

import { db } from "@/lib/db";
import { CustomInput } from "@/components/custom/CustomInput";
import { formatMoney } from "../helpers/helpers";
import { useConfirmation } from "../hooks/useConfirmation";

interface Props {
  repairQuoteId: number | null;

  handleSelectOldRepairQuote: (id: number) => Promise<void>;
}

export const HistoryDrawer = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [deletingQuoteId, setDeletingQuoteId] = useState<number | null>(null);

  const {
    isConfirmed: confirmDelete,
    triggerConfirmation,
    resetConfirmation,
  } = useConfirmation();

  const handleDeleteQuote = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    quoteId: number,
  ) => {
    event.stopPropagation();

    if (!confirmDelete) {
      triggerConfirmation();
      setDeletingQuoteId(quoteId);

      return;
    }

    if (deletingQuoteId === quoteId) {
      db.historic.delete(quoteId).then(() => {
        resetConfirmation();
        setDeletingQuoteId(null);
      });
    }
  };

  const repairQuotes = useLiveQuery(() =>
    db.historic.orderBy("date").reverse().toArray(),
  );

  const filteredQuotes = useMemo(() => {
    if (searchInput.trim() === "") return repairQuotes;

    const query = searchInput.toLowerCase();

    return repairQuotes?.filter(
      (quote) =>
        quote.clientData.name.toLowerCase().includes(query) ||
        quote.clientData.address.toLowerCase().includes(query) ||
        quote.clientData.phone.toLowerCase().includes(query),
    );
  }, [repairQuotes, searchInput]);

  const handleClickOnItem = (id: number) => {
    setOpen(false);

    props.handleSelectOldRepairQuote(id);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="left">
      <DrawerTrigger
        render={
          <Button
            variant="ghost"
            size="lg"
            className="absolute h-full w-12 text-muted-foreground"
          >
            <History />
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Historial de presupuestos</DrawerTitle>
          <DrawerDescription>
            Aquí puedes ver los presupuestos antiguos.
          </DrawerDescription>

          <hr className="my-2" />

          <div>
            <Label
              htmlFor="search-input"
              className="text-sm text-muted-foreground mb-1"
            >
              Buscar Presupuesto
            </Label>

            <CustomInput
              id="search-input"
              placeholder="Nombre, dirección o teléfono del cliente"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value || "")}
            />
          </div>

          <hr className="my-2" />
        </DrawerHeader>
        <div className="h-full px-4 scrollbar-auto overflow-auto">
          <ToggleGroup
            variant="outline"
            orientation="vertical"
            size={"lg"}
            value={props.repairQuoteId ? [props.repairQuoteId.toString()] : []}
            spacing={2}
            className="w-full"
          >
            {filteredQuotes?.map((quote) => (
              <ToggleGroupItem
                key={quote.id}
                value={quote.id.toString()}
                onClick={() => handleClickOnItem(quote.id)}
                className="flex flex-col items-stretch rounded-xl h-auto w-full p-5 text-left data-[state=on]:bg-accent"
              >
                <div className="flex flex-row items-center justify-between w-full gap-4">
                  <span className="text-xl font-medium text-foreground truncate">
                    {quote.clientData.name}
                  </span>

                  <div
                    className={`
                      transform-all duration-500 ease-in-out
                      h-5 rounded-full text-xs text-destructive inline-flex overflow-clip
                      ${confirmDelete && deletingQuoteId === quote.id ? "w-20" : ""}
                      ${!confirmDelete && "w-5"}
                    `}
                    onClick={(e) => handleDeleteQuote(e, quote.id)}
                  >
                    <X className="mr-1 h-3 w-3.5" />
                    {confirmDelete && deletingQuoteId === quote.id
                      ? "Confirmar"
                      : ""}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {quote.date}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {quote.clientData.address} - {quote.clientData.phone}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between w-full gap-4">
                  <span className="text-lg font-bold text-primary">
                    {formatMoney(quote.total)}
                  </span>
                  {quote.status === "saved" && (
                    <Badge variant="outline">Guardado</Badge>
                  )}
                  {quote.status === "shared" && (
                    <Badge variant="default">Enviado</Badge>
                  )}
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <DrawerFooter>
          <hr className="mt-2" />
          <DrawerClose render={<Button variant="outline">Cerrar</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
