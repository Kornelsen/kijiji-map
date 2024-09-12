import type { Nullable, TInput } from "@/app/_types";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  value?: Nullable<string | number>;
  type?: "string" | "number";
  onChange: (input: TInput<string | number>) => void;
};

export const Input = ({
  name,
  label,
  placeholder,
  value,
  type = "string",
  onChange,
}: Props) => {
  const isNumeric = type === "number";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ?? null;
    onChange({
      name: event.target.name,
      value: value && type === "number" ? +value : value,
    });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        className="border rounded px-2 py-1 text-black"
        onChange={handleChange}
        value={value ?? undefined}
        placeholder={placeholder}
        type={isNumeric ? "number" : "text"}
      />
    </div>
  );
};
