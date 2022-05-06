import { Currency, Price } from "@sushiswap/sdk";
import React, { useCallback, useState } from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import Typography from "../../../components/Typography";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import NewTooltip from "../../../components/NewTooltip";
import { classNames } from "../../../functions";

interface PriceTradeProps {
  valuePrice?: any;
  inputName?: string;
  outputName?: string;
  tokenOuputPrice?: boolean;
}

const TypographyStyle = styled(Typography)`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 500;
  font-size: 14px;
  font-family: "SF UI Display";
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const TypographyLimit = styled(TypographyStyle)`
  color: ${({ theme }) => theme.text1};
  opacity: 0.6;
  font-weight: 600;
  font-size: ${(props) => (props.isMobile ? "12px" : "16px")} !important;
  padding: 0 9px;
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.smText};
  font-weight: 500;
  font-size: 14px;
  font-family: "SF UI Display";
  cursor: pointer;
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;
const IconChange = styled.div`
  svg {
    stroke: ${({ theme }) => theme.iconSvg};
  }
`;

export default function PriceTradeOrder({
  valuePrice,
  inputName,
  outputName,
  tokenOuputPrice,
}: PriceTradeProps) {
  const { chainId } = useActiveWeb3React();
  const { i18n } = useLingui();
  const [showInverted, setShowInverted] = useState(true);

  const firstTokenSymbol = tokenOuputPrice ? outputName : inputName;
  const secondTokenSymbol = tokenOuputPrice ? inputName : outputName;

  const handleValue = (value) => {
    let valueNew = value;
    if (value?.length > 11) {
      valueNew = value.substring(0, 10) + "...";
    }
    return valueNew;
  };

  return (
    <div className={classNames("pt-2")}>
      <div className="flex justify-between w-full text-secondary pt-2">
        <TypographyLimit
          variant="sm"
          className="text-secondary"
          isMobile={isMobile}
        >
          {i18n._(t`Price`)}
        </TypographyLimit>
        <div className="flex items-center space-x-4">
          {isMobile ? (
            <SmallText>
              <NewTooltip
               dataTip={!showInverted ? valuePrice : Number(valuePrice) ? 1 / Number(valuePrice) : '-'}
                dataValue={
                  valuePrice
                    ? !showInverted
                      ? `${handleValue(valuePrice)} ${firstTokenSymbol} per ${secondTokenSymbol} `
                      : Number(valuePrice) ? `${
                         handleValue((1 / Number(valuePrice)).toString())
                        } ${secondTokenSymbol} per ${firstTokenSymbol} ` : '-'
                    : "-"
                }
              ></NewTooltip>
            </SmallText>
          ) : (
            <SmallText onClick={() => setShowInverted(!showInverted)}>
              <NewTooltip
                dataTip={!showInverted ? valuePrice : Number(valuePrice) ? 1 / Number(valuePrice) : '-'}
                dataValue={
                  valuePrice
                    ? !showInverted
                      ? `${handleValue(valuePrice)} ${firstTokenSymbol} per ${secondTokenSymbol} `
                      : Number(valuePrice) ? `${
                         handleValue((1 / Number(valuePrice)).toString())
                        } ${secondTokenSymbol} per ${firstTokenSymbol} ` : '-'
                    : "-"
                }
              ></NewTooltip>
            </SmallText>
          )}
          {/* <SmallText
              onClick={() => setShowInverted(!showInverted)}
            >
              <NewTooltip dataTip={(notFound) ? '0' : (amountReturn === "") ? formattedPriceDefault : formattedPrice} dataValue={text}></NewTooltip>

            </SmallText> */}
          <IconChange
            onClick={() => setShowInverted(!showInverted)}
            className="cursor-pointer hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </IconChange>
        </div>
      </div>
    </div>
  );
}
