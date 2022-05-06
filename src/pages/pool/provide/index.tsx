import { BigNumber } from "@ethersproject/bignumber";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Currency,
  CurrencyAmount
} from "@sushiswap/sdk";
import crypto from "crypto";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import ReactGA from "react-ga";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import CloseIcon from "../../../components/CloseIcon";
import { AutoColumn } from "../../../components/Column";
import CurrencyInputPanel from "../../../components/CurrencyInputPanel";
import Modal from "../../../components/Modal";
import { Input as NumericalInput } from "../../../components/NumericalInput";
import ProvideConfirm from "../../../components/ProvideConfirm";
import TransactionConfirmationModal from "../../../components/TransactionConfirmationModal";
import TransactionFailedModal from "../../../components/TransactionFailedModal";
import { useCalcSupply } from "../../../features/liquidity/calcLpSupply";
import ChartPool from "../../../features/liquidity/ChartPool";
import { tryParseAmount } from "../../../functions";
import {
  maxAmountSpend
} from "../../../functions/currency";
import {
  calculateGasMargin
} from "../../../functions/trade";
import { usePairContract } from "../../../hooks";
import { useCurrencyDisconnect } from "../../../hooks/TokensDisconnect";
import {
  ApprovalState,
  useApproveCallback
} from "../../../hooks/useApproveCallback";
import { Field } from "../../../state/mint/actions";
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState
} from "../../../state/mint/hooks";
import { useTransactionAdder } from "../../../state/transactions/hooks";
import { convertToDecimals, convertToNumber, convertToNumberBigNumber } from "../../../utils/convertNumber";
import { decimalAdjust, scientificToDecimal, toFixed } from "../../../utils/decimalAdjust";

export default function Provide({
  isOpenProvide,
  onDismissProvide,
  dataDetails,
  onProvideSuccess,
}: {
  isOpenProvide?: boolean;
  onDismissProvide: () => void;
  dataDetails?: any;
  onProvideSuccess?: any;
}) {
  const { i18n } = useLingui();
  const router = useRouter();
  const tokens = router.query;

  const [currencyIdA, currencyIdB] = [
    tokens.currencyA?.toString(),
    tokens.currencyB?.toString(),
  ] || [undefined, undefined];
  const currencyA = useCurrencyDisconnect(dataDetails?.token0.id || currencyIdA);
  const currencyB = useCurrencyDisconnect(dataDetails?.token1.id || currencyIdB);

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    currencyBalances,
    noLiquidity,
    pairAddress,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);

  const [lpAmountMint, setLpAmountMint] = useState(null);
  const [usdValue, setUsdValue] = useState(null);
  const [idTooltip, setIdTooltip] = useState("");

  const inputAmounts = {
    [independentField]: typedValue,
    [dependentField]: otherTypedValue,
  }

  const {
    amountA,
    amountAMin,
    lpReceive,
    dependentMinAmount,
    dependentMaxAmount,
    isDeposit,
    token0,
    shapeOfPool,
    lpAmountRequire,
    amountARequire,
    amountBRequire,
    maxLpAmount,
    decimalsPool,
    usdValueReceive,
    disableUSD,
    usdValueA,
    usdValueB
  } = useCalcSupply(inputAmounts[Field.CURRENCY_A], inputAmounts[Field.CURRENCY_B], currencyA, currencyB, pairAddress, lpAmountMint, usdValue)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity || !isDeposit);
  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [isSubmitDeposit, setIsSubmitDeposit] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>("");

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue
      || convertToNumber(amountA, currencyA?.decimals) && convertToNumber(amountA, currencyA?.decimals).toString() || "",
    [dependentField]: convertToNumber(dependentMaxAmount, currencyB?.decimals)
      && convertToNumber(dependentMaxAmount, currencyB?.decimals).toString()
      || otherTypedValue
  }

  const rawAmounts = {
    [independentField]: typedValue || toFixed(Number(amountA)) || "",
    [dependentField]: toFixed(Number(dependentMaxAmount)) || otherTypedValue || "",
  }
  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const depositContract = usePairContract(pairAddress);
  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    currencies[Field.CURRENCY_A]
    && tryParseAmount(toFixed(decimalAdjust("floor", formattedAmounts[Field.CURRENCY_A], -currencies[Field.CURRENCY_A]?.decimals)).toString()
      || '0', currencies[Field.CURRENCY_A]), depositContract?.address
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    currencies[Field.CURRENCY_B]
    && tryParseAmount(toFixed(decimalAdjust("floor", formattedAmounts[Field.CURRENCY_B], -currencies[Field.CURRENCY_B]?.decimals)).toString()
      || '0', currencies[Field.CURRENCY_B]), depositContract?.address
  );

  const addTransaction = useTransactionAdder();

  const handleApprove = async () => {
    if (approvalA !== ApprovalState.APPROVED) {
      await approveACallback();
    }
    if (approvalB !== ApprovalState.APPROVED) {
      await approveBCallback()
    };
  }

  const depositPool = async () => {
    if (!depositContract) return;

    let parsedMaxAmountA,
      parsedMaxAmountB,
      parsedMinAmountA,
      parsedMinAmountB,
      decimalsA,
      decimalsB,
      symbolA,
      symbolB

    if (token0 === currencyA?.wrapped.address || currencyA?.isNative) {
      parsedMaxAmountA = rawAmounts[Field.CURRENCY_A] == formattedAmounts[Field.CURRENCY_A]
        ? convertToDecimals(rawAmounts[Field.CURRENCY_A], currencies[Field.CURRENCY_A]?.decimals).toString()
        : rawAmounts[Field.CURRENCY_A].toString();
      parsedMaxAmountB = rawAmounts[Field.CURRENCY_B] == formattedAmounts[Field.CURRENCY_B]
        ? convertToDecimals(rawAmounts[Field.CURRENCY_B], currencies[Field.CURRENCY_B]?.decimals).toString()
        : rawAmounts[Field.CURRENCY_B].toString();
      parsedMinAmountA = amountAMin;
      parsedMinAmountB = dependentMinAmount;
      decimalsA = currencyA?.decimals;
      decimalsB = currencyB?.decimals;
      symbolA = currencies[Field.CURRENCY_A]?.symbol;
      symbolB = currencies[Field.CURRENCY_B]?.symbol;
    } else {
      parsedMaxAmountA = rawAmounts[Field.CURRENCY_B] == formattedAmounts[Field.CURRENCY_B]
        ? convertToDecimals(rawAmounts[Field.CURRENCY_B], currencies[Field.CURRENCY_B]?.decimals).toString()
        : rawAmounts[Field.CURRENCY_B].toString();
      parsedMaxAmountB = rawAmounts[Field.CURRENCY_A] == formattedAmounts[Field.CURRENCY_A]
        ? convertToDecimals(rawAmounts[Field.CURRENCY_A], currencies[Field.CURRENCY_A]?.decimals).toString()
        : rawAmounts[Field.CURRENCY_A].toString();
      parsedMinAmountA = dependentMinAmount;
      parsedMinAmountB = amountAMin;
      decimalsA = currencyB?.decimals;
      decimalsB = currencyA?.decimals;
      symbolA = currencies[Field.CURRENCY_B]?.symbol;
      symbolB = currencies[Field.CURRENCY_A]?.symbol;
    }

    if (!parsedMaxAmountA || !parsedMaxAmountB) {
      return;
    }

    const estimate = depositContract.estimateGas.deposit;
    const method = depositContract.deposit;
    let args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA?.isNative || currencyB?.isNative) {
      args = [
        [
          toFixed(Number(parsedMaxAmountA)).toString(),  // eth min
          toFixed(Number(parsedMaxAmountB)).toString(), // token min
        ],
        [
          toFixed(isDeposit ? Number(parsedMinAmountA).toString() : Number(parsedMaxAmountA).toString()),  // eth min
          toFixed(isDeposit ? Number(parsedMinAmountB).toString() : Number(parsedMaxAmountB).toString()), // token min
        ],
      ]
      value = BigNumber.from(parsedMaxAmountA)
    } else {
      args = [
        [
          toFixed(Number(parsedMaxAmountA)).toString(), // token min
          toFixed(Number(parsedMaxAmountB)).toString(),  // eth min
        ],
        [
          toFixed(isDeposit ? Number(parsedMinAmountA).toString() : Number(parsedMaxAmountA)).toString(), // token min
          toFixed(isDeposit ? Number(parsedMinAmountB).toString() : Number(parsedMaxAmountB)).toString(),  // eth min
        ],
      ]
      value = null
    }

    setShowConfirm(true);
    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);
          const summary = `
            ${i18n._(t`Add`)} ${scientificToDecimal(decimalAdjust("floor", convertToNumber(parsedMaxAmountA, decimalsA), -8))
            } ${symbolA} ${i18n._(t`and`)} ${scientificToDecimal(decimalAdjust("floor", convertToNumber(parsedMaxAmountB, decimalsB), -8))
            } ${symbolB}
          `
          setTxHash(response.hash)
          onProvideSuccess(summary);
          addTransaction(response, {summary})

          ReactGA.event({
            category: 'Deposit',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
          })
        })
      )
      .catch((error) => {
        setShowConfirm(false);
        setAttemptingTxn(false);
        setShowReject(true);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const pendingText = `${i18n._(t`Supplying`)} 
  ${scientificToDecimal(decimalAdjust("floor", formattedAmounts[Field.CURRENCY_A], -8))} 
  ${currencies[Field.CURRENCY_A]?.symbol} 
  ${i18n._(t`and`)} ${scientificToDecimal(decimalAdjust("floor", formattedAmounts[Field.CURRENCY_B], -8))} 
  ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onDismiss();
    }

    setTxHash("");
  }, [txHash]);

  const handleDismisReject = () => {
    setShowReject(false);
    setIsSubmitDeposit(false);
    onFieldAInput("");
    onFieldBInput("");
    setLpAmountMint("");
  }

  const onDismiss = () => {
    onDismissProvide();
    router.push("/pool");
    onFieldAInput("");
    onFieldBInput("");
    setLpAmountMint("");
  }

  useEffect(() => {
    ReactTooltip.rebuild();
    const id = crypto.randomBytes(16).toString("hex");
    setIdTooltip(id)
  }, []);

  return (
    <Modal
      isOpen={isOpenProvide}
      onDismiss={onDismiss}
      maxWidth={745}
    >
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">{i18n._(t`Provide Liquidity`)}</TitleStyle>
        <CloseIcon onClick={onDismiss} />
      </div>
      <div className="w-full" style={{ zIndex: 1 }}>
        <div>
          <TopModal className=" flex-col lg:flex-row">
            <ChartPool />
            <AutoColumn gap="md" className="w-full auto-col">
              <CurrencyInputPanel
                isLock={approvalA === ApprovalState.NOT_APPROVED}
                label={currencies[Field.CURRENCY_A]?.wrapped?.symbol}
                addPool={true}
                value={
                  Number(lpAmountMint) > 0 && Number(lpAmountMint) === Number(maxLpAmount)
                    ? formattedAmounts[Field.CURRENCY_A].toString()
                    : formattedAmounts[Field.CURRENCY_A]
                }
                onUserInput={value => {
                  setLpAmountMint(null);
                  setUsdValue("");
                  onFieldAInput(value);
                }}
                onMax={() => {
                  if (!isDeposit) {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "")
                  } else {
                    onFieldAInput("");
                    setLpAmountMint(convertToNumberBigNumber(maxLpAmount, decimalsPool))
                  }
                }}
                disableCurrencySelect={true}
                showMaxButton={false}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
                inputRequire={
                  isDeposit
                  && Number(formattedAmounts[Field.CURRENCY_A]) < convertToNumber(amountARequire, currencies[Field.CURRENCY_A]?.decimals)
                  && formattedAmounts[Field.CURRENCY_A].toString().length > 0
                  && !lpAmountMint
                }
                decimals={currencies[Field.CURRENCY_A]?.decimals}
                minValue={convertToNumber(amountARequire, currencies[Field.CURRENCY_A]?.decimals)}
                priceToken={toFixed(decimalAdjust("floor", usdValueA, -8))}
                showPrice={isDeposit}
              />
              {
                isDeposit
                && Number(formattedAmounts[Field.CURRENCY_A]) < convertToNumber(amountARequire, currencies[Field.CURRENCY_A]?.decimals)
                && formattedAmounts[Field.CURRENCY_A]?.toString().length > 0
                && !lpAmountMint
                && <div className="error-msg">
                  {`${i18n._(t`Amount must be at least`)} ${convertToNumber(amountARequire, currencies[Field.CURRENCY_A]?.decimals)}`}
                </div>
              }
              <CurrencyInputPanel
                isLock={approvalB === ApprovalState.NOT_APPROVED}
                label={currencies[Field.CURRENCY_B]?.wrapped?.symbol}
                isInput={isDeposit}
                addPool={true}
                value={
                  Number(lpAmountMint) > 0 && Number(lpAmountMint) === Number(maxLpAmount)
                    ? formattedAmounts[Field.CURRENCY_B].toString()
                    : dependentMaxAmount
                      ? toFixed(formattedAmounts[Field.CURRENCY_B])
                      : formattedAmounts[Field.CURRENCY_B]
                }
                onUserInput={onFieldBInput}
                disableCurrencySelect={true}
                onMax={() => {
                  !isDeposit && onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "");
                }}
                showMaxButton={false}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
                decimals={currencies[Field.CURRENCY_B]?.decimals}
                minValue={convertToNumber(amountBRequire, currencies[Field.CURRENCY_B]?.decimals)}
                priceToken={toFixed(decimalAdjust("floor", usdValueB, -8))}
                showPrice={isDeposit}
              />
              {
                !isDeposit
                && Number(formattedAmounts[Field.CURRENCY_B]) < convertToNumber(amountBRequire, currencies[Field.CURRENCY_B]?.decimals)
                && formattedAmounts[Field.CURRENCY_B]?.toString().length > 0
                && !lpAmountMint
                && <div className="error-msg">
                  {`${i18n._(t`Amount must be at least`)} ${convertToNumber(amountBRequire, currencies[Field.CURRENCY_B]?.decimals)}`}
                </div>
              }
            </AutoColumn>
          </TopModal>
          <MiddleModal>
            <Form>
              <div className="label flex flex-row justify-between">
                <div className="title">{i18n._(t`Enter LP Token Amount To Mint`)}</div>
                <div
                  className="amount-value cursor-pointer"
                  data-tip={convertToNumber(maxLpAmount, decimalsPool).toString() || "0"}
                  data-for={idTooltip}
                  data-iscapture='true'
                >
                  <div
                    className="wrap-text"
                    onClick={() => {
                      if (Number(maxLpAmount) >= convertToNumber(lpAmountRequire, decimalsPool)) {
                        onFieldAInput("");
                        setUsdValue("");
                        setLpAmountMint(convertToNumberBigNumber(maxLpAmount, decimalsPool));
                      }
                    }}
                  >
                    {`${i18n._(t`Max: `)} ${decimalAdjust("floor", convertToNumber(maxLpAmount, decimalsPool) || 0, -8)}`}
                  </div>
                  <StyledReactTooltip type="dark" id={idTooltip} />
                </div>
              </div>
              <InputNumber
                value={
                  Number(lpAmountMint) && Number(lpAmountMint) === Number(maxLpAmount)
                    ? convertToNumber(maxLpAmount, decimalsPool)
                    : lpAmountMint || convertToNumber(lpReceive, decimalsPool) || ""
                }
                className={["input-amount", isDeposit && lpAmountMint && lpAmountMint < convertToNumber(lpAmountRequire, decimalsPool) && "error-border"]}
                disabled={!isDeposit || !Number(maxLpAmount)}
                onUserInput={(value) => {
                  if (isDeposit) {
                    onFieldAInput("");
                    setUsdValue("");
                    setLpAmountMint(value)
                  }
                }}
                decimals={decimalsPool}
                minValue={convertToNumber(lpAmountRequire, decimalsPool)}
              />
              {
                isDeposit && lpAmountMint && lpAmountMint < convertToNumber(lpAmountRequire, decimalsPool)
                && <div className="error-msg">
                  {`
                    ${i18n._(t`Amount must be at least`)} ${convertToNumber(lpAmountRequire, decimalsPool)}
                  `}
                </div>
              }
              {
                !!isDeposit &&
                <>
                  <div className="label mt-6 flex flex-row justify-between">
                    <div className="title">{i18n._(t`USD Value`)}</div>
                  </div>
                  <InputNumber
                    value={usdValue || Number(usdValueReceive) || ""}
                    className="input-amount"
                    onUserInput={(value) => {
                      if (isDeposit) {
                        onFieldAInput("")
                        setLpAmountMint("")
                        setUsdValue(value)
                      }
                    }}
                    disabled={disableUSD}
                  />
                  <div className="title-desc mt-4">{i18n._(t`Set value in USD to calculate tokens amount automatically`)}</div>
                </>
              }
              <div className="desc flex flex-row items-center mt-4"
                data-tip={`This pool already created. You can provide liquidity to it`}
                data-for={idTooltip + "text"}
                data-iscapture='true'
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-display">
                  <path d="M8 0.5C8.98491 0.5 9.96018 0.693993 10.8701 1.0709C11.7801 1.44781 12.6069 2.00026 13.3033 2.6967C13.9997 3.39314 14.5522 4.21993 14.9291 5.12987C15.306 6.03982 15.5 7.01509 15.5 8C15.5 8.98491 15.306 9.96018 14.9291 10.8701C14.5522 11.7801 13.9997 12.6069 13.3033 13.3033C12.6069 13.9997 11.7801 14.5522 10.8701 14.9291C9.96018 15.306 8.98491 15.5 8 15.5C6.01088 15.5 4.10322 14.7098 2.6967 13.3033C1.29018 11.8968 0.5 9.98912 0.5 8C0.5 6.01088 1.29018 4.10322 2.6967 2.6967C4.10322 1.29018 6.01088 0.5 8 0.5ZM8 1.75C6.3424 1.75 4.75269 2.40848 3.58058 3.58058C2.40848 4.75269 1.75 6.3424 1.75 8C1.75 9.6576 2.40848 11.2473 3.58058 12.4194C4.75269 13.5915 6.3424 14.25 8 14.25C9.6576 14.25 11.2473 13.5915 12.4194 12.4194C13.5915 11.2473 14.25 9.6576 14.25 8C14.25 6.3424 13.5915 4.75269 12.4194 3.58058C11.2473 2.40848 9.6576 1.75 8 1.75ZM8 10.5C8.24864 10.5 8.4871 10.5988 8.66291 10.7746C8.83873 10.9504 8.9375 11.1889 8.9375 11.4375C8.9375 11.6861 8.83873 11.9246 8.66291 12.1004C8.4871 12.2762 8.24864 12.375 8 12.375C7.75136 12.375 7.5129 12.2762 7.33709 12.1004C7.16127 11.9246 7.0625 11.6861 7.0625 11.4375C7.0625 11.1889 7.16127 10.9504 7.33709 10.7746C7.5129 10.5988 7.75136 10.5 8 10.5ZM8 3.625C8.14628 3.62495 8.28795 3.67621 8.40032 3.76986C8.5127 3.86351 8.58867 3.99361 8.615 4.1375L8.625 4.25V8.625C8.62529 8.78118 8.56709 8.93181 8.46186 9.04723C8.35664 9.16264 8.21202 9.23448 8.05647 9.24859C7.90093 9.26271 7.74574 9.21807 7.62146 9.12348C7.49718 9.02888 7.41283 8.89118 7.385 8.7375L7.375 8.625V4.25C7.375 4.08424 7.44085 3.92527 7.55806 3.80806C7.67527 3.69085 7.83424 3.625 8 3.625Z" className="svg-fill" />
                </svg> &nbsp;
                <div className="text-overflow">
                  {i18n._(t`This pool already created. You can provide liquidity to it`)}
                </div>
                <StyledReactTooltip type="dark" id={idTooltip + "text"} />
              </div>
              {
                (
                  Number(formattedAmounts[Field.CURRENCY_A]) > Number(maxAmounts[Field.CURRENCY_A]?.toExact())
                  || Number(formattedAmounts[Field.CURRENCY_B]) > Number(maxAmounts[Field.CURRENCY_B]?.toExact())
                )
                ? <button
                  className={"disable-btn"}
                  disabled={true}
                >
                  {
                    Number(formattedAmounts[Field.CURRENCY_A]) > Number(maxAmounts[Field.CURRENCY_A]?.toExact())
                      ? `${i18n._(t`Insufficient`)} ${currencies[Field.CURRENCY_A]?.symbol} ${i18n._(t`balance`)}`
                      : `${i18n._(t`Insufficient`)} ${currencies[Field.CURRENCY_B]?.symbol} ${i18n._(t`balance`)}`
                  }
                </button>
                : !formattedAmounts[Field.CURRENCY_A] && !formattedAmounts[Field.CURRENCY_B] || approvalA === "UNKNOWN" || approvalB === "UNKNOWN"
                ? <button
                  className={"disable-btn"}
                  disabled={true}
                >
                  {i18n._(t`Enter amount`)}
                </button>
                : approvalA === ApprovalState.APPROVED && approvalB === ApprovalState.APPROVED
                ? (
                  <button
                    className={
                      isDeposit
                        && Number(formattedAmounts[Field.CURRENCY_A]) < convertToNumber(amountARequire, currencies[Field.CURRENCY_A]?.decimals)
                        && formattedAmounts[Field.CURRENCY_A]?.toString().length > 0
                        && lpAmountMint < convertToNumber(lpAmountRequire, decimalsPool)
                        ? "disable-btn"
                        : "confirm-btn"
                    }
                    onClick={() => setIsSubmitDeposit(true)}
                    disabled={
                      isDeposit
                      && Number(formattedAmounts[Field.CURRENCY_A]) < convertToNumber(amountARequire, currencies[Field.CURRENCY_A]?.decimals)
                      && formattedAmounts[Field.CURRENCY_A]?.toString().length > 0
                      && lpAmountMint < convertToNumber(lpAmountRequire, decimalsPool)
                    }
                  >
                  {i18n._(t`Provide`)}
                  </button>
                ) : (
                  <button
                    className={
                      (approvalA === ApprovalState.PENDING
                        || approvalB === ApprovalState.PENDING
                      ) ? "disable-btn" : "confirm-btn"
                    }
                    disabled={(
                      approvalA === ApprovalState.PENDING
                      || approvalB === ApprovalState.PENDING
                    )}
                    onClick={handleApprove}
                  >
                    <div>
                      {
                        (approvalA === ApprovalState.PENDING || approvalB === ApprovalState.PENDING)
                        ? `${i18n._(t`Giving Permission to use`)} ${currencyA?.symbol} ${i18n._(t`and`)} ${currencyB?.symbol}`
                        : (!currencyA && !currencyB)
                        ? i18n._(t`Select a Token`)
                        : `${i18n._(t`Give Permission to use`)} ${currencyA?.symbol} ${i18n._(t`and`)} ${currencyB?.symbol}`
                      }
                    </div> &nbsp;
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-display">
                      <path d="M9.5 0.875C10.6327 0.875 11.7542 1.09809 12.8006 1.53154C13.8471 1.96499 14.7979 2.6003 15.5988 3.4012C16.3997 4.20211 17.035 5.15292 17.4685 6.19936C17.9019 7.24579 18.125 8.36735 18.125 9.5C18.125 10.6327 17.9019 11.7542 17.4685 12.8006C17.035 13.8471 16.3997 14.7979 15.5988 15.5988C14.7979 16.3997 13.8471 17.035 12.8006 17.4685C11.7542 17.9019 10.6327 18.125 9.5 18.125C7.21251 18.125 5.01871 17.2163 3.4012 15.5988C1.7837 13.9813 0.875 11.7875 0.875 9.5C0.875 7.21251 1.7837 5.01871 3.4012 3.4012C5.01871 1.7837 7.21251 0.875 9.5 0.875ZM9.5 2.3125C7.59376 2.3125 5.76559 3.06975 4.41767 4.41767C3.06975 5.76559 2.3125 7.59376 2.3125 9.5C2.3125 11.4062 3.06975 13.2344 4.41767 14.5823C5.76559 15.9302 7.59376 16.6875 9.5 16.6875C11.4062 16.6875 13.2344 15.9302 14.5823 14.5823C15.9302 13.2344 16.6875 11.4062 16.6875 9.5C16.6875 7.59376 15.9302 5.76559 14.5823 4.41767C13.2344 3.06975 11.4062 2.3125 9.5 2.3125ZM9.5 13.0938C9.78594 13.0938 10.0602 13.2073 10.2623 13.4095C10.4645 13.6117 10.5781 13.8859 10.5781 14.1719C10.5781 14.4578 10.4645 14.732 10.2623 14.9342C10.0602 15.1364 9.78594 15.25 9.5 15.25C9.21406 15.25 8.93984 15.1364 8.73765 14.9342C8.53546 14.732 8.42188 14.4578 8.42188 14.1719C8.42188 13.8859 8.53546 13.6117 8.73765 13.4095C8.93984 13.2073 9.21406 13.0938 9.5 13.0938ZM9.5 4.46875C10.2625 4.46875 10.9938 4.77165 11.5329 5.31082C12.0721 5.84999 12.375 6.58125 12.375 7.34375C12.375 8.39313 12.0703 8.9825 11.2911 9.799L10.9116 10.1871C10.3697 10.7506 10.2188 11.0554 10.2188 11.6562C10.2188 11.8469 10.143 12.0297 10.0082 12.1645C9.87344 12.2993 9.69062 12.375 9.5 12.375C9.30938 12.375 9.12656 12.2993 8.99177 12.1645C8.85698 12.0297 8.78125 11.8469 8.78125 11.6562C8.78125 10.6069 9.086 10.0175 9.86512 9.201L10.2446 8.81287C10.7866 8.24937 10.9375 7.94462 10.9375 7.34375C10.9375 6.9625 10.786 6.59687 10.5165 6.32728C10.2469 6.0577 9.88125 5.90625 9.5 5.90625C9.11875 5.90625 8.75312 6.0577 8.48353 6.32728C8.21395 6.59687 8.0625 6.9625 8.0625 7.34375C8.0625 7.53437 7.98677 7.71719 7.85198 7.85198C7.71719 7.98677 7.53437 8.0625 7.34375 8.0625C7.15313 8.0625 6.97031 7.98677 6.83552 7.85198C6.70073 7.71719 6.625 7.53437 6.625 7.34375C6.625 6.58125 6.9279 5.84999 7.46707 5.31082C8.00624 4.77165 8.7375 4.46875 9.5 4.46875Z" fill="white" />
                    </svg>
                  </button>
                )
              }
            </Form>
          </MiddleModal>
        </div>
        {isSubmitDeposit && <ProvideConfirm
          isOpenConfirm={isSubmitDeposit}
          currencies={currencies}
          formattedAmounts={formattedAmounts}
          handleDeposit={depositPool}
          onDismiss={() => setIsSubmitDeposit(false)}
          data={{ lpAmountMint, lpReceive, decimalsPool, isDeposit, shapeOfPool }}
        />}
        {showConfirm && <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => null}
          pendingText={pendingText}
        />}
        {showReject && <TransactionFailedModal
          isOpen={showReject}
          onDismiss={handleDismisReject}
        />}
      </div>
    </Modal>
  );
}


const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  @media (max-width: 767px){
    font-size: 18px;
  }
`;

const TopModal = styled.div`
  font-family: "SF UI Display";
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 20px;
  margin-top: 30px;

  .error-msg {
    margin-top: -10px;
    color: #ff0000;
  }

  .error-border {
    border: 1px solid #ff0000;
  }

  @media screen and (max-width: 1023px) {
    .auto-col {
      margin-top: 24px;
    }
  }
`;

const MiddleModal = styled.div`
  font-family: "SF UI Display";
  margin-top: 24px;
`;

const Form = styled.div`
  .label {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    font-style: normal;

    @media (max-width: 767px) {
      font-size: 10px;
    }
  }

  .title {
    color: ${({ theme }) => theme.primaryText3};
    font-size: 14px;
    @media (max-width: 640px){
      font-size: 10px;
    }
  }
  .title-desc {
    color: ${({ theme }) => theme.primaryText3};
    font-size: 14px;
    font-weight: 500;
    @media (max-width: 640px){
      font-size: 10px;
    }
  }

  .amount-value {
    color: ${({ theme }) => theme.smText};
    .wrap-text {
      width: 120px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: right;
    }
  }

  .desc {
    border: 1px solid ${({ theme }) => theme.border2};
    background-color: ${({ theme }) => theme.bgNoti};
    color: ${({ theme }) => theme.primaryText3};
    width: 100%;
    padding: 16px 21.5px;
    border-radius: 10px;
    font-weight: 500;

    .svg-fill {
      fill: ${({ theme }) => theme.primaryText3};
    }
  }

  .error-msg {
    margin-top: 10px;
    color: #ff0000;
  }

  .error-border {
    border-color: #ff0000;
  }

  .confirm-btn {
    margin-top: 47px;
    font-weight: 700;
    font-size: 18px;
    padding: 23px;
    background: ${({ theme }) => theme.greenButton};
    border-radius: 10px;
    color: ${({ theme }) => theme.white};
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 63px;

    @media (max-width: 640px){
      font-size: 14px;
      padding: 17px;
    }
  }

  & .disable-btn {
    background-color: rgba(31, 55, 100, 0.5) !important;
    color: rgba(255, 255, 255, 0.5) !important;
    cursor: not-allowed;
    margin-top: 47px;
    font-weight: 700;
    font-size: 18px;
    padding: 23px;
    border-radius: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 63px;
    
    .icon-display > path {
      fill: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 640px){
      font-size: 14px;
      padding: 17px;
    }
  }

  @media (max-width: 767px) {
    .icon-display {
      display: none;
    }

    .disable-btn, .confirm-btn {
      font-size: 14px;
      height: 40px;
      margin-top: 23px;
    }

    .desc {
      font-size: 12px;
    }

    .text-overflow {
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
    }
  }

`

const InputNumber = styled(NumericalInput)`
  color: ${({ theme }) => theme.text7};
  background-color: ${({ theme }) => theme.bg2};
  font-size: 14px;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.border2};
  width: 100%;
  padding: 16px 19px;
  border-radius: 10px;

  ::placeholder {
    color: ${({ theme }) => theme.smText};
  }
`

const StyledReactTooltip = styled(ReactTooltip)`
  background: #5C6A86 !important;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600 !important;
  word-wrap: break-word;      /* IE 5.5-7 */
  white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
  white-space: pre-wrap;      /* current browsers */
  line-height: 126.5%;
  @media screen and (max-width:768px) {
    max-width:250 !important;
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
