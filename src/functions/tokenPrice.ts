import { doubleTokenPriceQuery, tokenPriceQuery } from "./../services/graph/queries/exchange";
import { client } from "./../services/graph/apollo/client";
import axios from "axios";
import { CURRENCY_NETWORK } from "../constants/chains";

export async function getTokenPrice(tokenAddress, chainId): Promise<number> {
  const priceVsEthRes = await client(chainId).query({
    query: tokenPriceQuery,
    variables: {
      id: tokenAddress?.toLowerCase(),
    },
    fetchPolicy: "cache-first",
  });
  
  const priceVerEth = priceVsEthRes.data.token ? priceVsEthRes.data.token.derivedETH : 0;
  const ethPrice = await getPriceFromCogeko(CURRENCY_NETWORK[chainId]);
  return ethPrice * priceVerEth;
}

export const getNativePrice = async (chainId) => {
  
  return await getPriceFromCogeko(CURRENCY_NETWORK[chainId]);
};

const getPriceFromCogeko = async (symbol) => {
  try {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_PRICE}/api/lasted-price`
    );

    const data = result?.data.filter(item => item.name === symbol)

    return data&&data[0].price_usd
  } catch (e) {
    return 0;
  }
};

export async function getDoubleTokenPrice(tokenAddress0, tokenAddress1, chainId) {
  const [ethPrice, priceVsEthRes] = await Promise.all([
    getPriceFromCogeko(CURRENCY_NETWORK[chainId]),
    client(chainId).query({
      query: doubleTokenPriceQuery,
      variables: {
        tokenAddresses: [tokenAddress0.toLowerCase(), tokenAddress1.toLowerCase()]
      },
      fetchPolicy: "cache-first",
    })
  ]);

  const priceVerEth = priceVsEthRes?.data?.tokens;
  return [(priceVerEth[0]?.derivedETH || 0) * ethPrice, (priceVerEth[1]?.derivedETH || 0) * ethPrice];
}
