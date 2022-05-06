import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";

import { BscConnector } from "@binance-chain/bsc-connector";
import { ChainId } from "@sushiswap/sdk";
import { FortmaticConnector } from "./Fortmatic";
import { InjectedConnector } from "@web3-react/injected-connector";
import { LatticeConnector } from "@web3-react/lattice-connector";
import { NetworkConnector } from "./NetworkConnector";
import { PortisConnector } from "@web3-react/portis-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const RPC = {
  [ChainId.MAINNET]: process.env.NEXT_PUBLIC_FULLNODE_ETH,
  [ChainId.ROPSTEN]:
    "https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW",
  [ChainId.RINKEBY]: process.env.NEXT_PUBLIC_FULLNODE_RINKENY,
  [ChainId.GÖRLI]:
    "https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im",
  [ChainId.KOVAN]: process.env.NEXT_PUBLIC_FULLNODE_KOVAN,
  [ChainId.FANTOM]: "https://rpcapi.fantom.network",
  [ChainId.FANTOM_TESTNET]: "https://rpc.testnet.fantom.network",
  [ChainId.MATIC]: "https://rpc-mainnet.maticvigil.com",
  // [ChainId.MATIC]:
  //     'https://apis.ankr.com/e22bfa5f5a124b9aa1f911b742f6adfe/c06bb163c3c2a10a4028959f4d82836d/polygon/full/main',
  [ChainId.MATIC_TESTNET]: "https://rpc-mumbai.matic.today",
  [ChainId.XDAI]: "https://rpc.xdaichain.com",
  [ChainId.BSC]: process.env.NEXT_PUBLIC_FULLNODE_BSC,
  [ChainId.BSC_TESTNET]: process.env.NEXT_PUBLIC_FULLNODE_BSCTESTNET,
  [ChainId.MOONBEAM_TESTNET]: "https://rpc.testnet.moonbeam.network",
  [ChainId.AVALANCHE]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.AVALANCHE_TESTNET]: "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainId.HECO]: "https://http-mainnet.hecochain.com",
  [ChainId.HECO_TESTNET]: "https://http-testnet.hecochain.com",
  [ChainId.HARMONY]: "https://explorer.harmony.one",
  [ChainId.HARMONY_TESTNET]: "https://explorer.pops.one",
  [ChainId.OKEX]: "https://exchainrpc.okex.org",
  [ChainId.OKEX_TESTNET]: "https://exchaintestrpc.okex.org",
  [ChainId.ARBITRUM]: "https://arb1.arbitrum.io/rpc",
};

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC,
});

let networkLibrary: Web3Provider | undefined;

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary =
    networkLibrary ??
    new Web3Provider(network.provider as ExternalProvider | JsonRpcFetchFunc));
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    3, // ropsten
    4, // rinkeby
    5, // goreli
    42, // kovan
    250, // fantom
    4002, // fantom testnet
    137, // matic
    80001, // matic testnet
    100, // xdai
    56, // binance smart chain
    97, // binance smart chain testnet
    1287, // moonbase
    43114, // avalanche
    43113, // fuji
    128, // heco
    256, // heco testnet
    1666600000, // harmony
    1666700000, // harmony testnet
    66, // okex testnet
    65, // okex testnet
    42161, // arbitrum
    79377087078960, // arbitrum testnet
    42220, // celo
  ],
});

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  supportedChainIds: [1, 4, 3, 5, 42, 97, 56, 42161, 79377087078960],
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 15000,
});

// mainnet only
export const lattice = new LatticeConnector({
  chainId: 1,
  url: RPC[ChainId.MAINNET],
  appName: "SushiSwap",
});

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY ?? "",
  chainId: 1,
});

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.REACT_APP_PORTIS_ID ?? "",
  networks: [1],
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[ChainId.MAINNET],
  appName: "SushiSwap",
  appLogoUrl:
    "https://raw.githubusercontent.com/sushiswap/art/master/sushi/logo-256x256.png",
});

// mainnet only
export const torus = new TorusConnector({
  chainId: 1,
});

export const bsc = new BscConnector({ supportedChainIds: [56] });

export const networkSupport = new InjectedConnector({
  supportedChainIds: process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? [4,97,42] :  [1,56,42161],
});

export const networkSupportLottery = new InjectedConnector({
  supportedChainIds: process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? [4,97] :  [1,56],
});