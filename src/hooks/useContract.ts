
import { MASTER_CHEF, MASTER_CHEF_V2, NATIVE_TOKEN_ADDRESS, NFT_JACKPOT_ADDRESS, ONE_SPLIT_ADDRESS, SWAP_FACTORY_ADDRESS, LIMIT_ORDER_ADDRESS, BRIDGE_TOKEN_ADDRESS, LOTTERY_ADDRESS, REFERRAL_ADDRESS } from './../constants/addresses';
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from "../constants/abis/argent-wallet-detector";
import {
  BAR_ADDRESS,
  ChainId,
  FACTORY_ADDRESS,
  MAKER_ADDRESS,
  MASTERCHEF_ADDRESS,
  ROUTER_ADDRESS,
  SUSHI_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE,
} from "@sushiswap/sdk";
import {
  BENTOBOX_ADDRESS,
  BORING_HELPER_ADDRESS,
  CHAINLINK_ORACLE_ADDRESS,
  KASHI_ADDRESS,
  SUSHISWAP_MULTISWAPPER_ADDRESS,
  SUSHISWAP_SWAPPER_ADDRESS,
  SUSHISWAP_TWAP_0_ORACLE_ADDRESS,
  SUSHISWAP_TWAP_1_ORACLE_ADDRESS,
} from "../constants/kashi";
import { MERKLE_DISTRIBUTOR_ADDRESS, SUSHI } from "../constants";
import { MULTICALL_ABI, MULTICALL_NETWORKS } from "../constants/multicall";
import AuditAbi from "../constants/abis/oneSplitAudit.json";
import ONE_SPLIT_ABI from "../constants/abis/oneSplit.json"
import ALCX_REWARDER_ABI from "../constants/abis/alcx-rewarder.json";
import BAR_ABI from "../constants/abis/bar.json";
import BASE_SWAPPER_ABI from "../constants/abis/swapper.json";
import BENTOBOX_ABI from "../constants/abis/bentobox.json";
import BORING_HELPER_ABI from "../constants/abis/boring-helper.json";
import CHAINLINK_ORACLE_ABI from "../constants/abis/chainlink-oracle.json";
import COMPLEX_REWARDER_ABI from "../constants/abis/complex-rewarder.json";
import { Contract } from "@ethersproject/contracts";
import DASHBOARD2_ABI from "../constants/abis/dashboard2.json";
import DASHBOARD_ABI from "../constants/abis/dashboard.json";
import EIP_2612_ABI from "../constants/abis/eip-2612.json"
import ENS_ABI from "../constants/abis/ens-registrar.json";
import ENS_PUBLIC_RESOLVER_ABI from "../constants/abis/ens-public-resolver.json";
import ERC20_ABI from "../constants/abis/erc20.json";
import LP_ERC20_ABI from "../constants/abis/lperc20.json";
import { ERC20_BYTES32_ABI } from "../constants/abis/erc20";
import FACTORY_ABI from "../constants/abis/factory.json";
import IUniswapV2PairABI from "../constants/abis/uniswap-v2-pair.json";
import KASHIPAIR_ABI from "../constants/abis/kashipair.json";
import MAKER_ABI from "../constants/abis/maker.json";
import MASTERCHEF_ABI from "../constants/abis/masterchef.json";
import MAINNET_MASTERCHEF_ABI from "../constants/abis/mainnetMasterChef.json";
import MASTERCHEF_V2_ABI from "../constants/abis/masterchef-v2.json";
import MEOWSHI_ABI from "../constants/abis/meowshi.json";
import MERKLE_DISTRIBUTOR_ABI from "../constants/abis/merkle-distributor.json";
import MINICHEF_V2_ABI from "../constants/abis/minichef-v2.json";
import MULTICALL2_ABI from "../constants/abis/multicall2.json";
import PAIR_POOL from "../constants/abis/pair-pool.json";
import PENDING_ABI from "../constants/abis/pending.json";
import ROUTER_ABI from "../constants/abis/router.json";
import SAAVE_ABI from "../constants/abis/saave.json";
import SUSHIROLL_ABI from "@sushiswap/core/abi/SushiRoll.json";
import SUSHISWAP_MULTISWAPPER_ABI from "../constants/abis/sushiswapmultiswapper.json";
import SUSHISWAP_TWAP_ORACLE_ABI from "../constants/abis/sushiswap-slp-oracle.json";
import SUSHI_ABI from "../constants/abis/sushi.json";
import SWAP_FACTORY from "../constants/abis/swap-factory.json";
import TIMELOCK_ABI from "../constants/abis/timelock.json";
import UNI_FACTORY_ABI from "../constants/abis/uniswap-v2-factory.json";
import WETH9_ABI from "../constants/abis/weth.json";
import ZAPPER_ABI from "../constants/abis/zapper.json";
import { MINICHEF_ADDRESS, MULTICALL2_ADDRESS, WRAP_NATIVE_TOKEN_ADDRESS, ZAPPER_ADDRESS } from "../constants/addresses";
import { getContract, getWeb3Contract, getWeb3ContractOther } from "../functions/contract";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { useMemo } from "react";
import { Interface } from "ethers/lib/utils";
import FARMING_ABI from "../constants/abis/farmingReward.json";
import FARMING_ABI_V2 from "../constants/abis/farm-v2.json";
import LIMIT_ORDER_ABI from "../constants/abis/limit-order-abi.json";
import TOKEN_ORDINATOR_ABI from "../constants/abis/token-ordinator.json";
import TOKEN_ORDINATOR_BSC_ABI from "../constants/abis/token-ordinator-bsc.json";
import { ethers } from 'ethers';
import { NetworkChainId } from '../utils/chainId';
import { networkSupport } from '../connectors';
import { DEFAULT_CHAIN_ID } from '../constants/chains';
import { useWeb3React } from '@web3-react/core';
import NFT_JACKPOT_ABI from '../constants/abis/nft-jackpot-abi.json'
import ERC721_ABI from "../constants/abis/erc720.json";
import ERC1155_ABI from "../constants/abis/erc1155.json";
import BRIDGE_TOKEN_ABI from '../constants/abis/bridge-token.json';
import TOKEN_ORDINATOR_KOVAN_ABI from '../constants/abis/token-ordinator-kovan.json';
import LOTTERY_ABI from "../constants/abis/lottery-abi.json";
import REFERRAL_ABI from '../constants/abis/referral.json';

const UNI_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

export const useProvider = () => {
  const { library } = useActiveWeb3React();
  const chainId = NetworkChainId()
  let provider;
  switch (chainId) {
    case ChainId.RINKEBY:
      provider = providerRinkeby;
      break;
    case ChainId.BSC_TESTNET:
      provider = providerBscTest;
      break;
    case ChainId.MAINNET:
       provider = providerEth;
        break;
    case ChainId.BSC:
      provider = providerBsc;
        break;
    case ChainId.KOVAN:
      provider = providerKovan;
      break;
    case ChainId.ARBITRUM:
      provider = providerArbitrum;
      break;
    default:
      provider = providerEth;
      break;
  }

  return { ...library, provider };
}

// returns null on errors

export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { account, library } = useActiveWeb3React();
  const { provider } = useProvider()

  return useMemo(() => {
    if (!address || !ABI || !library || address === NATIVE_TOKEN_ADDRESS) return null;
    try {
      return getContract(
        address,
        ABI,
        account ? library : provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account, provider]);
}

export const useChainId = () => {
  let { chainId, account } = useWeb3React();
  // if(!account){
  //   const localChainId = Number(localStorage.getItem('chainId'))
  //   return localChainId ? { chainId: Number(localChainId) } : { chainId: 4 }
  // } 
  if (Number(localStorage.getItem("chainId"))) {
    return { chainId: Number(localStorage.getItem("chainId")) }
  } else if (networkSupport.supportedChainIds.includes(chainId)) {
    return { chainId }
  } else {
    return { chainId: DEFAULT_CHAIN_ID }
  }
}

// Contract using
export function useMulticalSwapContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  let ABI;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = ONE_SPLIT_ADDRESS[ChainId.MAINNET];
        ABI = TOKEN_ORDINATOR_ABI;
      break;
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.BSC_TESTNET:
        address = ONE_SPLIT_ADDRESS[ChainId.BSC_TESTNET];
        ABI = TOKEN_ORDINATOR_BSC_ABI;
      break;
      case ChainId.BSC:
        address = ONE_SPLIT_ADDRESS[ChainId.BSC];
        ABI = TOKEN_ORDINATOR_BSC_ABI;
      break;
      case ChainId.RINKEBY:
        address =  ONE_SPLIT_ADDRESS[ChainId.RINKEBY];
        ABI = TOKEN_ORDINATOR_ABI;
        break;
      case ChainId.KOVAN:
        address =  ONE_SPLIT_ADDRESS[ChainId.KOVAN];
        ABI = TOKEN_ORDINATOR_KOVAN_ABI;
        break;
      case ChainId.ARBITRUM:
          address =  ONE_SPLIT_ADDRESS[ChainId.ARBITRUM];
          ABI = TOKEN_ORDINATOR_KOVAN_ABI;
          break;
  }
  }

  return useContract(address, ABI, withSignerIfPossible);
}

export function useOneSplitAuditContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  let ABI;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address =  ONE_SPLIT_ADDRESS[ChainId.MAINNET];
        ABI = TOKEN_ORDINATOR_ABI;
      break;
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.BSC_TESTNET:
        address = ONE_SPLIT_ADDRESS[ChainId.BSC_TESTNET];
        ABI = TOKEN_ORDINATOR_BSC_ABI;
      break;
      case ChainId.BSC:
        address = ONE_SPLIT_ADDRESS[ChainId.BSC];
        ABI = TOKEN_ORDINATOR_BSC_ABI;
      break;
      case ChainId.RINKEBY:
        address =  ONE_SPLIT_ADDRESS[ChainId.RINKEBY];
        ABI = TOKEN_ORDINATOR_ABI;
        break;
      case ChainId.KOVAN:
        address =  ONE_SPLIT_ADDRESS[ChainId.KOVAN];
        ABI = TOKEN_ORDINATOR_KOVAN_ABI;
        break;
      case ChainId.ARBITRUM:
          address =  ONE_SPLIT_ADDRESS[ChainId.ARBITRUM];
          ABI = TOKEN_ORDINATOR_KOVAN_ABI;
          break;
    }
  }
  return useContract(address, ABI, withSignerIfPossible);
}

export function useMiniChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MINICHEF_ADDRESS[chainId], MINICHEF_V2_ABI, withSignerIfPossible)
}

export function useFactoryContract( withSignerIfPossible?: boolean
  ): Contract | null {
    const { chainId } = useActiveWeb3React();
    let address: string | undefined;
    if (chainId) {
      switch (chainId) {
        case ChainId.MAINNET:
        case ChainId.GÖRLI:
        case ChainId.ROPSTEN:
        case ChainId.RINKEBY:
          address = "0x55F5E5ec8f3761A0cB39658Ff54564797D6f30F8";
          break;
      }
    }
  return useContract(address, FACTORY_ABI, withSignerIfPossible);
}

export function useRouterContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = "0x13C21eD9155d57dE1bb83A26b446Aa2e772a22C1";
        break;
    }
  }
  return useContract(address, ROUTER_ABI, withSignerIfPossible);
}

export function useMulticall() {
  const multicallContract = useMulticallContract();

  const multicall = async function (
    abi, calls, enoughParam
  ) {
    try {
      const itf = new Interface(abi);
      const calldata = calls.map((call) => [
        call.address.toLowerCase(),
        itf.encodeFunctionData(call.name, call.params),
      ]);
      const { returnData } = await multicallContract.functions.aggregate(
        calldata
      );
      const res = returnData.map((call, i) =>
        itf.decodeFunctionResult(calls[i].name, call)
      );
      return res;
    } catch (e) {
      console.log('err ',e);
      return null;
    }
  };
  return { multicall };
}

export async function multicall (multicallContract, abi, calls) {
  try {
    const itf = new Interface(abi);
    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multicallContract.functions.aggregate(
      calldata
    );
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );
    return res;
  } catch (e) {
    console.log('err ',e);
    return null;
  }
}
export function useMulticallContract(): Contract | null {
  const { chainId } = useChainId();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}

export function useWrapTokenContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && WRAP_NATIVE_TOKEN_ADDRESS[chainId],
    WETH9_ABI,
    false
  );
}

// Old contract, need to remove carefully
export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MAINNET
      ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
      : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, PAIR_POOL, withSignerIfPossible);
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined,
    MERKLE_DISTRIBUTOR_ABI,
    true
  );
}

export function useBoringHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && BORING_HELPER_ADDRESS[chainId],
    BORING_HELPER_ABI,
    false
  );
}

export function usePendingContract(): Contract | null {
  return useContract(
    "0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029",
    PENDING_ABI,
    false
  );
}


export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && SUSHI_ADDRESS[chainId],
    SUSHI_ABI,
    withSignerIfPossible
  );
}

export function useMasterChefContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MASTERCHEF_ADDRESS[chainId],
    MASTERCHEF_ABI,
    withSignerIfPossible
  );
}

export function useMasterChefV2Contract(
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(
    "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d",
    MASTERCHEF_V2_ABI,
    withSignerIfPossible
  );
}
export function useMiniChefV2Contract(
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(
    "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
    MINICHEF_V2_ABI,
    withSignerIfPossible
  );
}

export function useMulticall2Contract() {
  const { chainId } = useChainId();
  return useContract(chainId && MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI, false)
}

export function useSushiBarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && BAR_ADDRESS[chainId],
    BAR_ABI,
    withSignerIfPossible
  );
}

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useChainId()
  return useContract(chainId ? WRAP_NATIVE_TOKEN_ADDRESS[chainId] : undefined, WETH9_ABI, withSignerIfPossible)
}

export function useMakerContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && MAKER_ADDRESS[chainId], MAKER_ABI, false);
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false);
}

export function useBentoBoxContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && BENTOBOX_ADDRESS[chainId],
    BENTOBOX_ABI,
    withSignerIfPossible
  );
}

export function useKashiPairContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && KASHI_ADDRESS[chainId],
    KASHIPAIR_ABI,
    withSignerIfPossible
  );
}

export function useKashiPairCloneContract(
  address: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, KASHIPAIR_ABI, withSignerIfPossible);
}

export function useSushiSwapSwapper(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && SUSHISWAP_SWAPPER_ADDRESS[chainId],
    BASE_SWAPPER_ABI,
    false
  );
}

export function useChainlinkOracle(): Contract | null {
  return useContract(CHAINLINK_ORACLE_ADDRESS, CHAINLINK_ORACLE_ABI, false);
}

// experimental:
export function useSaaveContract(
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(
    "0x364762C00b32c4b448f39efaA9CeFC67a25603ff",
    SAAVE_ABI,
    withSignerIfPossible
  );
}
export function useSwaave(withSignerIfPossible?: boolean): Contract | null {
  return useContract(
    "0xA70e346Ca3825b46EB4c8d0d94Ff204DB76BC289",
    SAAVE_ABI,
    withSignerIfPossible
  );
}

export function useUniV2FactoryContract(): Contract | null {
  return useContract(UNI_FACTORY_ADDRESS, UNI_FACTORY_ABI, false);
}

export function usePancakeV1FactoryContract(): Contract | null {
  return useContract(
    "0xBCfCcbde45cE874adCB698cC183deBcF17952812",
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "_feeToSetter",
            type: "address",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "token0",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "token1",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "pair",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "PairCreated",
        type: "event",
      },
      {
        constant: true,
        inputs: [],
        name: "INIT_CODE_PAIR_HASH",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "allPairs",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "allPairsLength",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "tokenA",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenB",
            type: "address",
          },
        ],
        name: "createPair",
        outputs: [{ internalType: "address", name: "pair", type: "address" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "feeTo",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "feeToSetter",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "getPair",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "_feeTo",
            type: "address",
          },
        ],
        name: "setFeeTo",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "_feeToSetter",
            type: "address",
          },
        ],
        name: "setFeeToSetter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    false
  );
}

export function useSushiRollContract(
  version: "v1" | "v2" = "v2"
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = "0x16E58463eb9792Bc236d8860F5BC69A81E26E32B";
        break;
      case ChainId.ROPSTEN:
        address = "0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5";
        break;
      case ChainId.BSC:
        if (version === "v1") {
          address = "0x677978dE066b3f5414eeA56644d9fCa3c75482a1";
        } else if (version === "v2") {
          address = "0x2DD1aB1956BeD7C2d938d0d7378C22Fd01135a5e";
        }
        break;
      case ChainId.MATIC:
        address = "0x0053957E18A0994D3526Cf879A4cA7Be88e8936A";
        break;
    }
  }
  return useContract(address, SUSHIROLL_ABI, true);
}

// export function usePancakeRollV1Contract(): Contract | null {
//     return useContract('0x677978dE066b3f5414eeA56644d9fCa3c75482a1', SUSHIROLL_ABI, true)
// }

// export function usePancakeRollV2Contract(): Contract | null {
//     return useContract('', SUSHIROLL_ABI, true)
// }

export function useDashboardContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = "0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF";
        break;
      case ChainId.ROPSTEN:
        address = "0xC95678C10CB8b3305b694FF4bfC14CDB8aD3AB35";
        break;
      case ChainId.BSC:
        address = "0xCFbc963f223e39727e7d4075b759E97035457b48";
        break;
    }
  }
  return useContract(address, DASHBOARD_ABI, false);
}

export function useDashboard2Contract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
        address = "0x1B13fC91c6f976959E7c236Ac1CF17E052d113Fc";
        break;
      case ChainId.ROPSTEN:
        address = "0xbB7091524A6a42228E396480C9C43f1C4f6c50e2";
        break;
      case ChainId.BSC:
        address = "0x06d149A4a3f4Ac20e992F9321Af571b3B4Da64C4";
        break;
    }
  }
  return useContract(address, DASHBOARD2_ABI, false);
}

export function useSushiSwapMultiSwapper(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && SUSHISWAP_MULTISWAPPER_ADDRESS[chainId],
    SUSHISWAP_MULTISWAPPER_ABI
  );
}

export function useSushiSwapTWAP0Oracle(): Contract | null {
  return useContract(
    SUSHISWAP_TWAP_0_ORACLE_ADDRESS,
    SUSHISWAP_TWAP_ORACLE_ABI
  );
}

export function useSushiSwapTWAP1Oracle(): Contract | null {
  return useContract(
    SUSHISWAP_TWAP_1_ORACLE_ADDRESS,
    SUSHISWAP_TWAP_ORACLE_ABI
  );
}

export function useSushiSwapTWAPContract(address?: string): Contract | null {
  const TWAP_0 = useContract(
    SUSHISWAP_TWAP_0_ORACLE_ADDRESS,
    SUSHISWAP_TWAP_ORACLE_ABI
  );
  const TWAP_1 = useContract(
    SUSHISWAP_TWAP_1_ORACLE_ADDRESS,
    SUSHISWAP_TWAP_ORACLE_ABI
  );
  if (address === SUSHISWAP_TWAP_0_ORACLE_ADDRESS) {
    return TWAP_0;
  } else if (address === SUSHISWAP_TWAP_1_ORACLE_ADDRESS) {
    return TWAP_1;
  }
  return undefined;
}

export function useZapperContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  const address = ZAPPER_ADDRESS[chainId];
  return useContract(address, ZAPPER_ABI, withSignerIfPossible);
}

export function useQuickSwapFactoryContract(): Contract | null {
  return useContract(
    "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
    [
      {
        type: "constructor",
        stateMutability: "nonpayable",
        payable: false,
        inputs: [
          {
            type: "address",
            name: "_feeToSetter",
            internalType: "address",
          },
        ],
      },
      {
        type: "event",
        name: "PairCreated",
        inputs: [
          {
            type: "address",
            name: "token0",
            internalType: "address",
            indexed: true,
          },
          {
            type: "address",
            name: "token1",
            internalType: "address",
            indexed: true,
          },
          {
            type: "address",
            name: "pair",
            internalType: "address",
            indexed: false,
          },
          {
            type: "uint256",
            name: "",
            internalType: "uint256",
            indexed: false,
          },
        ],
        anonymous: false,
      },
      {
        type: "function",
        stateMutability: "view",
        payable: false,
        outputs: [{ type: "address", name: "", internalType: "address" }],
        name: "allPairs",
        inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
        constant: true,
      },
      {
        type: "function",
        stateMutability: "view",
        payable: false,
        outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
        name: "allPairsLength",
        inputs: [],
        constant: true,
      },
      {
        type: "function",
        stateMutability: "nonpayable",
        payable: false,
        outputs: [{ type: "address", name: "pair", internalType: "address" }],
        name: "createPair",
        inputs: [
          {
            type: "address",
            name: "tokenA",
            internalType: "address",
          },
          {
            type: "address",
            name: "tokenB",
            internalType: "address",
          },
        ],
        constant: false,
      },
      {
        type: "function",
        stateMutability: "view",
        payable: false,
        outputs: [{ type: "address", name: "", internalType: "address" }],
        name: "feeTo",
        inputs: [],
        constant: true,
      },
      {
        type: "function",
        stateMutability: "view",
        payable: false,
        outputs: [{ type: "address", name: "", internalType: "address" }],
        name: "feeToSetter",
        inputs: [],
        constant: true,
      },
      {
        type: "function",
        stateMutability: "view",
        payable: false,
        outputs: [{ type: "address", name: "", internalType: "address" }],
        name: "getPair",
        inputs: [
          { type: "address", name: "", internalType: "address" },
          { type: "address", name: "", internalType: "address" },
        ],
        constant: true,
      },
      {
        type: "function",
        stateMutability: "nonpayable",
        payable: false,
        outputs: [],
        name: "setFeeTo",
        inputs: [
          {
            type: "address",
            name: "_feeTo",
            internalType: "address",
          },
        ],
        constant: false,
      },
      {
        type: "function",
        stateMutability: "nonpayable",
        payable: false,
        outputs: [],
        name: "setFeeToSetter",
        inputs: [
          {
            type: "address",
            name: "_feeToSetter",
            internalType: "address",
          },
        ],
        constant: false,
      },
    ],
    false
  );
}

export function useComplexRewarderContract(
  address,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible);
}

export function useAlcxRewarderContract(
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(
    "0x7519C93fC5073E15d89131fD38118D73A72370F8",
    ALCX_REWARDER_ABI,
    withSignerIfPossible
  );
}

export function useMeowshiContract(
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(
    "0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D",
    MEOWSHI_ABI,
    withSignerIfPossible
  );
}

export function useSwapFactory(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useChainId();
  let address: string | undefined;
  if (chainId) {
    address = SWAP_FACTORY_ADDRESS[chainId];
  }
  return useContract(address, SWAP_FACTORY, withSignerIfPossible);
}
//contract of pool farm
export function useFarmingContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useChainId();
  let address: string | undefined;
  let abi = process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? FARMING_ABI : MAINNET_MASTERCHEF_ABI
  if (chainId) {
      address = MASTER_CHEF[chainId];        
    }
  return useContract(address, abi, withSignerIfPossible);
}

//contract of limitOrder
export function useLimitOrderContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useChainId();
  let address: string | undefined;
  let abi = process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? LIMIT_ORDER_ABI : LIMIT_ORDER_ABI
  if (chainId) {
      address = LIMIT_ORDER_ADDRESS[chainId];       
    }
  return useContract(address, abi, withSignerIfPossible);
}

export function useFarmingContractV2(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useChainId();
  let address: string | undefined;
  let abi =  FARMING_ABI_V2
  if (chainId) {
      address = MASTER_CHEF_V2[chainId];   
    }
  return useContract(address, abi, withSignerIfPossible);
}


//contract of lp token
export function useLpTokenContract(lpTokenAddress: any) {
  const { chainId } = useChainId();
  let address: string | undefined;
  if (chainId) {
    address = lpTokenAddress[`${chainId}`]
  }
  return getWeb3Contract(LP_ERC20_ABI, address);}

  export function useLpTokenContractV2(lpTokenAddress: any) {
   
    return getWeb3Contract(LP_ERC20_ABI, lpTokenAddress);}

const providerEth = ethers.getDefaultProvider(`${process.env.NEXT_PUBLIC_FULLNODE_ETH}`)
const providerBsc = ethers.getDefaultProvider(`${process.env.NEXT_PUBLIC_FULLNODE_BSC}`)
const providerRinkeby = ethers.getDefaultProvider(`${process.env.NEXT_PUBLIC_FULLNODE_RINKENY}`)
const providerBscTest = ethers.getDefaultProvider(`${process.env.NEXT_PUBLIC_FULLNODE_BSCTESTNET}`)
const providerKovan = ethers.getDefaultProvider(`${process.env.NEXT_PUBLIC_FULLNODE_KOVAN}`)
const providerArbitrum = ethers.getDefaultProvider(`${process.env.NEXT_PUBLIC_FULLNODE_ARBITRUM}`)


export function useFarmingContractWeb3() {
  const { chainId } = useChainId();
  let address: string | undefined;
  let abi = process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? FARMING_ABI : MAINNET_MASTERCHEF_ABI
  if (chainId) {
      address = MASTER_CHEF[chainId];        
    }
  return getWeb3Contract(abi, address);
}

export function useFarmingContractV2Web3() {
  const { chainId } = useChainId();
  let address: string | undefined;
  let abi = process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? FARMING_ABI : MAINNET_MASTERCHEF_ABI
  if (chainId) {
      address = MASTER_CHEF_V2[chainId];        
    }
  return getWeb3Contract(abi, address);
}

export function useTokenContractWeb3(tokenAddress) {
  return getWeb3Contract(ERC20_ABI, tokenAddress);
}

export function useTokenBytes32Contract(tokenAddress) {
  return getWeb3Contract(ERC20_BYTES32_ABI, tokenAddress);
}

//contract of nft jackpot
export function useNFTJackpotContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useChainId();
  let address: string | undefined;
 
  if (chainId) {
      address = NFT_JACKPOT_ADDRESS[chainId];        
    }
  return useContract(address, NFT_JACKPOT_ABI, withSignerIfPossible);
}

export function useApproveNFTContract(
  collectionAddress?: string,
  typeERC1155?: boolean,
  withSignerIfPossible?: boolean
): Contract | null {
  const ABI = typeERC1155 ? ERC1155_ABI : ERC721_ABI
  return useContract(collectionAddress, ABI, withSignerIfPossible);
}

export function useBridgeTokenContract(
  chainId: ChainId,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(BRIDGE_TOKEN_ADDRESS[chainId], BRIDGE_TOKEN_ABI, withSignerIfPossible);
}

export function useLotteryContract(
  withSignerIfPossible?: boolean
): Contract | null {
  let address: string | undefined;
  const { chainId } = useChainId();

  if (chainId) {
    address = LOTTERY_ADDRESS[chainId];
  }
  return useContract(address, LOTTERY_ABI, withSignerIfPossible);
}


export function useReferralContract(
  chainId: ChainId,
  withSignerIfPossible?: boolean
): Contract | null {
  let address: string | undefined;
  if (chainId) {
    address = REFERRAL_ADDRESS[chainId];
  }
  return useContract(address, REFERRAL_ABI, withSignerIfPossible);
}

export function useGetBalanceOtherChain(chainId, tokenAddress) {
  
  return getWeb3ContractOther(chainId, ERC20_ABI, tokenAddress);
}
