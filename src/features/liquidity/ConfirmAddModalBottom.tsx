import React from "react";
import { Currency, CurrencyAmount, Fraction, Percent } from "@sushiswap/sdk";
import Button from "../../components/Button";
import { Field } from "../../state/mint/actions";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";
import styled from "styled-components";
import CurrencyLogo from "../../components/CurrencyLogo";
import { decimalAdjust, scientificToDecimal } from "../../utils/decimalAdjust";
import NewTooltip from "../../components/NewTooltip";
export function ConfirmAddModalBottom({
  isDeposit,
  currencies,
  parsedAmounts,
  onAdd,
  shareOfPool,
}: {
  isDeposit?: boolean;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> };
  onAdd: () => void;
  shareOfPool?: any;
}) {
  const { i18n } = useLingui();

  return (
    <BoxInfoToken>
      <div className="grid gap-1 pb-6">
        <div className="flex items-center justify-between py-1">
          <div className="text-sm text-token">
            {i18n._(
              t`${currencies[Field.CURRENCY_A]?.symbol} Deposited`
            )}
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            <div className="icon-token">
              <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size={16} />
            </div>
            <div className="price-token">
              <NewTooltip
                dataTip={scientificToDecimal(parsedAmounts[Field.CURRENCY_A])}
                dataValue={scientificToDecimal(decimalAdjust("floor", parsedAmounts[Field.CURRENCY_A], -8))}
              >
              </NewTooltip>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="text-sm text-token">
            {i18n._(
              t`${currencies[Field.CURRENCY_B]?.symbol} Deposited`
            )}
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis">
            <div className="icon-token">
              <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size={16} />
            </div>
            <div className="price-token">
              <NewTooltip
                dataTip={scientificToDecimal(parsedAmounts[Field.CURRENCY_B])}
                dataValue={scientificToDecimal(decimalAdjust("floor", parsedAmounts[Field.CURRENCY_B], -8))}
              >
              </NewTooltip>
            </div>
          </div>
        </div>
        <div className="grid gap-1">
          <div className="flex items-center justify-between py-1">
            <div className="text-sm text-high-emphesis text-token">{i18n._(t`Rates`)}</div>
            <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis number-token">
              {`
                1 ${currencies[Field.CURRENCY_A]?.symbol} =`}&nbsp;
                <NewTooltip style={{margin: '2px'}} 
                  dataTip={Number(parsedAmounts[Field.CURRENCY_B]) / Number(parsedAmounts[Field.CURRENCY_A])}
                  dataValue={decimalAdjust("floor", Number(parsedAmounts[Field.CURRENCY_B]) / Number(parsedAmounts[Field.CURRENCY_A]), -8)}
                >
                </NewTooltip>
                &nbsp;{`${currencies[Field.CURRENCY_B]?.symbol}
              `}
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis number-token">
              {`
                1 ${currencies[Field.CURRENCY_B]?.symbol} =`}&nbsp;
                <NewTooltip
                  dataTip={Number(parsedAmounts[Field.CURRENCY_A]) / Number(parsedAmounts[Field.CURRENCY_B])}
                  dataValue={decimalAdjust("floor", Number(parsedAmounts[Field.CURRENCY_A]) / Number(parsedAmounts[Field.CURRENCY_B]), -8)}
                >
                </NewTooltip>
                &nbsp;{`${currencies[Field.CURRENCY_A]?.symbol}
              `}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between group-percent">
          <div className="text-sm text-token">
            {i18n._(t`Share of Pool:`)}
          </div>
          <div className="text-sm font-bold justify-center items-center flex right-align pl-1.5 text-high-emphesis text-percent">
            {
              !isDeposit ?
                <NewTooltip dataValue="100%" dataTip="100%" /> :
                <NewTooltip dataValue={`${Number(shareOfPool).toFixed(2)} %`} dataTip={`${Number(shareOfPool)} %`} />
            }
          </div>
        </div>
      </div>
      <ButtonConfirm color="gradient" size="lg" onClick={onAdd}>
        {i18n._(t`Confirm Supply`)}
      </ButtonConfirm>
    </BoxInfoToken>
  );
}

export default ConfirmAddModalBottom;

const BoxInfoToken = styled.div`
font-family: "SF UI Display";

  .text-token{
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.lblToken};
     ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 12px;
      `};
  }

  .text-percent{
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    text-transform: capitalize;
    color: ${({ theme }) => theme.priceAdd};
  }

  .number-token{
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: ${({ theme }) => theme.priceAdd};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 12px;
    `};
    }
  .price-token{
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    letter-spacing: 0.015em;
    color: ${({ theme }) => theme.priceAdd};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      font-size: 12px;
    `};
  }
  .icon-token{
    margin-right: 5px;
    width: 16px;
    height: 16px;

    div {
      border-radius: 50%;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .group-percent{
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 10px 0 0 0;
    `};
  }
`
const ButtonConfirm = styled.button`
  background: ${({ theme }) => theme.greenButton};
  width: 100%;
  height: 63px;
  border-radius: 15px;
  font-size: 18px;
  line-height: 21px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  text-transform: capitalize;
  color: #FFFFFF;
  font-family: "SF UI Display";
  font-weight: bold;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
    height: 40px;
    border-radius: 10px;
  `};
`
