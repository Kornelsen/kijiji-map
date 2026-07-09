import type { Nullable } from "@/app/_types";

interface CurrencyInputProps {
  name: string;
  label: string;
  value?: Nullable<number>;
  onChange: ({
    name,
    value,
  }: {
    name: string;
    value: Nullable<string | number>;
  }) => void;
  placeholder?: string;
}

const MAX_DIGITS = 7;

const formatCurrency = (value: Nullable<number> | undefined) =>
  value ? `$${value.toLocaleString("en-CA")}` : "";

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const digits = value.replace(/\D/g, "").slice(0, MAX_DIGITS);
    const numericValue = +digits > 0 ? +digits : null;
    onChange({ name, value: numericValue });
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        inputMode="numeric"
        className="border rounded px-2 py-1 text-black"
        onChange={handleChange}
        value={formatCurrency(value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CurrencyInput;
