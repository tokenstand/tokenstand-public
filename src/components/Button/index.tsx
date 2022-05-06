import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { classNames } from "../../functions";

const SIZE = {
  xs: "px-2 py-1 text-xs",
  sm: "px-4 py-2 text-base",
  default: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-base",
};

const FILLED = {
  default: "bg-transparent",
  red: "bg-red bg-opacity-80 w-full rounded text-white hover:bg-opacity-100 disabled:bg-opacity-80",
  blue: "bg-blue bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  pink: "bg-pink bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  gray: "bg-dark-700 bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  green:
    "bg-green bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80",
  gradient:
    "w-full text-white bg-gradient-to-r from-blue to-pink bg-opacity-80 hover:bg-opacity-100 disabled:bg-opacity-80",
};

const OUTLINED = {
  default: "bg-transparent",
  red: "bg-red bg-opacity-20 outline-red rounded text-red hover:bg-opacity-40 disabled:bg-opacity-20",
  blue: "bg-blue bg-opacity-20 outline-blue rounded text-blue hover:bg-opacity-40 disabled:bg-opacity-20",
  pink: "bg-pink bg-opacity-20 outline-pink rounded text-pink hover:bg-opacity-40 disabled:bg-opacity-20",
  gray: "bg-dark-700 bg-opacity-20 outline-gray rounded text-gray hover:bg-opacity-40 disabled:bg-opacity-20",
  green:
    "bg-green bg-opacity-20 border border-green rounded text-green hover:bg-opacity-40 disabled:bg-opacity-20",
  gradient:
    "bg-gradient-to-r from-blue to-pink bg-opacity-20 hover:opacity-100 disabled:bg-opacity-20",
};

const EMPTY = {
  default:
    "flex bg-transparent justify-center items-center focus:underline action:no-underline disabled:opacity-50 disabled:cursor-auto",
};

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
};

export type ButtonColor =
  | "blue"
  | "pink"
  | "gradient"
  | "gray"
  | "default"
  | "red"
  | "green";

export type ButtonSize = "xs" | "sm" | "lg" | "default";

export type ButtonVariant = "outlined" | "filled" | "empty";

export type ButtonProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & {
  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonCustom = styled.button`
  font-size: ${isMobile ? "14px" : "18px"};
  border-radius: 15px;
`;

function Button({
  children,
  className = undefined,
  color = "default",
  size = "default",
  variant = "filled",
  disabled,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <ButtonCustom
      disabled={disabled}
      className={classNames(
        VARIANT[variant][color],
        variant !== "empty" && SIZE[size],
        "rounded focus:outline-none font-bold",
        className,
      )}
      {...rest}
    >
      {children}
    </ButtonCustom>
  );
}

export default Button;

export function ButtonConfirmed({
  className,
  confirmed,
  disabled,
  ...rest
}: {
  className?: string;
  confirmed?: boolean;
  disabled?: boolean;
} & ButtonProps) {
  if (confirmed) {
    return (
      <Button
        variant="outlined"
        color="green"
        size="lg"
        className={classNames(
          disabled && "cursor-not-allowed",
          "border opacity-50",
          "font-bold",
          className
        )}
        disabled={disabled}
        {...rest}
      />
    );
  } else {
    return (
      <Button
        color={disabled ? "gray" : "gradient"}
        size="lg"
        disabled={disabled}
        {...rest}
        className={`font-bold w-full, ${className}`}
        style={{ background: disabled ? "rgba(31, 55, 100, 0.5)" : "#72BF65" }}
      />
    );
  }
}

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean;
  disabled?: boolean;
} & ButtonProps) {
  if (error) {
    return (
      <Button
        size="lg"
        {...rest}
        style={{ background: "#EC5656", color: "#ffff", width: "100%" }}
      />
    );
  } else {
    return (
      <Button
        style={{
          background: disabled ? "rgba(31, 55, 100, 0.5)" : "#72BF65",
          color: disabled ? "rgba(255, 255, 255, 0.5)" : "#ffff",
        }}
        disabled={disabled}
        size="lg"
        className="font-bold w-full"
        {...rest}
      />
    );
  }
}
