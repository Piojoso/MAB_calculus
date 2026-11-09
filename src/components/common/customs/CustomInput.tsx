import { Input } from "@/components/ui/input";

interface Props {
  id?: string;

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

  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];

  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const CustomInput = ({
  id,
  inputMode = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
}: Props) => {
  return (
    <Input
      id={id}
      className="h-10 px-2 text-sm"
      inputMode={inputMode}
      placeholder={placeholder}
      value={value || ""}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};
