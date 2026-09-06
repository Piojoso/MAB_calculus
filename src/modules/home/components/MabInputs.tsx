import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  advance: number;
  labor: number;
  warranty: number;
  advanceInputRef: React.RefObject<HTMLInputElement | null>;
  laborInputRef: React.RefObject<HTMLInputElement | null>;
  warrantyInputRef: React.RefObject<HTMLInputElement | null>;

  setAdvance: React.Dispatch<React.SetStateAction<number>>;
  setLabor: React.Dispatch<React.SetStateAction<number>>;
  setWarranty: React.Dispatch<React.SetStateAction<number>>;
}

export const MabInputs = (props: Props) => {
  return (
    <>
      <div className="mt-1 mx-4 space-y-4 rounded-xl bg-card p-4 shadow-sm">
        <div>
          <Label htmlFor="advance" className="text-sm text-muted-foreground">
            Pago por adelantado
          </Label>
          <Input
            ref={props.advanceInputRef}
            id="advance"
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            value={props.advance || 0}
            onChange={(e) =>
              props.setAdvance(Number.parseFloat(e.target.value) || 0)
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
            ref={props.laborInputRef}
            id="labor"
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            value={props.labor || 0}
            onChange={(e) =>
              props.setLabor(Number.parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            className="mt-1 h-11 text-right text-base"
          />
        </div>

        <div>
          <Label htmlFor="warranty" className="text-sm text-muted-foreground">
            Plazo de garantia
          </Label>
          <Input
            ref={props.warrantyInputRef}
            id="warranty"
            type="number"
            inputMode="decimal"
            step="1"
            min={0}
            value={props.warranty || 0}
            onChange={(e) =>
              props.setWarranty(Number.parseFloat(e.target.value) || 0)
            }
            placeholder="3"
            className="mt-1 h-11 text-right text-base"
          />
        </div>
      </div>
    </>
  );
};
