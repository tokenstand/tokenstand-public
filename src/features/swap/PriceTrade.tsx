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

interface PriceTradeProps {
  price?: number;
  showInverted?: boolean;
  setShowInverted?: (showInverted: boolean) => void;
  inputName: string;
  outputName: string;
  className?: string;
  notFound?: boolean;
  defaultPrice?: number;
  amountReturn: string;
  amount;
  showWrap?: boolean;
  isLimit?: boolean;
  showNotFound?: boolean;
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
  font-size: ${(props) =>props.isMobile ? '12px': '16px' } !important;
  padding: 0 9px ;
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.smText};
  font-weight: 500;
  font-size: 14px;
  font-family: "SF UI Display";
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;
const IconChange = styled.div`
  svg {
    stroke: ${({ theme }) => theme.iconSvg};
  }
`;

const getDecimal = (value) => {
  let text = value.toString();
  if (text.indexOf("e-") > -1) {
    text = value.toFixed(19).toString().split(".")[1];
    let length = 19;
    while (length > 0 && text[length] === "0") {
      length = length - 1;
    }
    return length;
  }
  if (Math.floor(value) !== value) {
    return value.toString().split(".")[1].length || 0;
  }
  return 0;
};
export default function PriceTrade({
  price,
  showInverted,
  inputName,
  outputName,
  setShowInverted,
  className,
  notFound,
  defaultPrice,
  amountReturn,
  amount,
  showWrap,
  isLimit,
  showNotFound
}: PriceTradeProps) {
  const { chainId } = useActiveWeb3React();
  const { i18n } = useLingui();

  let formattedPrice: string;
  let formattedPriceDefault: string;
  try {
    // formattedPrice = showInverted ? price.toFixed(18) : (1 / price).toFixed(18);
    // if (formattedPrice === "NaN") formattedPrice = '0';
    formattedPrice =
      price == Infinity
        ? "0.00"
        : showInverted
        ? getDecimal(price) > 18
          ? price.toFixed(18)
          : getDecimal(price) === 0
          ? price.toFixed(1)
          : price.toString()
        : getDecimal(1 / price) > 18
        ? (1 / price).toFixed(18)
        : getDecimal(1 / price) === 0
        ? (1 / price).toFixed(1)
        : (1 / price).toString();
    if (formattedPrice === "NaN") formattedPrice = "0";
    if (showWrap) {
      formattedPrice = "1";
    }
  } catch (error) {
    formattedPrice = "0";
  }

  try {
    // formattedPriceDefault = showInverted ? defaultPrice.toFixed(18) : (1 / defaultPrice).toFixed(18);
    // if (formattedPriceDefault === "NaN") formattedPrice = '0';

    formattedPriceDefault = showInverted
      ? getDecimal(defaultPrice) > 18
        ? defaultPrice.toFixed(18)
        : getDecimal(defaultPrice) === 0
        ? defaultPrice.toFixed(1)
        : defaultPrice.toString()
      : getDecimal(1 / defaultPrice) > 18
      ? (1 / defaultPrice).toFixed(18)
      : getDecimal(1 / defaultPrice) === 0
      ? (1 / defaultPrice).toFixed(1)
      : showWrap
      ? "1"
      : (1 / defaultPrice).toString();
    if (formattedPriceDefault === "NaN") formattedPriceDefault = "0";
  } catch (error) {
    formattedPriceDefault = "0";
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
    if (value?.length > 18) {
      valueNew = value.substring(0, 10) + "...";
    }
    return valueNew;
  };

  // const text = showInverted ? `${handlevalue(formattedPrice)} ${outputName} per ${inputName}` :
  //   `${handlevalue(formattedPrice)} ${inputName} per ${outputName}`;

  let text: string;
  if (notFound) {
    text = "0";
  } else {
    if (amountReturn === "0.0" && amount && Number(amount) === 0) {
      text = "0.0";
    } else if (amountReturn === "0.0" && amount && Number(amount) !== 0) {
      text = "-";
    } else if (amountReturn === "") {
      text = "-";
    } else {
      text = showInverted
        ? `${
            showWrap ? "1" : handlevalue(formattedPrice)
          } ${outputName} per ${inputName}`
        : `${
            showWrap ? "1" : handlevalue(formattedPrice)
          } ${inputName} per ${outputName}`;
    }
  }

  return (
    <div className={classNames("pt-2", className)}>
      {show && !showNotFound ? (
        <div className="flex justify-between w-full text-secondary pt-2">
          {isLimit ? (
            <TypographyLimit variant="sm" className="text-secondary" isMobile={isMobile}>
              {i18n._(t`Price`)}
            </TypographyLimit>
          ) : (
            <TypographyStyle variant="sm" className="text-secondary">
              {i18n._(t`Price`)}
            </TypographyStyle>
          )}

          <div className="flex items-center space-x-4">
            {isMobile ? (
              <SmallText>
                <NewTooltip
                  dataTip={
                    notFound
                      ? "0"
                      : amountReturn === ""
                      ? formattedPriceDefault
                      : formattedPrice
                  }
                  dataValue={text}
                ></NewTooltip>
              </SmallText>
            ) : (
              <SmallText onClick={() => setShowInverted(!showInverted)}>
                <NewTooltip
                  dataTip={
                    notFound
                      ? "0"
                      : amountReturn === ""
                      ? formattedPriceDefault
                      : formattedPrice
                  }
                  dataValue={text}
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
      ) : (
        "-"
      )}
    </div>
  );
}
