type Props = {
  secondary?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "outlined";
  fullWidth?: boolean;
  className?: string;
};

export const Button = ({
  onClick,
  disabled,
  variant = "primary",
  fullWidth = true,
  children,
  className,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={`${getButtonStyle(variant, !!disabled, fullWidth)} ${className}`}
    disabled={disabled}
  >
    {children}
  </button>
);

const getButtonStyle = (
  variant: string,
  disabled: boolean,
  fullWidth: boolean,
) => {
  switch (variant) {
    case "primary":
      return `bg-[#373373] text-white rounded py-2 px-4 hover:brightness-125  ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${fullWidth ? "w-full" : ""}`;
    case "outlined":
      return "outline outline-2 outline-[#e5e7eb] rounded py-2 px-4 w-full hover:outline-[#373373] focus:outline-[#373373]";
  }
};
