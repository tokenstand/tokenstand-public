// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */
export const UNSUPPORTED_LIST_URLS: string[] = [];

const YEARN_LIST = "https://yearn.science/static/tokenlist.json";
const COMPOUND_LIST =
  "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json";
const UMA_LIST = "https://umaproject.org/uma.tokenlist.json";
const NFTX_LIST = "https://nftx.ethereumdb.com/v1/tokenlist/";
const AAVE_LIST = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokenlist.aave.eth.link";
const SYNTHETIX_LIST = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://synths.snx.eth.link";
const WRAPPED_LIST = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://wrapped.tokensoft.eth.link";
const SET_LIST =
  "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json";
const OPYN_LIST =
  "https://raw.githubusercontent.com/opynfinance/opyn-tokenlist/master/opyn-v1.tokenlist.json";
const ROLL_LIST = "https://app.tryroll.com/tokens.json";
const COINGECKO_LIST = "https://tokens.coingecko.com/uniswap/all.json";
const CMC_ALL_LIST = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://defi.cmc.eth.link";
const CMC_STABLECOIN = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://stablecoin.cmc.eth.link";
const CMC_ERC20 = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://erc20.cmc.eth.link"
const KLEROS_LIST = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://t2crtokens.eth.link";
const GEMINI_LIST = "https://www.gemini.com/uniswap/manifest.json";
const QUICK_SWAP =
  "https://unpkg.com/quickswap-default-token-list@1.0.39/build/quickswap-default.tokenlist.json";

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  YEARN_LIST,
  // COMPOUND_LIST,
  // AAVE_LIST,
  // SYNTHETIX_LIST,
  // UMA_LIST,
  NFTX_LIST,
  // WRAPPED_LIST,
  // SET_LIST,
  // OPYN_LIST,
  // ROLL_LIST,
  // COINGECKO_LIST,
  CMC_ALL_LIST,
  CMC_STABLECOIN,
  CMC_ERC20,
  // KLEROS_LIST,
  GEMINI_LIST,
  // QUICK_SWAP,
  //...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
];

// default lists to be 'active' aka searched across
// export const DEFAULT_ACTIVE_LIST_URLS: string[] = [YEARN_LIST, NFTX_LIST] //[GEMINI_LIST]

export const DEFAULT_ACTIVE_LIST_URLS: string[] = [];

export const STABLE_COIN = [
  "USDT",
  "USDC",
  "DAI",
]