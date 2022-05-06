import { Currency, Token } from "@sushiswap/sdk";
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { networkSupport } from "../../connectors";
import { NATIVE_TOKEN_ADDRESS } from "../../constants";
import { STABLE_COIN } from "../../constants/token-lists";
import { maxAmountSpend } from "../../functions";
import { getDoubleTokenPrice } from "../../functions/tokenPrice";
import { useActiveWeb3React, useMulticallContract, usePairContract, useTokenContractWeb3 } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { compareNumber } from "../../utils/calculate";
import { convertToDecimals, convertToNumber } from "../../utils/convertNumber";
import { toFixed } from "../../utils/decimalAdjust";

export function useCalcSupply(
  amountA?: string,
  amountB?: string,
  tokenA?: Currency,
  tokenB?: Currency, 
  pairAddress?: Token,
  lpAmountMint?: any,
  usdValue?: string,
) {
  const { account, chainId } = useActiveWeb3React();
  const pairContract = usePairContract(pairAddress);
  const [priceToken, setPriceToken] = useState({
    priceTokenA: null,
    priceTokenB: null
  })

  const [valueAmount, setValueAmount] = useState({
    amountA: null,
    amountAMin: null,
    lpReceive: null,
    dependentMinAmount: null,
    dependentMaxAmount: null,
    isDeposit: false,
    token0: "",
    shapeOfPool: null,
    lpAmountRequire: null,
    amountARequire: null,
    maxLpAmount: null,
    decimalsPool: null,
    amountBRequire: null,
    usdValueReceive: null,
    disableUSD: null,
    usdValueA: null,
    usdValueB: null,
  })
  
  let addressA = tokenA?.isNative ? NATIVE_TOKEN_ADDRESS : tokenA?.wrapped?.address;
  let addressB = tokenB?.isNative ? NATIVE_TOKEN_ADDRESS : tokenB?.wrapped?.address;
  
  const balanceTokenA = useCurrencyBalance(
    account ?? undefined,
    tokenA ?? undefined
  );
  const balanceTokenB = useCurrencyBalance(
    account ?? undefined,
    tokenB ?? undefined
    );

  const multicallContract = useMulticallContract();
  const tokenAContract = useTokenContractWeb3(addressA);
  const tokenBContract = useTokenContractWeb3(addressB);

  useMemo(() => {    
    if(tokenA && tokenB) {
      getDoubleTokenPrice(
        tokenA?.isNative ? NATIVE_TOKEN_ADDRESS : tokenA?.wrapped?.address, 
        tokenB?.isNative ? NATIVE_TOKEN_ADDRESS : tokenB?.wrapped?.address, 
        chainId
      ).then(res => {
        setPriceToken({
          priceTokenA: STABLE_COIN.includes(tokenA.symbol) ? res[0] || 1 : res[0],
          priceTokenB: STABLE_COIN.includes(tokenA.symbol) ? res[1] || 1 : res[1],
        })
      })
    }

  }, [tokenA?.wrapped?.address, tokenB?.wrapped?.address]) 

  useMemo(async () => {
    if (networkSupport.supportedChainIds.includes(chainId)) {
      let amount,
      amountAMin,
      lpReceive,
      dependentMaxAmount,
      dependentMinAmount,
      lpAmountRequire,
      amountARequire,
      amountBRequire,
      maxLpAmount,
      usdValueReceive,
      usdValueB,
      usdValueA

      const disableUSD = !priceToken.priceTokenA && !priceToken.priceTokenB

      const [totalSupply, decimalsPool, balanceA, balanceB, token0] = await Promise.all([
        pairContract?.totalSupply(),
        pairContract?.decimals(),
        tokenA?.isNative 
        ? pairAddress && multicallContract.getEthBalance(pairAddress)
        : pairAddress && tokenAContract.options.address && tokenAContract.methods.balanceOf(pairAddress).call(),
        tokenB?.isNative 
        ? pairAddress && multicallContract.getEthBalance(pairAddress)
        : pairAddress && tokenBContract.options.address && tokenBContract.methods.balanceOf(pairAddress).call(),
        pairContract?.token0(),
      ])

      const isDeposit = !Number(totalSupply) ? false : true;
      if (!Number(totalSupply)) {
        if (amountA && amountB) {
          lpReceive = compareNumber(
            "max",
            BigNumber.from(toFixed(convertToDecimals(amountA, tokenA?.decimals)).toString()),
            BigNumber.from(toFixed(convertToDecimals(amountB, tokenB?.decimals)).toString())
          ) || "";
        }
        amountARequire = convertToDecimals("0.0001", tokenA?.decimals);
        amountBRequire = convertToDecimals("0.0001", tokenB?.decimals);
        maxLpAmount = compareNumber(
          "max",
          BigNumber.from(toFixed(convertToDecimals(maxAmountSpend(balanceTokenA)?.toExact(), tokenA?.decimals) || 0).toString()),
          BigNumber.from(toFixed(convertToDecimals(maxAmountSpend(balanceTokenB)?.toExact(), tokenB?.decimals) || 0).toString())
          ) || "";

        if (lpAmountMint) {
          amount = BigNumber.from(toFixed(convertToDecimals(maxAmountSpend(balanceTokenA)?.toExact(), tokenA?.decimals) || 0).toString());          
          dependentMaxAmount = BigNumber.from(toFixed(convertToDecimals(maxAmountSpend(balanceTokenB)?.toExact(), tokenB?.decimals) || 0).toString());
        }

      } else if (totalSupply > 0) {
        maxLpAmount = isDeposit && compareNumber(
          "min",
          BigNumber.from(totalSupply).mul(toFixed(convertToDecimals(maxAmountSpend(balanceTokenA)?.toExact(), tokenA?.decimals) || 0).toString()).div(balanceA),
          BigNumber.from(totalSupply).mul(toFixed(convertToDecimals(maxAmountSpend(balanceTokenB)?.toExact(), tokenB?.decimals) || 0).toString()).div(balanceB)
        ) || "";
        
        amountARequire = (convertToNumber(Number(balanceA), tokenA?.decimals) - convertToNumber(Number(balanceA), tokenA?.decimals) % convertToNumber(Number(balanceB), tokenB?.decimals))
          / convertToNumber(Number(balanceB), tokenB?.decimals) === 0
        ? convertToDecimals("0.0001", tokenA?.decimals) 
        : convertToDecimals(convertToNumber(Number(balanceA), tokenA?.decimals) / convertToNumber(Number(balanceB), tokenB?.decimals) * 0.0001, tokenA?.decimals);

        lpAmountRequire =  BigNumber.from(totalSupply).mul(Math.round(amountARequire).toString()).div(balanceA) || ""; 

        dependentMaxAmount = BigNumber.from(toFixed(convertToDecimals(amountA, tokenA?.decimals)).toString()).mul(balanceB).div(balanceA) || "";
        amountAMin = BigNumber.from(toFixed(convertToDecimals(amountA, tokenA?.decimals)).toString()).add((toFixed(totalSupply - 1)).toString()).div(totalSupply);
        dependentMinAmount = dependentMaxAmount.add((toFixed(totalSupply - 1)).toString()).div(totalSupply);

        lpReceive = compareNumber(
          "min",
          BigNumber.from(totalSupply).mul(toFixed(convertToDecimals(amountA, tokenA?.decimals)).toString()).div(balanceA), 
          BigNumber.from(totalSupply).mul(dependentMaxAmount).div(balanceB), 
        ) || "";

        if (lpAmountMint) {
          amount = BigNumber.from(toFixed(Math.floor(convertToDecimals(lpAmountMint, decimalsPool))).toString())
            .mul(balanceA).div(totalSupply) || "";
          dependentMaxAmount = BigNumber.from(amount).mul(balanceB).div(balanceA) || "";
          amountAMin = BigNumber.from(amount).add((toFixed(totalSupply - 1)).toString()).div(totalSupply);
          dependentMinAmount = BigNumber.from(dependentMaxAmount).add((toFixed(totalSupply - 1)).toString()).div(totalSupply);
        }

        if (priceToken.priceTokenA || priceToken.priceTokenB) {
          if (amountA || lpAmountMint) {
            let amountTokenA = Number(amountA) || convertToNumber(amount, tokenA?.decimals)
            usdValueReceive = amountTokenA * priceToken.priceTokenA + convertToNumber(dependentMaxAmount, tokenB?.decimals) * priceToken.priceTokenB;
            usdValueB = priceToken.priceTokenB * convertToNumber(dependentMaxAmount, tokenB?.decimals) 
          }

          if (usdValue) {
            if (priceToken.priceTokenA && priceToken.priceTokenB) {
              const valueA = Number(usdValue) / (2 * priceToken.priceTokenA);
              // usdValueB = valueA * priceToken.priceTokenA * convertToNumber(balanceA, tokenA?.decimals) * convertToNumber(dependentMaxAmount, tokenB?.decimals) / convertToNumber(balanceB, tokenB?.decimals)
              amount = BigNumber.from(toFixed(Math.floor(convertToDecimals(valueA, tokenA?.decimals))).toString());
              dependentMaxAmount = BigNumber.from(amount).mul(balanceB).div(balanceA) || "";
              lpReceive = compareNumber(
                "min",
                BigNumber.from(totalSupply).mul(amount).div(balanceA), 
                BigNumber.from(totalSupply).mul(dependentMaxAmount).div(balanceB), 
                ) || "";
            } else if (priceToken.priceTokenA) {
              const valueA = Number(usdValue) / priceToken.priceTokenA;
              // usdValueB = valueA * priceToken.priceTokenA * convertToNumber(balanceA, tokenA?.decimals) * convertToNumber(dependentMaxAmount, tokenB?.decimals) / convertToNumber(balanceB, tokenB?.decimals)
              amount = BigNumber.from(toFixed(Math.floor(convertToDecimals(valueA, tokenA?.decimals))).toString());
              dependentMaxAmount = BigNumber.from(amount).mul(balanceB).div(balanceA) || "";
              lpReceive = compareNumber(
                "min",
                BigNumber.from(totalSupply).mul(amount).div(balanceA), 
                BigNumber.from(totalSupply).mul(dependentMaxAmount).div(balanceB), 
                ) || "";
            } else {
              const valueB = Number(usdValue) / priceToken.priceTokenB;
              // usdValueA = valueB * priceToken.priceTokenB * convertToNumber(balanceB, tokenB?.decimals) * convertToNumber(amountA, tokenA?.decimals) / convertToNumber(balanceA, tokenA?.decimals)
              dependentMaxAmount = BigNumber.from(toFixed(Math.floor(convertToDecimals(valueB, tokenB?.decimals))).toString());
              amount = BigNumber.from(dependentMaxAmount).mul(balanceA).div(balanceB) || "";
              lpReceive = compareNumber(
                "min",
                BigNumber.from(totalSupply).mul(amount).div(balanceA), 
                BigNumber.from(totalSupply).mul(dependentMaxAmount).div(balanceB), 
                ) || "";
            }
          }
        } else {
          usdValueReceive = 0
        }
      }
      const shapeOfPool =  lpAmountMint 
        ? (convertToDecimals(lpAmountMint, decimalsPool) / (convertToDecimals(lpAmountMint, decimalsPool) + Number(totalSupply))) * 100 
        : (Number(lpReceive) / (Number(lpReceive) + Number(totalSupply))) * 100;

      setValueAmount({
        amountA: amount,
        amountAMin,
        lpReceive: lpReceive?.toString(),
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
        usdValueA: usdValueA || Number(amountA) * priceToken.priceTokenA || convertToNumber(amount, tokenA?.decimals) * priceToken.priceTokenA,
        usdValueB: usdValueB || convertToNumber(dependentMaxAmount, tokenB?.decimals) * priceToken.priceTokenB
      })
    }
  }, [tokenA, tokenB, pairAddress, amountA, amountB, lpAmountMint, balanceTokenA?.toExact(), balanceTokenB?.toExact(), usdValue, priceToken])

  return valueAmount
}