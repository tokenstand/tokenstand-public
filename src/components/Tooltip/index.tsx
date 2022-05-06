import React, { useCallback, useState } from "react";
import Popover, { PopoverProps } from "../Popover";

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: string;
  className?: string
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return (
    <Popover
      content={
        <div className="w-full font-medium bg-dark-500 rounded text-sm px-2 py-3" 
        style={{background:"#5C6A86", color:"rgba(255, 255, 255, 0.6)"}}>
          {text}
        </div>
      }
      {...rest}
    />
  );
}

export function MouseoverTooltip({
  className,
  children,
  ...rest
}: Omit<TooltipProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close} className={className}>
        {children}
      </div>
    </Tooltip>
  );
}
