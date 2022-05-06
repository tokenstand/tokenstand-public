import {
  AdvancedSwapDetails,
  AdvancedSwapDetailsProps,
} from "./AdvancedSwapDetails";

import React from "react";
import styled from "styled-components";
import { useLastTruthy } from "../../hooks/useLast";

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  width: 100%;
  border-radius: 15px;
  padding: 17px 18px;
  max-width: 662px;
  display: ${({ show }) => (show ? "block" : "none")};
  transition: height 2s;
  background: ${({ theme }) => theme.bgInput};
  margin-top: 17px;
`;

export default function AdvancedSwapDetailsDropdown({
  trade,
  ...rest
}: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade);
  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  );
}
