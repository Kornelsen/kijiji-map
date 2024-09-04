import type { Nullable } from "@/app/_types";
import MaskedInput from "react-text-mask";
import { createNumberMask } from "text-mask-addons";

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

const maskOptions = {
  prefix: "$",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecmial: false,
  integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  label,
  value,
  onChange,
  placeholder,
}) => {
  const currencyMask = createNumberMask(maskOptions);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let numericValue: Nullable<number> = +value
      .substring(1, value.length)
      .replaceAll(",", "");
    numericValue = numericValue > 0 ? numericValue : null;
    onChange({ name, value: numericValue });
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name}>{label}</label>
      <MaskedInput
        name={name}
        mask={currencyMask}
        inputMode="numeric"
        className="border rounded px-2 py-1 text-black"
        onChange={handleChange}
        value={value ?? undefined}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CurrencyInput;
