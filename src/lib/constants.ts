const uniswapV2SDK = require("@uniswap/sdk");
const sushiSDK = require("@sushiswap/sdk");
const helioswapSDK = require("@tokenstand/helioswap-sdk");

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ONE_HUNDRED_PERCENT = new uniswapV2SDK.Percent("1");
export const ZERO_PERCENT = new uniswapV2SDK.Percent("0");

// 0.3 %
export const SWAP_FEE = new uniswapV2SDK.Percent(uniswapV2SDK.JSBI.BigInt(30), uniswapV2SDK.JSBI.BigInt(10000));

// 100 % - 0.3 %
export const ACTUAL_SWAP = ONE_HUNDRED_PERCENT.subtract(SWAP_FEE);

export const ACTIVE_PERCENT = 0.5; //


// ============= Token =============
// UniswapV2
export const UNIV2_WETH_ONLY = {
    [uniswapV2SDK.ChainId.MAINNET]: [uniswapV2SDK.WETH[uniswapV2SDK.ChainId.MAINNET]],
    [uniswapV2SDK.ChainId.RINKEBY]: [uniswapV2SDK.WETH[uniswapV2SDK.ChainId.RINKEBY]],
    [uniswapV2SDK.ChainId.ROPSTEN]: [uniswapV2SDK.WETH[uniswapV2SDK.ChainId.ROPSTEN]],
    [uniswapV2SDK.ChainId.GOERLI]: [uniswapV2SDK.WETH[uniswapV2SDK.ChainId.GOERLI]],
    [uniswapV2SDK.ChainId.KOVAN]: [uniswapV2SDK.WETH[uniswapV2SDK.ChainId.KOVAN]],
    [uniswapV2SDK.ChainId.ARBITRUM]: [uniswapV2SDK.WETH[uniswapV2SDK.ChainId.ARBITRUM]]
};

export const UniV2DAI = new uniswapV2SDK.Token(uniswapV2SDK.ChainId.RINKEBY, '0x6158864304e969B6d4daACb8f2e3bC5B76c03959', 18, 'DAI', 'Dai Stablecoin');
export const UniV2USDC = new uniswapV2SDK.Token(uniswapV2SDK.ChainId.RINKEBY, '0x8570c3592CCeb7ebCd51Dc13f3b95fE2f4f01C80', 6, 'USDC', 'USDC');
export const UniV2USDT = new uniswapV2SDK.Token(uniswapV2SDK.ChainId.RINKEBY, '0xEA040dB91b2FB439857145D3e660ceE46f458F94', 6, 'USDT', 'Tether USD');
export const UniV2COMP = new uniswapV2SDK.Token(uniswapV2SDK.ChainId.RINKEBY, '0x75C00df109f2bfDF762D6c8061D6Ded21e2cDA4c', 18, 'COMP', 'Compound');
export const UniV2MKR = new uniswapV2SDK.Token(uniswapV2SDK.ChainId.RINKEBY, '0xc3F7125e04341Ff3ABa0F1ED3FE92bFbD8Eb20d5', 18, 'MKR', 'Maker');
export const UniV2AMPL = new uniswapV2SDK.Token(uniswapV2SDK.ChainId.RINKEBY, '0xcDFadc544ccE6CF0A9a4f4E00050076406A760A6', 9, 'AMPL', 'Ampleforth');

// used to construct intermediary pairs for trading
export const UNIV2_BASES_TO_CHECK_TRADES_AGAINST = {
    ...UNIV2_WETH_ONLY,
    [uniswapV2SDK.ChainId.RINKEBY]: [...UNIV2_WETH_ONLY[uniswapV2SDK.ChainId.RINKEBY], UniV2DAI, UniV2USDC, UniV2USDT, UniV2COMP, UniV2MKR],
};

export const UNIV2_CUSTOM_BASES = {
    [uniswapV2SDK.ChainId.RINKEBY]: {
        [UniV2AMPL.address]: [UniV2DAI, uniswapV2SDK.WETH[uniswapV2SDK.ChainId.RINKEBY]]
    },
};

// Sushiswap
export const SUSHI_WETH_ONLY = {
    [sushiSDK.ChainId.MAINNET]: [sushiSDK.WETH9[sushiSDK.ChainId.MAINNET]],
    [sushiSDK.ChainId.RINKEBY]: [sushiSDK.WETH9[sushiSDK.ChainId.RINKEBY]],
    [sushiSDK.ChainId.ROPSTEN]: [sushiSDK.WETH9[sushiSDK.ChainId.ROPSTEN]],
    [sushiSDK.ChainId.GOERLI]: [sushiSDK.WETH9[sushiSDK.ChainId.GOERLI]],
    [sushiSDK.ChainId.KOVAN]: [sushiSDK.WETH9[sushiSDK.ChainId.KOVAN]],
    [sushiSDK.ChainId.ARBITRUM]: [sushiSDK.WETH9[sushiSDK.ChainId.ARBITRUM]]
};

export const SushiDAI = new sushiSDK.Token(sushiSDK.ChainId.RINKEBY, '0x6158864304e969B6d4daACb8f2e3bC5B76c03959', 18, 'DAI', 'Dai Stablecoin');
export const SushiUSDC = new sushiSDK.Token(sushiSDK.ChainId.RINKEBY, '0x8570c3592CCeb7ebCd51Dc13f3b95fE2f4f01C80', 6, 'USDC', 'USDC');
export const SushiUSDT = new sushiSDK.Token(sushiSDK.ChainId.RINKEBY, '0xEA040dB91b2FB439857145D3e660ceE46f458F94', 6, 'USDT', 'Tether USD');
export const SushiCOMP = new sushiSDK.Token(sushiSDK.ChainId.RINKEBY, '0x75C00df109f2bfDF762D6c8061D6Ded21e2cDA4c', 18, 'COMP', 'Compound');
export const SushiMKR = new sushiSDK.Token(sushiSDK.ChainId.RINKEBY, '0xc3F7125e04341Ff3ABa0F1ED3FE92bFbD8Eb20d5', 18, 'MKR', 'Maker');
export const SushiAMPL = new sushiSDK.Token(sushiSDK.ChainId.RINKEBY, '0xcDFadc544ccE6CF0A9a4f4E00050076406A760A6', 9, 'AMPL', 'Ampleforth');

// used to construct intermediary pairs for trading
export const SUSHI_BASES_TO_CHECK_TRADES_AGAINST = {
    ...SUSHI_WETH_ONLY,
    [sushiSDK.ChainId.RINKEBY]: [...SUSHI_WETH_ONLY[sushiSDK.ChainId.RINKEBY], SushiDAI, SushiUSDC, SushiUSDT, SushiCOMP, SushiMKR],
};
delete SUSHI_BASES_TO_CHECK_TRADES_AGAINST['undefined']
delete SUSHI_BASES_TO_CHECK_TRADES_AGAINST['42']

export const SUSHI_CUSTOM_BASES = {
    [sushiSDK.ChainId.RINKEBY]: {
        [SushiAMPL.address]: [SushiDAI, sushiSDK.WETH9[sushiSDK.ChainId.RINKEBY]]
    },
};

// Helioswap
export const HELIOS_WETH_ONLY = {
    [helioswapSDK.ChainId.MAINNET]: [new helioswapSDK.Token(helioswapSDK.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH9', 'Wrapped Ether')],
    [helioswapSDK.ChainId.RINKEBY]: [new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH9', 'Wrapped Ether')],
    [helioswapSDK.ChainId.ROPSTEN]: [new helioswapSDK.Token(helioswapSDK.ChainId.ROPSTEN, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH9', 'Wrapped Ether')],
    [helioswapSDK.ChainId.GOERLI]: [new helioswapSDK.Token(helioswapSDK.ChainId.GOERLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH9', 'Wrapped Ether')],
    [helioswapSDK.ChainId.KOVAN]: [new helioswapSDK.Token(helioswapSDK.ChainId.KOVAN, '0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1', 18, 'WETH9', 'Wrapped Ether')],
    [helioswapSDK.ChainId.ARBITRUM]: [new helioswapSDK.Token(helioswapSDK.ChainId.ARBITRUM, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH9', 'Wrapped Ether')],
    [helioswapSDK.ChainId.BSC_MAINNET]: [new helioswapSDK.Token(helioswapSDK.ChainId.BSC_MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')],
    [helioswapSDK.ChainId.TESTNET]: [new helioswapSDK.Token(helioswapSDK.ChainId.TESTNET, '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', 18, 'WBNB', 'Wrapped BNB')]
};

export const HeliosDAI = new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0x6158864304e969B6d4daACb8f2e3bC5B76c03959', 18, 'DAI', 'Dai Stablecoin');
export const HeliosUSDC = new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0x8570c3592CCeb7ebCd51Dc13f3b95fE2f4f01C80', 6, 'USDC', 'USDC');
export const HeliosUSDT = new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0xEA040dB91b2FB439857145D3e660ceE46f458F94', 6, 'USDT', 'Tether USD');
export const HeliosCOMP = new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0x75C00df109f2bfDF762D6c8061D6Ded21e2cDA4c', 18, 'COMP', 'Compound');
export const HeliosMKR = new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0xc3F7125e04341Ff3ABa0F1ED3FE92bFbD8Eb20d5', 18, 'MKR', 'Maker');
export const HeliosAMPL = new helioswapSDK.Token(helioswapSDK.ChainId.RINKEBY, '0xcDFadc544ccE6CF0A9a4f4E00050076406A760A6', 9, 'AMPL', 'Ampleforth');

// used to construct intermediary pairs for trading
export const HELIOS_BASES_TO_CHECK_TRADES_AGAINST = {
    ...HELIOS_WETH_ONLY,
    [helioswapSDK.ChainId.RINKEBY]: [...HELIOS_WETH_ONLY[helioswapSDK.ChainId.RINKEBY], HeliosDAI, HeliosUSDC, HeliosUSDT, HeliosCOMP, HeliosMKR],
};

export const HELIOS_CUSTOM_BASES = {
    [sushiSDK.ChainId.RINKEBY]: {
        [HeliosAMPL.address]: [HeliosDAI, HELIOS_WETH_ONLY[helioswapSDK.ChainId.RINKEBY]]
    },
};

export const MAX_HOPS = 3;

export const LOWEST_PRICE_IMPACT = new uniswapV2SDK.Percent(uniswapV2SDK.JSBI.BigInt(30), uniswapV2SDK.JSBI.BigInt(10000));

export const VERY_NEGATIVE_VALUE = -9999999;