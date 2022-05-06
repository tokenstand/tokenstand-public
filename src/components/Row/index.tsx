import React, { FC } from "react";

import { classNames } from "../../functions";
import styled from "styled-components";

interface RowProps {
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}

export const Row: FC<React.HTMLAttributes<HTMLDivElement> & RowProps> = ({
  children,
  className,
  width,
  align,
  justify,
  padding,
  border,
  borderRadius,
  ...rest
}) => (
  <div
    className={classNames("w-full flex p-0", className)}
    style={{
      width,
      alignItems: align,
      justifyContent: justify,
      padding,
      border,
      borderRadius,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const RowBetween = styled(Row)`
  justify-content: space-between;
  
  .btn-confirmed{
    @media (max-width: 767px){
      font-size: 14px;
      height: 40px;
      padding: 0;
    }
  }
`;

// export const RowBetween = styled(Row)`
//     justify-content: space-between;
// `

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row) <{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row) <{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
  align-items: center;
  justify-content: center;

  .warning-text{
    font-size: 16px;
    font-weight: 600;
    @media (max-width: 767px) {
      font-size: 12px;
    }
  }
  .style-svg{
    width: 20px;
  }
  .style-active{
    font-size: 16px;
    color: ${({ theme }) => theme.primary1};
    @media (max-width: 640px){
      font-size: 12px;
      font-weight: 600;
    }
  }
  img{
    border-radius: 50%;
  }
`;

export default Row;
