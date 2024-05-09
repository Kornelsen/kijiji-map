import { TInput } from "@/app/_types";
import { Button } from "../../shared";

type Props<T> = {
  label: string;
  name: string;
  selected: T[];
  options: {
    value: T;
    label: string;
  }[];
  onChange: (input: TInput<T[]>) => void;
};

export function MultipleSelect<T>({
  label,
  name,
  options = [],
  selected = [],
  onChange,
}: Props<T>) {
  const handleClick = (value: T) => {
    const index = selected.indexOf(value);
    if (index > -1) {
      selected.splice(index, 1);
      onChange({ name, value: selected });
    } else {
      onChange({ name, value: [...selected, value] });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected?.includes(option.value);
          return (
            <div key={option.label} className="min-w-[80px]">
              <Button
                variant={isSelected ? "primary" : "outlined"}
                onClick={() => handleClick(option.value)}
              >
                {option.label}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
