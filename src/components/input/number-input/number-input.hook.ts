"use client";
import { ChangeEvent } from "react";

import { NumberInputHookProps } from "./number-input.types";

const ONLY_NUMBERS_AND_SPACE = /[^0-9\s]/g;
const ALLOWED_NUMBER_CHARS = /[^0-9.-]/g;

const ALLOWED_NUMBER_CHARS_BR = /[^0-9.,-]/g;

function sanitizeDecimals(
  value: string,
  allowCommaAsDecimal: boolean = true
): string {
  if (value === "") return "0";

  const regex = allowCommaAsDecimal
    ? ALLOWED_NUMBER_CHARS_BR
    : ALLOWED_NUMBER_CHARS;

  let cleaned = value.replace(regex, "");

  if (allowCommaAsDecimal) {
    cleaned = cleaned.replace(",", ".");
  }

  const parts = cleaned.split(".").filter(Boolean);
  if (parts.length === 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  } else {
    if (cleaned.endsWith(".")) {
      cleaned = parts[0] + "." + "1";
    }
  }

  if (cleaned.startsWith("-")) {
    cleaned = "-" + cleaned.slice(1).replace(/-/g, "");
  } else {
    cleaned = cleaned.replace(/-/g, "");
  }

  return cleaned;
}

function sanitize(value: string): string {
  return value.replace(ONLY_NUMBERS_AND_SPACE, "");
}

export const useNumberInput = ({
  value: controlledValue = "",
  onChange: externalOnChange,
  isDecimal = false,
}: NumberInputHookProps = {}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = isDecimal ? sanitizeDecimals(raw) : sanitize(raw);

    const synthetic = {
      ...e,
      target: { ...e.target, value: cleaned },
    } as ChangeEvent<HTMLInputElement>;

    externalOnChange?.(parseFloat(cleaned), synthetic);
  };

  return {
    value: controlledValue,
    onChange: handleChange,
  };
};
