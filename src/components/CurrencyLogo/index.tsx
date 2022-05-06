import { ChainId, Currency, WNATIVE, NATIVE } from '@sushiswap/sdk'
import React, { FunctionComponent, useMemo } from 'react'

import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { getMaticTokenLogoURL } from '../../constants/maticTokenMapping'
import useHttpLocations from '../../hooks/useHttpLocations'
import Image from 'next/image';
// export const getTokenLogoURL = (address: string, chainId: ChainId) => {
//   let imageURL
//   if (chainId === ChainId.MAINNET) {
//     imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
//   } else if (chainId === ChainId.BSC) {
//     imageURL = `https://v1exchange.pancakeswap.finance/images/coins/${address}.png`
//   } else if (chainId === ChainId.MATIC) {
//     imageURL = getMaticTokenLogoURL(address)
//   }
//   return imageURL
// }

const BLOCKCHAIN = {
  [ChainId.MAINNET]: 'ethereum',
}

function getCurrencySymbol(currency) {
  if (currency.symbol === 'WBTC') {
    return 'btc'
  }
  if (currency.symbol === 'WETH') {
    return 'eth'
  }
  return currency.symbol?.toLowerCase()
}

function getCurrencyLogoUrls(currency) {
  const urls = []

  if (currency.chainId === ChainId.MAINNET) {
    urls.push(`https://raw.githubusercontent.com/sushiswap/icons/master/token/${getCurrencySymbol(currency)}.jpg`)
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${currency.address
      }/logo.jpg`
    )
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${currency.address
      }/logo.png`
    )
  } else if (currency.chainId === ChainId.BSC) {
    urls.push(`https://v1exchange.pancakeswap.finance/images/coins/${currency.address}.png`)
    urls.push(`https://tokens.1inch.io/${currency.address.toLowerCase()}.png`)

  } else if (currency.chainId === ChainId.MATIC) {
    urls.push(getMaticTokenLogoURL(currency.address))
  }
  else {
    urls.push(`https://raw.githubusercontent.com/sushiswap/icons/master/token/${getCurrencySymbol(currency)}.jpg`)
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${currency.address
      }/logo.png`
    )
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${currency.address
      }/logo.png`
    )
  }
  return urls
}

const AvalancheLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/avax.jpg'
const BinanceCoinLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/bnb.jpg'
const EthereumLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg'
const FantomLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/ftm.jpg'
const HarmonyLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/one.jpg'
const HecoLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/heco.jpg'
const MaticLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/polygon.jpg'
const MoonbeamLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg'
const OKExLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/okt.png'
const xDaiLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/xdai.png'
const CeloLogo = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/celo.jpg'

const logo: { readonly [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MATIC_TESTNET]: MaticLogo,
  [ChainId.XDAI]: xDaiLogo,
  [ChainId.BSC]: BinanceCoinLogo,
  [ChainId.BSC_TESTNET]: BinanceCoinLogo,
  [ChainId.MOONBEAM_TESTNET]: MoonbeamLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.AVALANCHE_TESTNET]: AvalancheLogo,
  [ChainId.HECO]: HecoLogo,
  [ChainId.HECO_TESTNET]: HecoLogo,
  [ChainId.HARMONY]: HarmonyLogo,
  [ChainId.HARMONY_TESTNET]: HarmonyLogo,
  [ChainId.OKEX]: OKExLogo,
  [ChainId.OKEX_TESTNET]: OKExLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.KOVAN]: EthereumLogo,
}

interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
  squared?: boolean
}

const unknown = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png'

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
  currency,
  size = '24px',
  style,
  className = '',
  ...rest
}) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )

  const srcs = useMemo(() => {
 
    if (!currency) {
      return [unknown]
    }
    if (currency.isNative || currency?.equals&&currency?.equals(WNATIVE[currency.chainId])) {

      return [logo[currency.chainId], unknown]
    }

    if (currency.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)]
      if (currency instanceof WrappedTokenInfo) {

        return [...uriLocations, ...defaultUrls, unknown]
      }

      return defaultUrls

    }

  }, [currency, uriLocations])

  if (currency?.symbol === "STAND") {
    return <Image
      src={'/icons/tokenstand_circle_logo.png'}
      width={size}
      height={size}
      alt={currency?.symbol}
      layout="fixed"
      {...rest}
  />
  }

  return <Logo className={className} srcs={srcs} width={size} height={size} alt={currency?.symbol} {...rest} />
}

export default CurrencyLogo
