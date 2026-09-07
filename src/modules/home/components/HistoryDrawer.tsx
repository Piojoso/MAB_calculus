import { use, useState } from "react";

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
import { getRepairQuotes } from "@/lib/db";

interface Props {
  handleSelectOldRepairQuote: (id: number) => Promise<void>;
}

const repairQuotesPromise = getRepairQuotes();

export const HistoryDrawer = (props: Props) => {
  const [open, setOpen] = useState(false);

  const repairQuotes = use(repairQuotesPromise);

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
        <div className="flex-1 scroll-fade overflow-y-auto p-4">
          <ToggleGroup size="lg" variant="outline" orientation="vertical">
            {repairQuotes.map((quote) => (
              <ToggleGroupItem
                key={quote.id}
                onClick={() => props.handleSelectOldRepairQuote(quote.id)}
                value="light"
                aria-label="Light"
                className="flex size-16 flex-col items-center justify-center rounded-xl"
              >
                <span className="leading-none font-light">{quote.date}</span>
                <span className="text-xs text-muted-foreground">
                  {quote.clientData.name}
                </span>
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
