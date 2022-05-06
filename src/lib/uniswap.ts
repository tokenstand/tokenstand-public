import { ethers } from "ethers";
import { flatMap } from "lodash";
import { Contract, Provider } from "ethers-multicall";
const uniswapV2SDK = require("@uniswap/sdk");
import UniswapV2FactoryABI from "../constants/abis/uniswap-v2-factory.json";
import UniswapV2PairABI from "../constants/abis/uniswap-v2-pair.json";

import {
  ONE_HUNDRED_PERCENT,
  ZERO_ADDRESS,
  ZERO_PERCENT,
  ACTUAL_SWAP,
  ACTIVE_PERCENT,
  UNIV2_BASES_TO_CHECK_TRADES_AGAINST,
  UNIV2_CUSTOM_BASES,
  MAX_HOPS,
  LOWEST_PRICE_IMPACT,
} from "./constants";
import { formatEther } from "ethers/lib/utils";

let chainId: any;
let provider: any;

async function uniswapV2TradeExactIn(currencyIn, currencyOut, amount, allowedPairs) {
    chainId = currencyIn.chainId
    // find best route trade
    const isExactIn = true;

    const tradeInfo = await findBestRoute(currencyIn, currencyOut, amount, allowedPairs, isExactIn);
    if (!tradeInfo) {
        return null;
    }
    return tradeInfo;
}

async function findBestRoute(currencyIn, currencyOut, amount, allowedPairs, isTradeExactIn) {
    if (Number(amount) > 0) {
        if (isTradeExactIn) {
            const amountIn = ethers.utils.parseUnits(amount, currencyIn.decimals).toString();
            const [tokenIn, tokenOut] = chainId ? [getWrappedCurrency(currencyIn, chainId), getWrappedCurrency(currencyOut, chainId)] : [undefined, undefined];
            const path = await fetchToShowBestTradeExactIn(new uniswapV2SDK.TokenAmount(tokenIn, amountIn), tokenOut, allowedPairs, ACTIVE_PERCENT);
            return path;
        }
        // else {
        //     const amountOut = ethers.utils.parseUnits(amount, currencyIn.decimals);
        //     const path = await fetchToShowBestTradeExactOut(currencyIn, new uniswapV2SDK.TokenAmount(currencyOut, amountOut), allowedPairs, ACTIVE_PERCENT);
        //     return path;
        // }
    }
    return null;
}

async function fetchToShowBestTradeExactIn(currencyAmountIn, currencyOut, allowedPairs, activePercent) {
    let bestTrade = await findBestTradeExactIn(currencyAmountIn, currencyOut, allowedPairs);

    if (bestTrade) {
        const percentage = new uniswapV2SDK.Percent(uniswapV2SDK.JSBI.BigInt(activePercent * 100), uniswapV2SDK.JSBI.BigInt(10000));
        const routes = bestTrade.route.path;
        const inputAmount = bestTrade.inputAmount;
        const outputAmount = bestTrade.outputAmount;
        const midPrice = bestTrade.executionPrice.toSignificant(6);
        const midPriceInvert = bestTrade.executionPrice.invert().toSignificant(6);
        const minimumAmountOut = bestTrade.minimumAmountOut(percentage).toSignificant(4);

        const { priceImpactWithoutFee, realizedLPFee } = await computeTradePriceBreakDown(bestTrade);
        const priceImpact = priceImpactWithoutFee.toSignificant(6);
        const _realizedLPFee = realizedLPFee.toSignificant(4);
        const priceImpactDisplay = realizedLPFee.lessThan(LOWEST_PRICE_IMPACT) ? "<0.01" : priceImpact;

        return {
            routes,
            inputAmount,
            outputAmount,
            minimumAmountOut,
            priceImpact,
            realizedLPFee: _realizedLPFee,
            priceImpactDisplay,
            midPrice,
            midPriceInvert,
            path: routes.map(x => x.address)
        };
    }
}

async function computeTradePriceBreakDown(trade) {
    if (trade) {
        const realizedLPFee = ONE_HUNDRED_PERCENT.subtract(trade.route.pairs.reduce((currentFee, pair) => currentFee.multiply(ACTUAL_SWAP), ONE_HUNDRED_PERCENT));
        const { numerator, denominator } = trade.priceImpact.subtract(realizedLPFee);
        const priceImpactWithoutFeePercent = new uniswapV2SDK.Percent(numerator, denominator);
        const realizedLPAmount = new uniswapV2SDK.TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient);

        return {
            priceImpactWithoutFee: priceImpactWithoutFeePercent,
            realizedLPFee: realizedLPAmount,
        };
    }
    return undefined;
}

async function findBestTradeExactIn(currencyAmountIn, currencyOut, allowedPairs) {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
        const BETTER_TRADE_LESS_HOPS_THRESHOLD = new uniswapV2SDK.Percent(50, 10000);
        let bestTradeSoFar = null;

        for (let i = 1; i <= MAX_HOPS; i++) {
            let currentTrade = uniswapV2SDK.Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
                maxHops: i,
                maxNumResults: 1,
            })[0];
            if (!currentTrade) currentTrade = null;

            // if current trade is best yet, save it
            if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                bestTradeSoFar = currentTrade;
            }
            return bestTradeSoFar;
        }
    }
}

// async function findBestTradeExactOut(currencyIn, currencyAmountOut) {
//     const allowedPairs = await getCommonPairs(currencyIn, currencyAmountOut.currency);

//     if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
//         // search through trades with varying hops, find best trade out of them
//         let bestTradeSoFar = null;
//         for (let i = 1; i <= MAX_HOPS; i++) {
//             const currentTrade = uniswapV2SDK.Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
//                 maxHops: i,
//                 maxNumResults: 1
//             })[0];

//             // if current trade is best yet, save it
//             if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
//                 bestTradeSoFar = currentTrade;
//             }
//         }

//         return bestTradeSoFar;
//     }
// }

// Get Common Pairs

function getWrappedCurrency(currency, chainId) {
    return chainId && (currency === uniswapV2SDK.ETHER || currency.address == ZERO_ADDRESS)
        ? uniswapV2SDK.WETH[chainId]
        : currency instanceof uniswapV2SDK.Token ? currency
            : undefined;
}

export async function uniswapV2GetCommonPairs(_chainId, _provider, tokenFrom, decimalsFrom, tokenTo, decimalsTo) {
    chainId = _chainId;
    provider = _provider;

    const currencyA = new uniswapV2SDK.Token(chainId, tokenFrom, decimalsFrom);
    const currencyB = new uniswapV2SDK.Token(chainId, tokenTo, decimalsTo);

    const bases = chainId ? UNIV2_BASES_TO_CHECK_TRADES_AGAINST[chainId] : [];
    const [tokenA, tokenB] = chainId ? [getWrappedCurrency(currencyA, chainId), getWrappedCurrency(currencyB, chainId)] : [undefined, undefined];

    const basePairs = flatMap(bases, (base) => {
        return bases.map((otherBase) => [base, otherBase]).filter(([t0, t1]) => t0.address !== t1.address);
    })
    const allPairsCombination = await getAllPairCombinations([tokenA, tokenB], basePairs);
    const allPairs = await getPairExists(allPairsCombination);

    return allPairs;
}

async function getAllPairCombinations([tokenA, tokenB], basePairs) {
    const bases = chainId ? UNIV2_BASES_TO_CHECK_TRADES_AGAINST[chainId] : [];

    return tokenA && tokenB
        ? [
            [tokenA, tokenB],
            ...bases.map((base) => [tokenA, base]),
            ...bases.map((base) => [tokenB, base]),
            ...basePairs,
        ]
            .filter((tokens) => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
                if (!chainId) return true;
                const customBase = UNIV2_CUSTOM_BASES[chainId];
                if (!customBase) return true;

                const customBaseA = customBase[tokenA.address];
                const customBaseB = customBase[tokenB.address];

                if (!customBaseA && !customBaseB) return true;

                if (customBaseA && !customBaseA.find((base) => tokenA.equals(base))) {
                    return false;
                }

                if (customBaseB && !customBaseB.find((base) => tokenB.equals(base))) {
                    return false;
                }

                return true;
            })
        : [];
}

async function getPairExists(currencies) {
    const tokens = currencies.map(([currencyA, currencyB]) => {
        return [currencyA, currencyB];
    });

    const pairsWithReserves = await getAllPairReserves(tokens);

    return Object.values(
        pairsWithReserves.reduce((memo, current) => {
            memo[current.liquidityToken.address] = memo[current.liquidityToken.address] ? memo[current.liquidityToken.address] : current;
            return memo;
        }, {})
    );
};

async function getAllPairReserves(tokens) {
    const uniswapFactory = uniswapV2SDK.FACTORY_ADDRESS;
    const pairABI = UniswapV2PairABI;
    const factoryABI = UniswapV2FactoryABI;

    // init factory contract
    const uniswapFactoryContract = new Contract(uniswapFactory, factoryABI);
    const ethCallProvider = new Provider(provider, chainId);
    await ethCallProvider.init();

    // Use for group multiple contract calls into one by using MultiCall SmartContract and ethers lib
    const pairsExistContractCall = tokens.map(([tokenA, tokenB]) =>
        uniswapFactoryContract.getPair(tokenA.address, tokenB.address)
    );

    let pairs = await ethCallProvider.all(pairsExistContractCall);

    // filter all the pair that doesn't has a pool
    const validTokenPairs = [];

    pairs = pairs.filter((pair, index) => {
        if (Number(pair) !== 0) {
            validTokenPairs.push(tokens[index]);
            return true;
        }
    });

    // MultiCall smart contract for getting reserves of all pairs
    const pairsReserveContractCall = pairs.map(pair => {
        const pairContract = new Contract(pair, pairABI);
        return pairContract.getReserves();
    });

    let pairsWithReserves = await ethCallProvider.all(pairsReserveContractCall);

    return pairsWithReserves.map((pair, index) => {
        const [tokenA, tokenB] = validTokenPairs[index];
        const { reserve0, reserve1 } = pair;
   
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

        return new uniswapV2SDK.Pair(
            new uniswapV2SDK.TokenAmount(token0, reserve0.toString()),
            new uniswapV2SDK.TokenAmount(token1, reserve1.toString())
        );
    });
};

async function isTradeBetter(tradeA, tradeB, minimumDelta) {
    if (tradeA && !tradeB) return false;
    if (tradeB && !tradeA) return true;
    if (!tradeA || !tradeB) return undefined;

    if (tradeA.tradeType !== tradeB.tradeType || !uniswapV2SDK.currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
        !uniswapV2SDK.currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency)) {
        throw new Error("Trades are not complete");
    }

    if (minimumDelta === ZERO_PERCENT) {
        return tradeA.executionPrice.lessThan(tradeB.executionPrice);
    } else {
        return tradeA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice);
    }
}

export async function calculateUniswapV2(chainId, parts, from, decimalsFrom, to, decimalsTo, amountsIn, uniswapV2AllowedPairs) {
    const tokenIn = new uniswapV2SDK.Token(chainId, from, decimalsFrom);
    const tokenOut = new uniswapV2SDK.Token(chainId, to, decimalsTo);
    let amountsOut = null;
    let paths = null;
    const amount = formatEther(amountsIn)
    const result = await uniswapV2TradeExactIn(tokenIn, tokenOut, amount, uniswapV2AllowedPairs);
    amountsOut = result.outputAmount.toExact();
    paths = result.path;
    
    return {
        amountsOut,
        paths
    };
}