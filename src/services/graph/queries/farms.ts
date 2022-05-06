import gql from 'graphql-tag'

export const GET_PAIR = gql`
    query pair($pairId: String!) {
        pair(
            id: $pairId
        ) {
            id
            totalSupply
            untrackedVolumeUSD
            reserveUSD
            totalLiquidityToken0
            totalLiquidityToken1
            token0 {
                derivedETH
                totalLiquidity
            }
            token1 {
                derivedETH
                totalLiquidity
            }
        }
    }
`