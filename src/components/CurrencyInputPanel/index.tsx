import { ChevronDownIcon } from "@heroicons/react/outline";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Currency, CurrencyAmount, Pair, Percent, Token } from "@sushiswap/sdk";
import { debounce } from "lodash";
import Lottie from "lottie-react";
import { darken } from "polished";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import selectCoinAnimation from "../../animation/select-coin.json";
import { getNativePrice, getTokenPrice } from "../../functions/tokenPrice";
import { useChainId } from "../../hooks";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { decimalAdjust } from "../../utils/decimalAdjust";
import Button from "../Button";
import CurrencyLogo from "../CurrencyLogo";
import DoubleCurrencyLogo from "../DoubleLogo";
import NewTooltip from "../NewTooltip";
import { Input as NumericalInput } from "../NumericalInput";
import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
import { MouseoverTooltip } from "../Tooltip";


const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 100%;
  font-size: 20px;
  font-weight: 500;
  // background-color: ${({ selected, theme }) =>
    selected ? theme.bg1 : theme.primary1};
  // color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  // border-radius: ${({ theme }) => theme.borderRadius};
  // box-shadow: ${({ selected }) =>
    selected ? "none" : "0px 6px 10px rgba(0, 0, 0, 0.075)"};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  // padding: 0 0.5rem;
  :focus,
  :hover {
    // background-color: ${({ selected, theme }) =>
    selected ? theme.bg2 : darken(0.05, theme.primary1)};
  }
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  //   ${({ active }) =>
    active
      ? "  margin: 0 0.25rem 0 0.75rem;"
      : "  margin: 0 0.25rem 0 0.25rem;"}
  //   font-size:  ${({ active }) => (active ? "24px" : "12px")};
`;

const InputPanel = styled.div`
  font-family: SF UI Display;
  .block-input {
    cursor: not-allowed;
  }
  .block-input :disabled{
  
  }
  background: ${({ theme }) => theme.bgInput};
  border-radius: 15px;
  .input-col {
    height: fit-content;
    justify-content: flex-end;
  }

  .dependent-value {
    color: ${({ theme }) => theme.textBold};
    background-color: transparent;
    font-size: 18px;
    font-weight: bold;
  }

  @media (max-width: 640px) {
    padding-left: 10px;
    padding-right: 16px;
    padding-top: 7px;
    padding-bottom: 7px;
  }
  @media (max-width: 1199px) {
    padding: 10px;
  }
`;

const StyleLogo = styled.div`
  img {
    border-radius: 50%;
  }
  svg {
    @media (max-width: 767px) {
      width: 35px;
    }
  }
`;

const TokenName = styled.div`
  color: ${({ theme }) => theme.textBold};
  font-size: 16px;
  font-weight: 600;
  @media (max-width: 767px) {
    font-size: 14px;
  }
  @media (max-width: 1199px) {
    font-size: 14px;
  }
`;

const NumericalInputStyle = styled(NumericalInput)`
  color: ${({ theme }) => theme.textBold};
  background-color: transparent;
  font-size: 18px;
  font-weight: bold;
  font-family: "SF UI Display";
  &::disabled{
    color: ${({ theme }) => theme.textBold} !important;
    background-color: transparent !important;
  }
  &::-webkit-input-placeholder { 
    color: ${({ theme }) => theme.smText};

  }
  
  &:-ms-input-placeholder {
    color: ${({ theme }) => theme.smText};

  }
  
  &::placeholder {
    color: ${({ theme }) => theme.smText};

  }

  
  @media (max-width: 640px) {
    width: 100%;
  }
  @media (max-width: 1199px) {
    font-size: 16px;
  }
`;
const NumericalInputStyleSwap = styled(NumericalInput)`
  color: ${({ theme }) => theme.textBold};
  background-color: transparent;
  font-size: 18px;
  font-weight: bold;
  font-family: "SF UI Display";
    padding-top: 18px;
  
  &::-webkit-input-placeholder { 
    color: ${({ theme }) => theme.smText};

  }
  
  &:-ms-input-placeholder {
    color: ${({ theme }) => theme.smText};

  }
  
  &::placeholder {
    color: ${({ theme }) => theme.smText};

  }

  &:disabled{
    color: ${({ theme }) => theme.textBold} !important;
    background-color: transparent !important;
  }

  @media (max-width: 767px){
    margin-top: 8px;
    width: 50px;
    font-size: 14px;
    padding-top: 0px;
  }
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.smText};
  font-weight: 500;
  font-size: 12px;
  @media (max-width: 640px) {
    font-size: 10px;
  }
  @media (max-width: 1199px) {
    font-size: 11px;
  }
`;
const SmallTextBalance = styled.div`
  color: ${({ theme }) => theme.smText};
  font-weight: 500;
  font-size: 12px;
  margin-top: 5px;
  white-space: nowrap;
  @media (max-width: 640px) {
    font-size: 10px;
    margin-top: -8px;
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    font-size: 11px;
  }
`;
const SmallTextUSD = styled.div`
font-weight: 500;
font-size: 12px;
line-height: 126.5%;
letter-spacing: 0.015em;
text-transform: capitalize;
color: ${({ theme }) => theme.smText};
margin-top: 5px;
@media screen and (max-width: 640px) {
  font-size: 10px;
}
`

const SmallButton = styled(SmallText)`
  border: 1px solid ${({ theme }) => theme.borderSwitch};
`;

const ButtonMax = styled(Button)`
  color: #72bf65;
  font-weight: 500;
  font-size: 12px;
  border: 1px solid #72bf65;
  width: 43px;
  height: 22px;
  padding: 0px;
  border-radius: 30px;
  margin-top: 22px;
  @media (max-width: 767px){
    margin-top: 8px;
    width: 50px;
    height: 19px;
    text-transform: uppercase;
    font-size: 10px;
    margin-right: 5px;
  }
  @media (min-width: 1024px) and (max-width: 1199px) {
    margin-top: 23px;
    width: 63px;
    height: 19px;
    text-transform: uppercase;
    font-size: 10px;
  }
`;

const MouseoverTooltipNumber = styled(MouseoverTooltip)`
  width: 35%;
  .style-number {
    font-weight: 600;
    text-align: right;
    font-size: 16px;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.textTotal};
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const Block = styled.div`
  
  
  > div:first-child {
    width: 70%;
    @media (max-width: 640px){
      width: 79%;
    }
  }
  > div + div{
    width: 70%;
    @media (max-width: 640px){
      width: 79%;
    }
  }
  button + div {
    width: 40%;
  }


  button + div + div {
    width: 60% !important;
    @media (max-width: 640px){
      width: 45% !important;
    }
    @media (max-width: 1199px) {
      width: 70% !important;
      }
  }
 
  > div + div:last-child {
    justify-content: space-around;
    width: 100%;
  }
  @media (max-width: 640px){
    padding-left: 0px;
  }
 
`;
const ChevronDownIconStyle = styled(ChevronDownIcon)`
  stroke: ${({ theme }) => theme.primaryText3};
@media (max-width: 1199px) {
  margin-left: 1px;
  width: 11px;
  }
  @media (max-width: 767px) {
    margin-left: 5px;
    width: 11px;
    }
`
const BlockText = styled.div`
  @media(max-width: 414px){
    margin-left: 5px;
    margin-right: 5px;
  }
  @media(max-width: 767px){
    margin-left: 7px;
    // width: 75px;
  }
  
`
export const StyledReactTooltip = styled(ReactTooltip)`
background: #5C6A86 !important;
font-family: SF UI Display;
font-style: normal;
font-weight: 600 !important;
line-height: 126.5%;
word-wrap: break-word;      /* IE 5.5-7 */
white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
white-space: pre-wrap;      /* current browsers */
@media screen and (max-width:768px){
    max-width:250px !important;
}
&.place-top {
    padding: 0.3rem 1rem;
    &:after{
      border-top-color: #5C6A86 !important;
    }
}
&.place-left {
  padding: 0.3rem 1rem;
  &:after{

    border-left-color: #5C6A86 !important;
  }
}
&.place-right {
  padding: 0.3rem 1rem;
  &:after{

    border-right-color: #5C6A86 !important;
  }
}
&.place-bottom {
  padding: 0.3rem 1rem;
  &:after{

    border-bottom-color: #5C6A86 !important;
  }
} 

`

interface CurrencyInputPanelProps {
  isLock?: boolean;
  addPool?: boolean;
  isInput?: boolean;
  value?: string;
  onUserInput?: (value: string) => void;
  onMax?: () => void;
  showMaxButton?: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  fiatValue?: CurrencyAmount<Token> | null;
  priceImpact?: Percent;
  id: string;
  showCommonBases?: boolean;
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode;
  locked?: boolean;
  customBalanceText?: string;
  inputRequire?: boolean;
  decimals?: number;
  minValue?: number;
  priceToken?: number;
  showPrice?: boolean;
  loadingBestPriceLimit?: boolean
  valueInput?: any
  isLimitOrder?: boolean
}

export default function CurrencyInputPanel({
  isLock,
  addPool,
  isInput,
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = "Input",
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  customBalanceText,
  inputRequire = false,
  decimals = 18,
  minValue = 0,
  priceToken,
  showPrice = true,
  loadingBestPriceLimit,
  valueInput,
  isLimitOrder
}: CurrencyInputPanelProps) {
  const { i18n } = useLingui();
  const [modalOpen, setModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const { chainId } = useChainId()
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const [amount, setAmount] = useState('');
  
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);
  const [valueUSDC, setValueUSDC] = useState("0");

  const getPriceInput = async () => {
    let amountCheck = amount && id==="swap-currency-input" ? amount : value
    if ((currency as any)?.address) {
      setValueUSDC('0.00');
      const price = await getTokenPrice((currency as any)?.address, chainId);
      const valueUSDC = amountCheck && amountCheck !=='.' && Number(amountCheck) != Infinity && Number(amountCheck) != NaN? (Number(amountCheck) * Number(price)).toFixed(2) : '0.00';
      setValueUSDC(valueUSDC);
    }
    if (currency?.isNative) {
      setValueUSDC('0.00');
      const price = await getNativePrice(chainId);
      const valueUSDC = amountCheck && amountCheck !=='.' && Number(amountCheck) != Infinity && Number(amountCheck) != NaN? (Number(amountCheck) * Number(price)).toFixed(2) : '0.00';
      setValueUSDC(valueUSDC);
    }  
  };
  useEffect(() => {
    !addPool && getPriceInput();
  }, [currency,amount, value]);

  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  const handlevalue = (value) => {
    let valueNew = value;
    if (value.length > 5) {
        valueNew = value.substring(0, 5) + "...";
      }
    return valueNew;
  };

  const handleUSD = (value) => {
    let valueNew = value;
    if (label === "Swap From:") {
      if (value.length > 2) {
        valueNew = value.substring(0, 7) ;
      }
    } else {
      if (value.length > 5) {
        valueNew = value.substring(0, 5) + "...";
      }
    }
    return valueNew;
  };
  const handleUSDMB = (value) => {
    let valueNew = value;
      if (value.length > 5) {
        valueNew = value.substring(0, 4) + "...";
      }
    
    return valueNew;
  };

  const debounceAmountChange = useCallback(
    debounce((value: string) => {
      onUserInput(value);
    }, 500),
    []
  );

  const handleAmountChange = (value: string) => {
    setAmount(value);
    debounceAmountChange(value);
  };

  useEffect(() => {
    setAmount('');
  }, [chainId, account]);

  useEffect(() => {
    if(Number(value) !== Number(amount)){
      setAmount(value);
    }
  }, [value]);

  return (
    <InputPanel
      id={id}
      className={[
        addPool ? "add-pool-container px-5" : "input-style p-5",
        inputRequire && "error-border",
      ]}
    >
      {addPool ? (
        <>
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true);
              }
            }}
          >
            <div className="flex">
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={54}
                  margin={true}
                />
              ) : currency ? (
                <StyleLogo className="flex items-center">
                  {isMobile ? (
                    <CurrencyLogo currency={currency} size={"35px"} />
                  ) : (
                    <CurrencyLogo currency={currency} size={"48px"} />
                  )}
                </StyleLogo>
              ) : (
                <div
                  className="rounded"
                  style={{ maxWidth: 48, maxHeight: 48 }}
                >
                  <div style={{ width: 48, height: 48 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <div className="flex flex-1 flex-col items-start justify-center mx-3.5">
                  {label && (
                    <SmallText className="text-xs font-medium">
                      {i18n._(t`${label}`)}
                    </SmallText>
                  )}
                  <div className="flex items-center">
                    {/* <StyledTokenName
                                              className="token-symbol-container"
                                              active={Boolean(currency && currency.symbol)}
                                          > */}
                    <TokenName className="text-lg font-bold">
                      {(currency &&
                        currency.symbol &&
                        currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                        "..." +
                        currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )
                        : currency?.symbol) || (
                          <SmallButton className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full  whitespace-nowrap ">
                            {i18n._(t`Select a token`)}
                          </SmallButton>
                        )}
                    </TokenName>
                    {/* </StyledTokenName> */}
                    {!disableCurrencySelect && currency && (
                      <ChevronDownIcon
                        width={16}
                        height={16}
                        className="ml-1 stroke-current"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </CurrencySelect>
          {isLock && (
            <div style={{ color: "red", marginTop: "13px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}
          <div className="flex items-center w-full space-x-3 rounded input-col">
            <div className="flex flex-col justify-end">
              {account && (
                <div className="flex flex-col">
                  <SmallText
                    onClick={onMax}
                    className="text-right cursor-pointer "
                  >
                    {" "}
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? decimalAdjust("floor", selectedCurrencyBalance?.toExact(), -5)
                      : " -"}
                  </SmallText>
                  {/* {chainId && showPrice && (
                    <div className="text-xs font-medium text-right text-secondary">
                      ≈ {priceToken || 0} USD
                    </div>
                  )} */}
                </div>
              )}
              <div
                data-tip={amount && amount.length > 0 ? amount : "0.0"}
                data-tip-disable={false}
                data-for={id + "tooltip"}
                data-iscapture='true'
              >
                <NumericalInputStyle
                  style={{ width: "100%" }}
                  disabled={isInput || !selectedCurrencyBalance?.toSignificant(6)}
                  value={amount || value}
                  onUserInput={(val) => handleAmountChange(val)}
                  className="text-right"
                  decimals={decimals}
                  minValue={minValue}
                />
                <StyledReactTooltip id={id + "tooltip"} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-between space-y-3 sm:space-y-0 sm:flex-row box-currency">

          <div className="sm:w-2/5">
            <CurrencySelect
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true);
                }
              }}
            >
              <div className="flex">
                {pair ? (
                  <DoubleCurrencyLogo
                    currency0={pair.token0}
                    currency1={pair.token1}
                    size={54}
                    margin={true}
                  />
                ) : currency ? (
                  <StyleLogo className="flex items-center">
                    {isMobile ? (
                      <CurrencyLogo currency={currency} size={"35px"} />
                    ) : (
                      <CurrencyLogo currency={currency} size={"48px"} />
                    )}
                  </StyleLogo>
                ) : (
                  <div
                    className="rounded"
                    style={{ maxWidth: 48, maxHeight: 48 }}
                  >
                    <div style={{ width: 48, height: 48 }}>
                      <Lottie
                        animationData={selectCoinAnimation}
                        autoplay
                        loop
                      />
                    </div>
                  </div>
                )}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0?.symbol}:{pair?.token1?.symbol}
                  </StyledTokenName>
                ) : (
                  <BlockText className="flex flex-1 flex-col items-start justify-center sm:mx-3.5">
                    {label && (
                      <SmallText className="text-xs font-medium whitespace-nowrap">
                        {i18n._(t`${label}`)}
                      </SmallText>
                    )}
                    <div className="flex items-center">
                      <TokenName className="text-lg font-bold">
                        {(currency &&
                          currency.symbol &&
                          currency?.symbol.length > 20
                          ? currency?.symbol.slice(0, 4) +
                          "..." +
                          currency?.symbol.slice(
                            currency?.symbol.length - 5,
                            currency?.symbol.length
                          )
                          : currency?.symbol) || (
                            <SmallButton className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full  whitespace-nowrap ">
                              {i18n._(t`Select a token`)}
                            </SmallButton>
                          )}
                      </TokenName>
                      {!disableCurrencySelect && currency && (
                        <ChevronDownIconStyle
                          width={16}
                          height={16}
                          className="ml-2 stroke-current"
                        />
                      )}
                    </div>
                  </BlockText>
                )}
              </div>
            </CurrencySelect>
          </div>
          <Block className="flex w-full pl-3 sm:space-x-3 space-x-0 rounded sm:w-3/5">
            {!hideInput && (
              <>
                {account && currency && showMaxButton && label !== "To" && (
                  <ButtonMax
                    onClick={onMax}
                    size="xs"
                    className="text-xs font-medium bg-transparent border rounded-full whitespace-nowrap"
                  >
                    {i18n._(t`Max`)}
                  </ButtonMax>
                )}
                {account ? (
                  // <Tooltip
                  //   text={value}
                  //   show={showValue}

                  // >

                  <>
                    <div data-tip={  id ==="swap-currency-output" ? (value && value.length > 0 ? value : "0.0") : (amount && amount.length > 0 ? amount : "0.0")}
                      data-tip-disable={false}
                      data-for={id + "tooltip"}
                      data-iscapture='true'
                      >
                      <NumericalInputStyleSwap
                        // onMouseEnter={openToolTipValue}
                        // onMouseLeave={closeToolTipValue}
                        id={id}
                        value={amount || value}
                        onUserInput={(val) => {
                          !isInput && handleAmountChange(val);
                        }}
                        className={isInput && "block-input"}
                        disabled={id === "swap-currency-output" || loadingBestPriceLimit? true : false || isLimitOrder&&(!valueInput || Number(valueInput) == 0)}
                        style={{ width: "100%" }}
                      />
                      <StyledReactTooltip id={id + "tooltip"} />
                    </div>

                  </>
                ) : (
                  // </Tooltip>
                  <>
                    <div
                      data-tip={amount}
                      data-tip-disable={false}
                      data-for={id + "tooltip2"}
                      data-iscapture='true'
                    >
                      <NumericalInputStyle
                        id={id}

                        value={amount || value}
                        onUserInput={(val) => {
                          !isInput && handleAmountChange(val);
                        }}
                        className="text-right sm:top-1 sm:right-4"
                        disabled={id === "swap-currency-output" || loadingBestPriceLimit? true : false || isLimitOrder&&!valueInput}
                        decimals={decimals}
                        minValue={minValue}
                      />
                      <StyledReactTooltip id={id + "tooltip2"}/>
                    </div>

                  </>

                )}

                {account && (
                  <>
                    <div className="text-right ">
                      <SmallTextBalance
                        onClick={onMax}
                        className="cursor-pointer "
                        onMouseEnter={open}
                        onMouseLeave={close}
                        data-tip={!hideBalance && !!currency && selectedCurrencyBalance
                          ? selectedCurrencyBalance?.toExact() : " -"}
                        data-iscapture='true'
                        data-for={id+'balane-tooltip'}
                      >
                        {!hideBalance && !!currency && selectedCurrencyBalance
                          ? (customBalanceText ?? `${i18n._(t`Balance`)}: `) +
                          handlevalue(
                            selectedCurrencyBalance?.toExact()
                          )
                          : " -"}
                      </SmallTextBalance>
                      
                      <StyledReactTooltip id={id+'balane-tooltip'}/>
                      {chainId && (
                        <SmallTextUSD className="text-xs font-medium text-right text-secondary count-usd">
                          {/* ≈ ${valueUSDC} */}
                          {isMobile ?
                            <NewTooltip dataTip={valueUSDC} dataValue={` ≈ $${handleUSDMB(valueUSDC)}`}></NewTooltip>
                          :
                          <NewTooltip dataTip={valueUSDC} dataValue={` ≈ $${handleUSD(valueUSDC)}`}></NewTooltip>
                          }
                         
                        </SmallTextUSD>
                      )}
                    </div>

                  </>
                )}
              </>
            )}
          </Block>
        </div>
      )}
      {!disableCurrencySelect && onCurrencySelect && modalOpen && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  );
}
