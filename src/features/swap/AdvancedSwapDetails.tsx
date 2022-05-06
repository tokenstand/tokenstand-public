import { ChainId, Currency, Ether, Percent, TradeType, Trade as V2Trade, CurrencyAmount, NativeCurrency } from '@sushiswap/sdk'
import React, { useContext, useMemo } from "react";
import { RowBetween, RowFixed } from "../../components/Row";
import { NATIVE } from "@sushiswap/sdk";
import { ANALYTICS_URL } from "../../constants";
import { AutoColumn } from "../../components/Column";
import ExternalLink from "../../components/ExternalLink";
import { Field } from "../../state/swap/actions";
import FormattedPriceImpact from "./FormattedPriceImpact";
import QuestionHelper from "../../components/QuestionHelper";
import SwapRoute from "./SwapRoute";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";
import { useUserSlippageTolerance } from "../../state/user/hooks";
import styled from 'styled-components'
import { computeRealizedLPFeePercent } from '../../functions';
import NewTooltip from '../../components/NewTooltip';

const SmText = styled.div`
  color: ${({ theme }) => theme.contentTitle};
  font-weight: 500;
  font-size: 16px;
  @media (max-width: 640px){
    font-size: 12px;
  }
  font-family: "SF UI Display";
`

const PriceReceived = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 500;
  font-size: 16px;
  @media (max-width: 640px){
    font-size: 12px;
  }
  font-family: "SF UI Display";
`

function TradeSummary({
  trade,
  currencyIn,
  currencyOut,
  gas,
  minAmountOut,
  providerFee,
  priceImpact,
  allowedSlippage,
}: {
  currencyIn: Currency | null,
  currencyOut: Currency | null,
  minAmountOut,
  gas,
  providerFee,
  priceImpact?: string |null,
  trade?: V2Trade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
}) {
  const { i18n } = useLingui();

  const { chainId } = useActiveWeb3React();
  const { realizedLPFee } = useMemo(() => {
    // if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    // const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent);
    const realizedLPFee = 1;

    
    const priceImpact = 1;

    return { priceImpact, realizedLPFee };
  }, [trade])

  return (
    <>
      <AutoColumn className="gap-y-1">
        <RowBetween>
            <RowFixed>
              <SmText>
                {i18n._(t`Price Impact`)}
              </SmText>
              <QuestionHelper
                text={i18n._(
                  t`The difference between the market price and estimated price due to trade size.`
                )}
              />
            </RowFixed>
            <PriceReceived>
            {priceImpact
              ?
              <NewTooltip dataTip={`${priceImpact}`} dataValue={`${priceImpact}%`}></NewTooltip>
              
              : '-'} 
               </PriceReceived>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <SmText>
                {i18n._(t`Liquidity Provider Fee`)}
              </SmText>
              <QuestionHelper
                text={i18n._(
                  t`A portion of each trade (0.3%) goes to liquidity providers as a protocol incentive.`
                )}
              />
            </RowFixed>
            <PriceReceived>
            {realizedLPFee
              ?
              <NewTooltip dataTip={`${providerFee} ${currencyIn?.symbol}`} dataValue={`${providerFee} ${currencyIn?.symbol}`}></NewTooltip>
              
              : '-'} 
            </PriceReceived>
          </RowBetween>
        <RowBetween>
          <RowFixed>
            <SmText >
              {i18n._(t`Transaction Cost`)}
            </SmText>
          </RowFixed>
          <RowFixed>
            <PriceReceived>
              <NewTooltip dataTip={`${gas} ${NATIVE[chainId].symbol}`} dataValue={`${gas} ${NATIVE[chainId].symbol}`}></NewTooltip>
            </PriceReceived>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    </>
  );
}
export interface AdvancedSwapDetailsProps {
  currencyIn,
  currencyOut,
  gas,
  minAmountOut,
  providerFee,
  trade?: V2Trade<Currency, Currency, TradeType>
  allowedSlippage?: Percent
  minerBribe?: string,
  priceImpact?: string | null
}

export function AdvancedSwapDetails({
  currencyIn,
  currencyOut,
  gas,
  minAmountOut,
  providerFee,
  priceImpact,
  trade, allowedSlippage, minerBribe } : AdvancedSwapDetailsProps) {
  const { i18n } = useLingui();
  const { chainId } = useActiveWeb3React();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="0px">
      {(
        <>
          <TradeSummary 
           currencyIn = {currencyIn}
           currencyOut = {currencyOut}
           minAmountOut = { minAmountOut }
           providerFee = { providerFee }
           priceImpact={priceImpact}
           gas={gas}
          trade={trade} allowedSlippage={allowedSlippage} />
          {/* {showRoute && (
            <>
              <RowBetween>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <div className="text-sm text-secondary">
                    {i18n._(t`Route`)}
                  </div>
                  <QuestionHelper
                    text={i18n._(
                      t`Routing through these tokens resulted in the best price for your trade.`
                    )}
                  />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )} */}
{/* 
          {!showRoute &&
            chainId &&
            [
              ChainId.MAINNET,
              ChainId.BSC,
              ChainId.FANTOM,
              ChainId.XDAI,
              ChainId.MATIC,
            ].includes(chainId) && (
              <div className="flex justify-center px-4 pt-3">
                <ExternalLink
                  href={`${
                    chainId && ANALYTICS_URL[chainId]
                      ? ANALYTICS_URL[chainId]
                      : "https://analytics.sushi.com"
                  }/pairs/${trade.route.pairs[0].liquidityToken.address}`}
                >
                  {i18n._(t`View pair analytics`)}
                </ExternalLink>
              </div>
            )} */}
        </>
      )}
    </AutoColumn>
  );
}
