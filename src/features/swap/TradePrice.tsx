import { Currency, Price } from "@sushiswap/sdk";
import React, { useCallback } from "react";
import Typography from "../../components/Typography";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";
import styled from "styled-components";
import { classNames } from "../../functions";
import NewTooltip from "../../components/NewTooltip";
import { isMobile } from "react-device-detect";

interface TradePriceProps {
  price?: number;
  showInverted?: boolean;
  setShowInverted?: (showInverted: boolean) => void;
  inputName: string;
  outputName: string;
  className?: string;
}

const TypographyStyle = styled(Typography)`
  color: ${({ theme }) => theme.lblColor};
  font-weight: 500;
  font-size: 16px;
  font-family: "SF UI Display";
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 500;
  font-size: 16px;
  font-family: "SF UI Display";
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export default function TradePrice({
  price,
  showInverted,
  inputName,
  outputName,
  setShowInverted,
  className,
}: TradePriceProps) {
  const { chainId } = useActiveWeb3React();
  const { i18n } = useLingui();

  let formattedPrice: string;

  try {
    formattedPrice = showInverted ? price.toFixed(18) : (1 / price).toFixed(18);
  } catch (error) {
    formattedPrice = "0";
  }


  // const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  // const label = showInverted ? `${price.quoteCurrency?.symbol}` : `${price.baseCurrency?.symbol} `;

  // const labelInverted = showInverted ? `${price.baseCurrency?.symbol} ` : `${price.quoteCurrency?.symbol}`

  // const text = `${'1 ' + labelInverted + ' = ' + formattedPrice ?? '-'} ${label}`

  const show = true;
  const label = showInverted ? inputName : outputName;

  const labelInverted = showInverted ? `USA` : `sa`;
  const handlevalue = (value) => {
    let valueNew = value;
    if (value.length > 18) {
      valueNew = value.substring(0, 10) + "...";
    }
    return valueNew;
  };

  const text = showInverted
    ? `${handlevalue(formattedPrice)} ${outputName} / ${inputName}`
    : `${handlevalue(formattedPrice)} ${inputName} / ${outputName}`;

  return (
    <div className={classNames("pt-2", className)}>
      {show ? (
        <div className="flex justify-between w-full text-secondary">
          <TypographyStyle variant="sm" className="text-secondary">
            {i18n._(t`Price`)}
          </TypographyStyle>
          <div className="flex items-center space-x-4">
            {isMobile ? (
              <SmallText>
                <NewTooltip
                  dataTip={formattedPrice}
                  dataValue={text}
                ></NewTooltip>
              </SmallText>
            ) : (
              <SmallText onClick={() => setShowInverted(!showInverted)}>
                <NewTooltip
                  dataTip={formattedPrice}
                  dataValue={text}
                ></NewTooltip>
              </SmallText>
            )}

            <div
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
            </div>
          </div>
        </div>
      ) : (
        "-"
      )}
    </div>
  );
}
