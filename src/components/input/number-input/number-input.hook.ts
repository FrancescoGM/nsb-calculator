"use client";
import { ChangeEvent } from "react";

import { NumberInputHookProps } from "./number-input.types";

const ONLY_NUMBERS_AND_SPACE = /[^0-9\s]/g;

function sanitize(value: string): string {
  return value.replace(ONLY_NUMBERS_AND_SPACE, "");
}

export const useNumberInput = ({
  value: controlledValue = "",
  onChange: externalOnChange,
}: NumberInputHookProps = {}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = sanitize(raw);

    const synthetic = {
      ...e,
      target: { ...e.target, value: cleaned },
    } as ChangeEvent<HTMLInputElement>;

    externalOnChange?.(synthetic);
  };

  return {
    value: controlledValue,
    onChange: handleChange,
  };
};
