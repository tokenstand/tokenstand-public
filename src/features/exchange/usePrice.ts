import { formatEther, formatUnits } from "ethers/lib/utils";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";
import {
  NATIVE_TOKEN_ADDRESS,
  TOKEN_STAND_ROUTER_ADDRESS,
  UNI_V1_ROUTER_ADDRESS,
  UNI_V2_ROUTER_ADDRESS,
  WRAP_NATIVE_TOKEN_ADDRESS,
} from "./../../constants/addresses";
import { calculateUniswapV2, uniswapV2GetCommonPairs } from "../../lib/uniswap";
import { ethers } from "ethers";
import {
  calculateSushiswap,
  sushiswapGetCommonPairs,
} from "../../lib/sushiswap";
import { calculateHelioswap, helioswapGetCommonPairs } from "../../lib/helios";
import axios from "axios";
import { fetchPrice } from "../../context/globalData";
import { keys } from "lodash";
const uniswapSDK = require("@uniswap/sdk");
export default async function getPrices(
  currencyInput,
  currencyOutput,
  amount,
  chainId,
  isNative,
  contracts,
  currencies?,
  isToggleOwnPool?
) {
  try {
    // const URL = 'https://eth-rinkeby.alchemyapi.io/v2/4jaWR-ngLIyefGmvpo1l7NKZXNzuESlm';
    if (!currencyInput || !currencyOutput) return null;
    if (currencyInput.address == currencyOutput?.address) return null;
    const isEther = [1, 2, 3, 4, 5, 42, 42161].includes(chainId);
    const inputAddress = checkNativeAddress(currencyInput);
    const outputAddress = checkNativeAddress(currencyOutput);

    const result = await fetchPrice({
      tokenFrom: inputAddress,
      decimalsFrom: currencyInput.decimals,
      tokenTo: outputAddress,
      decimalsTo: currencyOutput.decimals,
      amount: formatUnits(amount, currencyInput.decimals),
      chainId,
      maxHops: [1, 56].includes(chainId) ? 2 : 3,
      helioswap: !isToggleOwnPool,
    });
    // const result = await Promise.all(
    // contracts.map(async (contract, index) => {
    //   if (!contract) return 0;
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       if (isEther && index == 0) {
    //         resolve(0);
    //       } else {
    //         const provider = await ethers.getDefaultProvider(URL);
    //         if(index == 3){
    //           const heliosAllowedPairs = await helioswapGetCommonPairs(chainId, provider, inputAddress, currencyInput.decimals, outputAddress, currencyOutput.decimals);
    //           const calResultHelios = await calculateHelioswap(chainId, 100, inputAddress,currencyInput.decimals, outputAddress, currencyOutput.decimals, amount, heliosAllowedPairs)
    //           resolve(parseEther(calResultHelios.amountsOut))
    //         }
    //         // univ2
    //         if(index == 2){
    //           const uniswapAllowedPairs = await uniswapV2GetCommonPairs(chainId, provider, inputAddress, currencyInput.decimals, outputAddress, currencyOutput.decimals);
    //           const calResult = await calculateUniswapV2(chainId, 100, inputAddress,currencyInput.decimals, outputAddress, currencyOutput.decimals, amount, uniswapAllowedPairs)
    //           resolve(parseEther(calResult.amountsOut))
    //         }
    //         // sushi
    //         if(index == 1){

    //           const [finalInput, finalOutput] = wrapInputAddress(currencyInput, currencyOutput, chainId)
    //           const uniswapAllowedPairs = await sushiswapGetCommonPairs(chainId, provider, finalInput, currencyInput.decimals, finalOutput, currencyOutput.decimals);
    //           const calResult = await calculateSushiswap(chainId, 100, finalInput,currencyInput.decimals, finalOutput, currencyOutput.decimals, amount, uniswapAllowedPairs)
    //           resolve(parseEther(calResult.amountsOut))
    //         }

    //       }
    //     } catch (e) {
    //       resolve(0);
    //     }
    //   });
    // })
    // );

    const prices = result?.data.data;
    const mappedPrices = keys(prices).map((platform) => {
      const price = prices[platform];
      const amountsOut = price.amountsOut !== 0 ? parseEther(String(price.amountsOut)) : 0;

      return {
        platform,
        amountsOut
      }
    });

    return mappedPrices;
  } catch (e) {
    console.log(e);
    return null;
  }

  // const calls = [
  //   {
  //     address: SUSHI_ROUTER_ADDRESS[chainId],
  //     name: "getAmountsOut",
  //     params: [amount, [inputAddress, outputAddress]],
  //   },
  //   {
  //     address: UNI_V1_ROUTER_ADDRESS[chainId],
  //     name: "getAmountsOut",
  //     params: [amount, [inputAddress, outputAddress]],
  //   },
  //   {
  //     address: UNI_V2_ROUTER_ADDRESS[chainId],
  //     name: "getAmountsOut",
  //     params: [amount, [inputAddress, outputAddress]],
  //   },
  // ];
  // const result = await multicallContract.getPrice(ROUTER_ABI, calls);
}
const wrapInputAddress = (currencyInput, currencyOutput, chainId) => {
  const currencyInFinal = currencyInput?.isNative
    ? WRAP_NATIVE_TOKEN_ADDRESS[chainId]
    : currencyInput?.address;
  const currencyOutFinal = currencyOutput?.isNative
    ? WRAP_NATIVE_TOKEN_ADDRESS[chainId]
    : currencyOutput?.address;
  return [currencyInFinal, currencyOutFinal];
};

const checkNativeAddress = (currency) => {
  if (currency?.isNative) return NATIVE_TOKEN_ADDRESS;
  else return currency?.address;
};
