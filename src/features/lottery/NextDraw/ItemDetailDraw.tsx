import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import NewTooltip from "../../../components/NewTooltip";
import { formatAmount } from "../../../utils";
import { toFixedNumber } from "../../../utils/decimalAdjust";

export const BlockItem = styled.div`
  background: ${({ theme }) => theme.bgDetail};
  border-radius: 8px;
  padding: 16px 20px;

  .text-first {
    font-weight: normal;
    font-size: 17px;
    color: ${({ theme }) => theme.thinText};
  }

  .text-second {
    display: flex;
    color: ${({ theme }) => theme.primaryText2};
    font-weight: bold;
    font-size: 20px;
    padding-top: 4px;
    
    span {
      margin-left: 5px;
    }

    .text-second-child {
     max-width: 62%;
      div {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

  .text-third {
    color: ${({ theme }) => theme.primaryText3};
    font-weight: normal;
    font-size: 14px;
    padding-top: 4px;
  }

  .text-burn {
    color: #ec5656;
  }

  @media screen and (max-width: 768px) {
    .text-first,
    .text-third {
      font-size: 12px;
    }

    .text-second {
      font-size: 14px;
    }
  }
  @media screen and (max-width: 400px) {
    padding: 10px;
    .text-second {
      font-size: 12px;
    }
  }
`;

const RATE = {
  1: 0.02,
  2: 0.03,
  3: 0.05,
  4: 0.1,
  5: 0.2,
  6: 0.4,
  0: 0.2,
};

const ItemDetailDraw = ({ type, dataDetail }) => {
  const prizeSTAND = dataDetail.prizePotSTAND * RATE[type];
  const prizeUSDT = dataDetail.prizePotUSD * RATE[type];
  return (
    <BlockItem>
      <div className={`text-first ${type === 0 && " text-burn"}`}>
        {type === 0 && "Burn"}
        {type === 1 && "1 Number Matched"}
        {type > 1 && type + " Numbers Matched"}
      </div>
      <div className="text-second">
        <div className="mr-1 text-second-child">
          <NewTooltip
            dataTip={formatAmount("" + prizeSTAND, 0, 4)}
            dataValue={
              formatAmount("" + prizeSTAND, 0, 4)
            }
          ></NewTooltip>
        </div>
        <div> STAND</div>
      </div>
      <div className="text-third">${formatAmount("" + prizeUSDT, 0, 4)}</div>
    </BlockItem>
  );
};

export default ItemDetailDraw;
