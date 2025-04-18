import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const ClockIcon: React.FC<HTMLAttributes<SVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-4 h-4", props.className)}
      {...props}
    >
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

export default ClockIcon;
