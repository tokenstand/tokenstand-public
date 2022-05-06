import { formatEther } from 'ethers/lib/utils';
const ethers = require("ethers");
const { flatMap } = require("lodash");
const { Contract, Provider } = require('ethers-multicall');
const helioswapSDK = require("@tokenstand/helioswap-sdk");

import HelioswapFactoryABI from "../constants/abis/helioswapFactory.json";
import HelioswapABI from "../constants/abis/helioswap.json";

const {
    ONE_HUNDRED_PERCENT,
    ZERO_PERCENT,
    ACTUAL_SWAP,
    ACTIVE_PERCENT,
    HELIOS_BASES_TO_CHECK_TRADES_AGAINST,
    HELIOS_CUSTOM_BASES,
    MAX_HOPS,
    HELIOS_WETH_ONLY,
} = require("./constants");
let chainId;
let provider;

const LOWEST_PRICE_IMPACT = new helioswapSDK.Percent(helioswapSDK.JSBI.BigInt(30), helioswapSDK.JSBI.BigInt(10000));

async function helioswapTradeExactIn(currencyIn, currencyOut, amount, allowedPairs) {
    // find best route trade
    const isExactIn = true;

    const tradeInfo = await findBestRoute(currencyIn, currencyOut, amount, allowedPairs, isExactIn);
    if (!tradeInfo) {
        // throw "Insufficient liquidity for this trade";
        return null;
    }

    return tradeInfo;
}

async function findBestRoute(currencyIn, currencyOut, amount, allowedPairs, isTradeExactIn) {
    if (Number(amount) > 0) {
        if (isTradeExactIn) {
            const amountIn = ethers.utils.parseUnits(amount, currencyIn.decimals).toString();
            const path = await fetchToShowBestTradeExactIn(new helioswapSDK.TokenAmount(currencyIn, amountIn), currencyOut, allowedPairs, ACTIVE_PERCENT);
            return path;
        }
    }
    return null;
}

async function fetchToShowBestTradeExactIn(currencyAmountIn, currencyOut, allowedPairs, activePercent) {
    let bestTrade = await findBestTradeExactIn(currencyAmountIn, currencyOut, allowedPairs);

    if (bestTrade) {
        const percentage = new helioswapSDK.Percent(helioswapSDK.JSBI.BigInt(activePercent * 100), helioswapSDK.JSBI.BigInt(10000));
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
        const realizedLPFee = ONE_HUNDRED_PERCENT.subtract(trade.route.pairs.reduce((currentFee) => currentFee.multiply(ACTUAL_SWAP), ONE_HUNDRED_PERCENT));
        const realizedLPFeeFraction = new helioswapSDK.Fraction(realizedLPFee.numerator, realizedLPFee.denominator);
        const { numerator, denominator } = trade.priceImpact.subtract(realizedLPFeeFraction);
        const priceImpactWithoutFeePercent = new helioswapSDK.Percent(numerator, denominator);
        const realizedLPAmount = new helioswapSDK.TokenAmount(trade.inputAmount.token, realizedLPFeeFraction.multiply(trade.inputAmount.raw).quotient);

        return {
            priceImpactWithoutFee: priceImpactWithoutFeePercent,
            realizedLPFee: realizedLPAmount,
        };
    }
    return undefined;
}

async function findBestTradeExactIn(currencyAmountIn, currencyOut, allowedPairs) {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
        const BETTER_TRADE_LESS_HOPS_THRESHOLD = new helioswapSDK.Percent(50, 10000);
        let bestTradeSoFar = null;

        for (let i = 1; i <= MAX_HOPS; i++) {
            let currentTrade = helioswapSDK.Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
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
// Get Common Pairs

// function getWrappedCurrency(currency, chainId) {
//     return chainId && (currency === helioswapSDK.ETHER || currency.address === helioswapSDK.ZERO_ADDRESS)
//         ? HELIOS_WETH_ONLY[chainId]
//         : currency instanceof helioswapSDK.Token ? currency
//             : undefined;
// }

export async function helioswapGetCommonPairs(_chainId, _provider, tokenFrom, decimalsFrom, tokenTo, decimalsTo) {
    chainId = _chainId;
    provider = _provider;

    const tokenA = new helioswapSDK.Token(chainId, tokenFrom, decimalsFrom);
    const tokenB = new helioswapSDK.Token(chainId, tokenTo, decimalsTo);

    const bases = chainId ? HELIOS_BASES_TO_CHECK_TRADES_AGAINST[chainId] : [];
    // const [tokenA, tokenB] = chainId ? [getWrappedCurrency(currencyA, chainId), getWrappedCurrency(currencyB, chainId)] : [undefined, undefined];
    const basePairs = flatMap(bases, (base) => {
        return bases.map((otherBase) => [base, otherBase]).filter(([t0, t1]) => t0.address !== t1.address);
    })
    const allPairsCombination = await getAllPairCombinations([tokenA, tokenB], basePairs);

    const allPairs = await getPairExists(allPairsCombination);

    return allPairs;
}

async function getAllPairCombinations([tokenA, tokenB], basePairs) {
    const bases = chainId ? HELIOS_BASES_TO_CHECK_TRADES_AGAINST[chainId] : [];

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
                const customBase = HELIOS_CUSTOM_BASES[chainId];
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

    const swapsWithReserves = await getAllPairReserves(tokens);

    return Object.values(
        swapsWithReserves.reduce((memo, current) => {
            memo[current.liquidityToken.address] = memo[current.liquidityToken.address] ? memo[current.liquidityToken.address] : current;
            return memo;
        }, {})
    );
};

async function getAllPairReserves(tokens) {
    const helioswapFactory = helioswapSDK.FACTORY_ADDRESS[chainId];
    const helioswapABI = HelioswapABI.abi;
    const helioswapFactoryABI = HelioswapFactoryABI.abi;

    // init factory contract
    const helioswapFactoryContract = new Contract(helioswapFactory, helioswapFactoryABI);
    const ethCallProvider = new Provider(provider, chainId);
    await ethCallProvider.init();

    // Use for group multiple contract calls into one by using MultiCall SmartContract and ethers lib
    const pairsExistContractCall = tokens.map(([tokenA, tokenB]) =>
        helioswapFactoryContract.pools(tokenA.address, tokenB.address)
    );

    let pairs = await ethCallProvider.all(pairsExistContractCall);

    // filter all the pair that doesn't has a swap
    const validTokenPairs = [];

    pairs = pairs.filter((pair, index) => {
        if (pair[0] !== helioswapSDK.ZERO_ADDRESS) {
            validTokenPairs.push(tokens[index]);
            return pair;
        }
    });

    // MultiCall smart contract for getting reserves of all pairs
    const pairsReserveContractCall = pairs.map(pair => {
        const pairContract = new Contract(pair[0], helioswapABI);
        return pairContract.getReserves();
    });

    let pairsWithReserves = await ethCallProvider.all(pairsReserveContractCall);

    return pairsWithReserves.map((pair, index) => {
        const [tokenA, tokenB] = validTokenPairs[index];
        const { _reserve0, _reserve1 } = pair;

        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

        return new helioswapSDK.Pair(
            new helioswapSDK.TokenAmount(token0, _reserve0.toString()),
            new helioswapSDK.TokenAmount(token1, _reserve1.toString()),
            pairs[index][0],
            pairs[index][1],
            pairs[index][2],
            pairs[index][3],
            pairs[index][4],
            pairs[index][5]
        );
    });
};

async function isTradeBetter(tradeA, tradeB, minimumDelta) {
    if (tradeA && !tradeB) return false;
    if (tradeB && !tradeA) return true;
    if (!tradeA || !tradeB) return undefined;

    if (tradeA.tradeType !== tradeB.tradeType || !helioswapSDK.currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
        !helioswapSDK.currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency)) {
        throw new Error("Trades are not complete");
    }

    if (minimumDelta === ZERO_PERCENT) {
        return tradeA.executionPrice.lessThan(tradeB.executionPrice);
    } else {
        return tradeA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice);
    }
}

export async function calculateHelioswap(chainId, parts, from, decimalsFrom, to, decimalsTo, amountsIn, helioswapAllowedPairs) {
    const tokenIn = new helioswapSDK.Token(chainId, from, decimalsFrom)
    const tokenOut = new helioswapSDK.Token(chainId, to, decimalsTo)
    let amountsOut = null;
    let paths = null;
    const amount = formatEther(amountsIn)

    const result = await helioswapTradeExactIn(tokenIn, tokenOut, amount, helioswapAllowedPairs);
    amountsOut = ethers.utils.formatUnits(result.outputAmount.raw.toString(), decimalsTo);
    paths = result.path;

    return {
        amountsOut,
        paths
    };
}