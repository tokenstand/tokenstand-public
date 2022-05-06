import React, { useCallback, useContext, useState } from "react";
import {
  fortmatic,
  injected,
  portis,
  torus,
  walletconnect,
  walletlink,
  bsc,
} from "../../connectors";
import styled, { ThemeContext } from "styled-components";
import { AppDispatch } from "../../state";
import Button from "../Button";
import Copy from "./Copy";
import ExternalLink from "../ExternalLink";
import Identicon from "../Identicon";
import Image from "next/image";
import { ExternalLink as LinkIcon } from "react-feather";
import LinkStyledButton from "../LinkStyledButton";
import ModalHeader from "../ModalHeader";
import { SUPPORTED_WALLETS } from "../../constants";
import Transaction from "./Transaction";
import { clearAllTransactions } from "../../state/transactions/actions";
import { getExplorerLink } from "../../functions/explorer";
import { fullAddress, shortenAddress } from "../../functions/format";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useDispatch } from "react-redux";
import { TransactionHelper, DisconnectHelper } from './newTransaction';
import { NETWORK_LABEL } from "../../constants/networks";
import { NATIVE } from "@sushiswap/sdk";
import { useETHBalances } from "../../state/wallet/hooks";
import { isMobile } from "react-device-detect";
import ModalTransaction from "../../components/AccountDetails/popupTransaction"
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
const AddressLink = styled(ExternalLink) <{ hasENS: boolean; isENS: boolean }>`
  font-size: 0.825rem;
  // color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    // color: ${({ theme }) => theme.text2};
  }
`;

const WalletName = styled.div`
  width: initial;
  // font-size: 0.825rem;
  // font-weight: 500;
  // color: ${({ theme }) => theme.text3};
`;
// const HorizontalBorder = styled.span`
//     border: 0.5px solid rgba(255, 255, 255, 0.15);
//     transform: rotate(90deg)";
//     width: 4rem;
//     height : 0px;
// `;

const IconWrapper = styled.div<{ size?: number }>`
  // ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  // margin-right: 8px;
  margin-left : 15px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 10px;
  `};
  @media(max-width: 767px) {
    margin-left : 10px;
  }
`;

const StyledAddress = styled.div`
  background: ${({ theme }) => theme.bgENSNamePopup};
  border: 1px solid ${({ theme }) => theme.borderENSNamePopup};
  box-sizing: border-box;
  border-radius: 10px;
  padding-rigth: 22.5px;
  @media(max-width: 767px) {
    padding-rigth: 17px;
  }
  .text-address{
    font-size: 14px;
    @media(max-width: 780px) {
      font-size: 12px;
    }
  }
`;

const HorizontalBar = styled.span`
  border-right: 1px solid ${({ theme }) => theme.borderENSNamePopup};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: calc(0.125rem * var(--tw-space-x-reverse)) !important;
    margin-left: calc(0.125rem * calc(1 - var(--tw-space-x-reverse))) !important;
  `};
  
`
const ButtonChangeOption = styled.button`

  width : 7%;
  color : ${({ theme }) => theme.text6};

  & svg{
    width : ${props => props.mobile ? "18px" : "24px"};
    @media (max-width: 767px) {
      width : 18px;
    }
  }
  @media (max-width: 767px) {
    width : 10%;
  }

`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`;

const StyledAccount = styled.div`

  .box-info-account{
      padding-right: 21px;

    @media(max-width: 767px){
      display: flex;
      flex-direction: column;
      height: 108px !important;
      padding-right: 16px !important;
    }
  }

  .group-logo-account{
    @media(max-width: 767px){
      padding-top: 12px;
    }
  }

  .group-info{
    // padding: 16px 16px 0 16px;
    justify-content: space-between;
    @media(max-width: 767px){
      padding-left: 16px;
    }
  }

  .group-text{
    @media(max-width: 767px){
      font-size: 14px;
    }
  }

  .lbl-text{
    opacity:1;

    @media(max-width: 767px){
      font-size: 10px;
    }
  }

  .lbl-button{
    opacity:1;

    @media(max-width: 767px){
      font-size: 10px;
      margin-left: 1px !important;
      margin-right: 1px !important;
    }
  }
  .style-transaction{
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      margin-right: calc(0.125rem * var(--tw-space-x-reverse)) !important;
      margin-left: calc(0.125rem * calc(1 - var(--tw-space-x-reverse))) !important;
    `};
  }
`
const BlockAccount = styled.div`
  @media (max-width: 640px){
    justify-content:  space-around;
  }
`

function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />;
      })}
    </TransactionListWrapper>
  );
}

interface AccountDetailsProps {
  toggleWalletModal: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}: AccountDetailsProps): any {
  const { i18n } = useLingui()
  const { chainId, account, connector } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch<AppDispatch>();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ""
  ];
  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === "METAMASK"))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return <WalletName>{name}</WalletName>;
  }

  const getIconWallet = () => {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const icon = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === "METAMASK"))
      )
      .map((k) => SUPPORTED_WALLETS[k].iconName)[0];
    return <img alt="Wallet" src={`/images/wallets/${icon}`} width="32px" height="32px" className="ml-4" />;
  }
  
  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={30}>

          {isMobile ?
            <Identicon size={36} classNames={"ml-2"} />
            :
            <Identicon size={46} classNames={"ml-2"} />
          }
        </IconWrapper>
      );
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={30}>
          <Image
            // src="/wallet-connect.png"
            src="/images/wallets/wallet-connect.svg"
            alt={"Wallet Connect"}
            width="30px"
            height="30px"
          />
        </IconWrapper>
      );
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={30}>
          <Image
            src="/images/wallets/coinbase.svg"
            alt={"Coinbase Wallet"}
            width="30px"
            height="30px"
          />
        </IconWrapper>
      );
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={30}>
          <Image
            src="/images/wallets/fortmatic.png"
            alt={"Fortmatic"}
            width="30px"
            height="30px"
          />
        </IconWrapper>
      );
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={30}>
            <Image
              src="/images/wallets/portis.png"
              alt={"Portis"}
              width="30px"
              height="30px"
            />
            <Button
              onClick={() => {
                portis.portis.showPortis();
              }}
            >
              Show Portis
            </Button>
          </IconWrapper>
        </>
      );
    } else if (connector === torus) {
      return (
        <IconWrapper size={30}>
          <Image
            src="/images/wallets/torus.png"
            alt={"Coinbase Wallet"}
            width="30px"
            height="30px"
          />
        </IconWrapper>
      );
    }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);
  const [isOpenTransaction, setIsOpenTransaction] = useState(false)
  const handleOpenTransaction = () => {
    setIsOpenTransaction(true)
  }

  const onDismissTransaction = () => {
    setIsOpenTransaction(false)
  }

  return (
    <StyledAccount>
      <div className="space-y-3">
        <div className="space-y-3">
          <ModalHeader title="Account" onClose={toggleWalletModal}></ModalHeader>

          <div className="space-y-3 items-center">
            <div className="flex space-between w-auto h-20 box-info-account"
              style={{
                background: "linear-gradient(90deg, #00B09B 0%, #96C93D 100%)",
                borderRadius: "10px",
              }}>
              <div className="w-1/2 h-auto flex items-center text-general-popup group-logo-account">
                {getStatusIcon()}
                <div className="items-center ml-4">
                  <p className="text-xs font-normal tracking-wide leading-none mb-0 text-white lbl-text">{i18n._(t`Balance`)}</p>
                  <p className="text-base mb-0 font-semibold text-white group-text" >{userEthBalance?.toSignificant(4) ? userEthBalance?.toSignificant(4) : "0"}{" "}
                    {NATIVE[chainId].symbol}
                  </p>
                </div>
              </div>
              <div className="flex flex-grow items-center text-general-popup group-info">
                <div className="items-center ">
                  <p className="text-xs font-normal tracking-wide leading-none mb-0 text-white lbl-text">{i18n._(t`Network`)}</p>
                  <p className="text-base mb-0 font-semibold text-white group-text" >{NETWORK_LABEL[chainId]}</p>
                </div>
                <div className=" items-center">
                  <p className="text-xs font-normal tracking-wide leading-none mb-0 text-white lbl-text">{i18n._(t`Wallet`)}</p>
                  <p className="text-base mb-0 font-semibold text-white group-text" >{formatConnectorName()}</p>
                </div>
              </div>
            </div>
            <StyledAddress
              id="web3-account-identifier-row"
              className="flex items-center space-x-3 w-auto h-12 justify-between"
            >
              {ENSName ? (
                <>
                  {getIconWallet()}
                  <p className="text-primary text-general-popup font-medium ml-0 mt-auto break-words text-address"> {ENSName}</p>
                </>
              ) : (
                <>
                  {getIconWallet()}
                  <p className="text-general-popup text-address font-medium ml-0 mt-auto flex-grow break-words md:hidden">
                    {account && shortenAddress(account)}</p>
                  <p className="text-general-popup text-address font-medium ml-0 mt-auto flex-grow break-words hidden md:block"> {account && fullAddress(account)}</p>

                  <ButtonChangeOption
                    onClick={() => {
                      openOptions();
                    }}
                    mobile={isMobile}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </ButtonChangeOption>
                </>
              )}
            </StyledAddress>
            <div>
              {ENSName ? (
                <>
                  <div className="flex items-center justify-center " style={{ height: "11vh" }}>
                    {account && (
                      <div style={{ width: "30%" }}>
                        <Copy toCopy={account}>
                          <span style={{ marginLeft: "4px" }} className="text-general-popup text-sm font-medium ml-3 lbl-text lbl-button">{i18n._(t`Copy Address`)}</span>
                        </Copy>
                      </div>
                    )}
                    <HorizontalBar className="h-8" style={{ marginLeft: "-2%" }}>

                    </HorizontalBar>
                    {
                      <div className="flex items-center style-transaction" onClick={handleOpenTransaction} style={{ width: "40%" }}>
                        <TransactionHelper />
                        <span style={{ marginLeft: "4px" }} className="text-general-popup text-sm font-medium ml-0 cursor-pointer lbl-text lbl-button">{i18n._(t`Transaction History`)}</span>
                        {isOpenTransaction && <ModalTransaction isOpenTransaction={isOpenTransaction} onDismissTransaction={onDismissTransaction} tabSwap={0}/>}
                        {/* </TransactionHelper> */}
                      </div>

                    }
                    <HorizontalBar className="h-8" style={{ marginLeft: "-2%" }}>

                    </HorizontalBar>
                    {
                      <div style={{ display: "flex", width: "26%", alignItems: "center", gridGap: "2px" }}>
                        <DisconnectHelper />
                        <span
                          style={{ marginLeft: "4px" }}
                          className="text-general-popup text-sm font-medium ml-0 cursor-pointer lbl-text lbl-button"
                          onClick={() => {
                            (connector as any).handleClose()
                            localStorage.setItem("isDisconnected", "1")
                          }}
                        >
                          {i18n._(t`Disconnnect`)}
                        </span>
                      </div>
                    }
                  </div>
                </>
              ) : (
                <>
                  <BlockAccount className="flex items-center space-x-1 md:space-x-3 sm:justify-center " style={{ height: "11vh" }}>
                    {account && (
                      <div style={{ width: "30%" }}>
                        <Copy toCopy={account}>
                          <span className="text-general-popup text-sm font-medium mr-3 lbl-text lbl-button">{i18n._(t`Copy Address`)}</span>
                        </Copy>
                      </div>
                    )}
                    <HorizontalBar className="h-8" style={{ marginLeft: "-2%" }}>

                    </HorizontalBar>
                    {
                      <div className="flex items-center style-transaction" onClick={handleOpenTransaction} style={{ width: "40%" }}>
                        <TransactionHelper />
                        <span className="text-general-popup text-sm font-medium cursor-pointer lbl-text lbl-button">{i18n._(t`Transaction History`)}</span>
                        <ModalTransaction isOpenTransaction={isOpenTransaction} onDismissTransaction={onDismissTransaction} tabSwap={0}/>
                      </div>
                    }
                    <HorizontalBar className="h-8" style={{ marginLeft: "-2%" }}>

                    </HorizontalBar>
                    {
                      <div style={{ display: "flex", width: "26%", alignItems: "center", gridGap: "2px" }}>
                        <DisconnectHelper />
                        <span
                          className="text-general-popup text-sm font-medium ml-0 cursor-pointer lbl-text lbl-button"
                          onClick={() => {(
                            connector === injected || connector === bsc) ? (connector as any).handleClose() : (connector as any).close()
                            localStorage.setItem("isDisconnected", "1")
                          }}
                        >
                          {i18n._(t`Disconnnect`)}
                        </span>
                      </div>
                    }
                  </BlockAccount>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyledAccount>
  );
}
