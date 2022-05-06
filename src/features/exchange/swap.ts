import { parseUnits } from "@ethersproject/units";
import { NATIVE_TOKEN_ADDRESS } from "./../../constants/addresses";
import { formatBytes32String, formatEther, hexlify } from "ethers/lib/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { WrapType } from "../../hooks/useWrapCallback";
import { ChainId } from "@sushiswap/sdk";
import { TokenAmount } from "@uniswap/sdk";
let ABI = [
  {
    "inputs": [
      {
        "internalType": "contract IERC20[][]",
        "name": "path",
        "type": "address[][]"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minReturn",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "distribution",
        "type": "uint256[]"
      }
    ],
    "name": "swapOnTheOther",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "poolsPath",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minReturn",
        "type": "uint256"
      }
    ],
    "name": "swapOnKyberDMM",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "tokenIn",
        "type": "address",
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenOut",
        "type": "address",
      },
      {
        "internalType": "bytes",
        "name": "path",
        "type": "bytes",
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "amountOutMinimum",
        "type": "uint256",
      },
    ],
    "name": "swapOnUniswapV3",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256",
      },
    ],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "internalType": "contract IAsset",
        "name": "assetIn",
        "type": "address"
      },
      {
        "internalType": "contract IAsset",
        "name": "assetOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMinimum",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "singleSwapOnBalancerV2",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "components": [
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          {
            "internalType": "uint256",
            "name": "assetInIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "assetOutIndex",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "bytes", "name": "userData", "type": "bytes" }
        ],
        "internalType": "struct IBalancerV2Vault.BatchSwapStep[]",
        "name": "swaps",
        "type": "tuple[]"
      },
      {
        "internalType": "contract IAsset[]",
        "name": "assets",
        "type": "address[]"
      },
      { "internalType": "int256[]", "name": "limits", "type": "int256[]" },
      {
        "internalType": "uint256",
        "name": "amountOutMinimum",
        "type": "uint256"
      },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "batchSwapOnBalancerV2",
    "outputs": [
      { "internalType": "uint256", "name": "returnAmount", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
];
const deadline = BigNumber.from("11111111111111111");
export async function swap(
  currencyIn,
  currencyOut,
  amount,
  routeData,
  amountReturn,
  contract,
  chainId,
  isToggleOwnPool,
  allowedSlippage,
  account,
  outputDecimal,
  multicalSwapContract?,
  gas?
) {
  return await getFunction(
    currencyIn,
    currencyOut,
    amount,
    routeData,
    amountReturn,
    contract,
    chainId,
    isToggleOwnPool,
    allowedSlippage,
    account,
    false,
    outputDecimal,
    multicalSwapContract,
    gas
  );
}
const getFunction = async (
  currencyIn,
  currencyOut,
  amountIn,
  routeData,
  amountReturn,
  contract,
  chainId,
  isToggleOwnPool,
  allowedSlippage,
  account,
  isEstimasteGas,
  outputDecimal,
  multicalSwapContract?,
  gas?
) => {
  try {
    const currencyInFinal = currencyIn?.address
      ? currencyIn?.address
      : NATIVE_TOKEN_ADDRESS;

    const currencyOutFinal = currencyOut?.address
      ? currencyOut?.address
      : NATIVE_TOKEN_ADDRESS;

    const isNativeTokenSwap = currencyInFinal == NATIVE_TOKEN_ADDRESS;

    let kyperDistribution = routeData.distribution["kyperswap"] || 0,
      kyperPoolPaths = routeData?.kyberPoolPaths;

    let uniV3Distribution = routeData.distribution["uniswapV3"] || 0;
    let balancerDistribution = routeData.distribution["balancer"] || 0;

    const { bestRoutes, distributions } = getBestRoutesData(chainId, routeData);
    const iface = new ethers.utils.Interface(ABI);

    let dataEndcodekyper = null, dataEndcodeUniV3 = null, dataEndcodeBalancer = null, dataEndcodeAllDex = null;
    const amountInKyper = BigNumber.from(amountIn)
      .mul(kyperDistribution)
      .div(100);
    const amountInUniV3 = BigNumber.from(amountIn)
      .mul(uniV3Distribution)
      .div(100);
    const amountInBalancer = BigNumber.from(amountIn)
      .mul(balancerDistribution)
      .div(100);
      
    const amountInAllDex = (chainId === ChainId.KOVAN || chainId === ChainId.ARBITRUM) ? BigNumber.from(amountIn).sub(amountInKyper).sub(amountInUniV3).sub(amountInBalancer) : BigNumber.from(amountIn).sub(amountInKyper).sub(amountInUniV3);

    let amountReturnKyper = parseUnits(routeData.returnAmount["kyperswap"] || "0", outputDecimal);
    let amountReturnUniV3 = parseUnits(routeData.returnAmount["uniswapV3"] || "0", outputDecimal);
    let amountReturnBalancer = parseUnits(routeData.returnAmount["balancer"] || "0", outputDecimal);
   
    let amountReturnAllDex = BigNumber.from(amountReturn).sub(amountReturnKyper).sub(amountReturnUniV3).sub(amountReturnBalancer);
    amountReturnKyper = allowedSlippage && Number(allowedSlippage.toSignificant()) !== 0
      ? BigNumber.from((100 - allowedSlippage.toSignificant()) * 100).mul(
          BigNumber.from(amountReturnKyper).div(BigNumber.from(10000))
        )
      : amountReturnKyper;
    amountReturnUniV3 =  allowedSlippage && Number(allowedSlippage.toSignificant()) !== 0
      ? BigNumber.from((100 - allowedSlippage.toSignificant()) * 100).mul(
          BigNumber.from(amountReturnUniV3).div(BigNumber.from(10000))
        )
      : amountReturnUniV3;
    amountReturnBalancer =  allowedSlippage && Number(allowedSlippage.toSignificant()) !== 0
      ? BigNumber.from((100 - allowedSlippage.toSignificant()) * 100).mul(
          BigNumber.from(amountReturnBalancer).div(BigNumber.from(10000))
        )
      : amountReturnBalancer;
    amountReturnAllDex = allowedSlippage && Number(allowedSlippage.toSignificant()) !== 0
      ? BigNumber.from((100 - allowedSlippage.toSignificant()) * 100).mul(
        BigNumber.from(amountReturnAllDex).div(BigNumber.from(10000))
      )
    : amountReturnAllDex;

    let kyperEndCodeParams = [
      routeData?.bestRoutes["kyperswap"],
      kyperPoolPaths,
      amountInKyper,
      amountReturnKyper,
    ]
    let uniV3EndCodeParams = [
      currencyInFinal,
      currencyOutFinal,
      routeData.uniswapV3EncodePath,
      deadline,
      amountInUniV3,
      amountReturnUniV3,
    ]
    let { balancerFunctionFragment, balancerEndCodeParams } =
      getBalancerEndCodeParams(
        routeData,
        currencyInFinal,
        currencyOutFinal,
        amountInBalancer,
        amountReturnBalancer,
        deadline
      );
    let allDexEncodeParams = [
      bestRoutes,
      amountInAllDex,
      amountReturnAllDex,
      distributions,
    ]

    dataEndcodekyper = kyperDistribution > 0 ? iface.encodeFunctionData("swapOnKyberDMM", kyperEndCodeParams) : 0;
    dataEndcodeUniV3 = uniV3Distribution > 0 ? iface.encodeFunctionData("swapOnUniswapV3", uniV3EndCodeParams) : 0;
    dataEndcodeBalancer = balancerDistribution > 0 ? iface.encodeFunctionData(balancerFunctionFragment, balancerEndCodeParams) : 0;
    
    dataEndcodeAllDex = (kyperDistribution + uniV3Distribution + balancerDistribution) === 100
      ? 0
      : iface.encodeFunctionData("swapOnTheOther", allDexEncodeParams);
    
    let arrEncode = [dataEndcodekyper, dataEndcodeUniV3, dataEndcodeBalancer, dataEndcodeAllDex].filter(item => item !== 0)
    
    // let arrEncode = [dataEndcodekyper]
    // const multicallContract = contract
    // console.log(`gas`, gas)
    let swapOptions = {}
    if (isEstimasteGas) {
      if (isNativeTokenSwap) {
        swapOptions["value"] = amountIn
      }
      const smReturn = await contract.estimateGas.multicall(arrEncode, swapOptions)
      return smReturn ? BigNumber.from(smReturn).toString() : 0;
    } else {
      swapOptions = isNativeTokenSwap ? {
        value: amountIn,
        gasLimit: BigNumber.from(Math.floor(Number(gas) * 1.3))
      } : {
        gasLimit: BigNumber.from(Math.floor(Number(gas) * 1.3))
      }

      const trans = await contract.multicall(arrEncode, swapOptions)

      return trans;
    }
  } catch (e) {
    console.error('err', e)
    if (isEstimasteGas) return 0;
    return e;
  }
};

export async function estimateGas(
  currencyIn,
  currencyOut,
  amount,
  routeData,
  amountReturn,
  contract,
  chainId,
  isToggleOwnPool,
  allowedSlippage,
  account,
  showWrap,
  wethContract,
  wrapType,
  outputDecimal,
  multicalSwapContract?
) {
  if (!currencyIn || !amount || (!amountReturn && !showWrap)) return 0;
  try {
    if (showWrap) {
      if (wrapType == WrapType.WRAP) {

        const gas = await wethContract.estimateGas.deposit({
          value: ethers.utils.parseEther(formatEther(amount))._hex,
        })

        return gas
      } else {
        const gas = await wethContract.estimateGas.withdraw(ethers.utils.parseEther(formatEther(amount)))
        return gas
      }
    } else {
      return await getFunction(
        currencyIn,
        currencyOut,
        amount,
        routeData,
        amountReturn,
        contract,
        chainId,
        isToggleOwnPool,
        allowedSlippage,
        account,
        true,
        outputDecimal,
        multicalSwapContract
      );
    }

  } catch (e) {
    console.log('fail gas ', e)
    return 0;
  }
}

const getBestRoutesData = (chainId, routeData) => {
  let bestRoutes = [], distributions = []
  switch (chainId) {
    case ChainId.RINKEBY:
    case ChainId.MAINNET:
      distributions = [
        routeData?.distribution["uniswapV2"],
        routeData?.distribution["sushiswap"],
        routeData?.distribution["helioswap"],
        routeData?.distribution["cryptoswap"],
      ];
      bestRoutes = [
        routeData?.bestRoutes["uniswapV2"],
        routeData?.bestRoutes["sushiswap"],
        routeData?.bestRoutes["helioswap"],
        routeData?.bestRoutes["cryptoswap"],
      ]
      break;
    case ChainId.BSC_TESTNET:
    case ChainId.BSC:
      distributions = [
        routeData?.distribution["pancakeV1"],
        routeData?.distribution["pancakeV2"],
        routeData?.distribution["helioswap"],
        routeData?.distribution["bakeryswap"],
        routeData?.distribution["biswap"],
        routeData?.distribution["apeswap"],
        routeData?.distribution["mdexswap"]
      ];
      bestRoutes = [
        routeData?.bestRoutes["pancakeV1"],
        routeData?.bestRoutes["pancakeV2"],
        routeData?.bestRoutes["helioswap"],
        routeData?.bestRoutes["bakeryswap"],
        routeData?.bestRoutes["biswap"],
        routeData?.bestRoutes["apeswap"],
        routeData?.bestRoutes["mdexswap"]
      ];
      break;
    case ChainId.ARBITRUM:
      distributions = [
        routeData?.distribution["sushiswap"],
        // routeData?.distribution["balancer"],
        // routeData?.distribution["uniswapV3"],
      ];
      bestRoutes = [
        routeData?.bestRoutes["sushiswap"],
        // routeData?.bestRoutes["balancer"],
        // routeData?.bestRoutes["uniswapV3"],
      ];
      break; 
    case ChainId.KOVAN:
      distributions = [
        routeData?.distribution["sushiswap"],
        // routeData?.distribution["balancer"],
        // routeData?.distribution["uniswapV3"],
      ];
      bestRoutes = [
        routeData?.bestRoutes["sushiswap"],
        // routeData?.bestRoutes["balancer"],
        // routeData?.bestRoutes["uniswapV3"],
      ];
      break;
  }
  return { bestRoutes, distributions }
}

const getBalancerEndCodeParams = (
  routeData,
  currencyInAdress,
  currencyOutAdress,
  amountIn,
  amountOutMin,
  deadline
) => {
  if (!routeData.balancerV2SwapPools || !routeData.balancerV2SwapPools?.length) {
    return {
      balancerFunctionFragment: '',
      balancerEndCodeParams: [],
    };
  }

  if (routeData.balancerV2SwapPools.length === 1) {
    return {
      balancerFunctionFragment: 'singleSwapOnBalancerV2',
      balancerEndCodeParams: [
        routeData?.balancerV2SwapPools[0].poolId,
        currencyInAdress,
        currencyOutAdress,
        amountIn,
        amountOutMin,
        deadline,
      ]
    };
  }

  const assets = routeData.bestRoutes['balancer'];
  const limits = assets.map((asset, i) => !i ? routeData?.balancerV2SwapPools[i].amount : '0');

  return {
    balancerFunctionFragment: 'batchSwapOnBalancerV2',
    balancerEndCodeParams: [
      currencyInAdress,
      currencyOutAdress,
      routeData.balancerV2SwapPools,
      assets,
      limits,
      amountOutMin,
      deadline,
    ]
  };
};
