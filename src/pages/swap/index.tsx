import {
  ARCHER_RELAY_URI,
  ARCHER_ROUTER_ADDRESS,
  INITIAL_ALLOWED_SLIPPAGE,
  NATIVE_TOKEN_ADDRESS,
  ONE_SPLIT_ADDRESS,
  PANCAKESWAP_ROUTER_ADDRESS,
  SMARTDEX_ROUTER_ADDRESS,
  SUSHI_ROUTER_ADDRESS,
  UNI_V1_FACTORY_ADDRESS,
  UNI_V1_ROUTER_ADDRESS,
  UNI_V2_ROUTER_ADDRESS,
  WRAP_NATIVE_TOKEN_ADDRESS,
  UNI_V3_ROUTER_ADDRESS,
} from "../../constants";
import {
  ApprovalState,
  useApproveCallback,
  useApproveCallbackFromTrade,
} from "../../hooks/useApproveCallback";
import {
  ArrowWrapper,
  BottomGrouping,
  SwapCallbackError,
} from "../../features/swap/styleds";
import { AutoRow, RowBetween, RowFixed } from "../../components/Row";
import { ButtonConfirmed, ButtonError } from "../../components/Button";
import QuestionHelper from "../../components/QuestionHelper";
import ROUTER_ABI from "../../constants/abis/router.json";
import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  NATIVE,
  Token,
  Trade as V2Trade,
  TradeType,
} from "@sushiswap/sdk";
import Column, { AutoColumn } from "../../components/Column";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import { warningSeverity } from "../../functions/prices";
import { useAllTokens, useCurrency } from "../../hooks/Tokens";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/swap/hooks";
import {
  useExpertModeManager,
  useUserArcherETHTip,
  useUserArcherGasPrice,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from "../../state/user/hooks";
import {
  useNetworkModalToggle,
  useToggleSettingsMenu,
  useWalletModalToggle,
} from "../../state/application/hooks";
import useWrapCallback, { WrapType } from "../../hooks/useWrapCallback";

import AddressInputPanel from "../../components/AddressInputPanel";
import AdvancedSwapDetailsDropdown from "../../features/swap/AdvancedSwapDetailsDropdown";
import { ArrowDown } from "react-feather";
import Button from "../../components/Button";
import ConfirmSwapModal from "../../features/swap/ConfirmSwapModal";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import { Field } from "../../state/swap/actions";
import Head from "next/head";
import Layout from "../../layouts/DefaultLayout";
import LinkStyledButton from "../../components/LinkStyledButton";
import Loader from "../../components/Loader";
import Lottie from "lottie-react";
import MinerTip from "../../components/MinerTip";
import ProgressSteps from "../../components/ProgressSteps";
import ReactGA from "react-ga";
import SwapHeader from "../../components/ExchangeHeader";
import TokenWarningModal from "../../components/TokenWarningModal";
import TradePrice from "../../features/swap/TradePrice";
import PriceTrade from "../../features/swap/PriceTrade";
import Typography from "../../components/Typography";
import UnsupportedCurrencyFooter from "../../features/swap/UnsupportedCurrencyFooter";
import Web3Connect from "../../components/Web3Connect";
import confirmPriceImpactWithoutFee from "../../features/swap/confirmPriceImpactWithoutFee";
import {
  computeFiatValuePriceImpact,
  getRouterAddress,
  tryParseAmount,
} from "../../functions";
import { maxAmountSpend } from "../../functions/currency";
import swapArrowsAnimationData from "../../animation/swap-arrows.json";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import useENSAddress from "../../hooks/useENSAddress";
import { useLingui } from "@lingui/react";
import usePrevious from "../../hooks/usePrevious";
import { useSwapCallback } from "../../hooks/useSwapCallback";
import styled from "styled-components";
import Popups from "../../components/Popups/index";
import Routing from "../../features/exchange/Routing";
import { getExpectedReturn } from "../../features/exchange/useAudit";
import { useSingleCallResult } from "../../state/multicall/hooks";
import {
  useChainId,
  useContract,
  useMulticall,
  useWETH9Contract,
  useMulticallContract,
  useOneSplitAuditContract,
  useUniV2FactoryContract,
  useMulticalSwapContract,
} from "../../hooks";
import {
  useERC20PermitFromTrade,
  UseERC20PermitState,
} from "../../hooks/useERC20Permit";
import { useUSDCValue } from "../../hooks/useUSDCPrice";
import useIsArgentWallet from "../../hooks/useIsArgentWallet";
import { useIsSwapUnsupported } from "../../hooks/useIsSwapUnsupported";
import { MainAdvancedSwapDetails } from "../../features/swap/MainAdvancedSwap";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import { estimateGas, swap } from "../../features/exchange/swap";
import {
  useCurrencyBalance,
  useCurrencyBalances,
} from "../../state/wallet/hooks";
import { ethers } from "ethers";
import { useTransactionAdder } from "../../state/transactions/hooks";
import { isMobile } from "react-device-detect";
import getPrices from "../../features/exchange/usePrice";
import { debounce, orderBy, result } from "lodash";
import UNI_V1_FACTORY_ABI from "../../constants/abis/uniV1Factory.json";
import UNI_V3_FACTORY_ABI from "../../constants/abis/univ3.json";
import TransactionFailedModal from "../../components/TransactionFailedModal";
import { getTokenPrice, getNativePrice } from "../../functions/tokenPrice";
import OneSplitAbi from "../../constants/abis/oneSplit.json";
import { formatNumber } from "../../functions";
import { fetchBestRoutes } from "../../context/globalData";
import { setInterval } from "timers";
import useDebounce from "../../hooks/useDebounce";
import LimitOrder from "../../features/exchange/limit-order";
import OrderList from "../../features/exchange/limit-order/OrderList";
import axios from "axios";

const SwapBlock = styled.div`
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.border1};
  box-shadow: ${({ theme }) => theme.shadowExchange};

  .swap-details {
    width: 100%;
    border-radius: 15px;
    padding: 17px 18px;
    max-width: 662px;
    transition: height 2s;
    background: ${({ theme }) => theme.bgInput};
    margin-top: 17px;
  }
`;

const SwitchSwap = styled.div`
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
  }
`;

const SwapContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 767px) {
    margin-top: 30px;
  }
`;

const LayoutSwap = styled.div`
  display: grid;
  grid-template-columns: 1fr 480px;
  grid-column-gap: 40px;
  padding-top: ${(props) => (props.isMobile ? "10px" : "33px")};
  padding-bottom: 36px;
  width: 100%;
  @media (max-width: 1199px) {
    grid-template-columns: 1fr 0.65fr;
  }
  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column-reverse;
  }
`;

const TitleSWap = styled.div`
  font-family: SF UI Display;
  font-size: ${(props) => (props.isMobile ? "16px" : "24px")};
  line-height: 126.5%;
  color: ${({ theme }) => theme.text1};
  font-weight: 700;
  margin-bottom: 8px;
  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

const ContentTitle = styled.div`
  font-family: SF UI Display;
  font-weight: 400;
  font-size: 16px;
  line-height: 126.5%;
  color: ${({ theme }) => theme.contentTitle};
`;

const TypographyStyle = styled(Typography)`
  color: ${({ theme }) => theme.textBold};
  font-weight: 600;
  font-size: 14px;
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.smText};
  font-weight: 500;
  font-size: 12px;
`;

const MessageSwap = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  background: ${({ theme }) => theme.bgBtn1};
  border-radius: 15px;
  padding: 16px;

  color: rgba(255, 255, 255, 0.5);
  @media (max-width: 640px) {
    font-size: 14px;
    line-height: 17px;
    height: 40px;
    padding: 13px;
  }
  .text-message {
    margin: 0;
  }
`;
const SmsText = styled.div`
  color: ${({ theme }) => theme.contentTitle};
  font-weight: 500;
  font-size: 16px;
  @media (max-width: 640px) {
    font-size: 12px;
  }
  font-family: "SF UI Display";
`;

let interval = undefined;

export const TOKENSTAND_NAME = "TokenStand pools";

export default function Swap() {
  const { i18n } = useLingui();
  const { account, library } = useActiveWeb3React();
  const { chainId } = useChainId();
  const [defaulUnitPrice, setDefaultUnirPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
 
  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    chainId,
    blockNumber: null,
  });
  const [routeData, setRouteData] = useState<any>({
    bestRoutes: [],
    distribution: [],
    bestAmount: {
      hex: "0x01",
    },
    returnAmount: {
      hex: "0x00",
    },
    priceImpacts: [],
  });

  const defaultPlatform = (
    currencyIn: Currency,
    currencyOut: Currency,
    chainId
  ) => {
    const arr = [];
    let Pools;
    const helio = {
      name: "TokenStand pools",
      logo: "/icons/tokenstand_circle_logo.png",
    };

    switch (chainId) {
      // Ethereum
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        Pools = {
          sushiswap: {
            name: "Sushi",
            logo: "/icons/icon-72x72.png",
          },
          uniswapV2: {
            name: "Uniswap V2",
            logo: "/images/tokens/uni-square.jpg",
          },
          helioswap: helio,
          uniswapV3: {
            name: "Uniswap V3",
            logo: "/images/tokens/uni-square.jpg",
          },
          cryptoswap: {
            name: "CryptoDefi",
            logo: "/images/liquidity-providers-logo/crypto_defi.svg",
          },
          kyperswap: {
            name: "Kyber DMM",
            logo: "/images/liquidity-providers-logo/kyber_color.svg",
          },
          balancer: {
            name: "Balancer",
            logo: "/images/tokens/balancer-square.jpg",
          },
        };
        break;

      // Binance  Mainnet
      case 56:
      case 97:
        Pools = {
          pancakeV1: {
            name: "PancakeSwapV1",
            logo: "/images/tokens/cake-square.jpg",
          },
          pancakeV2: {
            name: "PancakeSwapV2",
            logo: "/images/tokens/cake-square.jpg",
          },
          helioswap: helio,
          bakeryswap: {
            name: "BakerySwap",
            logo: "/images/liquidity-providers-logo/bakeryswap_color.svg",
          },
          biswap: {
            name: "Biswap",
            logo: "/images/liquidity-providers-logo/biswap_color.svg",
          },
          apeswap: {
            name: "ApeSwap",
            logo: "/images/liquidity-providers-logo/apeswap_color.svg",
          },
          mdexswap: {
            name: "MDEX",
            logo: "/images/liquidity-providers-logo/mdex_color.svg",
          },
        };
        break;

      // Binance Testnet
      // case 97:
      //   Pools = {
      //     smartdex: {
      //       name: "SmartDEX",
      //       logo: "/images/tokens/smartdex-square.jpg",
      //     },
      //     helioswap: helio,
      //   };
      //   break;

      // Arbitrum
      case 42:
      case 42161:
        Pools = {
          sushiswap: { name: "Sushi", logo: "/icons/icon-72x72.png" },
          uniswapV3: {
            name: "Uniswap V3",
            logo: "/images/tokens/uni-square.jpg",
          },
          balancer: {
            name: "Balancer",
            logo: "/images/tokens/balancer-square.jpg",
          },
        };
        break;

      default:
        break;
    }

    for (const key in Pools) {
      arr.push({
        key,
        name: Pools[key].name,
        price: "",
        diff: "",
        amount: "",
        diffNumber: 0,
        logo: Pools[key].logo,
      });
    }
    return arr;
  };
  // const univ1Contract = useContract(
  //   UNI_V1_FACTORY_ADDRESS[chainId],
  //   UNI_V1_FACTORY_ABI
  // );
  // const univ2Contract = useContract(UNI_V2_ROUTER_ADDRESS[chainId], ROUTER_ABI);
  // const sushiContract = useContract(SUSHI_ROUTER_ADDRESS[chainId], ROUTER_ABI);
  const multicallContract = useMulticallContract();
  const smartDexContract = useContract(
    SMARTDEX_ROUTER_ADDRESS[chainId],
    ROUTER_ABI
  );
  const pancakeSwapContract = useContract(
    PANCAKESWAP_ROUTER_ADDRESS[chainId],
    ROUTER_ABI
  );
  const univ3Contract = useContract(
    UNI_V3_ROUTER_ADDRESS[chainId],
    UNI_V3_FACTORY_ABI
  );

  useEffect(() => {
    onUserInput(Field.INPUT, "");
  }, [account, chainId]);

  // TODO: Use?
  const [isLimitOrder, setLimitOrder] = useState(false);

  const [gas, setGas] = useState("0");
  const [savedCost, setSavedCost] = useState({
    amount: "0",
    secondPlatform: "",
  });
  const loadedUrlParams = useDefaultsFromURLSearch();
  const [transactionFailModal, setTransactionFailModal] = useState(false);
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const wethContract = useWETH9Contract();
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [loadingBestPrice, setLoadingBestPrice] = useState(false);
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c?.isToken ?? false
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  // toggle wallet when disconnected

  // for expert mode
  const toggleSettings = useToggleSettingsMenu();
  const [isExpertMode] = useExpertModeManager();
  const [isToggleOwnPool] = useUserSingleHopOnly();
  const [prices, setPrices] = useState([]);
  // get custom setting values for user
  const [ttl] = useUserTransactionTTL();
  const [useArcher] = useUserArcherUseRelay();
  const [archerETHTip] = useUserArcherETHTip();
  // const allowedSlippage = useUserSlippageTolerance();

  // archer
  const archerRelay = chainId ? ARCHER_RELAY_URI?.[chainId] : undefined;
  const doArcher = archerRelay !== undefined && useArcher;
  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    allowedSlippage,
    inputError: swapInputError,
  } = useDerivedSwapInfo(doArcher);
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);
  const [platforms, setPlatforms] = useState(
    defaultPlatform(currencies[Field.INPUT], currencies[Field.OUTPUT], chainId)
  );

  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]:
              independentField === Field.INPUT
                ? parsedAmount
                : trade?.inputAmount,
            [Field.OUTPUT]:
              independentField === Field.OUTPUT
                ? parsedAmount
                : trade?.outputAmount,
          },
    [
      independentField,
      parsedAmount,
      showWrap,
      trade?.inputAmount,
      trade?.outputAmount,
    ]
  );

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT]);
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT]);
  // const priceImpact = computeFiatValuePriceImpact(
  //   fiatValueInput,
  //   fiatValueOutput
  // );

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const [isType, setIsType] = useState(true);
  const [amountUserInput, setAmountUserInput] = useState(0);
  const handleTypeInput = useCallback(
    (value: string) => {
      value = checkDecimalLength(value);
      setIsType(true);
      setAmountUserInput(Number(value));
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      setIsType(false);
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });
  // const [currentTimeStamp, setCurrentTimeStamp] = useState(Math.round(Date.now() / 1000))
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTimeStamp(Math.round(Date.now() / 1000))
  //   }, 9000)

  //   return () => clearInterval(intervalId) //This is important
  // }, [])
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const checkDecimalLength = (num) => {
    if (!num.includes(".")) return num;
    const first = num.split(".")[0];
    let decimal = num.split(".")[1];
    if (decimal.length <= 18) return num;
    else {
      decimal = decimal.substring(0, 18);

      return `${first}.${decimal}`;
    }
  };
  const route = trade?.route;
  const noRoute = !route;
  let amount: string = isType
    ? formattedAmounts[Field.INPUT]
    : formattedAmounts[Field.OUTPUT];
  let amountRawFormat =
    amount && !isNaN(Number(amount)) ? checkDecimalLength(amount) : null;
  amount =
    amount && !isNaN(Number(amount))
      ? parseUnits(
          checkDecimalLength(amount),
          currencies[Field.INPUT].decimals
        ).toString()
      : "";
  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallback(
    currencies[Field.INPUT] &&
      tryParseAmount(
        amount
          ? formatUnits(amount, currencies[Field.INPUT].decimals).toString()
          : "0",
        currencies[Field.INPUT]
      ),
    ONE_SPLIT_ADDRESS[chainId]
  );
  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(trade, allowedSlippage);

  const handleApprove = useCallback(async () => {
    if (
      signatureState === UseERC20PermitState.NOT_SIGNED &&
      gatherPermitSignature
    ) {
      try {
        await gatherPermitSignature();
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback();
        }
      }
    } else {
      await approveCallback();
    }
  }, [approveCallback, gatherPermitSignature, signatureState]);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  );
  formattedAmounts[Field.INPUT];
  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) &&
      !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount)
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData,
    doArcher ? ttl : undefined
  );

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = 0;

  const isArgentWallet = useIsArgentWallet();

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED));
  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact());
    maxInputAmount && setAmountUserInput(Number(maxInputAmount.toExact()));
  }, [maxInputAmount, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  // useEffect(() => {
  //   if (
  //     doArcher &&
  //     parsedAmounts[Field.INPUT] &&
  //     maxInputAmount &&
  //     parsedAmounts[Field.INPUT]?.greaterThan(maxInputAmount)
  //   ) {
  //     handleMaxInput();
  //   }
  // }, [handleMaxInput, parsedAmounts, maxInputAmount, doArcher]);

  const swapIsUnsupported = useIsSwapUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  );
  // useEffect(() => {
  //   if (
  //     previousChainId &&
  //     previousChainId !== chainId &&
  //     router.asPath.includes(NATIVE[previousChainId].symbol)
  //   ) {
  //     router.push(`/swap/${NATIVE[chainId].symbol}`);
  //   }
  // }, [chainId, previousChainId, router]);
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currencies[Field.INPUT] ?? undefined
  );
  const addTransaction = useTransactionAdder();
  const oneSplitAuditContract = useOneSplitAuditContract();
  const multicallSwapContract = useMulticalSwapContract();
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const fetchBestPrice = async () => {
    // amount = Number(formattedAmounts[Field.INPUT] ) === 0 ? null : amount
    //
    // const newRouteData = await getExpectedReturn(
    //   currencies[Field.INPUT],
    //   currencies[Field.OUTPUT],
    //   amount,
    //   isToggleOwnPool,
    //   chainId,
    //   auditContract
    // );
    //
    // setRouteData(newRouteData)
    // const newRouteData = await getExpectedReturn(
    //   currencies[Field.INPUT],
    //   currencies[Field.OUTPUT],
    //   amount,
    //   isToggleOwnPool,
    //   chainId,
    //   auditContract
    // );
    // reset
    if (showWrap) {
      setLoadingBestPrice(false);
      return;
    }
    setLoadingBestPrice(true);
    setShowNotFound(false);
    try {
      setRouteData({
        bestRoutes: [],
        distribution: [],
        bestAmount: {
          hex: "0x01",
        },
        returnAmount: {
          hex: "0x00",
        },
        priceImpacts: [],
      });
      if (amount == "0") {
        setShowNotFound(true);
        setLoadingBestPrice(false);
        return;
      }
      const currencyIn: any = currencies[Field.INPUT];
      const currencyOut: any = currencies[Field.OUTPUT];
      const realAmount =
        amount && amount != "0" ? amount : "1000000000000000000";
      const currencyInFinal = currencyIn?.address
        ? currencyIn?.address
        : "0x0000000000000000000000000000000000000000";
      const currencyOutFinal = currencyOut?.address
        ? currencyOut?.address
        : "0x0000000000000000000000000000000000000000";
      const params = {
        tokenFrom: String(currencyInFinal),
        tokenTo: String(currencyOutFinal),
        decimalsFrom: currencyIn?.decimals,
        decimalsTo: currencyOut?.decimals,
        chainId: chainId,
        // amount: amountUserInput.toFixed(18),
        amount: formatUnits(realAmount, currencyIn?.decimals),
        helioswap: !isToggleOwnPool,
        parts: [1, 56].includes(chainId) ? 100 : 100,
        maxHops: [1, 56].includes(chainId) ? 2 : 3,
      };

      if (amountUserInput != 0) {
        const bestRoutesData = await fetchBestRoutes(params);

        if (bestRoutesData == "cancel") {
          return;
        }
        if (
          bestRoutesData &&
          bestRoutesData?.data &&
          bestRoutesData?.data?.data.returnAmount != 0
        ) {
          setRouteData(bestRoutesData.data.data);

          setShowNotFound(false);
        } else {
          if (![42, 42616].includes(chainId)) setShowNotFound(true);
        }
        setLoadingBestPrice(false);
      }
    } catch (e) {
      console.log(e);
      setLoadingBestPrice(false);
    }
  };

  useEffect(() => {
    fetchBestPrice();
    if (refresh) {
      interval = setInterval(fetchBestPrice, 10000);
    } else if (!refresh && interval) {
      clearInterval(interval._id);
      interval = undefined;
    }
  }, [
    (currencies[Field.INPUT] as any)?.address,
    (currencies[Field.OUTPUT] as any)?.address,
    formattedAmounts[Field.INPUT],
    refresh,
  ]);

  useEffect(() => {
    const checkNotFoundBestAmount = routeData?.totalReturnAmount
      ? BigNumber.from(routeData?.totalReturnAmount?.hex)
      : null;
    const checkNotFOundRealAmount = amount
      ? amount
      : BigNumber.from("1000000000000000000").toString();
    const checkNotFoundBestAmountReal = checkNotFoundBestAmount
      ? checkNotFoundBestAmount?.toString()
      : "0";
    const checkNotFoundPrice1Inch = FixedNumber.from(
      formatUnits(
        checkNotFoundBestAmountReal,
        currencies[Field.OUTPUT]?.decimals
      )
    )
      .divUnsafe(
        FixedNumber.from(
          Number(
            formatUnits(
              checkNotFOundRealAmount,
              currencies[Field.INPUT]?.decimals
            )
          ) === 0
            ? "10000000000000000"
            : formatUnits(checkNotFOundRealAmount, 18)
        )
      )
      .toString();

    if (!Number(checkNotFoundPrice1Inch)) {
      setShowNotFound(true);
    }
  }, [amount, currencies, routeData?.totalReturnAmount]);

  // useEffect(() => {
  //   fetchBestPrice();
  // }, [])

  // const amountReturn: any =
  //   routeData?.returnAmount && amount
  //     ? formatEther(routeData?.returnAmount).toString()
  //     : "";
  const amountReturn: any = showWrap
    ? formatEther(amount ? amount : "0")
    : routeData?.totalReturnAmount && amount
    ? formatUnits(
        routeData?.totalReturnAmount.hex,
        currencies[Field.OUTPUT]?.decimals
      ).toString()
    : "";
  const bestAmount = routeData?.bestAmount
    ? BigNumber.from(routeData?.bestAmount?.hex)
    : BigNumber.from(1);
  const bestReturnAmount = routeData?.totalReturnAmount
    ? BigNumber.from(routeData?.totalReturnAmount?.hex)
    : BigNumber.from(1);
  const notFound = bestAmount.toString() === "0" ? true : false;
  const minAmountReturn =
    (Number(amountReturn) *
      (100 - Number(allowedSlippage ? allowedSlippage.toSignificant() : 100))) /
    100;

  let priceImpact = "-",
    sum = 0,
    count = 0;
  if (routeData && amountReturn) {
    for (let key in routeData?.priceImpacts) {
      if (routeData?.priceImpacts[key] > 0) {
        count++;
        sum += Math.abs(Number(routeData?.priceImpacts[key]));
      }
    }

    priceImpact = count ? (sum / count).toString() : "0";
  } else priceImpact = amount && showWrap ? "0" : "-";
  const providerFee = showWrap
    ? 0
    : amount
    ? (Number(
        formatUnits(BigNumber.from(amount), currencies[Field.INPUT].decimals)
      ) *
        0.3) /
      100
    : Number(formatEther(BigNumber.from("10000000000000000"))) * 0.3;

  const unitPrice =
    Number(amountReturn) /
    Number(amount ? formatUnits(amount, currencies[Field.INPUT].decimals) : 1);
  // Default unitPrice when no input

  // const getDefaultUnitPrice = async () => {
  //   const routeDataDefault = await getExpectedReturn(
  //     currencies[Field.INPUT],
  //     currencies[Field.OUTPUT],
  //     "",
  //     isToggleOwnPool,
  //     chainId,
  //     auditContract
  //   );
  //   const amountReturnDefault =
  //     routeDataDefault?.returnAmount
  //       ? formatEther(routeDataDefault?.returnAmount).toString()
  //       : "";
  //   // return Number(amountReturnDefault);
  //   setDefaultUnirPrice(Number(1));
  // }
  const getStatistic = async (amount) => {
    const gas = await estimateGas(
      currencies[Field.INPUT],
      currencies[Field.OUTPUT],
      amount,
      routeData,
      routeData.totalReturnAmount,
      oneSplitAuditContract,
      chainId,
      !isToggleOwnPool,
      allowedSlippage,
      account,
      showWrap,
      wethContract,
      wrapType,
      currencies[Field.OUTPUT]?.decimals,
      multicallContract
    );
    // console.log(`(Number(formatEther(gas)) * 10 ** 9).toFixed(6)`, (Number(formatEther(gas)) * 10 ** 9).toFixed(6))
    setGas(
      //newGas = gas * 130% ----- to fix out of gas
      // gas ? (Number(formatEther(gas)) * 10 ** 9 * 1.5).toFixed(6).toString() : "0"
      gas ? gas : "0"
    );
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getStatistic(amount ? amount : "1000000000000000000");
    // fetchPrice()
  }, [
    (currencies[Field.INPUT] as any)?.address,
    (currencies[Field.OUTPUT] as any)?.address,
    amount,
    routeData,
    approvalState,
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setShowNotFound(false);
    // setRouteData({
    //   bestRoutes: [],
    //   distribution: [],
    //   bestAmount: {
    //     hex: "0x01",
    //   },
    //   returnAmount: {
    //     hex: "0x00",
    //   },
    //   priceImpacts: [],
    // });
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT]]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== "number")
            return { chainId, blockNumber };
          return {
            chainId,
            blockNumber: Math.max(blockNumber, state.blockNumber),
          };
        }
        return state;
      });
    },
    [chainId, setState]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!library || !chainId) return undefined;
    setState({ chainId, blockNumber: null });

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error
        )
      );

    library.on("block", blockNumberCallback);
    return () => {
      library.removeListener("block", blockNumberCallback);
    };
  }, [chainId, library, blockNumberCallback]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchPrice();
  }, [
    (currencies[Field.INPUT] as any)?.address,
    (currencies[Field.OUTPUT] as any)?.address,
    amount,
    chainId,
  ]);

  useEffect(() => {
    setShowNotFound(false);
    setRouteData({
      bestRoutes: [],
      distribution: [],
      bestAmount: {
        hex: "0x01",
      },
      returnAmount: {
        hex: "0x00",
      },
      priceImpacts: [],
    });
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT]]);

  // useEffect(() => {
  //   fetchPrice();
  // }, [bestAmount])
  const handleWrap = async () => {
    const trans: any = await onWrap();

    if (trans) onUserInput(Field.INPUT, "");
  };
  const handleSwap = async () => {
    if (!amount || !amountReturn || !currencies[Field.INPUT]) return;
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });

    try {
      const obj = {
        currcy: currencies[Field.INPUT],
        amount,
        routeData,
        returnAmount: routeData.totalReturnAmount,
        oneSplitAuditContract,
        chainId,
        isToggleOwnPool: !isToggleOwnPool,
        allowedSlippage,
        account,
        decimals: currencies[Field.OUTPUT].decimals,
        multicallSwapContract,
      };

      const txReceipt = await swap(
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        amount,
        routeData,
        routeData.totalReturnAmount,
        oneSplitAuditContract,
        chainId,
        !isToggleOwnPool,
        allowedSlippage,
        account,
        currencies[Field.OUTPUT].decimals,
        multicallSwapContract,
        gas
      );
      setSwapState({
        attemptingTxn: false,
        tradeToConfirm,
        showConfirm,
        swapErrorMessage: undefined,
        txHash: txReceipt.hash,
      });
      addTransaction(txReceipt, {
        summary: `Swap ${formatUnits(
          amount,
          currencies[Field.INPUT].decimals
        )} ${currencies[Field.INPUT].symbol} to ${
          currencies[Field.OUTPUT].symbol
        }`,
      });
    } catch (e) {
      console.log(e);
      setSwapState({
        attemptingTxn: true,
        tradeToConfirm,
        showConfirm: false,
        swapErrorMessage: e.message,
        txHash: undefined,
      });
      setTransactionFailModal(true);
    }
  };

  const fetchPrice = async () => {
    // try{<
    //   const a = await testContract.functions.getExpectedReturn('0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06', '0xb05fb7E89DAD5F717fbD78d79C2b9C04700f7A71', '10000000000', 100, 0);
    // } catch(e){
    // }
    // if (
    //   !currencies[Field.INPUT] ||
    //   !currencies[Field.OUTPUT] ||
    //   !bestAmount ||
    //   showWrap || formattedAmounts[Field.INPUT] === ""
    // ) {
    //   setSavedCost({
    //     amount: "0",
    //     secondPlatform: "",
    //   });
    //   return;
    // }

    setLoadingPrice(true);
    let contractList = [];
    if ([1, 2, 3, 4, 5].includes(chainId)) {
      contractList = [
        multicallContract,
        "Sushiswap",
        "Uniswap v2",
        "TokenStand pools",
      ];
    } else {
      contractList = [pancakeSwapContract, smartDexContract];
    }
    const realAmount = amount && amount != "0" ? amount : "1000000000000000000";
    const prices = await getPrices(
      currencies[Field.INPUT],
      currencies[Field.OUTPUT],
      realAmount,
      chainId,
      currencies[Field.INPUT]?.isNative || currencies[Field.OUTPUT]?.isNative,
      contractList,
      isToggleOwnPool
    );
    if (prices && Array.isArray(prices)) {
      setPrices(prices);
    }
  };
  const updateNewPlatForm = async () => {
    const realAmount =
      amount && amount != "0"
        ? parseEther(formatUnits(amount, currencies[Field.INPUT]?.decimals))
        : "1000000000000000000";
    if (prices) {
      const newPlatform = defaultPlatform(
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        chainId
      );
      prices.forEach((price) => {
        const amountsOut = price ? price.amountsOut : null;
        const index = newPlatform.findIndex(
          (item) => item.key === price.platform
        );
        if (newPlatform[index]) {
          newPlatform[index].amount = amountsOut;
          if (!amountsOut) {
            newPlatform[index].price = null;
            return;
          } else {
            newPlatform[index].price = (
              Number(amountsOut) / Number(realAmount)
            ).toString();
            newPlatform[index].diff = (
              100 -
              (Number(formatUnits(amountsOut ? amountsOut : "0", 18)) /
                Number(
                  formatUnits(
                    bestReturnAmount.toString(),
                    currencies[Field.OUTPUT]?.decimals
                  )
                )) *
                100
            )
              .toFixed(2)
              .toString();
            newPlatform[index].diffNumber = Number(newPlatform[index].diff);
            newPlatform[index].priceNumber = Number(newPlatform[index].price);
          }
        }
      });

      // Sort by price
      const finalNewPlatform = orderBy(
        newPlatform,
        ["priceNumber", "diffNumber"],
        ["desc", "asc"]
      );

      setPlatforms(finalNewPlatform);

      const platfomHasPrice = finalNewPlatform.filter(
        (platform) => platform.amount
      );

      if (
        platfomHasPrice.length > 0 &&
        Number(amountReturn) !== 0 &&
        routeData
      ) {
        const secondPlatform = platfomHasPrice[0];
        if (secondPlatform.amount) {
          const numberSave = showWrap
            ? "0"
            : Number(
                formatEther(
                  BigNumber.from(routeData?.totalReturnAmount).sub(
                    secondPlatform.amount
                  )
                )
              )
                .toFixed(18)
                .toString();

          if ((currencies[Field.OUTPUT] as any)?.address) {
            const price = await getTokenPrice(
              (currencies[Field.OUTPUT] as any)?.address,
              chainId
            );
            const valueUSDC = (Number(numberSave) * Number(price)).toString();
            setSavedCost({
              secondPlatform: secondPlatform.name,
              amount: valueUSDC,
            });
          }
          if (currencies[Field.OUTPUT]?.isNative) {
            const price = await getNativePrice(chainId);
            const valueUSDC = (Number(numberSave) * Number(price)).toString();

            setSavedCost({
              secondPlatform: secondPlatform.name,
              amount: valueUSDC,
            });
          }

          // if (
          //   Number(balanceTokenFormat()) <
          //   (amountRawFormat ? Number(amountRawFormat) : 0)
          // ) {
          //   setSavedCost({
          //     ...savedCost,
          //     amount: "0",
          //   });
          // }
        } else {
          setSavedCost({
            ...savedCost,
            amount: "0",
          });
        }
      }

      setLoadingPrice(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    updateNewPlatForm();
  }, [prices, loadingBestPrice]);
  const balanceTokenFormat = () => {
    try {
      return selectedCurrencyBalance?.toExact();
    } catch (e) {
      return "0";
    }
  };
  const handleChangeSwapTab = () => {
    onUserInput(Field.INPUT, "");
  };
  return (
    <Layout>
      <Head>
        <title>TokenStand Swap</title>
        <meta
          name="description"
          content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
        />
      </Head>
      <TitleSWap isMobile={isMobile}>
        {i18n._(t`THE MOST EFFICIENT DEFI AGGREGATOR`)}
      </TitleSWap>
      {isMobile ? (
        ""
      ) : (
        <ContentTitle>
          {i18n._(t`Access the most liquidity, lowest slippage and best exchange rates
          across Ethereum, Binance Smart Chain.`)}
        </ContentTitle>
      )}
      <TransactionFailedModal
        isOpen={transactionFailModal}
        onDismiss={() => setTransactionFailModal(false)}
      />
      <LayoutSwap isMobile={isMobile}>
        {isLimitOrder ? (
          <OrderList showSuccess={showSuccess} />
        ) : (
          <Routing
            routeData={routeData}
            amountReturn={amountReturn}
            platforms={
              isToggleOwnPool
                ? platforms.filter(
                    (platform) => platform.name !== TOKENSTAND_NAME
                  )
                : platforms
            }
            setSavedCost={setSavedCost}
            showWrap={showWrap}
            currencies={currencies}
            amount={amount}
            notFound={notFound}
            unitPrice={unitPrice}
            showNotFound={showNotFound}
            loadingPrice={loadingPrice}
            amountRawFormat={amountRawFormat}
            loadingBestPrice={loadingBestPrice}
          />
        )}

        <SwapContainer>
          <TokenWarningModal
            isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
            tokens={importTokensNotInDefault}
            onConfirm={handleConfirmTokenWarning}
          />
          <SwapBlock
            id="swap-page"
            className="w-full p-7 rounded rounded-3xl"
            style={{ zIndex: 1 }}
          >
            <SwapHeader
              input={currencies[Field.INPUT]}
              output={currencies[Field.OUTPUT]}
              setRefresh={setRefresh}
              refresh={refresh}
              setLimitOrder={setLimitOrder}
              isLimitOrder={isLimitOrder}
              onChangeSwapTab={handleChangeSwapTab}
            />
            <ConfirmSwapModal
              gas={(Number(formatEther(gas)) * 10 ** 9).toFixed(6).toString()}
              isOpen={showConfirm}
              priceImpact={priceImpact}
              trade={trade}
              unitPrice={unitPrice}
              providerFee={providerFee?.toString()}
              currencyIn={currencies[Field.INPUT]}
              currencyOut={currencies[Field.OUTPUT]}
              originalTrade={null}
              onAcceptChanges={handleAcceptChanges}
              attemptingTxn={attemptingTxn}
              amountIn={
                amount
                  ? formatUnits(
                      amount,
                      currencies[Field.INPUT].decimals
                    ).toString()
                  : ""
              }
              amountOut={amountReturn.toString()}
              minAmountOut={minAmountReturn.toString()}
              txHash={txHash}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onConfirm={handleSwap}
              swapErrorMessage={swapErrorMessage}
              onDismiss={handleConfirmDismiss}
              minerBribe={doArcher ? archerETHTip : undefined}
            />

            {isLimitOrder ? (
              <LimitOrder
                showSuccess={showSuccess}
                setShowSuccess={setShowSuccess}
              />
            ) : (
              <>
                {" "}
                <div>
                  <CurrencyInputPanel
                    label={
                      independentField === Field.OUTPUT && !showWrap && trade
                        ? "Swap From (est.):"
                        : "Swap From:"
                    }
                    value={
                      !isType
                        ? // ? Number(amountReturn).toString()
                          amountReturn === ""
                          ? null
                          : Number(amountReturn).toString()
                        : formattedAmounts[Field.INPUT]
                    }
                    showMaxButton={showMaxButton}
                    currency={currencies[Field.INPUT]}
                    onUserInput={handleTypeInput}
                    onMax={handleMaxInput}
                    onCurrencySelect={handleInputSelect}
                    otherCurrency={currencies[Field.OUTPUT]}
                    id="swap-currency-input"
                  />
                  <AutoColumn
                    justify="space-between"
                    className="sm:py-2.5 py-2"
                  >
                    {isMobile ? (
                      <AutoRow
                        justify={isExpertMode ? "space-between" : "flex-start"}
                        style={{ padding: "0 12px" }}
                      >
                        <button
                          className="z-10 -mt-6 -mb-6 rounded-full p-3px"
                          onClick={() => {
                            setApprovalSubmitted(false); // reset 2 step UI for approvals
                            onSwitchTokens();
                            setIsType(!isType);
                            handleTypeInput("");
                          }}
                        >
                          <SwitchSwap className="rounded-full">
                            <svg
                              width="23"
                              height="23"
                              viewBox="0 0 23 23"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.1667 16.0925V9.66667H13.3333V16.0925H10.5833L14.25 19.75L17.9167 16.0925H15.1667ZM8.75001 3.25L5.08334 6.9075H7.83334V13.3333H9.66668V6.9075H12.4167L8.75001 3.25Z"
                                fill="#667795"
                              />
                            </svg>
                          </SwitchSwap>
                        </button>
                        {/* <ArrowWrapper clickable>
                                      <ArrowDown
                                        size="16"
                                        onClick={() => {
                                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                                            onSwitchTokens()
                                        }}
                                        color={
                                            currencies[Field.INPUT] && currencies[Field.OUTPUT]
                                                ? theme.primary1
                                                : theme.text2
                                        }
                                    />
                                </ArrowWrapper> */}
                        {recipient === null && !showWrap && isExpertMode ? (
                          <LinkStyledButton
                            id="add-recipient-button"
                            onClick={() => onChangeRecipient("")}
                          >
                            {i18n._(t`+ Add a send (optional)`)}
                          </LinkStyledButton>
                        ) : null}
                      </AutoRow>
                    ) : (
                      <AutoRow
                        justify={isExpertMode ? "space-between" : "flex-start"}
                        style={{ padding: "0 1.5rem" }}
                      >
                        <button
                          className="z-10 -mt-6 -mb-6 rounded-full p-3px"
                          onClick={() => {
                            setApprovalSubmitted(false); // reset 2 step UI for approvals
                            onSwitchTokens();
                            setIsType(!isType);
                            handleTypeInput("");
                          }}
                        >
                          <SwitchSwap className="rounded-full">
                            {/* <Lottie
                    animationData={swapArrowsAnimationData}
                    autoplay={animateSwapArrows}
                    loop={false}
                    style={{ width: 16, height: 16 }}

                    className="fill-current text-secondary"
                  /> */}

                            <svg
                              width="23"
                              height="23"
                              viewBox="0 0 23 23"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.1667 16.0925V9.66667H13.3333V16.0925H10.5833L14.25 19.75L17.9167 16.0925H15.1667ZM8.75001 3.25L5.08334 6.9075H7.83334V13.3333H9.66668V6.9075H12.4167L8.75001 3.25Z"
                                fill="#667795"
                              />
                            </svg>
                          </SwitchSwap>
                        </button>
                        {/* <ArrowWrapper clickable>
                                      <ArrowDown
                                        size="16"
                                        onClick={() => {
                                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                                            onSwitchTokens()
                                        }}
                                        color={
                                            currencies[Field.INPUT] && currencies[Field.OUTPUT]
                                                ? theme.primary1
                                                : theme.text2
                                        }
                                    />
                                </ArrowWrapper> */}
                        {recipient === null && !showWrap && isExpertMode ? (
                          <LinkStyledButton
                            id="add-recipient-button"
                            onClick={() => onChangeRecipient("")}
                          >
                            {i18n._(t`+ Add a send (optional)`)}
                          </LinkStyledButton>
                        ) : null}
                      </AutoRow>
                    )}
                  </AutoColumn>

                  <CurrencyInputPanel
                    value={
                      isType && amount && Number(amount) !== 0
                        ? // ? Number(amountReturn).toString()
                          amountReturn
                        : amount && Number(amount) === 0
                        ? "0.0"
                        : ""
                    }
                    onUserInput={handleTypeOutput}
                    label={
                      independentField === Field.INPUT && !showWrap
                        ? "Swap To (est):"
                        : "Swap To:"
                    }
                    showMaxButton={false}
                    currency={currencies[Field.OUTPUT]}
                    onCurrencySelect={handleOutputSelect}
                    otherCurrency={currencies[Field.INPUT]}
                    id="swap-currency-output"
                  />
                  {
                    // unitPrice &&
                    <PriceTrade
                      price={unitPrice}
                      showInverted={showInverted}
                      inputName={currencies[Field.INPUT]?.symbol}
                      outputName={currencies[Field.OUTPUT]?.symbol}
                      setShowInverted={setShowInverted}
                      notFound={notFound}
                      defaultPrice={defaulUnitPrice}
                      amountReturn={amountReturn}
                      amount={amount}
                      showWrap={showWrap}
                      showNotFound={showNotFound}
                    />
                  }

                  {recipient !== null && !showWrap ? (
                    <>
                      <AutoRow
                        justify="space-between"
                        style={{ padding: "0 1rem" }}
                      >
                        <ArrowWrapper clickable={false}>
                          <ArrowDown size={16} />
                        </ArrowWrapper>
                        <LinkStyledButton
                          id="remove-recipient-button"
                          onClick={() => onChangeRecipient(null)}
                        >
                          - {i18n._(t`Remove send`)}
                        </LinkStyledButton>
                      </AutoRow>
                      <AddressInputPanel
                        id="recipient"
                        value={recipient}
                        onChange={onChangeRecipient}
                      />
                    </>
                  ) : null}

                  {/* {showWrap ? null : (
                    <div
                      style={{
                        padding: showWrap ? ".25rem 1rem 0 1rem" : "0px",
                      }}
                    >
                      <div className=" mt-1 space-y-2">
                        {account && trade && (
                          <RowBetween align="center">
                            <TypographyStyle
                              variant="sm"
                              className="text-secondary"
                              onClick={toggleSettings}
                            >
                              {i18n._(t`Slippage Tolerance`)}
                            </TypographyStyle>

                            <SmallText onClick={toggleSettings}>
                              {allowedSlippage?.toFixed(2)}%
                            </SmallText>
                          </RowBetween>
                        )}
                      </div>
                      <div className="px-5 mt-1">
                        {doArcher && userHasSpecifiedInputOutput && (
                          <MinerTip />
                        )}
                      </div>
                    </div>
                  )} */}
                </div>
                <BottomGrouping className="text-lg">
                  {swapIsUnsupported ? (
                    <Button color="red" size="lg" disabled>
                      {i18n._(t`Unsupported Asset`)}
                    </Button>
                  ) : !account ? (
                    <Web3Connect
                      size="lg"
                      color="blue"
                      className="w-full button-connect text-lg"
                    />
                  ) : showWrap ? (
                    <ButtonError
                      size="lg"
                      disabled={Boolean(wrapInputError)}
                      onClick={handleWrap}
                    >
                      {wrapInputError ??
                        (wrapType === WrapType.WRAP
                          ? i18n._(t`Wrap`)
                          : wrapType === WrapType.UNWRAP
                          ? i18n._(t`Unwrap`)
                          : null)}
                    </ButtonError>
                  ) : showNotFound && amount && !loadingBestPrice ? (
                    <MessageSwap style={{ textAlign: "center" }}>
                      <div className="">
                        {i18n._(t`Insufficient liquidity for this trade.`)}
                      </div>
                    </MessageSwap>
                  ) : !amount ? (
                    <MessageSwap style={{ textAlign: "center" }}>
                      <div className="mb-1 text-message">
                        {i18n._(t`Enter an amount`)}
                      </div>
                      {/* {singleHopOnly && (
                    <div className="mb-1">
                      {i18n._(t`Try enabling multi-hop trades`)}
                    </div>
                  )} */}
                    </MessageSwap>
                  ) : Number(balanceTokenFormat()) <
                    (amountRawFormat ? Number(amountRawFormat) : 0) ? (
                    <MessageSwap style={{ textAlign: "center" }}>
                      <div className="mb-1">
                        {i18n._(
                          t`Insufficient ${
                            currencies[Field.INPUT]?.symbol
                          } Balance`
                        )}
                      </div>
                      {/* {singleHopOnly && (
                    <div className="mb-1">
                      {i18n._(t`Try enabling multi-hop trades`)}
                    </div>
                  )} */}
                    </MessageSwap>
                  ) : Number(amountReturn) == 0 && true ? (
                    <MessageSwap style={{ textAlign: "center" }}>
                      <div className="">
                        {loadingBestPrice
                          ? "Loading..."
                          : i18n._(t`Enter an amount`)}
                      </div>
                      {/* {singleHopOnly && (
                    <div className="mb-1">
                      {i18n._(t`Try enabling multi-hop trades`)}
                    </div>
                  )} */}
                    </MessageSwap>
                  ) : showApproveFlow ? (
                    <RowBetween>
                      {approvalState !== ApprovalState.APPROVED && (
                        <ButtonConfirmed
                          onClick={handleApprove}
                          disabled={
                            approvalState !== ApprovalState.NOT_APPROVED ||
                            approvalSubmitted
                          }
                          confirmed={false}
                          className="text-lg btn-confirmed"
                        >
                          {approvalState === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              Approving <Loader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted ? (
                            i18n._(t`Approved`)
                          ) : (
                            i18n._(
                              t`Approve ${currencies[Field.INPUT]?.symbol}`
                            )
                          )}
                        </ButtonConfirmed>
                      )}

                      {approvalState === ApprovalState.APPROVED && (
                        <ButtonError
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap();
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                showConfirm: true,
                                txHash: undefined,
                              });
                            }
                          }}
                          id="swap-button"
                          disabled={
                            !isValid ||
                            balanceTokenFormat() === undefined ||
                            (priceImpactSeverity > 100 && !isExpertMode) ||
                            !!swapCallbackError
                          }
                          error={
                            isValid &&
                            priceImpactSeverity > 99 &&
                            !swapCallbackError
                          }
                        >
                          {swapInputError
                            ? swapInputError
                            : priceImpactSeverity > 100 && !isExpertMode
                            ? i18n._(t`Price Impact Too High`)
                            : priceImpactSeverity > 99
                            ? i18n._(t`Swap Anyway`)
                            : i18n._(t`Swap`)}
                        </ButtonError>
                      )}
                    </RowBetween>
                  ) : (
                    <ButtonError
                      className="button-swap"
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap();
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          });
                        }
                      }}
                      id="swap-button"
                      disabled={
                        !isValid ||
                        balanceTokenFormat() === undefined ||
                        (priceImpactSeverity > 100 && !isExpertMode) ||
                        !!swapCallbackError
                      }
                      error={
                        isValid &&
                        priceImpactSeverity > 99 &&
                        !swapCallbackError
                      }
                    >
                      {swapInputError
                        ? swapInputError
                        : priceImpactSeverity > 100 && !isExpertMode
                        ? i18n._(t`Price Impact Too High`)
                        : priceImpactSeverity > 99
                        ? i18n._(t`Swap Anyway`)
                        : i18n._(t`Swap`)}
                    </ButtonError>
                  )}
                  {isExpertMode && swapErrorMessage ? (
                    <SwapCallbackError error={swapErrorMessage} />
                  ) : null}
                </BottomGrouping>
                {
                  <div className="swap-details">
                    <MainAdvancedSwapDetails
                      minAmountOut={minAmountReturn.toString()}
                      priceImpact={priceImpact}
                      gas={
                        Number(balanceTokenFormat()) <
                          (amountRawFormat ? Number(amountRawFormat) : 0) ||
                        (amount && Number(amount) === 0) ||
                        (!loadingBestPrice &&
                          amount &&
                          Number(formatEther(gas)) * 10 ** 9 === 0)
                          ? "0.00"
                          : !loadingBestPrice && amount
                          ? (Number(formatEther(gas)) * 10 ** 9)
                              .toFixed(6)
                              .toString()
                          : "-"
                      }
                      savedCost={
                        amount && Number(amount) === 0
                          ? { ...savedCost, amount: "0.00" }
                          : loadingBestPrice
                          ? { ...savedCost, amount: "-" }
                          : amount
                          ? savedCost
                          : { ...savedCost, amount: "-" }
                      }
                      currencyIn={currencies[Field.INPUT]}
                      providerFee={
                        bestAmount.toString() === "0" ||
                        (amount && Number(amount) === 0)
                          ? "0.00"
                          : !loadingBestPrice && amount
                          ? providerFee
                          : "-"
                      }
                      currencyOut={currencies[Field.OUTPUT]}
                      trade={trade}
                      allowedSlippage={allowedSlippage}
                      showNotFound={showNotFound}
                    />
                  </div>
                }
                {/* {!swapIsUnsupported ? (
                </RowBetween>
              ) : (
                <ButtonError
                  className="button-swap"
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  id="swap-button"
                  disabled={
                    !isValid ||
                    balanceTokenFormat() === undefined ||
                    (priceImpactSeverity > 100 && !isExpertMode) ||
                    !!swapCallbackError
                  }
                  error={
                    isValid && priceImpactSeverity > 99 && !swapCallbackError
                  }
                >
                  {swapInputError
                    ? swapInputError
                    : priceImpactSeverity > 100 && !isExpertMode
                    ? i18n._(t`Price Impact Too High`)
                    : priceImpactSeverity > 99
                    ? i18n._(t`Swap Anyway`)
                    : i18n._(t`Swap`)}
                </ButtonError>
              )}
              {isExpertMode && swapErrorMessage ? (
                <SwapCallbackError error={swapErrorMessage} />
              ) : null}
            </BottomGrouping>
            {
              <div className="swap-details">
                <MainAdvancedSwapDetails
                  minAmountOut={minAmountReturn.toString()}
                  priceImpact={priceImpact}
                  gas={
                    Number(balanceTokenFormat()) <
                      (amountRawFormat ? Number(amountRawFormat) : 0) ||
                    (amount && Number(amount) === 0) ||
                    (!loadingBestPrice && amount && Number(gas) === 0)
                      ? "0.00"
                      : !loadingBestPrice && amount
                      ? gas
                      : "-"
                  }
                  savedCost={
                    amount && Number(amount) === 0
                      ? { ...savedCost, amount: "0.00" }
                      : loadingBestPrice
                      ? { ...savedCost, amount: "-" }
                      : amount
                      ? savedCost
                      : { ...savedCost, amount: "-" }
                  }
                  currencyIn={currencies[Field.INPUT]}
                  providerFee={
                    bestAmount.toString() === "0" ||
                    (amount && Number(amount) === 0)
                      ? "0.00"
                      : !loadingBestPrice && amount
                      ? providerFee
                      : "-"
                  }
                  currencyOut={currencies[Field.OUTPUT]}
                  trade={trade}
                  allowedSlippage={allowedSlippage}
                  showNotFound={showNotFound}
                />
              </div>
            }
            {/* {!swapIsUnsupported ? (
              <AdvancedSwapDetailsDropdown trade={trade} />
            ) : (
              <UnsupportedCurrencyFooter
                show={swapIsUnsupported}
                currencies={[currencies.INPUT, currencies.OUTPUT]}
              />
            )} */}
              </>
            )}
          </SwapBlock>
        </SwapContainer>

        {/* <Popups /> */}
      </LayoutSwap>
    </Layout>
  );
}
