import {
  pairsQueryPool, PAIRS_FILTER, PAIRS_WHERE, PAIRS_WHERE_LENGTH
} from '../queries'

import { TOKEN_STAND_API } from '../constants'
import { request } from 'graphql-request'
import { client } from '../../../services/graph/apollo/client'
import { PAIRCHART, PAIRCHARTHOUR, TOKENS_ALL } from '../../../services/graph/queries';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const uri = (chainId) => {
  const URI = TOKEN_STAND_API[chainId];
  return `${URI}`;
}


export const pool = async (query, variables, chainId) => request(uri(chainId), query, variables)

export const getPairsPool = async (chainId?:number, first?: number, skip?: number, variables?: object) => {
  const { pairs } = await pool(pairsQueryPool(first, skip), variables, chainId);
  return pairs
}

export const getPairsPoolWhere = async (params) => {
  const {chainId, pageSize, ofset, userId, order, token0, token1} = params;
  const {data} = await client(chainId).query({
    query: PAIRS_WHERE(userId, token0, token1),
    variables: {
      skip: ofset || 0,
      first: pageSize || 10,
      order: order || 'desc',
      token0: token0,
      token1: token1
    },
    fetchPolicy: "cache-first",
  });
  return data?.pairs || [];
}

export const getPairsLength = async (chainId) => {
  const {data} = await client(chainId).query({
    query: PAIRS_WHERE_LENGTH,
    variables: {},
    fetchPolicy: "cache-first",
  });
  return data?.pairs?.length || 0;
}

export const getTokensAll = async (chainId) => {
  const {data} = await client(chainId).query({
    query: TOKENS_ALL,
    variables: {},
    fetchPolicy: "cache-first",
  });
  return data?.tokens;
}

export const getChartPair = async (id: string, chainId?: number) => {
  let data = []
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
  let startTime = utcStartTime.unix() - 1;
  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      const {pairDayDatas} = await pool(PAIRCHART(id), null, chainId);
      skip += 1000;
      data = data.concat(pairDayDatas)
      if (pairDayDatas.length < 1000) {
        allFound = true
      }
    }

    let dayIndexSet = new Set()
    let dayIndexArray = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolume = parseFloat(dayData.dailyVolume)
      dayData.reserveETH = parseFloat(dayData.reserveETH)
      dayData.dailyFee = parseFloat(dayData.dailyFee)
      dayData.token0.derivedETH = parseFloat(dayData.token0.derivedETH)
    })

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime;
      let latestLiquidityUSD = data[0].reserveETH
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        let currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolume: 0,
            dailyFee: 0,
            reserveETH: latestLiquidityUSD,
            token0: {derivedETH: 0}
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveETH
          index = index + 1
        }
        timestamp = nextDay;
      }
    }

    if(data.length < 7){
      let timestamp = data[0].date;
      while(timestamp > utcEndTime.unix() - oneDay*6){
        const prevtDay = timestamp - oneDay;
        data.unshift({
          date: prevtDay,
          dayString: prevtDay,
          dailyVolume: 0,
          dailyFee: 0,
          reserveETH: 0,
          token0: {derivedETH: 0}
        })
        timestamp = prevtDay;
      }
    }

    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }
  return data
}


export const getChartPairHour = async (id: string, chainId?: number) => {
  let data = []
  const utcEndTime = dayjs.utc();
  let utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
  let startTime = utcStartTime.unix() - 1;
  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      const dataPair = await client(chainId).query({
        query: PAIRCHARTHOUR,
        variables: {
          pair: id
        },
        fetchPolicy: "cache-first",
      });;
      skip += 1000;
      if(dataPair?.data?.pairHourDatas){
        data = data.concat(dataPair?.data?.pairHourDatas)
        if (dataPair?.data?.pairHourDatas?.length < 1000) {
          allFound = true
        }
      }
    }
    let dayIndexSet = new Set()
    let dayIndexArray = []
    const oneDay = 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].hourStartUnix / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolume = parseFloat(dayData.hourlyVolume)
      dayData.reserveETH = parseFloat(dayData.reserveETH)
      dayData.dailyFee = parseFloat(dayData.hourlyFee)
      dayData.date = dayData.hourStartUnix
    })
    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].hourStartUnix ? data[0].hourStartUnix : startTime;
      let latestLiquidityUSD = data[0].reserveETH
      let index = 1;
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        let currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolume: 0,
            dailyFee: 0,
            reserveETH: latestLiquidityUSD,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveETH
          index = index + 1
        }
        timestamp = nextDay;
      }
    }

    if(data[0].date >= utcEndTime.hour(0).unix() - oneDay*24*7){
      let timestamp = data[0].hourStartUnix;
      while(timestamp >= utcEndTime.hour(0).unix() - oneDay*24*7){
        const prevtDay = timestamp - oneDay;
        data.unshift({
          date: prevtDay,
          dayString: prevtDay,
          dailyVolume: 0,
          dailyFee: 0,
          reserveETH: 0,
        })
        timestamp = prevtDay;
      }
    }
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1)).slice(-168)
  } catch (e) {
    console.log(e)
  }
  return data
}

export const getPairsFilter = async (params) => {
  const {chainId, token0, token1} = params;
  const {data} = await client(chainId).query({
    query: PAIRS_FILTER(token0, token1),
    variables: {
      token0: token0,
      token1: token1
    },
    fetchPolicy: "cache-first",
  });
  return data?.pairs?.length || 0;
}