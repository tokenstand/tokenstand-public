import { parseEther } from 'ethers/lib/utils';
import { Currency, CurrencyAmount, Percent, TradeType, Trade as V2Trade } from '@sushiswap/sdk'
import { useCallback, useMemo } from 'react'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'

import { ARCHER_ROUTER_ADDRESS, NATIVE_TOKEN_ADDRESS, ONE_SPLIT_ADDRESS, TOKEN_STAND_ROUTER_ADDRESS } from '../constants'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from '../functions/trade'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useTokenAllowance } from './useTokenAllowance'
import { useChainId, useTokenContract } from './useContract'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
  farm?: any
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const { chainId } = useChainId()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  let currentAllowance = useTokenAllowance(token, account ?? undefined, spender, pendingApproval)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])
  
  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const isLpBNB = farm&&[56,97].includes(chainId)&&(farm.pair.token.id === NATIVE_TOKEN_ADDRESS|| farm.pair.quoteToken.id === NATIVE_TOKEN_ADDRESS )? true : false
    
    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch((e) => {
      // general fallback for tokens who restrict approval amounts
     
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approved ' + (isLpBNB ? amountToApprove.currency.symbol.replace('ETH', 'BNB'): amountToApprove.currency.symbol),
          approval: { tokenAddress: token.address, spender: spender },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  currencyIn: Currency,
  amount: string,
  allowedSlippage: Percent,
  doArcher: boolean = false
) {
  const { chainId } = useActiveWeb3React()
  const currencyAmount = currencyIn.isToken ? CurrencyAmount.fromRawAmount(
    currencyIn,
    amount
  ): null;
  const amountToApprove = useMemo(
    () => (currencyIn.isToken ? currencyAmount : undefined),
    [currencyIn.isToken, currencyAmount]
  )
 
  return useApproveCallback(
    amountToApprove,
    chainId
        ? !doArcher
          ? ONE_SPLIT_ADDRESS[chainId]
          : ARCHER_ROUTER_ADDRESS[chainId]
        : undefined
  )
}
