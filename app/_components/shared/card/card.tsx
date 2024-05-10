import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export const Card = ({ children, className = "" }: Props) => {
	return (
		<div className={`text-black border-0 bg-white rounded shadow ${className}`}>
			{children}
		</div>
	);
};
