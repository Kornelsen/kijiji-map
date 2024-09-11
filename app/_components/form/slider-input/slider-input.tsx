import { Slider } from "../../ui/slider";
import { CurrencyInput } from "../currency-input";
import { Input } from "../input";
import type { Nullable, TInput } from "@/app/_types";

type Props = {
  label: string;
  name: string;
  value?: [Nullable<number>, Nullable<number>];
  type?: "number" | "currency";
  onChange: ({ name, value }: TInput<unknown>) => void;
};

export const SliderInput = ({
  label,
  name,
  value = [null, null],
  type,
  onChange,
}: Props) => {
  const [minValue, maxValue] = value;

  const handleInputChange = ({ name: fieldName, value }: TInput<unknown>) => {
    fieldName === "min"
      ? onChange({ name, value: [value, maxValue] })
      : onChange({ name, value: [minValue, value] });
  };

  const handleSliderChange = (value: [number, number]) => {
    onChange({ name, value });
  };

  return (
    <div className="space-y-2">
      {type === "currency" ? (
        <CurrencyInputs
          label={label}
          value={value}
          onChange={handleInputChange}
        />
      ) : (
        <NumericalInputs
          label={label}
          value={value}
          onChange={handleInputChange}
        />
      )}
      <Slider
        min={0}
        max={2000}
        value={[minValue || 0, maxValue || 2000]}
        step={50}
        onValueChange={handleSliderChange}
        className="py-2"
        double
      />
    </div>
  );
};

type InputProps = Pick<Props, "label" | "onChange"> & {
  value: [Nullable<number>, Nullable<number>];
};

const NumericalInputs = ({ label, value, onChange }: InputProps) => {
  const [minValue, maxValue] = value;
  return (
    <div className="flex gap-2">
      <Input
        name="min"
        label={`Min ${label}`}
        placeholder="0"
        type="number"
        value={minValue}
        onChange={onChange}
      />
      <Input
        name="max"
        label={`Max ${label}`}
        placeholder="Unlimited"
        type="number"
        value={maxValue}
        onChange={onChange}
      />
    </div>
  );
};

const CurrencyInputs = ({ label, value, onChange }: InputProps) => {
  const [minValue, maxValue] = value;
  return (
    <div className="flex gap-2">
      <CurrencyInput
        name="min"
        label={`Min ${label}`}
        placeholder="$0"
        value={minValue}
        onChange={onChange}
      />
      <CurrencyInput
        name="max"
        label={`Max ${label}`}
        placeholder="Unlimited"
        value={maxValue}
        onChange={onChange}
      />
    </div>
  );
};
