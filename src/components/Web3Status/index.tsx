import React, { useMemo } from "react";
import {
  fortmatic,
  injected,
  lattice,
  portis,
  walletconnect,
  walletlink,
} from "../../connectors";
import {
  isTransactionRecent,
  useAllTransactions,
} from "../../state/transactions/hooks";

import { AbstractConnector } from "@web3-react/abstract-connector";
import Image from "next/image";
import Loader from "../Loader";
import { NetworkContextName } from "../../constants";
import { TransactionDetails } from "../../state/transactions/reducer";
import WalletModal from "../WalletModal";
import Web3Connect from "../Web3Connect";
import { shortenAddress } from "../../functions/format";
import styled from "styled-components";
import { t } from "@lingui/macro";
import useENSName from "../../hooks/useENSName";
import { useLingui } from "@lingui/react";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useWeb3React } from "@web3-react/core";

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
`;

const StyleWebConnect = styled.div`
    background: rgba(114, 191, 101, 0.1);
    border-color: rgba(114, 191, 101, 0.1);
    color: ${({ theme }) => theme.primary1};
    border-radius: 30px;
    font-size: 17px;
    font-weight: 500;
    padding: 6px 20px;
    display: inline-block;
    > button {
      background: none;
      padding: 0;
      font-size: 17px;
      font-weight: 500;
      &:focus {
        outline: none;
      }
    }
    > div:first-child {
      margin-right: 5px !important;
      vertical-align: -2px;
    }
  `;

// we want the latest one to come first, so return negative if a is after b
export function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

const SOCK = (
  <span
    role="img"
    aria-label="has socks emoji"
    style={{ marginTop: -4, marginBottom: -4 }}
  >
    🧦
  </span>
);

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return (
      <Image
        src="/chef.svg"
        alt="Injected (MetaMask etc...)"
        width={20}
        height={20}
      />
    );
    // return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/wallet-connect.png"
          alt={"Wallet Connect"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === lattice) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/lattice.png"
          alt={"Lattice"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/coinbase.svg"
          alt={"Coinbase Wallet"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/fortmatic.png"
          alt={"Fortmatic"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/portis.png"
          alt={"Portis"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  }
  return null;
}

function Web3StatusInner() {
  const { i18n } = useLingui();
  const { account, connector } = useWeb3React();

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => {
      if (tx.receipt) {
        return false;
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false;
      } else {
        return true;
      }
    })
    .map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;

  const toggleWalletModal = useWalletModalToggle();

  if (account) {
    return (
      <div
        id="web3-status-connected"
        onClick={toggleWalletModal}
        style={{ paddingRight: "20px" }}
      >
        {hasPendingTransactions ? (
          <div className="flex items-center justify-between">
            <div className="pr-2">
              {pending?.length} {i18n._(t`Pending`)}
            </div>{" "}
            <Loader/>
          </div>
        ) : (
          <div className="mr-2">{ENSName || shortenAddress(account)}</div>
        )}
      </div>
    );
  } else {
    return (
      <StyleWebConnect>
        <Image src="/icon-connect.png" alt="Sushi" width="16px" height="15px" />
        <Web3Connect />
      </StyleWebConnect>
    );
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}