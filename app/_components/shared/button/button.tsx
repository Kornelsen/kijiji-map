type Props = {
	secondary?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
	disabled?: boolean;
	variant?: "primary" | "outlined";
};

export const Button = ({
	onClick,
	disabled,
	variant = "primary",
	children,
}: Props) => (
	<button
		type="button"
		onClick={onClick}
		className={getButtonStyle(variant, !!disabled)}
		disabled={disabled}
	>
		{children}
	</button>
);

const getButtonStyle = (variant: string, disabled: boolean) => {
	switch (variant) {
		case "primary":
			return `bg-[#373373] text-white rounded py-2 px-4 w-full hover:brightness-125  ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`;
		case "outlined":
			return "outline outline-2 outline-[#e5e7eb] rounded py-2 px-4 w-full";
	}
};
