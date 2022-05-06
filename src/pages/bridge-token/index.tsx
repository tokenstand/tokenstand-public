import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { ChainId } from "@sushiswap/sdk";
import Layout from "../../layouts/DefaultLayout";
import Head from "next/head";
import Container from "../../components/Container";
import SwapCard from "../../features/bridgeToken/SwapCard";
import AmountInput from "../../features/bridgeToken/AmountInput";
import AddressInput from "../../features/bridgeToken/AddressInput";
import Reminder from "../../features/bridgeToken/Reminder";
import SwitchSwapButton from "../../features/bridgeToken/SwitchSwapButton";
import { useIsDarkMode } from "../../state/user/hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { STAND } from "../../constants/tokens";
import {
  useBridgeTokenContract,
  useChainId,
  useGetBalanceOtherChain,
} from "../../hooks/useContract";
import { PARAMS as NETWORK_PARAMS } from "../../components/NetworkModal";
import { setChainIdDisconnect } from "../../state/application/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { isAddress } from "../../functions/validate";
import { useWalletModalToggle } from "../../state/application/hooks";
import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import ConfirmSwap from "../../features/bridgeToken/ConfirmSwap";
import WrongNetLayer from "./WrongNetLayer";
import { parseEther, parseUnits, formatEther } from "ethers/lib/utils";
import { useTransactionAdder } from "../../state/transactions/hooks";
import TransactionFailedModal from "../../components/TransactionFailedModal";
import { tryParseAmount } from "../../functions";
import { ApprovalState, useApproveCallback } from "../../hooks";
import { BRIDGE_TOKEN_ADDRESS, STAND_TOKEN } from "../../constants";
import Loader from "../../components/Loader";
import cookie from "cookie-cutter";
import NewTooltip from "../../components/NewTooltip";
import { NETWORK_LABEL_BRIDGE } from "../../features/bridgeToken/AmountInput/SelectNetworkButton";

const Divider = styled.div`
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.textInputPanel};
  font-weight: 500;
  @media screen and (min-width: 576px) {
    padding: 0 25px;
  }

  .pool-balance {
    width: 200px;
    text-align: right;
    font-size: 12px;
    div {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

const ButtonConnect = styled.button`
  background: ${({ theme }) => theme.greenButton};
  margin: 20px 0 24px;
  border-radius: 15px;
  color: ${({ theme }) => theme.white};
  min-height: 63px;
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  justify-content: center;
  @media screen and (max-width: 1024px) {
    font-size: 16px;
  }
  @media screen and (max-width: 768px) {
    min-height: 40px;
  }
`;

const SwapButton = styled.button`
  background: ${({ theme, disabled }) =>
    disabled ? theme.buttonDisable : theme.primary1};
  color: ${({ theme, disabled }) =>
    disabled ? "rgba(255, 255, 255, 0.5)" : theme.white};
  width: 100%;
  border-radius: 10px;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 24px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 576px) {
    border-radius: 15px;
    padding: 21px;
    font-size: 18px;
  }

  > span {
    margin-right: 8px;
  }
`;
let arr = [];
for (let i = 0; i < 20; i++) {
  arr.push(i);
}
export const getChainIdToByChainId = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return ChainId.BSC;
    case ChainId.BSC:
      return ChainId.MAINNET;
    case ChainId.RINKEBY:
      return ChainId.BSC_TESTNET;
    case ChainId.BSC_TESTNET:
      return ChainId.RINKEBY;
    default:
      return chainId;
  }
};

export default function BridgeToken(): JSX.Element {
  const { library, account } = useActiveWeb3React();
  const { chainId } = useChainId();
  const bridgeTokenContract = useBridgeTokenContract(chainId);
  const addTransaction = useTransactionAdder();
  const toggleWalletModal = useWalletModalToggle();
  const defaultChainId = Number(localStorage.getItem("chainId"))
    ? Number(localStorage.getItem("chainId"))
    : process.env.NEXT_PUBLIC_NETWORK === "TESTNET"
    ? 4
    : 1;

  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useIsDarkMode();
  const [amountInput, setAmountInput] = useState("");
  const [amountTo, setAmountTo] = useState<string>("");
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [addressTo, setAddressTo] = useState(account);
  const [messageAddress, setMessageAddress] = useState("");
  const [messageButton, setMessageButton] = useState("Enter an amount");
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isTransactionFailed, setIsTransactionFailed] = useState(false);
  const [isAttempingTx, setIsAttempingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [approvalState, approveCallback] = useApproveCallback(
    STAND[chainId] && tryParseAmount(amountInput, STAND[chainId]),
    BRIDGE_TOKEN_ADDRESS[chainId]
  );
  const [balancePool, setBalancePool] = useState("");

  const [chainIdSupport, setChainIdSupport] = useState(chainId);
  const balanceInput = useCurrencyBalance(account ?? undefined, STAND[chainId]);

  const supportedNets =
    process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? [4, 97] : [1, 56];

  const standOtherChain = useGetBalanceOtherChain(
    getChainIdToByChainId(chainId),
    STAND_TOKEN[getChainIdToByChainId(chainId)]
  );

  const getBalancePoolOutPut = async () => {
    const standInPool = await standOtherChain.methods
      .balanceOf(BRIDGE_TOKEN_ADDRESS[getChainIdToByChainId(chainId)])
      .call();
    setBalancePool(formatEther(standInPool));
  };
  // handle switch network
  const switchNetwork = (chainIdToSwitch: ChainId) => {
    cookie.set("chainId", chainIdToSwitch);
    if (account) {
      if (chainIdToSwitch === ChainId.MAINNET) {
        library?.send("wallet_switchEthereumChain", [
          { chainId: "0x1" },
          account,
        ]);
      } else if (chainIdToSwitch === ChainId.RINKEBY) {
        library?.send("wallet_switchEthereumChain", [
          { chainId: "0x4" },
          account,
        ]);
      } else {
        library?.send("wallet_addEthereumChain", [
          NETWORK_PARAMS[chainIdToSwitch],
          account,
        ]);
      }
    } else {
      localStorage.setItem("chainId", chainIdToSwitch.toString());
      dispatch(setChainIdDisconnect({ chainId: chainIdToSwitch }));
      // dispatch(setChainIdDisconnect({ chainId: chainIdToSwitch }))
    }
    if (!account) setChainIdSupport(chainIdToSwitch);
    setAmountInput("");
  };

  // handle user type input
  const handleUserInput = (value) => {
    const decimalRegExp = new RegExp(
      "^[+-]?([0-9]{0,20}([.][0-9]{0,18})?|[.][0-9]{0,18})$"
    );
    if (
      !value ||
      decimalRegExp.test(value) ||
      amountInput.length > value.length
    ) {
      setAmountInput(value);
    }
  };

  // handle user type address to
  const handleAddressTo = (value) => {
    setAddressTo(value);
    const validAdress = isAddress(value);
    if (!validAdress) {
      setMessageAddress("Please enter a valid address!");
    } else setMessageAddress("");
  };

  // handle deposit STAND to contract
  const hanleConfirmSwap = async () => {
    try {
      setIsAttempingTx(true);
      setTxHash("");

      const params = [
        addressTo,
        parseUnits(amountInput, STAND[chainId].decimals),
      ];
      const gasFee = await bridgeTokenContract.estimateGas.deposit(...params);
      const tx = await bridgeTokenContract.deposit(...params, {
        gasLimit: gasFee,
      });

      addTransaction(tx, {
        summary: `Swap ${amountInput} ${STAND[chainId].symbol}`,
      });

      setIsAttempingTx(false);
      setTxHash(tx.hash);
      setAmountInput("");
    } catch (error) {
      setIsAttempingTx(false);
      setTxHash("");
      setIsTransactionFailed(true);
      setIsOpenConfirm(false);
      setAmountInput("");
    }
  };

  // handle approve STAND to contract
  const handleApprove = useCallback(async () => {
    await approveCallback();
  }, [approveCallback]);

  // handle click button Swap, approve or swap
  const handleSwapButtonClick = () => {
    if (
      approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.UNKNOWN
    ) {
      handleApprove();
      return;
    }

    setIsOpenConfirm(true);
  };

  useEffect(() => {
    if (
      amountInput === "" ||
      Number(amountInput) === 0 ||
      amountInput === "."
    ) {
      setMessageButton("Enter an amount");
    } else if (
      account &&
      balanceInput &&
      parseEther(amountInput).gt(parseEther(balanceInput?.toExact()))
    ) {
      setMessageButton("Insuficient Your STAND Balance");
    } else if (
      balancePool !== "-" &&
      amountTo &&
      parseEther(Number(amountTo).toFixed(18)).gt(parseEther(balancePool))
    ) {
      setMessageButton("Insuficient Pool Balance");
    } else if (
      approvalState === ApprovalState.UNKNOWN ||
      approvalState === ApprovalState.NOT_APPROVED
    ) {
      setMessageButton("Approve STAND");
    } else if (approvalState === ApprovalState.PENDING) {
      setMessageButton("Approving");
    } else if (amountTo === "0") {
      setMessageButton("Input Amount Not Allowed");
    } else setMessageButton("Swap");
  }, [amountInput, approvalState, balanceInput, minAmount, balancePool]);

  useEffect(() => {
    const arrChainId =
      process.env.NEXT_PUBLIC_NETWORK === "TESTNET"
        ? [4, 97, 42]
        : [1, 56, 42161];
    if (account) {
      setChainIdSupport(
        arrChainId.includes(chainId) ? chainId : chainIdSupport
      );
    } else {
      setChainIdSupport(
        arrChainId.includes(defaultChainId) ? defaultChainId : 1
      );
    }
    setIsOpenConfirm(false);
    setAmountInput("");
    setAmountTo("");
    getBalancePoolOutPut();
  }, [chainId, account]);

  useEffect(() => {
    setAddressTo(account);
    setMessageAddress("");
  }, [account]);

  return (
    <Layout>
      {!supportedNets.includes(chainId) && (
        <WrongNetLayer chainId={chainId} supportedNets={supportedNets} />
      )}
      <Head>
        <title>Bridge Token | TokenStand</title>
        <meta name="description" content="Bridge Token" />
      </Head>

      <Container
        maxWidth="full"
        className="grid  mx-auto gap-9 relative"
        style={{ height: isMobile ? "690px" : "814px" }}
      >
        {darkMode &&
          arr.map((item, index) => (
            <div className={`meteor-${item + 1}`} key={index}></div>
          ))}
        <SwapCard heading={"Swap"}>
          <AmountInput
            isTokenFrom={true}
            inputChainId={chainIdSupport}
            balance={balanceInput ? balanceInput?.toExact() : "-"}
            amount={amountInput}
            handleUserInput={handleUserInput}
            handleBalanceMax={(balance) => setAmountInput(balance)}
            switchNetwork={switchNetwork}
          />
          <Divider>
            <SwitchSwapButton
              callback={() => switchNetwork(getChainIdToByChainId(chainId))}
            />
            <div className="pool-balance">
              <NewTooltip
                dataTip={balancePool}
                dataValue={
                  NETWORK_LABEL_BRIDGE[getChainIdToByChainId(chainId)] +
                  " Pool Balance: " +
                  balancePool
                }
              />
            </div>
          </Divider>
          <AmountInput
            isTokenFrom={false}
            inputChainId={getChainIdToByChainId(chainIdSupport)}
            amount={amountTo}
            switchNetwork={switchNetwork}
          />
          {account && (
            <AddressInput
              address={addressTo}
              handleAddressTo={handleAddressTo}
              messageAddress={messageAddress}
            />
          )}
          {!account ? (
            <ButtonConnect onClick={toggleWalletModal}>
              {i18n._(t`Connect Wallet`)}
            </ButtonConnect>
          ) : (
            <SwapButton
              disabled={
                (messageButton !== "Swap" &&
                  messageButton !== "Approve STAND") ||
                messageAddress !== "" ||
                amountTo === ""
              }
              onClick={handleSwapButtonClick}
            >
              <span>{messageButton}</span>
              {approvalState === ApprovalState.PENDING && (
                <Loader stroke="white" />
              )}
            </SwapButton>
          )}
          <Reminder
            chainId={chainId}
            amount={amountInput}
            onBridgeTokenFeeChange={(minAmount, maxAmount) => {
              setMinAmount(Number(minAmount));
              setMaxAmount(Number(maxAmount));
            }}
            setAmountTo={setAmountTo}
          />
        </SwapCard>

        <ConfirmSwap
          isOpen={isOpenConfirm}
          onDismiss={() => {
            setIsOpenConfirm(false);
            setTxHash("");
          }}
          amount={amountInput}
          amountTo={amountTo}
          chainIdOuput={getChainIdToByChainId(chainId)}
          onConfirm={hanleConfirmSwap}
          isAttempingTx={isAttempingTx}
          txHash={txHash}
        />

        <TransactionFailedModal
          isOpen={isTransactionFailed}
          onDismiss={() => setIsTransactionFailed(false)}
        />
      </Container>
    </Layout>
  );
}
