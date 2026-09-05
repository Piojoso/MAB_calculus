interface Props {
  rightLabel: string;
  rightLabelClass?: string;

  leftLabel: string;
  leftLabelClass?: string;
}

export const CustomSummaryLine = ({
  leftLabel,
  leftLabelClass,
  rightLabel,
  rightLabelClass,
}: Props) => {
  return (
    <>
      <div className="flex justify-between text-sm">
        <span className={leftLabelClass ?? "text-muted-foreground"}>
          {leftLabel}
        </span>
        <span className={rightLabelClass ?? "font-medium text-foreground"}>
          {rightLabel}
        </span>
      </div>
    </>
  );
};
