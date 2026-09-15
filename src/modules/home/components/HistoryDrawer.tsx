import { useState } from "react";
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
import { History } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { db } from "@/lib/db";
import { formatMoney } from "../helpers/helpers";
import { Badge } from "@/components/ui/badge";

interface Props {
  handleSelectOldRepairQuote: (id: number) => Promise<void>;
}

export const HistoryDrawer = (props: Props) => {
  const [open, setOpen] = useState(false);

  const repairQuotes = useLiveQuery(() =>
    db.historic.orderBy("date").reverse().toArray(),
  );

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
        </DrawerHeader>
        <div className="h-full p-4">
          <ToggleGroup
            variant="outline"
            orientation="vertical"
            size={"lg"}
            spacing={2}
            className="w-full"
          >
            {repairQuotes?.map((quote) => (
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
                  <span className="text-lg text-muted-foreground shrink-0">
                    {quote.date}
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
          <DrawerClose render={<Button variant="outline">Cerrar</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
