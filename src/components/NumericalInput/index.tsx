import { classNames, escapeRegExp } from "../../functions";

import React from "react";
import { MouseoverTooltip } from "../Tooltip";
import { type } from "os";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export const Input = React.memo(
  ({
    value,
    onUserInput,
    placeholder,
    className = "w-0 p-0 text-2xl bg-transparent",
    decimals,
    minValue,
    ...rest
  }: {
    value: string | number;
    onUserInput: (input: string) => void;
    error?: boolean;
    fontSize?: string;
    align?: "right" | "left";
    decimals?: number;
    minValue?: number;
  } & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput.includes(".")) {
        const numString = nextUserInput.toString().split('.')
        const dec = numString[1];
        if (dec.length > decimals) return;
      }
      if (minValue && nextUserInput.length >= minValue.toString().length && Number(nextUserInput) < minValue) {
        return onUserInput(`${minValue}`);
      }
      if (
        nextUserInput === "" ||
        inputRegex.test(escapeRegExp(nextUserInput))
      ) {
        onUserInput(nextUserInput);
      }
    };

    return (
      // <MouseoverTooltip text={(value ? value.toString() : null)}>
      <input
        {...rest}
        value={value}
        onChange={(event) => {
          const nativeEventData = event?.nativeEvent["data"];
          if (nativeEventData === "d" || nativeEventData === "e") {
            return;
          }
          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, "."));
        }}
        // universal input options
        inputMode="decimal"
        // title="Token Stand"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || "0.0"}
        min={0}
        minLength={1}
        maxLength={79}
        spellCheck="false"
        className={classNames(
          "relative font-bold outline-none border-none flex-auto overflow-hidden overflow-ellipsis placeholder-low-emphesis",
          className
        )}
      />
      // </MouseoverTooltip>
    );
  }
);

Input.displayName = "NumericalInput";

export default Input;

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
