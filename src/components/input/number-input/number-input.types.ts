import { ChangeEvent } from "react";

import { InputProps } from "../input";

export type NumberInputProps = InputProps & {
  value: number;
};

export type NumberInputHookProps = {
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type NumberInputHook = {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
