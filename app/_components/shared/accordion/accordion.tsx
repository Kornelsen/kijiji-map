import { ReactNode } from "react";
import { Button } from "../shared/button";

type Props = {
  label: string;
  expanded: boolean;
  onClick: () => void;
  children: ReactNode;
};

export const Accordion = ({ label, expanded, onClick, children }: Props) => {
  return (
    <div>
      <Button onClick={onClick}>{label}</Button>
      <div className={expanded ? "mt-2" : "hidden"}>{children}</div>
    </div>
  );
};
