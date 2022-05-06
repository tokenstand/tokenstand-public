import { AlertTriangle, ArrowDown } from "react-feather";
import React, { useMemo, useState, useEffect } from "react";
import { Currency, Percent, TradeType, Trade as V2Trade } from "@sushiswap/sdk";
import { Trans, t } from "@lingui/macro";
import { warningSeverity } from "../../functions";
import { isAddress, shortenAddress } from "../../functions";
import TradePrice from "./TradePrice";
import PriceTrade from "./PriceTrade";
import CurrencyLogo from "../../components/CurrencyLogo";
import { Field } from "../../state/swap/actions";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import styled from "styled-components";
import { useLingui } from "@lingui/react";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import { AdvancedSwapDetails } from "./AdvancedSwapDetails";
import { isMobile } from "react-device-detect";
import Tooltip, { MouseoverTooltip } from "../../components/Tooltip";
import NewTooltip from "../../components/NewTooltip";
import ReactTooltip from "react-tooltip";

export const BoldText = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-size: 18px;
  font-weight: bold;
  @media (max-width: 640px) {
    font-size: 14px;
    width: 185px;
  }
  font-family: "SF UI Display";
  font-weight: 700;
`;
const BoldInput = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-size: 18px;
  font-weight: 600;
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.smText};
  font-size: 14px;
  margin: 10px 0 10px;
  font-family: "SF UI Display";
  @media (max-width: 640px) {
    font-size: 10px;
  }
  width: 100%;
`;
export const BoldTextName = styled.p`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  font-family: "SF UI Display";
  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const StyleIcon = styled.div`
    img {
      border-radius: 50%;
    }
  `;
  export const BoxToken = styled.div`
    background: ${({ theme }) => theme.bgrToken};
    border-radius: 15px;
    height: 82px;
    padding-left: 16px;
    padding-right: 16px;
    @media (max-width: 640px) {
      height: 60px;
    }
  `;
  export const BoxToken1 = styled.div`
    background: ${({ theme }) => theme.bgrToken};
    border-radius: 15px;
    height: 82px;
    padding-left: 16px;
    padding-right: 16px;
    margin-top: 14px;
    @media (max-width: 640px) {
      height: 60px;
    }
  `;

  export const SvitchBox = styled.div`
    position: absolute;
    z-index: 10;
    top: 41%;
    left: 2%;
  `;
  export const StyledReactTooltip = styled(ReactTooltip)`
    background: #5c6a86 !important;
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600 !important;
    word-wrap: break-word; /* IE 5.5-7 */
    white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
    white-space: pre-wrap; /* current browsers */
    line-height: 126.5%;
    @media screen and (max-width: 768px) {
      max-width: 250px !important;
    }
    &.place-top {
      padding: 0.3rem 1rem;
      &:after {
        border-top-color: #5c6a86 !important;
      }
    }
    &.place-left {
      padding: 0.3rem 1rem;
      &:after {
        border-left-color: #5c6a86 !important;
      }
    }
    &.place-right {
      padding: 0.3rem 1rem;
      &:after {
        border-right-color: #5c6a86 !important;
      }
    }
    &.place-bottom {
      padding: 0.3rem 1rem;
      &:after {
        border-bottom-color: #5c6a86 !important;
      }
    }
  `;

const handleValue = (value) => {
  let valueNew = value.toString();

  if (valueNew.length > 8) {
    valueNew = valueNew.substring(0, 8) + "...";
  }

  return valueNew;
};
export default function SwapModalHeader({
  trade,
  currencyIn,
  unitPrice,
  currencyOut,
  allowedSlippage,
  gas,
  amountIn,
  amountOut,
  minAmountOut,
  recipient,
  providerFee,
  showAcceptChanges,
  onAcceptChanges,
  priceImpact,
  minerBribe,
}: {
  trade: V2Trade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  gas;
  unitPrice: number;
  amountIn: string | null;
  amountOut: string | null;
  minAmountOut: string | null;
  providerFee: string | null;
  currencyIn: Currency;
  currencyOut: Currency;
  recipient: string | null;
  showAcceptChanges: boolean;
  priceImpact?: string | null;
  onAcceptChanges: () => void;
  minerBribe?: string;
}) {
  const { i18n } = useLingui();
  const crypto = require("crypto");

  const idTooltip = crypto.randomBytes(16).toString("hex");
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // const priceImpactSeverity = warningSeverity(trade.priceImpact);
  const priceImpactSeverity = 0;
  
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="sm:grid pt-3 pb-4">
      <div className="sm:grid gap-2 relative">
        <BoxToken className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StyleIcon>
              {isMobile ? (
                <CurrencyLogo currency={currencyIn || null} squared size={35} />
              ) : (
                <CurrencyLogo currency={currencyIn || null} squared size={48} />
              )}
            </StyleIcon>
            <BoldText
              className="overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl"
              data-tip={amountIn}
              data-for={idTooltip + "amountIn"}
              data-iscapture="true"
            >
              {amountIn}
              <StyledReactTooltip
                id={idTooltip + "amountIn"}
              ></StyledReactTooltip>
            </BoldText>
          </div>
          <BoldTextName className="ml-3 text-2xl font-medium">
            {/* {trade.inputAmount.currency.symbol} */}
            {currencyIn?.symbol}
          </BoldTextName>
        </BoxToken>
        <SvitchBox className="ml-3 mr-3 z-10 flex">
          {isMobile ? (
            <img src="/icons/icon-downMobile.svg" />
          ) : (
            <img src="/icons/icon-swapdown.svg" />
          )}
        </SvitchBox>
        <BoxToken1 className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StyleIcon>
              {isMobile ? (
                <CurrencyLogo
                  currency={currencyOut || null}
                  squared
                  size={35}
                />
              ) : (
                <CurrencyLogo
                  currency={currencyOut || null}
                  squared
                  size={48}
                />
              )}
            </StyleIcon>
            <BoldText
              className="overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl"
              data-tip={amountOut}
              data-for={idTooltip + "amountOut"}
              data-iscapture="true"
            >
              {amountOut}
              <StyledReactTooltip
                id={idTooltip + "amountOut"}
              ></StyledReactTooltip>
            </BoldText>
          </div>
          {/* <BoldText className="ml-3 text-2xl font-medium">
            {trade.outputAmount.currency.symbol}
          </BoldText> */}
          <BoldTextName className="ml-3 text-2xl font-medium">
            {currencyOut?.symbol}
          </BoldTextName>
        </BoxToken1>
      </div>
      <SmallText className="text-sm">
        {true ? (
          <>
            <div className="">
              {i18n._(t`Output is estimated. You will receive at least`)}{" "}
              
              {/* : */}
              <span
                
                data-tip={minAmountOut}
                data-for={idTooltip}
                data-iscapture="true"
                style={{lineHeight: "0.78"}}
              >
                {/* {minAmountOut} */}
                {handleValue(minAmountOut)} 
                <StyledReactTooltip id={idTooltip}></StyledReactTooltip>
              </span>
             
              {/* <b>
              {trade.minimumAmountOut(allowedSlippage).toSignificant(6)} {trade.outputAmount.currency.symbol}
              </b>{" "} */}
              {/* {isMobile ? */}
              {/* } */}
              &nbsp;{`${currencyOut?.symbol} ${i18n._(t`or the transaction will revert.`)}`} 
              {/* <p className="overflow-ellipsis w-[170px] overflow-hidden">
              {/* {minAmountOut} */}
              {/* {amountOut} */}
              {/* </p>{" "} */}
            </div>
          </>
        ) : (
          <Trans>
            {i18n._(t`Input is estimated. You will sell at most`)}{" "}
            {/* <b>
              {trade.maximumAmountIn(allowedSlippage).toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>{" "} */}
            <b></b> {i18n._(t`or the transaction will revert.`)}
          </Trans>
        )}
      </SmallText>
      <TradePrice
        price={unitPrice}
        inputName={currencyIn.symbol}
        outputName={currencyOut.symbol}
        showInverted={showInverted}
        setShowInverted={setShowInverted}
        className="px-0"
      />

      <AdvancedSwapDetails
        minAmountOut={minAmountOut}
        currencyIn={currencyIn}
        gas={gas}
        priceImpact={priceImpact}
        providerFee={providerFee}
        currencyOut={currencyOut}
        trade={trade}
        allowedSlippage={allowedSlippage}
        minerBribe={minerBribe}
      />

      {showAcceptChanges ? (
        <div className="flex items-center justify-between p-2 px-3 border border-gray-800 rounded">
          <div className="flex items-center justify-start text-sm font-bold uppercase text-high-emphesis">
            <div className="mr-3 min-w-[24px]">
              <AlertTriangle size={24} />
            </div>
            <span>{i18n._(t`Price Updated`)}</span>
          </div>
          <span
            className="text-sm cursor-pointer text-blue"
            onClick={onAcceptChanges}
          >
            {i18n._(t`Accept`)}
          </span>
        </div>
      ) : null}

      {/* {recipient !== null ? (
        <div className="flex-start">
          <Trans>
            Output will be sent to{" "}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient) : recipient}
            </b>
          </Trans>
        </div>
      ) : null} */}
    </div>
  );
}
