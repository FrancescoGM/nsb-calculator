"use client";
import { forwardRef } from "react";

import { Input } from "../input";
import { useNumberInput } from "./number-input.hook";
import { NumberInputProps } from "./number-input.types";

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, value, ...rest }, ref) => {
    const props = useNumberInput({ value, onChange });

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
