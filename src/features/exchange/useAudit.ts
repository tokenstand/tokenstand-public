import { ONE_SPLIT_ADDRESS } from './../../constants/addresses';
import { useActiveWeb3React, useOneSplitAuditContract, useSushiContract } from "../../hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";
import { useCallback, useMemo } from "react";
import { useSingleCallResult } from "../../state/multicall/hooks";
import { FLAG_DISABLE_TOKENSTAND_ALL } from "../../constants";
import { ChainId } from "@sushiswap/sdk";
import OneSplitAbi from "../../constants/abis/oneSplit.json";
import { ethers, providers } from 'ethers';
import { Contract } from "@ethersproject/contracts";

const fullNodeBSCTest= ethers.getDefaultProvider(process.env.NEXT_PUBLIC_FULLNODE_BSCTESTNET);
const bscContract = new Contract(ONE_SPLIT_ADDRESS[ChainId.BSC_TESTNET], OneSplitAbi, fullNodeBSCTest);
export async function getExpectedReturn(currencyIn, currencyOut, amount, isToggleOwnPool, chainId, normalContract) {
  
  const isBSC = chainId == ChainId.BSC_TESTNET;
  const audit = isBSC ? bscContract : normalContract;

  const realAmount = amount ? amount: '1000000000000000000';
  let args = [];

  if (!currencyIn || !currencyOut) {
    return null;
  }
  const currencyInFinal = currencyIn?.address ? currencyIn?.address : '0x0000000000000000000000000000000000000000';
  const currencyOutFinal = currencyOut?.address ? currencyOut?.address : '0x0000000000000000000000000000000000000000';
  args = [String(currencyInFinal), String(currencyOutFinal), realAmount, '100', isToggleOwnPool? '0': FLAG_DISABLE_TOKENSTAND_ALL];

  if(args && audit && audit?.functions){
    const res = await audit.functions.getExpectedReturn(args[0], args[1], args[2], args[3], args[4]);
    
    return res;
  } else {
    return null;
  }
}
