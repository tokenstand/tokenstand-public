import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { useMemo, useState } from 'react'
import { useTokenContractWeb3 } from './useContract'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string, pendingApproval?: boolean): CurrencyAmount<Token> | undefined {
  const contract = useTokenContractWeb3(token?.address)
  const [allowance, setAllowance] = useState<CurrencyAmount<Token>>()
  // const inputs = useMemo(() => [owner, spender], [owner, spender])
  // const allowance = useSingleCallResult(contract, 'allowance', inputs).result
  
  useMemo(() => {
    token?.address && owner && spender && contract.methods.allowance(owner, spender).call()
    .then(res => {
      const results = token && res ? CurrencyAmount.fromRawAmount(token, res.toString()) : undefined
      setAllowance(results)
    })
  }, [token, owner, spender, pendingApproval]);
  return allowance;
}
