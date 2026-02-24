import { ChangeEvent } from "react";

import { InputProps } from "../input";

type OnChange = (value: number, e: ChangeEvent<HTMLInputElement>) => void;

export type NumberInputProps = Omit<InputProps, "onChange"> & {
  isDecimal?: boolean;
  value: number;
  onChange?: OnChange;
};

export type NumberInputHookProps = {
  value?: string | number;
  isDecimal?: boolean;
  onChange?: OnChange;
};

export type NumberInputHook = {
  value: string | number;
  onChange: ChangeEvent<HTMLInputElement>;
};
