import { Currency, Token } from "@sushiswap/sdk";
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { networkSupport } from "../../connectors";
import { NATIVE_TOKEN_ADDRESS } from "../../constants";
import { useMulticallContract, usePairContract, useTokenContractWeb3 } from "../../hooks";
import { convertToDecimals } from "../../utils/convertNumber";
import { toFixed } from "../../utils/decimalAdjust";

export function useWithdraw(
  amount?: number, 
  tokenA?: Currency, 
  tokenB?: Currency, 
  pairAddress?: Token,
  account?: string,
) {
  const pairContract = usePairContract(pairAddress);
  const [valueReturn, setValueReturn] = useState({
    lpWithdraw: null,
    valueA: null,
    valueB: null,
    decimalPool: null,
    aMax: null,
    bMax: null,
    balanceOf: null,
    balanceA: null,
    balanceB: null,
  })

  let addressA = tokenA?.isNative ? NATIVE_TOKEN_ADDRESS : tokenA?.wrapped?.address;
  let addressB = tokenB?.isNative ? NATIVE_TOKEN_ADDRESS : tokenB?.wrapped?.address;

  const multicallContract = useMulticallContract();
  const tokenAContract = useTokenContractWeb3(addressA);
  const tokenBContract = useTokenContractWeb3(addressB);

  useMemo(async () => {
    if (networkSupport.supportedChainIds.includes(tokenA?.chainId) && addressA && addressB) {
      const [totalSupply, decimalPool, balanceA, balanceB, balanceOf] = await Promise.all([
        pairContract?.totalSupply(),
        pairContract?.decimals(),
        tokenA?.isNative 
        ? pairAddress && multicallContract.getEthBalance(pairAddress)
        : pairAddress && tokenAContract.options.address && tokenAContract.methods.balanceOf(pairAddress).call(),
        tokenB?.isNative 
        ? pairAddress && multicallContract.getEthBalance(pairAddress)
        : pairAddress && tokenBContract.options.address && tokenBContract.methods.balanceOf(pairAddress).call(),
        pairContract?.balanceOf(account),
      ])

      const lpWithdraw = BigNumber.from(balanceOf)
        .mul(toFixed(convertToDecimals(Number(amount), decimalPool)).toString() || "0")
        .div(toFixed(convertToDecimals(100, decimalPool)).toString());
      const valueA = Number(totalSupply) && BigNumber.from(balanceA).mul(lpWithdraw).div(totalSupply);
      const valueB = Number(totalSupply) && BigNumber.from(balanceB).mul(lpWithdraw).div(totalSupply);
      const aMax = Number(totalSupply) && BigNumber.from(balanceA).mul(balanceOf).div(totalSupply);
      const bMax = Number(totalSupply) && BigNumber.from(balanceB).mul(balanceOf).div(totalSupply);

      let balanceTokenA, balanceTokenB
      const minDecimal = Math.min(tokenA?.decimals, tokenB?.decimals);

      if (minDecimal === tokenA?.decimals) {
        const brand = tokenB?.decimals - tokenA?.decimals;
        balanceTokenA = BigNumber.from(balanceA).mul((10**brand).toString());
        balanceTokenB = BigNumber.from(balanceB);
      } else if (minDecimal === tokenB?.decimals) {
        const brand = tokenA?.decimals - tokenB?.decimals;
        balanceTokenA = BigNumber.from(balanceA);
        balanceTokenB = BigNumber.from(balanceB).mul(((10**brand)).toString());
      }

      if (tokenA?.decimals === tokenB?.decimals) {
        balanceTokenA = BigNumber.from(balanceA);
        balanceTokenB = BigNumber.from(balanceB);
      }

      setValueReturn({
        lpWithdraw: lpWithdraw.toString(),
        valueA: valueA.toString(),
        valueB: valueB.toString(),
        balanceA: balanceTokenA,
        balanceB: balanceTokenB,
        decimalPool,
        aMax,
        bMax,
        balanceOf
      })
    }
  }, [account, amount, pairContract, tokenA, tokenAContract.options.address, tokenBContract.options.address])

  return valueReturn
}