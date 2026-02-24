"use client";
import { ChangeEvent, useState, useEffect } from "react";

import { NumberInputHook, NumberInputHookProps } from "./number-input.types";

const ONLY_NUMBERS_AND_SPACE = /[^0-9\s]/g;

function sanitize(value: string): string {
  return value.replace(ONLY_NUMBERS_AND_SPACE, "");
}

export const useNumberInput = ({
  value: _value = "",
  onChange: _onChange,
}: NumberInputHookProps = {}): NumberInputHook => {
  const [value, setValue] = useState(_value);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    const sanitizedText = sanitize(inputText);
    e.target.value = sanitizedText;

    setValue(sanitizedText);
    _onChange?.(e);
  };

  useEffect(() => {
    setValue(_value);
  }, [_value]);

  return {
    value,
    onChange: handleInputChange,
  };
};
