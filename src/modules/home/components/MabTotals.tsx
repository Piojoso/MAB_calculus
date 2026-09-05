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

        <CustomSummaryLine
          leftLabel="Pago por adelantado"
          rightLabel={`- ${formatMoney(props.advance)}`}
        />
        {/* − {formatMoney(props.advance)} */}

        <hr className="mb-2 border-dashed" />

        <CustomSummaryLine
          leftLabel="Saldo"
          leftLabelClass="font-medium text-foreground"
          rightLabel={formatMoney(props.balance)}
          rightLabelClass="font-semibold text-foreground"
        />
      </div>

      <hr className="mt-2 mb-4 " />

      <div className="space-y-2">
        <CustomSummaryLine
          leftLabel="Mano de obra"
          rightLabel={`+ ${formatMoney(props.labor)}`}
        />

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
