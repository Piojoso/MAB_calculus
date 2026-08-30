import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  inputMode?:
    | "search"
    | "text"
    | "email"
    | "tel"
    | "url"
    | "decimal"
    | "none"
    | "numeric";
  placeholder?: string;

  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const CustomInput = ({
  inputMode = "text",
  placeholder = "",
  value,
  onChange,
}: Props) => {
  return (
    <Input
      className="h-10 px-2 text-sm"
      inputMode={inputMode}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
    />
  );
};
