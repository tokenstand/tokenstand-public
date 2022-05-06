import { Currency, CurrencyAmount, FACTORY_ADDRESS, Pair, computePairAddress, ChainId } from '@sushiswap/sdk'

import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useMemo, useState } from 'react'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { useFactoryContract } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const getPair = async(contract, tokenA, tokenB) => {
  return await contract.getPair(tokenA, tokenB);
}  

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )
  const [pairAddress, setPairAddress] = useState([undefined])
  const factoryContract = useFactoryContract();
  const { chainId } = useActiveWeb3React();

  const pairAddresses = useMemo(
    () => {
      if (chainId !== ChainId.RINKEBY) {
        tokens.map(([tokenA, tokenB]) => {
          return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          FACTORY_ADDRESS[tokenA.chainId]
          ? computePairAddress({
            factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
            tokenA,
              tokenB,
            })
            : undefined
        })
      } else return undefined;
    }, [tokens])

  useMemo(() => {
    if (chainId === ChainId.RINKEBY) {
      return tokens.map(async ([tokenA, tokenB]) => {
        if (tokenB && tokenA?.chainId === tokenB?.chainId && !tokenA.equals(tokenB)) {
          getPair(factoryContract, tokenA?.address, tokenB?.address)
          .then(res => {
            return setPairAddress([res]);
          })
        } else {
          return setPairAddress([undefined]);
        }
      })
    }
  }, [factoryContract, tokens]);

  const results = useMultipleContractSingleData(pairAddresses ? pairAddresses : pairAddress, PAIR_INTERFACE, 'getReserves')
  
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens.length && tokens[i][0]
      const tokenB = tokens.length && tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
      ]
    })
  }, [results, tokens])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}
