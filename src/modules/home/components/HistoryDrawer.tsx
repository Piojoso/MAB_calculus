import * as React from "react";

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

export function HistoryDrawer() {
  const [open, setOpen] = React.useState(false);

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
            <ToggleGroupItem
              value="light"
              aria-label="Light"
              className="flex size-16 flex-col items-center justify-center rounded-xl"
            >
              <span className="text-2xl leading-none font-light">Aa</span>
              <span className="text-xs text-muted-foreground">Light</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Cerrar</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
