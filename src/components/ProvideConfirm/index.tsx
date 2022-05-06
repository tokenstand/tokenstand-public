import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Currency, CurrencyAmount, Percent } from "@sushiswap/sdk";
import styled from "styled-components";
import ConfirmAddModalBottom from "../../features/liquidity/ConfirmAddModalBottom";
import { Field } from "../../state/burn/actions";
import { useUserSlippageToleranceWithDefault } from "../../state/user/hooks";
import { convertToNumber } from "../../utils/convertNumber";
import { decimalAdjust, scientificToDecimal } from "../../utils/decimalAdjust";
import CloseIcon from "../CloseIcon";
import Modal from "../Modal";
import NewTooltip from "../NewTooltip";

const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

const ProvideConfirm = ({
  isOpenConfirm,
  onDismiss,
  handleDeposit,
  data,
  currencies,
  formattedAmounts,
}: {
  isOpenConfirm?: boolean;
  onDismiss: () => void;
  handleDeposit: () => void;
  data: any;
  currencies: { [field in Field]?: Currency };
  formattedAmounts: { [field in Field]?: CurrencyAmount<Currency> };

}) => {

  const { i18n } = useLingui();
  const { lpAmountMint, lpReceive, decimalsPool, isDeposit, shapeOfPool } = data;
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) // custom from users
  
  return (
    <Modal
      isOpen={isOpenConfirm}
      onDismiss={onDismiss}
      maxWidth={480}
      maxHeight={353}
    >
      <div className="sm:grid gap-3">
        <div>
          <div className="flex justify-between">
            <TitleStyle>{i18n._(t`You will receive`)}</TitleStyle>
            <CloseIcon onClick={onDismiss} />
          </div>
          <ReceiveBox className="pb-4">
          <div className="flex items-center justify-start gap-3">
            <div className="text-[2.275rem] font-bold text-high-emphesis">
              <TokenReceive>
                <NewTooltip dataTip={Number(lpAmountMint)
                  ? Number(lpAmountMint)
                  : scientificToDecimal(convertToNumber(lpReceive, decimalsPool))}
                  dataValue={
                    Number(lpAmountMint)
                      ? Number(lpAmountMint)
                      : scientificToDecimal(decimalAdjust("floor", convertToNumber(lpReceive, decimalsPool), -8))
                  }
                ></NewTooltip>
              </TokenReceive>
            </div>
          </div>
          <div className="text-2xl font-medium text-token">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            &nbsp;{i18n._(t`Pool Tokens`)}
          </div>
          <div className="pt-1 text-sm text-secondary sub-text">
            {t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(4)
              }% your transaction will revert.`}
          </div>
        </ReceiveBox>
      </div>
        <ConfirmAddModalBottom
          currencies={currencies}
          parsedAmounts={formattedAmounts}
          isDeposit={isDeposit}
          onAdd={handleDeposit}
          shareOfPool={shapeOfPool}
        />
      </div>
    </Modal>
  )
}

export default ProvideConfirm;

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   font-size: 18px;
  `};
`;

const ReceiveBox = styled.div`
  font-family: "SF UI Display";

  .text-token{
    font-size: 18px;
    line-height: 126.5%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    padding-bottom: 5px;
    color: ${({ theme }) => theme.priceAdd};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
    `};
  }
  .sub-text{
    font-size: 14px;
    line-height: 150%;
    color: ${({ theme }) => theme.subText};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     font-size: 10px;
    `};
  }
`

const TokenReceive = styled.p`
  font-weight: bold;
  font-size: 36px;
  line-height: 126.5%;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color: ${({ theme }) => theme.priceAdd};
  padding: 23px 0 11px 0;
  margin: 0;
`

