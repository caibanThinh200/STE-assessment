import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "p-2 w-full rounded-xl shadow outline-none text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
