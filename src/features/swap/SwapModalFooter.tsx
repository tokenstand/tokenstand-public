import { Currency, TradeType, Trade as V2Trade } from '@sushiswap/sdk'
import React, { ReactNode } from 'react'

import { ButtonError } from '../../components/Button'
import { SwapCallbackError } from './styleds'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'

export default function SwapModalFooter({
  trade,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: V2Trade<Currency, Currency, TradeType>
  onConfirm: () => void
  swapErrorMessage: ReactNode | undefined
  disabledConfirm: boolean
}) {
  const { i18n } = useLingui()
  const StyleButton = styled.div`
    .style-button{
      font-size: 18px;
      height: 63px;
      @media (max-width: 640px){
        font-size: 14px;
        height: 40px;
        padding: 0;
      }
      font-weight: 700;
    }
  `
  return (
    <StyleButton className=" mt-0 rounded">
      <ButtonError
        size="lg"
        onClick={onConfirm}
        disabled={false}
        id="confirm-swap-or-send"
        className="text-xl font-semibold w-full style-button"
      >
        {i18n._(t`Confirm Swap`)}
      </ButtonError>
      {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage.toString()} /> : null}
    </StyleButton>
  )
}
