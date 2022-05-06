import { useEffect } from "react";
import { client, clientBlockBSC } from "../services/graph/apollo/client";
import dayjs from "dayjs";
import { GET_BLOCK, ETH_PRICE } from "../services/graph/queries";
import { useETHPriceManager } from "../state/user/hooks";
import axios from "axios";
import { ChainId } from "@sushiswap/sdk";

// testing
const BASE_API_URL = process.env.NEXT_PUBLIC_API;
// staging
// const BASE_API_URL = 'https://tokenstand-api-routing.sotatek.works'
const CancelToken = axios.CancelToken;

const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) /
      parseFloat(value24HoursAgo)) *
    100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};

async function getBlockFromTimestamp(timestamp) {
  let result = await clientBlockBSC.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: "cache-first",
  });
  return result?.data?.blocks?.[0]?.number;
}

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
export const getEthPrice = async () => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime
    .subtract(1, "day")
    .startOf("minute")
    .unix();

  let ethPrice = 0;
  let ethPriceOneDay = 0;
  let priceChangeETH = 0;

  try {
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack);
    const apoloClient = client();
    let result = await apoloClient?.query({
      query: ETH_PRICE(),
      fetchPolicy: "cache-first",
    });
    let resultOneDay = await apoloClient?.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: "cache-first",
    });
    const currentPrice = result?.data?.bundles[0]?.ethPrice;
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice;
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice);
    ethPrice = currentPrice;
    ethPriceOneDay = oneDayBackPrice;
  } catch (e) {
    console.log(e);
  }
  return [ethPrice, ethPriceOneDay, priceChangeETH];
};

export const getEthPriceApi = async () => {
  return await axios.get("/api/lasted-price", {
    baseURL: process.env.NEXT_PUBLIC_API_PRICE,
    timeout: 15000,
  });
};

let cancelBestPrice;
let cancelPrice;

export const fetchBestRoutes = async (data: any) => {
  try {
    if (cancelBestPrice != undefined) {
      cancelBestPrice("cancel");
    }
    // return await axios.get("/expectedReturn", {
    return await axios.get("/v2/expected-return", {
      params: data,
      baseURL: BASE_API_URL,
      timeout: 120000,
      cancelToken: new CancelToken(function executor(c) {
        cancelBestPrice = c;
      }),
    });
  } catch (e) {
    console.log("error ", e);
    if (e.message == "cancel") return "cancel";
    return null;
  }
};

export const fetchPrice = async (data: any) => {
  try {
    if (cancelPrice != undefined) {
      cancelPrice();
    }
    return await axios.get("v2/price", {
      params: data,
      baseURL: BASE_API_URL,
      timeout: 60000,
      cancelToken: new CancelToken(function executor(c) {
        cancelPrice = c;
      }),
    });
  } catch (e) {
    return null;
  }
};

export let cancelBridgeTokenFee;
export const fetchBridgeTokenFee = async (
  chainId: ChainId,
  amount: string
) => {
  try {
    if (cancelBridgeTokenFee) {
      cancelBridgeTokenFee();
    }
    return await axios.get('/api/swap-fee', {
      baseURL: process.env.NEXT_PUBLIC_API_BRIDGE_TOKEN,
      params: {
        chainId,
        amount,
      },
      cancelToken: new CancelToken(function executor(c) {
        cancelBridgeTokenFee = c;
      }),
    });
  } catch (e) {
    return;
  }
};
