import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const CheckIcon: React.FC<HTMLAttributes<SVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("size-4", props.className)}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default CheckIcon;
