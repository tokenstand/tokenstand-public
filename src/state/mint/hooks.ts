import { Currency, CurrencyAmount, Token } from '@sushiswap/sdk'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NATIVE_TOKEN_ADDRESS } from '../../constants'
import { useSwapFactory } from '../../hooks'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>((state) => state.mint)
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  
  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_A,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      )
    },
    [dispatch, noLiquidity]
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_B,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      )
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldAInput,
    onFieldBInput,
  }
}

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  pending?: boolean
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  noLiquidity?: boolean
  pairAddress?: Token
  pending?: boolean
} {
  const { account } = useActiveWeb3React()
  const { independentField } = useMintState()
  const [pairAddress, setPairAddress] = useState<Token>()
  
  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A
  const factoryContract = useSwapFactory();
  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB]
  )
  
  useMemo(() => {
    const getPair = async () => {
      const currency0 = currencies[Field.CURRENCY_A]?.isNative ? NATIVE_TOKEN_ADDRESS : currencies[Field.CURRENCY_A]?.wrapped?.address;
      const currency1 = currencies[Field.CURRENCY_B]?.isNative ? NATIVE_TOKEN_ADDRESS : currencies[Field.CURRENCY_B]?.wrapped?.address;

      const address = await factoryContract.pools(currency0, currency1)
      setPairAddress(address?.pool);
    }
    if (currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B]) {
      getPair();
    }
  }, [currencies, factoryContract, pending])

  // pair
  const noLiquidity = pairAddress?.toString() === "0x0000000000000000000000000000000000000000"

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }
 
  return {
    dependentField,
    currencies,
    currencyBalances,
    noLiquidity,
    pairAddress,
  }
}
