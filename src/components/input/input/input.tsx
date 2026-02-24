import { forwardRef } from "react";

import { InputProps } from "./input.types";
import { cn } from "@/src/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "border rounded bg-gray-800 px-1 placeholder:text-gray-500",
          className
        )}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";
