import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { Dropdown, Menu } from "antd";
import { LIMIT_ORDER_ADDRESS, NATIVE_TOKEN_ADDRESS } from "../../../constants";
import styled from "styled-components";
import CurrencyInputPanel from "../../../components/CurrencyInputPanel";
import Big from "big.js";
import { maxAmountSpend } from "../../../functions/currency";
import {
  ApprovalState,
  useApproveCallback,
  useChainId,
  useLimitOrderContract,
  useProvider,
} from "../../../hooks";
import {
  useDefaultsFromURLSearch,
  useDerivedLimitOrderInfo,
  useLimitOrderActionHandlers,
  useLimitOrderState,
} from "../../../state/limit-order/hook";
import { ButtonConfirmed } from "../../../components/Button";
import {
  calculateGasMargin,
  escapeRegExp,
  tryParseAmountLimitOrder,
} from "../../../functions";
import { AutoRow } from "../../../components/Row";
import Loader from "../../../components/Loader";
import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { useCurrencyBalance } from "../../../state/wallet/hooks";
import { useIsDarkMode, useUserSingleHopOnly } from "../../../state/user/hooks";
import Web3Connect from "../../../components/Web3Connect";
import { useAllTokens, useCurrency } from "../../../hooks/Tokens";
import { Token } from "@sushiswap/sdk";
import TokenWarningModal from "../../../components/TokenWarningModal";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import { fetchBestRoutes } from "../../../context/globalData";
import {
  LimitOrderBuilder,
  Web3ProviderConnector,
} from "@sotatek-anhdao/tokenstand-limit-order-development";
import Web3 from "web3";
import { Field } from "../../../state/limit-order/actions";
import axios from "axios";
import moment from "moment";
import TransactionFailedModal from "../../../components/TransactionFailedModal";
import { useTransactionAdder } from "../../../state/transactions/hooks";
import PopUpTransaction from "./PopUpTransaction";
import PriceTradeOrder from "./PriceTradeOrder";
import OrderModalConfirm from "./OrderList/OrderModalConfirm";
import { StyledReactTooltip } from "../../swap/SwapModalHeader";
import PopUpWaiting from "./PopUpWaiting";
import { numberExponentToLarge } from "../../../utils";
import { debounce } from "lodash";

const Input = styled.input`
  border-radius: 15px;
  background: ${({ theme }) => theme.bgInput};
  color: ${({ theme }) => theme.textBold};
  font-weight: 600;
  padding: ${(props) => (props.isMobile ? "15px 4px 15px 15px" : "15px ")};
  font-size: ${(props) => (props.isMobile ? "10px" : "16px")};
  width: 100%;
`;
const MidBlock = styled.div`
  display: flex;
  gap: 16px;
  margin: 16px 0px;
  .input-block {
    border-radius: 15px;
    background: ${({ theme }) => theme.bgInput};
  }
`;

const ButtonOrder = styled.button`
  background: ${({ theme }) => theme.greenButton};
  width: 100%;
  font-size: ${(props) => (props.isMobile ? "14px" : "18px")};
  padding: ${(props) => (props.isMobile ? "9px" : "16px")};
  font-weight: 700;
  color: ${({ theme }) => theme.white};
  border-radius: 15px;
  margin-top: 1rem;

  img {
    margin-right: 8px;
  }
`;

const ButtonDisable = styled(ButtonOrder)`
  background: ${({ theme }) => theme.buttonDisable};
  color: rgba(255, 255, 255, 0.5);
  img {
    opacity: 0.5;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.text1};
  opacity: 0.6;
  font-weight: 600;
  font-size: ${(props) => (props.isMobile ? "12px" : "16px")};
  padding: 0px 9px 9px 9px;
`;

const ButtonSelect = styled.button`
  background: ${({ theme }) => theme.bgInput};
  color: ${({ theme }) => theme.textBold};
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  padding: 15px;
  font-size: ${(props) => (props.isMobile ? "10px" : "16px")};
  width: 100%;
`;

const SwitchSwap = styled.div`
  background: ${({ theme }) => theme.bgSwitch};
  border: 1px solid ${({ theme }) => theme.borderSwitch};
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    width: 24px;
    height: 24px;
  }
  svg {
    path {
      fill: ${({ theme }) => theme.iconSwitch};
    }
  }
`;

const BlockPrice = styled.div`
  display: flex;
  background: ${({ theme }) => theme.bgInput};
  border-radius: 15px;
  justify-items: center;
  align-items: center;
  .token-name {
    font-size: ${(props) => (props.isMobile ? "12px" : "16px")};
    padding-right: 10px;
    background: ${({ theme }) => theme.bgInput};
    color: ${({ theme }) => theme.subText};
    cursor: pointer;
  }
`;

const OrderBlock = styled.div`
  .button-connect {
    background: ${({ theme }) => theme.greenButton};
    color: ${({ theme }) => theme.white};
    margin-top: 30px;
  }

  .btn-confirmed {
    padding: ${isMobile ? "6px" : "16px"} !important;
  }
`;

const setTime = [
  {
    text: "10 Minutes",
    value: 10,
  },
  {
    text: "1 Hour",
    value: 60,
  },
  {
    text: "1 Day",
    value: 1440,
  },
  {
    text: "3 Days",
    value: 4320,
  },
  {
    text: "7 Days",
    value: 10080,
  },
  // {
  //   text: "30 Days",
  //   value: 43200,
  // },
  // {
  //   text: "3 Months",
  //   value: 129600,
  // },
  // {
  //   text: "6 Months",
  //   value: 259200,
  // },
  // {
  //   text: "1 Year",
  //   value: 525600,
  // },
  // {
  //   text: "2 Years",
  //   value: 1051200,
  // },
  // {
  //   text: "3 Years",
  //   value: 1576800,
  // },
];

const regexInput = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

const checkDecimalLength = (num) => {
  const numCheck = typeof num == "number" ? num.toString() : num;

  if (!numCheck?.includes("."))
    return numCheck.length > 20 ? numCheck.substring(0, 20) : numCheck;
  let first = numCheck.split(".")[0];

  if (first.length > 20) {
    first = first.substring(0, 20);
  }
  let decimal = numCheck.split(".")[1];
  if (decimal.length <= 18) return numCheck;
  else {
    decimal = decimal.substring(0, 18);

    return `${first}.${decimal}`;
  }
};

const checkDecimalLengthCurrency = (num, decimalCurrency) => {
  const numCheck = typeof num == "number" ? num.toString() : num;

  if (!numCheck?.includes("."))
    return numCheck.length > 20 ? numCheck.substring(0, 20) : numCheck;
  let first = numCheck.split(".")[0];
  if (first.length > 20) {
    first = first.substring(0, 20);
  }
  let decimal = numCheck.split(".")[1];
  if (decimal.length <= decimalCurrency) return numCheck;
  else {
    decimal = decimal.substring(0, decimalCurrency);

    return `${first}.${decimal}`;
  }
};

export default function LimitOrder({ showSuccess, setShowSuccess }) {
  const { chainId } = useChainId();
  const { account, library } = useWeb3React();
  const darkMode = useIsDarkMode();
  const [isSelect, setSelect] = useState(setTime[4].text);
  const [valuePrice, setValuePrice] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [valueOutput, setValueOutput] = useState<any>();
  const [showReject, setShowReject] = useState<boolean>(false);
  const [openVerify, setOpenVerify] = useState<boolean>(false);
  const [openWaiting, setOpenWaiting] = useState<boolean>(false);

  const addTransaction = useTransactionAdder();

  const limitOrderContract = useLimitOrderContract();

  // const { provider } = useProvider();
  const web3 = new Web3(library);
  //@ts-ignore
  const connector = new Web3ProviderConnector(web3);

  const limitOrderBuilder = new LimitOrderBuilder(
    LIMIT_ORDER_ADDRESS[chainId],
    chainId,
    connector
  );

  const { independentField, typedValue } = useLimitOrderState();
  const { currencies, parsedAmounts, walletBalances } =
    useDerivedLimitOrderInfo();
  const { onSwitchTokens, onCurrencySelection, onUserInput } =
    useLimitOrderActionHandlers();
  const loadedUrlParams = useDefaultsFromURLSearch();

  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];

  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );

  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const [isType, setIsType] = useState(true);
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const maxAmountInput = maxAmountSpend(walletBalances[Field.INPUT]);
  const maxAmountOutput = maxAmountSpend(walletBalances[Field.OUTPUT]);

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
    setValueInput(maxAmountInput.toExact());
    valuePrice && maxAmountInput.toExact() !== ""
      ? setValueOutput(
          tokenOuputPrice
            ? checkDecimalLength(
                numberExponentToLarge(
                  Number(maxAmountInput.toExact()) * Number(valuePrice)
                )
              )
            : checkDecimalLength(
                numberExponentToLarge(
                  Number(maxAmountInput.toExact()) / Number(valuePrice)
                )
              )
        )
      : setValueOutput("");
  }, [maxAmountInput, onUserInput]);

  const handleMaxOutput = useCallback(() => {
    if (valueInput && valueInput !== "." && Number(valueInput) !== 0) {
      maxAmountOutput && onUserInput(Field.OUTPUT, maxAmountOutput.toExact());
      setValueOutput(maxAmountOutput.toExact());

      setValuePrice(
        tokenOuputPrice &&
          Number(maxAmountOutput.toExact()) !== 0 &&
          valueInput !== ""
          ? checkDecimalLength(
              numberExponentToLarge(
                Number(maxAmountOutput.toExact()) / Number(valueInput)
              )
            )
          : Number(maxAmountOutput.toExact()) !== 0
          ? checkDecimalLength(
              numberExponentToLarge(
                Number(valueInput) / Number(maxAmountOutput.toExact())
              )
            )
          : ""
      );
    }
  }, [maxAmountOutput, onUserInput]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
      setValueOutput("");
      setValuePrice("");
    },
    [onCurrencySelection]
  );

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      setValueOutput("");
      setValuePrice("");
    },
    [onCurrencySelection]
  );

  const handleDismisReject = () => {
    setShowReject(false);
  };

  const handleDismisSuccess = () => {
    setShowSuccess(false);
  };

  const handleDismisVerify = () => {
    setOpenVerify(false);
  };

  const [approvalState, approveCallback] = useApproveCallback(
    currencies[Field.INPUT] &&
      tryParseAmountLimitOrder(valueInput, currencies[Field.INPUT]),
    LIMIT_ORDER_ADDRESS[chainId]
  );

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  const handleApprove = async () => {
    if (approvalState !== ApprovalState.APPROVED) {
      await approveCallback();
    }
  };

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currencies[Field.INPUT] ?? undefined
  );
  const balanceTokenFormat = () => {
    try {
      return selectedCurrencyBalance?.toExact();
    } catch (e) {
      return "0";
    }
  };

  let amount: string = isType
    ? formattedAmounts[Field.INPUT]
    : formattedAmounts[Field.OUTPUT];

  amount =
    amount && !isNaN(Number(amount))
      ? parseEther(checkDecimalLength(amount)).toString()
      : "";

  const handleMenuClick = (e) => {
    const selectedDate = setTime[e.key];
    setSelect(selectedDate.text);
  };

  const menuDay = (
    <Menu onClick={handleMenuClick} theme={darkMode ? "dark" : "light"}>
      {setTime.map((item, key) => (
        <Menu.Item key={key}>{item.text}</Menu.Item>
      ))}
    </Menu>
  );

  const [tokenOuputPrice, setTokenOutputPrice] = useState(true);

  // numberExponentToLarge  fix case:  fomat e pow (ex:  1e-10)
  const handleTypeInput = useCallback(
    (value: string) => {
      setIsType(true);
      onUserInput(Field.INPUT, value);
      setValueInput(checkDecimalLength(value));
      valuePrice && value !== ""
        ? setValueOutput(
            tokenOuputPrice
              ? checkDecimalLength(
                  numberExponentToLarge(Big(value).times(valuePrice))
                )
              : checkDecimalLength(
                  numberExponentToLarge(Number(value) / Number(valuePrice))
                )
          )
        : setValueOutput("");

      value === "" && setValuePrice("");
    },
    [onUserInput, valuePrice, tokenOuputPrice]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      setIsType(false);
      onUserInput(Field.OUTPUT, value);
      setValueOutput(checkDecimalLength(value));
      setValuePrice(
        tokenOuputPrice &&
          Number(value) !== 0 &&
          value !== "." &&
          valueInput !== ""
          ? checkDecimalLength(
              numberExponentToLarge(Number(value) / Number(valueInput))
            )
          : Number(value) !== 0 && value !== "."
          ? checkDecimalLength(
              numberExponentToLarge(Number(valueInput) / Number(value))
            )
          : ""
      );
    },
    [onUserInput, valueInput, tokenOuputPrice]
  );

  const handleValuePrice = (e) => {
    if (regexInput.test(escapeRegExp(e.target.value))) {
      setValuePrice(checkDecimalLength(e.target.value));
      valueInput !== "." &&
        e.target.value !== "" &&
        setValueOutput(
          tokenOuputPrice
            ? checkDecimalLength(
                numberExponentToLarge(Big(e.target.value).times(valueInput))
              )
            : Number(e.target.value) !== 0
            ? checkDecimalLength(
                numberExponentToLarge(
                  Number(valueInput) / Number(e.target.value)
                )
              )
            : "0"
        );
    }
  };
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  const [isToggleOwnPool] = useUserSingleHopOnly();
  const [loadingBestPrice, setLoadingBestPrice] = useState(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const fetchBestPrice = async () => {
    setLoadingBestPrice(true);
    setShowNotFound(false);
    try {
      if (amount == "0") {
        setShowNotFound(true);
        setLoadingBestPrice(false);
        return;
      }

      const currencyIn: any = currencies[Field.INPUT];
      const currencyOut: any = currencies[Field.OUTPUT];

      const currencyInFinal = currencyIn?.address
        ? currencyIn?.address
        : "0x0000000000000000000000000000000000000000";
      const currencyOutFinal = currencyOut?.address
        ? currencyOut?.address
        : "0x0000000000000000000000000000000000000000";
      const params = {
        tokenFrom: String(currencyInFinal),
        tokenTo: String(currencyOutFinal),
        decimalsFrom: currencyIn?.decimals,
        decimalsTo: currencyOut?.decimals,
        chainId: chainId,
        // amount: amountUserInput.toFixed(18),
        amount: formatEther(amount),
        helioswap: !isToggleOwnPool,
        parts: [1, 56].includes(chainId) ? 100 : 100,
        maxHops: [1, 56].includes(chainId) ? 2 : 3,
      };
    
      if (Number(valueInput) != 0) {
        const bestRoutesData = await fetchBestRoutes(params);
        if (bestRoutesData == "cancel") {
          return;
        }
        
        if (
          bestRoutesData &&
          bestRoutesData?.data &&
          bestRoutesData?.data?.data.returnAmount != 0
        ) {
          setShowNotFound(false);

          const amountReturn = formatUnits(
            bestRoutesData.data.data?.totalReturnAmount.hex,
            currencies[Field.OUTPUT]?.decimals
          ).toString();
          
          if (valueInput !== "") {
            setValueOutput(amountReturn);

            setValuePrice(
              tokenOuputPrice
                ? checkDecimalLength(
                    numberExponentToLarge(
                      Number(amountReturn) / Number(valueInput)
                    )
                  )
                : Number(amountReturn) !== 0
                ? checkDecimalLength(
                    numberExponentToLarge(
                      Number(valueInput) / Number(amountReturn)
                    )
                  )
                : "0"
            );
          } else {
            setValueOutput("");
            setValuePrice("");
          }
        } else {
          setShowNotFound(true);
        }
        setLoadingBestPrice(false);
      }
    } catch (e) {
      console.log(e);
      setLoadingBestPrice(false);
    }
  };

  useMemo(
    () => fetchBestPrice(),
    [
      (currencies[Field.INPUT] as any)?.address,
      (currencies[Field.OUTPUT] as any)?.address,
      account
    ]
  );

  useMemo(() => {
    setValueOutput("");
    setValueInput("")
    setValuePrice("");
  }, [account]);

  useEffect(() => {
    !valuePrice && fetchBestPrice();
    // getDefaultUnitPrice();
  }, [valueInput]);

  const checkBalance = (valueType) => {
    if (Number(balanceTokenFormat()) >= (valueType ? Number(valueType) : 0)) {
      return true;
    }
    return false;
  };

  const tokenInputAddress = (currencies[Field.INPUT] as any)?.address
    ? (currencies[Field.INPUT] as any)?.address
    : NATIVE_TOKEN_ADDRESS;
  const tokenOutputAddress = (currencies[Field.OUTPUT] as any)?.address
    ? (currencies[Field.OUTPUT] as any)?.address
    : NATIVE_TOKEN_ADDRESS;

  const handlePlaceOrder = async () => {
    const valueInputBigNumber = parseUnits(
      checkDecimalLengthCurrency(valueInput, currencies[Field.INPUT].decimals),
      currencies[Field.INPUT].decimals
    ).toString();
    const valueOutputBigNumber = parseUnits(
      checkDecimalLengthCurrency(
        valueOutput,
        currencies[Field.OUTPUT].decimals
      ),
      currencies[Field.OUTPUT].decimals
    ).toString();

    const timeSelect = setTime.filter((time) => time.text === isSelect);
    const timeUTC = moment().add(timeSelect[0].value, "m").valueOf();

    const limitOrder = limitOrderBuilder.buildLimitOrder({
      makerAssetAddress: tokenInputAddress,
      takerAssetAddress: tokenOutputAddress,
      makerAddress: account,
      makerAmount: valueInputBigNumber,
      takerAmount: valueOutputBigNumber,
      predicate: "0x",
      permit: "0x",
      interaction: "0x",
    });

    try {
      setOpenWaiting(true);
      setOpenVerify(false);

      const limitOrderTypedData =
        limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
      const limitOrderHash =
        limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);
      const signature = await limitOrderBuilder.buildOrderSignature(
        account,
        limitOrderTypedData
      );

      const getOrder = await axios({
        method: "GET",
        url: `${
          process.env.NEXT_PUBLIC_API_LIMIT_ORDER
        }/api/limit-order?makerAssetAddress=${tokenInputAddress}&takerAssetAddress=${tokenOutputAddress}&makerAddress=${account}&makerAmount=${Number(
          valueInput
        )}&takerAmount=${Number(valueOutput)}&chainId=${chainId}`,
      });

      const param = {
        makerAsset: account,
        takerAsset: "",
        makerAmount: Number(valueInput),
        takerAmount: Number(valueOutput),
        makerAssetAddress: tokenInputAddress,
        takerAssetAddress: tokenOutputAddress,
        makerSymbolToken: (currencies[Field.INPUT] as any).symbol.toLowerCase(),
        takerSymbolToken: (
          currencies[Field.OUTPUT] as any
        ).symbol.toLowerCase(),
        signature: signature,
        expiresIn: timeUTC,
        makerRate: checkDecimalLength(
          numberExponentToLarge(Number(valueOutput) / Number(valueInput))
        ),
        takerRate: checkDecimalLength(
          numberExponentToLarge(Number(valueInput) / Number(valueOutput))
        ),
        orderStructure: limitOrderTypedData.message,
        orderHash: limitOrderHash,
        makerDecimal: currencies[Field.INPUT].decimals,
        takerDecimal: currencies[Field.OUTPUT].decimals,
        chainId: chainId,
        txId: "",
      };

      if (getOrder && getOrder.data.order_structure) {
        const estimate = limitOrderContract.estimateGas.fillOrder;
        const method = limitOrderContract.fillOrder;
        const args = getOrder.data && [
          JSON.parse(getOrder.data.order_structure),
          getOrder.data.signature,
          parseEther("0"),
          parseUnits(
            checkDecimalLengthCurrency(
              valueInput,
              currencies[Field.INPUT].decimals
            ),
            currencies[Field.INPUT].decimals
          ),
          parseUnits(
            checkDecimalLengthCurrency(
              valueOutput,
              currencies[Field.OUTPUT].decimals
            ),
            currencies[Field.OUTPUT].decimals
          ),
        ];

        await estimate(...args)
          .then((estimatedGasLimit) =>
            method(...args, {
              gasLimit: calculateGasMargin(estimatedGasLimit),
            }).then(async (response) => {
              addTransaction(response, { summary: "Fill Order" });
              await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/create-limit-order`,
                headers: {},
                data: { ...param, txId: response.hash },
              });
            })
          )
          .catch(async (e) => {
            setShowReject(false);
            await axios({
              method: "POST",
              url: `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/create-limit-order`,
              headers: {},
              data: param,
            });
            setOpenWaiting(false);
            setShowSuccess(true);
          });
      } else {
        await axios({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/create-limit-order`,
          headers: {},
          data: param,
        });
        setShowSuccess(true);
      }

      setValueInput("");
      setValueOutput("");
      setValuePrice("");
      setSelect(setTime[4].text);
      setOpenWaiting(false);
    } catch (e) {
      setOpenWaiting(false);
      setShowReject(true);
    }
  };

  useEffect(() => {
    setValueInput("");
    setValueOutput("");
    setValuePrice("");
    setSelect(setTime[4].text);
  }, [chainId, account]);
  return (
    <OrderBlock>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />
      <Title isMobile={isMobile}>You Pay</Title>
      <CurrencyInputPanel
        label={currencies[Field.INPUT]?.name}
        value={valueInput}
        currency={currencies[Field.INPUT]}
        onUserInput={handleTypeInput}
        onMax={handleMaxInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currencies[Field.OUTPUT]}
        id="swap-currency-input"
      />

      <MidBlock>
        <div style={{ width: "100%" }}>
          <Title isMobile={isMobile}>Price</Title>
          <BlockPrice isMobile={isMobile}>
            <div data-tip={valuePrice} data-for="price">
              <Input
                value={valueInput === '' ? '' : valuePrice}
                onChange={handleValuePrice}
                isMobile={isMobile}
                disabled={
                  loadingBestPrice || valueInput === "" || valueInput === "."
                }
              />

              <StyledReactTooltip id="price" />
            </div>
            <div
              className="token-name"
              onClick={() => {
                setTokenOutputPrice(!tokenOuputPrice);
                valuePrice &&
                  Number(valuePrice) !== 0 &&
                  setValuePrice(
                    checkDecimalLength(
                      numberExponentToLarge(1 / Number(valuePrice))
                    )
                  );
              }}
            >
              {tokenOuputPrice
                ? currencies[Field.OUTPUT]?.symbol
                : currencies[Field.INPUT]?.symbol}
            </div>
          </BlockPrice>
        </div>

        <div style={{ width: "100%" }}>
          <Title isMobile={isMobile}>Expires in</Title>
          <Dropdown overlay={menuDay} trigger={["click"]}>
            <ButtonSelect isMobile={isMobile}>
              {isSelect}{" "}
              <img
                src={`/arrow-${darkMode}.svg`}
                alt=""
                width={isMobile ? "9.33px" : "10.67px"}
              />
            </ButtonSelect>
          </Dropdown>
        </div>
      </MidBlock>
      <div className="text-center mt-6">
        {" "}
        <button
          className="z-10 -mt-6 -mb-6 rounded-full p-3px"
          onClick={() => {
            setApprovalSubmitted(false); // reset 2 step UI for approvals
            onSwitchTokens();
            setIsType(true);
            onUserInput(Field.INPUT, valueOutput);
            setValueInput(valueOutput);
            setValueOutput("");
            setValuePrice("");
          }}
        >
          <SwitchSwap className="rounded-full">
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.1667 16.0925V9.66667H13.3333V16.0925H10.5833L14.25 19.75L17.9167 16.0925H15.1667ZM8.75001 3.25L5.08334 6.9075H7.83334V13.3333H9.66668V6.9075H12.4167L8.75001 3.25Z"
                fill="#667795"
              />
            </svg>
          </SwitchSwap>
        </button>
      </div>

      <Title isMobile={isMobile}>You Receive</Title>
      <CurrencyInputPanel
        value={valueInput === '' ? '' : valueOutput}
        onUserInput={handleTypeOutput}
        label={currencies[Field.OUTPUT]?.name}
        onMax={handleMaxOutput}
        currency={currencies[Field.OUTPUT]}
        onCurrencySelect={handleOutputSelect}
        otherCurrency={currencies[Field.INPUT]}
        id="limit-currency-output"
        loadingBestPriceLimit={loadingBestPrice}
        valueInput={valueInput}
        isLimitOrder={true}
      />

      <PriceTradeOrder
        inputName={currencies[Field.INPUT]?.symbol}
        outputName={currencies[Field.OUTPUT]?.symbol}
        valuePrice={valueInput === '' ? '' : valuePrice}
        tokenOuputPrice={tokenOuputPrice}
      />

      {!account ? (
        loadingBestPrice ? (
          <ButtonDisable isMobile={isMobile}>Loading...</ButtonDisable>
        ) : (
          <Web3Connect
            size="lg"
            color="blue"
            className="w-full button-connect text-lg"
          />
        )
      ) : (
        <>
          {valueInput && Number(valueInput) !== 0 && valueInput !== "." ? (
            checkBalance(valueInput) ? (
              loadingBestPrice ? (
                <ButtonDisable isMobile={isMobile}>Loading...</ButtonDisable>
              ) : approvalState !== ApprovalState.APPROVED ? (
                <ButtonConfirmed
                  onClick={handleApprove}
                  disabled={
                    approvalState !== ApprovalState.NOT_APPROVED ||
                    approvalSubmitted
                  }
                  confirmed={false}
                  className="text-lg btn-confirmed mt-8"
                >
                  {approvalState === ApprovalState.PENDING ? (
                    <AutoRow
                      gap="6px"
                      justify="center"
                      style={{ padding: "6px" }}
                    >
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted ? (
                    i18n._(t`Approved`)
                  ) : (
                    i18n._(t`Approve ${currencies[Field.INPUT]?.symbol}`)
                  )}
                </ButtonConfirmed>
              ) : valueOutput &&
                Number(valueOutput) !== 0 &&
                valuePrice &&
                Number(valuePrice) !== 0 ? (
                <ButtonOrder
                  className="justify-center flex"
                  isMobile={isMobile}
                  onClick={() => setOpenVerify(true)}
                >
                  {" "}
                  <img
                    src="/chart.svg"
                    alt=""
                    width={isMobile ? "17px" : "19.69px"}
                  />{" "}
                  Place Order
                </ButtonOrder>
              ) : (
                <ButtonDisable
                  className="justify-center flex"
                  isMobile={isMobile}
                >
                  {" "}
                  <img
                    src="/chart.svg"
                    alt=""
                    width={isMobile ? "17px" : "19.69px"}
                  />{" "}
                  Place Order
                </ButtonDisable>
              )
            ) : (
              <ButtonDisable isMobile={isMobile}>
                {i18n._(
                  t`Insufficient ${currencies[Field.INPUT]?.symbol} Balance`
                )}
              </ButtonDisable>
            )
          ) : (
            <ButtonDisable isMobile={isMobile}>
              {i18n._(t`Enter an amount`)}
            </ButtonDisable>
          )}
        </>
      )}

      <TransactionFailedModal
        isOpen={showReject}
        onDismiss={handleDismisReject}
      />
      <PopUpTransaction
        isOpen={showSuccess}
        onDismiss={handleDismisSuccess}
        isCreate={true}
      />
      <OrderModalConfirm
        isOpen={openVerify}
        onDismiss={handleDismisVerify}
        currencyIn={currencies[Field.INPUT]}
        currencyOut={currencies[Field.OUTPUT]}
        amountOut={valueOutput}
        amountIn={valueInput}
        valuePrice={valuePrice}
        tokenOuputPrice={tokenOuputPrice}
        handlePlaceOrder={handlePlaceOrder}
      />

      <PopUpWaiting
        isOpen={openWaiting}
        onDismiss={() => setOpenWaiting(false)}
      />
    </OrderBlock>
  );
}
