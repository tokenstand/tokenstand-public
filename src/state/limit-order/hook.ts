
import { ChainId, Currency, CurrencyAmount, JSBI, NATIVE, Percent, Price, WNATIVE } from "@sushiswap/sdk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "..";
import { isAddress, tryParseAmount } from "../../functions";
import { useActiveWeb3React, useChainId } from "../../hooks";
import { useCurrency } from "../../hooks/Tokens";
import useENS from "../../hooks/useENS";
import { ParsedQs } from 'qs'
import { useExpertModeManager, useUserSingleHopOnly } from "../user/hooks";
import { Field, replaceLimitOrderState, selectCurrency, setRecipient, switchCurrencies, typeInput } from "./actions";
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from '../../hooks/useV2Trades'
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBentoBalances } from "../bentobox/hooks";
import { useCurrencyBalances } from "../wallet/hooks";
import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import useParsedQueryString from "../../hooks/useParsedQueryString";
import { OrderExpiration } from "./reducer";
import { NATIVE_TOKEN_ADDRESS, WRAP_NATIVE_TOKEN_ADDRESS } from "../../constants";

export function useLimitOrderActionHandlers(): {
    onCurrencySelection: (field: Field, currency: Currency) => void
    onSwitchTokens: () => void
    onUserInput: (field: Field, typedValue: string) => void
    onChangeRecipient: (recipient: string | null) => void
  } {
    const dispatch = useDispatch<AppDispatch>()
    const onCurrencySelection = useCallback(
      (field: Field, currency: Currency) => {
        dispatch(
          selectCurrency({
            field,
            currencyId: currency.isToken ? currency.address : currency.isNative ? 'ETH' : '',
          })
        )
      },
      [dispatch]
    )
    const onSwitchTokens = useCallback(() => {
      dispatch(switchCurrencies())
    }, [dispatch])
    const onUserInput = useCallback(
      (field: Field, typedValue: string) => {
        dispatch(typeInput({ field, typedValue }))
      },
      [dispatch]
    )
    const onChangeRecipient = useCallback(
      (recipient: string | null) => {
        dispatch(setRecipient({ recipient }))
      },
      [dispatch]
    )
    return {
      onSwitchTokens,
      onCurrencySelection,
      onUserInput,
      onChangeRecipient,
    }
  }

export function useLimitOrderState(): AppState['limitOrder'] {
    return useSelector<AppState, AppState['limitOrder']>((state) => state.limitOrder)
  }
  const denominator = (decimals: number = 18) => JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
  let inputCurrency
  let outputCurrency
  export function useDerivedLimitOrderInfo(): {
    currencies: { [field in Field]?: Currency }
    parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
    walletBalances: { [field in Field]?: CurrencyAmount<Currency> }
    // bentoboxBalances: { [field in Field]?: CurrencyAmount<Currency> }
    inputError?: string
    currentPrice: Price<Currency, Currency>
  } {
    const { account } = useActiveWeb3React()
    const { chainId } = useChainId()
    const [singleHopOnly] = useUserSingleHopOnly()
    const dispatch = useDispatch<AppDispatch>()
    const {
      [Field.INPUT]: { currencyId: inputCurrencyId },
      [Field.OUTPUT]: { currencyId: outputCurrencyId },
      typedValue,
      independentField,
      limitPrice,
    //   fromBentoBalance,
      recipient,
      orderExpiration,
    } = useLimitOrderState()


     inputCurrency = useCurrency(inputCurrencyId || getDefaultOutput(Number(chainId)))
    let nativeCurrency = useCurrency(WRAP_NATIVE_TOKEN_ADDRESS[chainId])

    if(!inputCurrency&&inputCurrencyId){
      inputCurrency = nativeCurrency
    }

     outputCurrency = useCurrency(outputCurrencyId || getDefaultOutput(Number(chainId)))
    const defaultCurrency = useCurrency(getDefaultOutput(Number(chainId)))
    if(!outputCurrency&&outputCurrencyId){
      outputCurrency = defaultCurrency
    }

    const recipientLookup = useENS(recipient ?? undefined)
    const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

    const isExactIn: boolean = independentField === Field.INPUT
    const parsedInputAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)
    let parsedRate = limitPrice ? tryParseAmount(limitPrice, WNATIVE[chainId]) : undefined

    const parsedOutputAmount =
      outputCurrency && parsedRate && parsedInputAmount
        ? isExactIn
          ? CurrencyAmount.fromRawAmount(
              outputCurrency,
              new Percent(parsedRate.numerator, denominator(WNATIVE[chainId].decimals))
                .multiply(new Percent(parsedInputAmount.quotient, denominator(inputCurrency.decimals)))
                .multiply(denominator(outputCurrency.decimals)).quotient
            )
          : CurrencyAmount.fromRawAmount(
              inputCurrency,
              new Percent(
                parsedInputAmount
                  .multiply(denominator(inputCurrency.decimals))
                  .multiply(denominator(WNATIVE[chainId].decimals - outputCurrency.decimals)).quotient,
                parsedRate.quotient
              ).quotient
            )
        : undefined

    const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedInputAmount : undefined, outputCurrency ?? undefined, {
      maxHops: singleHopOnly ? 1 : undefined,
    })

    const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedInputAmount : undefined, {
      maxHops: singleHopOnly ? 1 : undefined,
    })

    const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut
    const rate = trade?.executionPrice

    // const bentoBoxBalances = useBentoBalances()
    // const balance = useMemo(
    //   () => bentoBoxBalances?.find((el) => el.address === inputCurrency?.wrapped.address),
    //   [bentoBoxBalances, inputCurrency?.wrapped.address]
    // )

    const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
      inputCurrency ?? undefined,
      outputCurrency ?? undefined,
    ])
    const walletBalances = {
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }

    // const bentoboxBalances = {
    //   [Field.INPUT]: inputCurrency
    //     ? CurrencyAmount.fromRawAmount(inputCurrency, balance?.bentoBalance ? balance.bentoBalance : 0)
    //     : undefined,
    //   [Field.OUTPUT]: outputCurrency
    //     ? CurrencyAmount.fromRawAmount(outputCurrency, balance?.bentoBalance ? balance.bentoBalance : 0)
    //     : undefined,
    // }

    const parsedAmounts = {
      [Field.INPUT]: independentField === Field.INPUT ? parsedInputAmount : parsedOutputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedInputAmount : parsedOutputAmount,
    }
    const currencies: { [field in Field]?: Currency } = {
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }
    let inputError: string | undefined
    if (!account) {
      inputError = 'Connect Wallet'
    }

    if (!parsedInputAmount || !parsedOutputAmount) {
      inputError = inputError ?? i18n._(t`Enter an amount`)
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? i18n._(t`Select a token`)
    }

    const formattedTo = isAddress(to)
    if (!to || !formattedTo) {
      inputError = inputError ?? i18n._(t`Enter a recipient`)
    }

    if (!limitPrice) {
      inputError = inputError ?? i18n._(t`Select a rate`)
    }

    if (!orderExpiration) {
      inputError = inputError ?? i18n._(t`Select an order expiration`)
    }

    // compare input balance to max input based on version
    const [balanceIn, amountIn] = [
      walletBalances[Field.INPUT],
      parsedAmounts[Field.INPUT],
    ]

    if (!balanceIn) {
      inputError = i18n._(t`Loading balance`)
    }

    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
      inputError = i18n._(t`Insufficient ${currencies[Field.INPUT]?.symbol} balance`)
    }

    return {
      currencies,
      parsedAmounts,
      walletBalances,
    //   bentoboxBalances,
      inputError,
      currentPrice: rate,
    }
  }

  export function useLimitOrderApprovalPending(): string {
    return useSelector((state: AppState) => state.limitOrder.limitOrderApprovalPending)
  }
  function parseCurrencyFromURLParameter(urlParam: any): string {
    if (typeof urlParam === 'string') {
      const valid = isAddress(urlParam)
      if (valid) return valid
      if (urlParam.toUpperCase() === 'ETH') return 'ETH'
    }
    return ''
  }

  function parseTokenAmountURLParameter(urlParam: any): string {
    return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
  }

  function parseIndependentFieldURLParameter(urlParam: any): Field {
    return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
  }

  function parseBooleanFieldParameter(urlParam: any): boolean {
    if (typeof urlParam !== 'string') return false
    if (urlParam.toLowerCase() === 'true') return true
    if (urlParam.toLowerCase() === 'false') return false
    return false
  }
  const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
  const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
  function validatedRecipient(recipient: any): string | null {
    if (typeof recipient !== 'string') return null
    const address = isAddress(recipient)
    if (address) return address
    if (ENS_NAME_REGEX.test(recipient)) return recipient
    if (ADDRESS_REGEX.test(recipient)) return recipient
    return null
  }
  export function queryParametersToSwapState(chainId: ChainId, parsedQs: ParsedQs) {
    let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
    let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
    if (inputCurrency === '' && outputCurrency === '') {
      inputCurrency = WRAP_NATIVE_TOKEN_ADDRESS[chainId]
    } else if (inputCurrency === outputCurrency) {
      outputCurrency = ''
    }
    return {
      inputCurrencyId: inputCurrency,
      outputCurrencyId: outputCurrency,
      typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
      independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
      recipient: validatedRecipient(parsedQs.recipient),
      limitPrice: parseTokenAmountURLParameter(parsedQs.exactRate),
      fromBentoBalance: parseBooleanFieldParameter(parsedQs.fromBento),
      orderExpiration: { value: OrderExpiration.never, label: i18n._(t`Never`) },
    }
  }
  // updates the swap state to use the defaults for a given network
  export function useDefaultsFromURLSearch() {
    const { chainId } = useChainId()
    const dispatch = useDispatch<AppDispatch>()
    const parsedQs = useParsedQueryString()
    const [expertMode] = useExpertModeManager()
    const [result, setResult] = useState<
      | {
          inputCurrencyId: string | undefined
          outputCurrencyId: string | undefined
        }
      | undefined
    >()

    useEffect(() => {
      if (!chainId) return

      const parsed = queryParametersToSwapState(chainId, parsedQs)
      dispatch(
        replaceLimitOrderState({
          ...parsed,
          recipient: expertMode ? parsed.recipient : null,
        })
      )
      setResult({
        inputCurrencyId: parsed.inputCurrencyId,
        outputCurrencyId: parsed.outputCurrencyId,
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, chainId, parsedQs])

    return result
  }

  const getDefaultOutput = (chainId: number) => {
    if (chainId === ChainId.MAINNET) {
      return "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }
    if (chainId === ChainId.BSC) {
      return "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    }
    if (chainId === ChainId.BSC_TESTNET) {
      return "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee"
    }
    if (chainId === ChainId.RINKEBY) {
      return "0xd35d2e839d888d1cDBAdef7dE118b87DfefeD20e"
    }
    if (chainId === ChainId.ARBITRUM) {
      return "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
    }
    if (chainId === ChainId.KOVAN) {
      return "0xEfdD90cfBE71083bDc1FaA420D6245548cf961F4"
    }
  }
