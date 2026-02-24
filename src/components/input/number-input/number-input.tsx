"use client";
import { forwardRef } from "react";

import { Input } from "../input";
import { useNumberInput } from "./number-input.hook";
import { NumberInputProps } from "./number-input.types";

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, value, isDecimal = false, ...rest }, ref) => {
    const props = useNumberInput({ value, onChange, isDecimal });

    return (
      <Input
        type="tel"
        ref={ref}
        value={props.value}
        onChange={props.onChange}
        {...rest}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";
