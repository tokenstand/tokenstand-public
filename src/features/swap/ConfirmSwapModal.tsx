import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Ether,
  Percent,
  TradeType,
  Trade as V2Trade,
} from "@sushiswap/sdk";
import React, { useCallback, useMemo } from "react";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from "../../components/TransactionConfirmationModal";

import SwapModalFooter from "./SwapModalFooter";
import SwapModalHeader from "./SwapModalHeader";

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
function tradeMeaningfullyDiffers(
  ...args: [
    V2Trade<Currency, Currency, TradeType>,
    V2Trade<Currency, Currency, TradeType>
  ]
): boolean {
  const [tradeA, tradeB] = args;
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  );
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  currencyIn,
  currencyOut,
  amountIn,
  amountOut,
  minAmountOut,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  unitPrice,
  recipient,
  providerFee,
  swapErrorMessage,
  gas,
  priceImpact,
  isOpen,
  attemptingTxn,
  txHash,
  minerBribe,
}: {
  isOpen: boolean;
  amountIn: string | null;
  amountOut: string | null;
  unitPrice: number,
  gas,
  providerFee: string | null;
  minAmountOut: string | null;
  trade: V2Trade<Currency, Currency, TradeType> | undefined;
  originalTrade: V2Trade<Currency, Currency, TradeType> | undefined;
  attemptingTxn: boolean;
  currencyIn: Currency;
  currencyOut: Currency;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: Percent;
  minerBribe?: string;
  onAcceptChanges: () => void;
  priceImpact?: string | null;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  onDismiss: () => void;
}) {
  const { i18n } = useLingui();
  const showAcceptChanges = useMemo(
    () =>
      Boolean(
        trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)
      ),
    [originalTrade, trade]
  );

  const modalHeader = useCallback(() => {
    return (
      <SwapModalHeader
        trade={trade}
        gas={gas}
        unitPrice={unitPrice}
        providerFee={providerFee}
        currencyIn={currencyIn}
        priceImpact={priceImpact}
        currencyOut={currencyOut}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        amountIn={amountIn}
        amountOut={amountOut}
        minAmountOut={minAmountOut}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        minerBribe={minerBribe}
      />
    );
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade]);

  const modalBottom = useCallback(() => {
    return (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
      />
    )
  }, [onConfirm, showAcceptChanges, swapErrorMessage, trade]);
  // text to show while loading
  const pendingText = `${i18n._(t`Swapping`)} ${amountIn} ${
    currencyIn?.symbol
  } ${i18n._(t`for`)} ${Number(amountOut).toFixed(6)} ${currencyOut?.symbol}`;

  const pendingText2 = minerBribe
    ? `${i18n._(t`Plus`)} ${CurrencyAmount.fromRawAmount(
        Ether.onChain(ChainId.MAINNET),
        minerBribe
      ).toSignificant(6)} ETH ${i18n._(t`Miner Tip`)}`
    : undefined;
  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={swapErrorMessage}
        />
      ) : (
        <ConfirmationModalContent
          title={i18n._(t`Confirm Swap`)}
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  );

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      pendingText2={pendingText2}
      currencyToAdd={trade?.outputAmount.currency}
    />
  );
}
