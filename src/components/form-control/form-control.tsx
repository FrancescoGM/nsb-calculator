import { forwardRef } from "react";

import { FormControlProps } from "./form-control.types";

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, ...rest }, ref) => {
    return (
      <div ref={ref} className="flex justify-between gap-1" {...rest}>
        {children}
      </div>
    );
  }
);

FormControl.displayName = "FormControl";
