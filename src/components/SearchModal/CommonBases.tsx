import { ChainId, Currency, Token, currencyEquals, NativeCurrency, NATIVE } from '@sushiswap/sdk'

import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import Button from '../Button'
import { COMMON_BASES } from '../../constants/routing'
import CurrencyLogo from '../CurrencyLogo'
import QuestionHelper from '../QuestionHelper'
import React, { useMemo } from 'react'
import Typography from '../Typography'
import { currencyId } from '../../functions'
import styled from "styled-components";

const TextCommonBase = styled.div`
  color : ${({ theme }) => theme.title1}
`

const ButtonStyle = styled(Button)`
  background:  ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.borderColor1};
  color : ${({ theme }) => theme.text1};
`


export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: number
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []
  
  const ether = useMemo(() => chainId && ![ChainId.CELO].includes(chainId) && NATIVE[chainId], [chainId])
  const isLimitOrder = localStorage.getItem("isLimitOrder")
  
  const baseReal = isLimitOrder==='true' ? bases: [ether, ...bases]
  
  return (
    <div className="flex flex-col space-y-2">
      <TextCommonBase className="flex flex-row items-center">
        Common bases
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </TextCommonBase>
      <div className="flex flex-wrap">
        
        {baseReal.map((currency: Currency) => {
          const isSelected = selectedCurrency?.equals(currency)
          return (
            <ButtonStyle
              variant="empty"
              type="button"
              onClick={() => !isSelected && onSelect(currency)}
              disabled={isSelected}
              key={currencyId(currency)}
              className="flex items-center p-2 m-1 space-x-2 rounded"
            >
              <CurrencyLogo currency={currency} />
              <Typography variant="sm" className="font-semibold">
                {currency.symbol}
              </Typography>
            </ButtonStyle>
          )
        })}
      </div>
    </div>
  )
}
