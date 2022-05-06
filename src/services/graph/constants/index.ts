import { ChainId } from '@sushiswap/sdk'
const THE_GRAPH = 'https://api.thegraph.com'

export const TOKEN_STAND_API: { [chainId in ChainId]?: String } = {
  [ChainId.MAINNET]:  `${process.env.NEXT_PUBLIC_GRAPH_ETH}`,
  [ChainId.RINKEBY]: `${process.env.NEXT_PUBLIC_GRAPH_RINKEBY}`,
  [ChainId.BSC]: `${process.env.NEXT_PUBLIC_GRAPH_BSC}`,
  [ChainId.BSC_TESTNET]: `${process.env.NEXT_PUBLIC_GRAPH_BSCTESTNET}`,
  [ChainId.ARBITRUM]: `${process.env.NEXT_PUBLIC_GRAPH_ARBITRUM}`,
  [ChainId.KOVAN]: `${process.env.NEXT_PUBLIC_GRAPH_KOVAN}`,
}

export const TOKEN_STAND_ETH = `${process.env.NEXT_PUBLIC_GRAPH_ETH}`
export const TOKEN_STAND_BSC = `${process.env.NEXT_PUBLIC_GRAPH_BSC}`
export const BUNDLE_ID = 1;

export const GRAPH_HOST = {
  [ChainId.MAINNET]: TOKEN_STAND_ETH,
  [ChainId.XDAI]: THE_GRAPH,
  [ChainId.MATIC]: THE_GRAPH,
  [ChainId.FANTOM]: THE_GRAPH,
  [ChainId.BSC]: TOKEN_STAND_BSC,
  [ChainId.HARMONY]: 'https://sushi.graph.t.hmny.io',
  [ChainId.OKEX]: '',
}
