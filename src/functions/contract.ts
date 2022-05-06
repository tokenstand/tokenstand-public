// NOTE: Try not to add anything to thie file, it's almost entirely refactored out.

import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { ChainId, ROUTER_ADDRESS } from "@sushiswap/sdk";
import Web3 from "web3";
import { ARCHER_ROUTER_ADDRESS, FULL_NODE } from "../constants";
import ArcherSwapRouterABI from "../constants/abis/ArcherSwapRouter.json";
import { ERC20_ABI } from "../constants/abis/erc20";
import IUniswapV2Router02NoETHABI from "../constants/abis/uniswap-v2-router-02-no-eth.json";
import IUniswapV2Router02ABI from "../constants/abis/uniswap-v2-router-02.json";
import { isAddress } from "../functions/validate";
import { useChainId } from "../hooks";
import { NetworkChainId } from "../utils/chainId";


// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

export function getRouterAddress(chainId?: ChainId) {
  if (!chainId) {
    throw Error(`Undefined 'chainId' parameter '${chainId}'.`);
  }
  return ROUTER_ADDRESS[chainId];
}

// account is optional
export function getRouterContract(
  chainId: number,
  library: Web3Provider,
  account?: string
): Contract {
  return getContract(
    getRouterAddress(chainId),
    chainId !== ChainId.CELO
      ? IUniswapV2Router02ABI
      : IUniswapV2Router02NoETHABI,
    library,
    account
  );
}

export function getArcherRouterContract(
  chainId: number,
  library: Web3Provider,
  account?: string
): Contract {
  return getContract(
    ARCHER_ROUTER_ADDRESS[chainId as ChainId] ?? "",
    ArcherSwapRouterABI,
    library,
    account
  );
}

export const getWeb3Contract = (abiContract, addressContract) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {chainId} = useChainId();
  let fullnode: string
  if (chainId) {
      fullnode = FULL_NODE[chainId];       
    }
  const web3Instance = new Web3(fullnode);
  return new web3Instance.eth.Contract(
    abiContract,
    addressContract,
  );
};

export const getWeb3ContractOther = (chainId, abiContract, addressContract: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let fullnode: string
  if (chainId) {
      fullnode = FULL_NODE[chainId];       
    }
  const web3Instance = new Web3(fullnode);
  return new web3Instance.eth.Contract(abiContract, addressContract)
}