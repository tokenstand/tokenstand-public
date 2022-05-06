import { ChevronDownIcon } from "@heroicons/react/outline";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Currency } from "@sushiswap/sdk";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { isMobile } from "react-device-detect";
import ReactGA from "react-ga";
import styled from "styled-components";
import { AutoColumn } from "../../../components/Column";
import CurrencyLogo from "../../../components/CurrencyLogo";
import Modal from "../../../components/Modal";
import { AutoRow } from "../../../components/Row";
import CurrencySearchModal from "../../../components/SearchModal/CurrencySearchModal";
import TransactionConfirmationModal from "../../../components/TransactionConfirmationModal";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants";
import { calculateGasMargin, currencyId } from "../../../functions";
import { useActiveWeb3React, useSwapFactory } from "../../../hooks";
import { useCurrencyDisconnect } from "../../../hooks/TokensDisconnect";
import { Field } from "../../../state/mint/actions";
import { useDerivedMintInfo } from "../../../state/mint/hooks";
import {
  useIsTransactionPending,
  useTransactionAdder
} from "../../../state/transactions/hooks";
import { CloseIcon } from "../../../theme";
import Provide from "../provide";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  @media (max-width: 767px) {
    font-size: 18px;
  }
`;

const BodyStyle = styled.div`
  font-family: "SF UI Display";
  width: 100%;
  margin-top: 14px;

  .open-currency-select-button {
    justify-content: center;
  }

  .chevron-icon {
    stroke: ${({ theme }) => theme.primaryText3};
  }

  .description {
    margin-top: 21px;
    text-align: center;
    font-weight: normal;
    font-size: 16px;
    color: ${({ theme }) => theme.primaryText3};
  }

  .disable-btn {
    background-color: rgba(31, 55, 100, 0.5) !important;
    color: rgba(255, 255, 255, 0.5) !important;
    cursor: not-allowed;
  }

  @media screen and (max-width: 1023px) {
    .auto-col {
      margin-top: 24px;
    }
  }

  @media screen and (max-width: 768px) {
    .description {
      font-size: 12px;
    }
  }
`;

const SelectToken = styled.div`
  width: 100%;
  border-radius: 15px;
  margin-bottom: 8px;
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  // margin-top: 22px;
  height: 100%;
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  background-color: ${({ theme }) => theme.bgNoti};
  cursor: pointer;
  user-select: none;
  border: none;

  .label {
    min-height: 33px;
  }

  @media screen and (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
    .label {
      min-height: unset;
      height: 24px;
    }
  }
`;

const StyleLogo = styled.div`
  img {
    border-radius: 50%;
  }
`;

const TokenName = styled.div`
  color: ${({ theme }) => theme.textBold};
  font-size: 16px;
  font-weight: 600;
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const ButtonConfirm = styled.button`
  margin-top: 28px;
  font-weight: 700;
  font-size: 18px;
  // padding: 20px;
  background: ${({ theme }) => theme.greenButton};
  border-radius: 10px;
  color: ${({ theme }) => theme.white};
  width: 100%;
  text-align: center;
  height: 63px;
  @media (max-width: 640px) {
    font-size: 14px;
    padding: 11px;
    line-height: 18px;
    margin-top: 12px;
    height: unset;
  }
`;

const PlusIcon = styled.div`
  background: ${({ theme }) => theme.bgSwitch};
  border: 1px solid ${({ theme }) => theme.borderSwitch};
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    width: 24px;
    height: 24px;
  }
  svg {
    path {
      fill: ${({ theme }) => theme.iconSwitch};
    }
    @media (max-width: 640px) {
      width: 11px;
      
    }
  }
`;

export default function Add({
  isOpenPool,
  onDismissAddPool,
  onCreateSuccess,
  onProvideSuccess
}: {
  isOpenPool: boolean;
  onDismissAddPool: () => void;
  onCreateSuccess: () => void;
  onProvideSuccess: any
}) {
  const { i18n } = useLingui();
  const { account, chainId, library } = useActiveWeb3React();
  const router = useRouter();
  const tokens = router.query;

  const [currencyIdA, currencyIdB] = [
    tokens.currencyA?.toString(),
    tokens.currencyB?.toString(),
  ] || [undefined, undefined];
  const currencyA = useCurrencyDisconnect(currencyIdA);
  const currencyB = useCurrencyDisconnect(currencyIdB);

  // txn values
  const [txHash, setTxHash] = useState<string>("");
  const [showPending, setShowPending] = useState<boolean>(false);
  const pending = useIsTransactionPending(txHash);

  // mint state
  const { currencies, noLiquidity } = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pending
  );

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  const factoryContract = useSwapFactory();
  // check whether the user has approved the router on the tokens

  const addTransaction = useTransactionAdder();

  const onAdd = async () => {
    if (!chainId || !library || !account || !factoryContract) return;

    const estimate = factoryContract.estimateGas.deploy;
    let method = factoryContract.deploy,
      args: Array<string | string[] | number>,
      value: BigNumber | null;

    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative;
      args = [
        NATIVE_TOKEN_ADDRESS,
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? "", // token
      ];
    } else {
      args = [
        currencyA?.wrapped?.address ?? "",
        currencyB?.wrapped?.address ?? "",
      ];
    }

    setShowPending(true);
    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);
          addTransaction(response, {
            summary: `${i18n._(t`Created pool`)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } ${i18n._(t`and`)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });
          onCreateSuccess();
          setTxHash(response.hash);
          ReactGA.event({
            category: "Liquidity",
            action: "Add",
            label: [
              currencies[Field.CURRENCY_A]?.symbol,
              currencies[Field.CURRENCY_B]?.symbol,
            ].join("/"),
          });
        })
      )
      .catch((error) => {
        setShowPending(false);
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  };

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA);
      if (newCurrencyIdA === currencyIdB) {
        router.push(`?currencyA=${currencyIdB}&currencyB=${currencyIdA}`);
      } else if (currencyIdB) {
        router.push(`?currencyA=${newCurrencyIdA}&currencyB=${currencyIdB}`);
      } else {
        router.push(`?currencyA=${newCurrencyIdA}`);
      }
    },
    [currencyIdB, router, currencyIdA]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB);
      if (newCurrencyIdB === currencyIdA) {
        router.push(`?currencyB=${currencyIdB}&currencyA=${currencyIdA}`);
      } else if (currencyIdA) {
        router.push(`?currencyB=${newCurrencyIdB}&currencyA=${currencyIdA}`);
      } else {
        router.push(`?currencyB=${newCurrencyIdB}`);
      }
    },
    [currencyIdA, currencyIdB, router]
  );

  const [isOpenProvide, setIsOpenProvide] = useState(false);
  const handleOpenProvide = () => {
    setIsOpenProvide(true);
  };

  const onDismissProvide = () => {
    router.push("/pool")
    setIsOpenProvide(false);
    onDismissAddPool();
  };

  const handleDismissConfirmation = useCallback(() => {
    setShowPending(false);
    if (txHash) {
      onDismissAddPool();
    }
    // if there was a tx hash, we want to clear the input
    setTxHash("");
  }, [onDismissAddPool, txHash]);

  const pendingText = `${i18n._(t`Creating pool`)} ${currencies[Field.CURRENCY_A]?.symbol} ${i18n._(t`and`)} ${currencies[Field.CURRENCY_B]?.symbol}`;

  return (
    <Modal isOpen={isOpenPool} onDismiss={onDismissAddPool} maxWidth={568}>
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">{i18n._(t`Create Pool`)}</TitleStyle>
        <CloseIcon onClick={onDismissAddPool} />
      </div>
      <BodyStyle style={{ zIndex: 1 }}>
        <SelectToken>
          <CurrencyInput
            currency={currencyA}
            onCurrencySelect={handleCurrencyASelect}
          />
          <AutoColumn justify="space-between" className="sm:py-2.5 py-2 w-full">
            <AutoRow style={{ padding: "0 12px" }}>
              <div className="z-10 -mt-6 -mb-6 rounded-full p-3px w-full flex items-center justify-center">
                <PlusIcon className="rounded-full">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.6875 1.78125C9.6875 1.50775 9.57885 1.24544 9.38545 1.05205C9.19206 0.858649 8.92975 0.75 8.65625 0.75C8.38275 0.75 8.12044 0.858649 7.92705 1.05205C7.73365 1.24544 7.625 1.50775 7.625 1.78125V7.625H1.78125C1.50775 7.625 1.24544 7.73365 1.05205 7.92705C0.858649 8.12044 0.75 8.38275 0.75 8.65625C0.75 8.92975 0.858649 9.19206 1.05205 9.38545C1.24544 9.57885 1.50775 9.6875 1.78125 9.6875H7.625V15.5312C7.625 15.8048 7.73365 16.0671 7.92705 16.2605C8.12044 16.4538 8.38275 16.5625 8.65625 16.5625C8.92975 16.5625 9.19206 16.4538 9.38545 16.2605C9.57885 16.0671 9.6875 15.8048 9.6875 15.5312V9.6875H15.5312C15.8048 9.6875 16.0671 9.57885 16.2605 9.38545C16.4538 9.19206 16.5625 8.92975 16.5625 8.65625C16.5625 8.38275 16.4538 8.12044 16.2605 7.92705C16.0671 7.73365 15.8048 7.625 15.5312 7.625H9.6875V1.78125Z"
                      fill="#667795"
                    />
                  </svg>
                </PlusIcon>
              </div>
            </AutoRow>
          </AutoColumn>
          <CurrencyInput
            currency={currencyB}
            onCurrencySelect={handleCurrencyBSelect}
          />
        </SelectToken>
        {!noLiquidity && currencyA && currencyB && (
          <div className="description">
            {i18n._(t`This Pool Already Created. You Can Provide Liquidity Here`)}
          </div>
        )}
        {noLiquidity || !currencyA || !currencyB ? (
          <ButtonConfirm
            onClick={onAdd}
            className={(!currencyA || !currencyB || pending) && "disable-btn"}
            disabled={!currencyA || !currencyB || pending}
          >
            {i18n._(t`Create Pool`)}
          </ButtonConfirm>
        ) : (
          <ButtonConfirm onClick={handleOpenProvide}>
            {i18n._(t`Provide Liquidity`)}
          </ButtonConfirm>
        )}
      </BodyStyle>
      {isOpenProvide && (
        <Provide
          isOpenProvide={isOpenProvide}
          onDismissProvide={onDismissProvide}
          onProvideSuccess={onProvideSuccess}
        />
      )}
      <TransactionConfirmationModal
        isOpen={showPending}
        onDismiss={handleDismissConfirmation}
        content={() => null}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        pendingText={pendingText}
      />
    </Modal>
  );
}

const CurrencyInput = ({ currency, onCurrencySelect }) => {
  const { i18n } = useLingui();
  const [modalSelectOpen, setModalSelectOpen] = useState(false);

  const handleDismissSearch = useCallback(() => {
    setModalSelectOpen(false);
  }, [setModalSelectOpen]);

  const handleOpenSearch = useCallback(() => {
    setModalSelectOpen(true);
  }, [setModalSelectOpen]);

  return (
    <CurrencySelect
      className="open-currency-select-button"
      onClick={() => setModalSelectOpen(true)}
    >
      <div className="flex label">
        {currency && (
          <StyleLogo className="flex items-center">
            {isMobile ? (
              <CurrencyLogo currency={currency} size={"24px"} />
            ) : (
              <CurrencyLogo currency={currency} size={"33px"} />
            )}
          </StyleLogo>
        )}
        <div className="flex flex-1 flex-col items-start justify-center mx-3.5">
          <div className="flex items-center" onClick={handleOpenSearch}>
            <TokenName className="text-lg font-bold">
              {(currency && currency.symbol && currency.symbol.length > 20
                ? currency.symbol.slice(0, 4) +
                  "..." +
                  currency.symbol.slice(
                    currency.symbol.length - 5,
                    currency.symbol.length
                  )
                : currency?.symbol) || <div>{i18n._(t`Select a token`)}</div>}
            </TokenName>
            {isMobile ? (
              <ChevronDownIcon
                width={11}
                height={11}
                className="ml-1 chevron-icon"
              />
            ) : (
              <ChevronDownIcon
                width={16}
                height={16}
                className="ml-1 chevron-icon"
              />
            )}
          </div>
        </div>
        {onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalSelectOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            showCommonBases={false}
          />
        )}
      </div>
    </CurrencySelect>
  );
};
