import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type Props = {
	children: ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Card = ({ children, className = "", ...other }: Props) => {
	return (
		<div
			className={`text-black border-0 bg-white rounded shadow ${className}`}
			{...other}
		>
			{children}
		</div>
	);
};
