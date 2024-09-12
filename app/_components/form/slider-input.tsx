import { Slider } from "../ui/slider";
import { CurrencyInput } from "./currency-input";
import { Input } from "./input";
import type { Nullable, TInput } from "@/app/_types";

type Props = {
  label: string;
  name: string;
  min: number;
  max: number;
  value?: [Nullable<number>, Nullable<number>];
  type?: "number" | "currency";
  onChange: ({ name, value }: TInput<unknown>) => void;
};

export const SliderInput = ({
  label,
  name,
  value = [null, null],
  type,
  max,
  min,
  onChange,
}: Props) => {
  const [leftValue, rightValue] = value;

  const handleInputChange = ({ name: fieldName, value }: TInput<unknown>) => {
    if (value && +value < min) value = min;
    if (value && +value > max) value = max;
    if (fieldName === "min") {
      if (value && rightValue && +value > rightValue) value = rightValue;
      onChange({ name, value: [value, rightValue] });
    } else {
      if (value && leftValue && +value < leftValue) value = leftValue;
      onChange({ name, value: [leftValue, value] });
    }
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
        min={min}
        max={max}
        value={[leftValue || min, rightValue || max]}
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
  const [leftValue, rightValue] = value;
  return (
    <div className="flex gap-2">
      <Input
        name="min"
        label={`Min ${label}`}
        placeholder="0"
        type="number"
        value={leftValue}
        onChange={onChange}
      />
      <Input
        name="max"
        label={`Max ${label}`}
        placeholder="Unlimited"
        type="number"
        value={rightValue}
        onChange={onChange}
      />
    </div>
  );
};

const CurrencyInputs = ({ label, value, onChange }: InputProps) => {
  const [leftValue, rightValue] = value;
  return (
    <div className="flex gap-2">
      <CurrencyInput
        name="min"
        label={`Min ${label}`}
        placeholder="$0"
        value={leftValue}
        onChange={onChange}
      />
      <CurrencyInput
        name="max"
        label={`Max ${label}`}
        placeholder="Unlimited"
        value={rightValue}
        onChange={onChange}
      />
    </div>
  );
};
