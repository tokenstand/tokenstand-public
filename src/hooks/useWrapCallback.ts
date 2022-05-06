import { WRAP_NATIVE_TOKEN_ADDRESS } from './../constants/addresses';
import { ChainId, Currency, WNATIVE } from '@sushiswap/sdk'

// import { WETH9_EXTENDED } from '../constants/tokens'
import { tryParseAmount } from '../functions/parse'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useWETH9Contract } from './useContract'
import { useChainId } from '.';

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency,
  outputCurrency,
  typedValue: string | undefined
): {
  wrapType: WrapType
  execute?: undefined | (() => Promise<void>)
  inputError?: string
} {
  const { account } = useActiveWeb3React()
  const { chainId } = useChainId()
  const wethContract = useWETH9Contract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency || chainId === ChainId.CELO)
      return NOT_APPLICABLE
    const weth = WNATIVE[chainId]
    if (!weth) return NOT_APPLICABLE
    const tokenName = [1, 2, 3, 4, 5, 42, 42161].includes(chainId) ? 'ETH': 'BNB'
    const hasInputAmount = Boolean(inputAmount?.greaterThan('0'))
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    if (inputCurrency.isNative && outputCurrency?.address == WRAP_NATIVE_TOKEN_ADDRESS[chainId]) {
      return {
    
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({
                    value: `0x${inputAmount.quotient.toString(16)}`,
                  })
                  addTransaction(txReceipt, {
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${tokenName} to W${tokenName}`,
                  })
                  return txReceipt
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : hasInputAmount ? `Insufficient ${tokenName} balance` : `Enter ${tokenName} amount`,
      }
    } else if (inputCurrency?.address == WRAP_NATIVE_TOKEN_ADDRESS[chainId] && outputCurrency.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.quotient.toString(16)}`)
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} W${tokenName} to ${tokenName}`,
                  })
                  return txReceipt
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : hasInputAmount ? `Insufficient W${tokenName} balance` : `Enter W${tokenName} amount`,
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
