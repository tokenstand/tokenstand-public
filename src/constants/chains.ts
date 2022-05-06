import { ChainId } from "@sushiswap/sdk";
type AddressMap = { [chainId: number]: string }

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  XDAI = 100,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 79377087078960,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
}

export const CURRENCY_NETWORK: {[chainId in ChainId]?: string} = {
  [ChainId.MAINNET]: "ethereum",
  [ChainId.RINKEBY]: "ethereum",
  [ChainId.KOVAN]: "ethereum",
  [ChainId.ARBITRUM]: "ethereum",
  [ChainId.BSC_TESTNET]: "binancecoin",
  [ChainId.BSC]: "binancecoin",
}

export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_NETWORK === "MAINNET" ? 1 : 4;
