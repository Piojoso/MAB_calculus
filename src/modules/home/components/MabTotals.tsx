import { CustomSummaryLine } from "@/components/custom/CustomSummaryLine";
import { formatMoney } from "../helpers/helpers";

interface Props {
  partsSubtotal: number;
  advance: number;
  balance: number;
  labor: number;
  total: number;
}

export const MabTotals = (props: Props) => {
  return (
    <>
      <div className=" space-y-2">
        <CustomSummaryLine
          leftLabel="Total repuestos"
          rightLabel={formatMoney(props.partsSubtotal)}
        />

        {/* <div className="flex justify-between text-sm">
          <span className="text-muted-foreground"></span>
          <span className="font-medium text-foreground"></span>
        </div> */}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pago por adelantado</span>
          <span className="font-medium text-foreground">
            − {formatMoney(props.advance)}
          </span>
        </div>

        <div className="border-t border-dashed border-border pt-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground">Saldo</span>
            <span className="font-semibold text-foreground">
              {formatMoney(props.balance)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-2 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Mano de obra</span>
          <span className="font-medium text-foreground">
            + {formatMoney(props.labor)}
          </span>
        </div>

        <div className="border-t-2 border-primary pt-3">
          <div className="flex justify-between">
            <span className="text-base font-bold text-primary">
              TOTAL A PAGAR
            </span>
            <span className="text-lg font-bold text-primary">
              {formatMoney(props.total)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
