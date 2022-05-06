import gql from 'graphql-tag'
import {BUNDLE_ID} from '../constants';

const PairFields = `
  fragment PairFields on Pair {
    id
    txCount
    token0 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    token1 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveETH
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
    createdAtTimestamp
  }
`

export const PAIR_DATA = (pairAddress) => {
  const queryString = `
    ${PairFields}
    query pairs {
      pairs(where: { id: "${pairAddress}"} ) {
        ...PairFields
      }
    }`
  return gql(queryString)
}

export const PAIRCHART = (id?: any) => gql`
  {
    pairDayDatas(where: { pair: "${id}" }) {
      id
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolume
      dailyFee
      reserveETH
      token0 {
        derivedETH
      }
    }
  }
`
export const PAIRCHARTHOUR = gql`
  query pairHourDatas($pair: String) {
    pairHourDatas(where: { pair: $pair }) {
      id
      reserveETH
      hourlyFee
      hourStartUnix
      hourlyVolumeToken0
      hourlyVolumeToken1
      hourlyVolume
      reserveETH
    }
  }
  `

export const pairsQueryPool = (first?: number, skip?: number, orderBy?: string, userId?: string) => gql`
  {
    pairs${first ? `(first: ${first}, skip: ${skip}, orderBy: totalLiquidityETH, orderDirection: ${orderBy ? orderBy : 'desc'})` : `(orderBy: totalLiquidityETH, orderDirection: ${orderBy ? orderBy : 'desc'})`} {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
      pairDayData (orderBy: date, orderDirection:desc, first: 1) {
        date
        dailyVolume
        dailyFee
      }
      ${userId ? `userLiquidities(where: {userId: "${userId}"}) {
        userId
        totalLiquidity
      }` : ''}
      trackedReserveETH
      reserveETH
      volume
      totalLiquidityETH 
    }
  }
`

export const PAIRS_WHERE = (userId?: string,token0?: string, token1?: string) => {
  let whereToken = '';
  let userLiquidities = '';
  if(token0 && !token1){
    whereToken = `, where:{token0: "${token0}"}`
  }
  if(token0 && token1){
    whereToken = `, where:{token0_in: ["${token0}"], token1_in:["${token1}"]}`
  }
  if(userId){
    userLiquidities = `userLiquidities(where: {userId: "${userId.toString().toLocaleLowerCase()}"}, orderBy: totalLiquidity) {
      totalLiquidity
      totalLiquidityToken0
      totalLiquidityToken1
    }`
  }
  return gql`
    query pairs($skip: Int!, $first: Int!, $order: String) {
      pairs(first: $first, skip: $skip, orderBy: totalLiquidityETH, orderDirection: $order ${whereToken}) {
        id
        token0 {
          id
          symbol
          name
          derivedETH
          decimals
        }
        token1 {
          id
          symbol
          name
          derivedETH
          decimals
        }
        pairDayData (orderBy: date, orderDirection:desc, first: 1) {
          date
          dailyVolume
          dailyFee
        }
        ${userLiquidities}
        trackedReserveETH
        reserveETH
        volume
        totalLiquidityETH 
        totalLiquidityToken0
        totalLiquidityToken1
      }
    }
  `
} 

export const PAIRS_WHERE_LENGTH = gql`
  query pairs {
    pairs {
      id
    }
  }
`

export const TOKENS_ALL = gql`
  query tokens {
    tokens {
      id
      symbol
    }
  }
`

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

export const ETH_PRICE = (block?: any) => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${BUNDLE_ID} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${BUNDLE_ID} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

export const PAIRS_FILTER = (token0?: string, token1?: string) => {
  let whereToken = '';
  if(token0 && !token1){
    whereToken = `, where:{token0: "${token0}"}`
  }
  if(token0 && token1){
    whereToken = `, where:{token0_in: ["${token0}"], token1_in:["${token1}"]}`
  }

  return gql`
    query pairs($order: String) {
      pairs(orderDirection: $order ${whereToken}) {
        id
      }
    }
  `
} 

