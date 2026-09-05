interface Props {
  rightLabel: string;
  leftLabel: string;
}

export const CustomSummaryLine = ({ leftLabel, rightLabel }: Props) => {
  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{leftLabel}</span>
        <span className="font-medium text-foreground">{rightLabel}</span>
      </div>
    </>
  );
};
