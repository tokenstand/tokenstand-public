import { Popover } from "@headlessui/react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ChainId, NATIVE } from "@sushiswap/sdk";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { bsc, injected } from "../../connectors";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useDarkModeManager } from "../../state/user/hooks";
import { useETHBalances } from "../../state/wallet/hooks";
import Toggle from "../Toggle";
import Web3Network from "../Web3Network";
import Web3Status from "../Web3Status";

const TextMode = styled.span`
  font-weight: 500;
  font-size: 17px;
  @media (min-width: 640px) {
    padding-left: 8px;
  }
`;

const LogoWalletBlock = styled.div`
  width: 100%;
  height: 100%;
  min-width: 20px;
  background-color: white;
  margin: auto;
  max-height: 25px;
  max-width: 25px;
  border-radius: 50%;
  #media (min-width: 640px) {
    marginleft: -10px;
  }
`;

const iconMenu = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 18.0048C2 18.5548 2.446 18.9998 2.995 18.9998H11.005C11.2689 18.9998 11.522 18.8949 11.7086 18.7083C11.8952 18.5217 12 18.2687 12 18.0048C12 17.7409 11.8952 17.4878 11.7086 17.3012C11.522 17.1146 11.2689 17.0098 11.005 17.0098H2.995C2.445 17.0098 2 17.4548 2 18.0048Z"
      fill="white"
    />
    <path
      d="M2 11.9999C2 12.5499 2.446 12.9949 2.995 12.9949H21.005C21.2689 12.9949 21.522 12.8901 21.7086 12.7035C21.8952 12.5169 22 12.2638 22 11.9999C22 11.736 21.8952 11.4829 21.7086 11.2963C21.522 11.1097 21.2689 11.0049 21.005 11.0049H2.995C2.445 11.0049 2 11.4509 2 11.9999Z"
      fill="white"
    />
    <path
      d="M2.995 6.99C2.73111 6.99 2.47803 6.88517 2.29143 6.69857C2.10483 6.51197 2 6.25889 2 5.995C2 5.73111 2.10483 5.47803 2.29143 5.29143C2.47803 5.10483 2.73111 5 2.995 5H15.005C15.1357 5 15.2651 5.02574 15.3858 5.07574C15.5065 5.12574 15.6162 5.19903 15.7086 5.29143C15.801 5.38382 15.8743 5.49351 15.9243 5.61423C15.9743 5.73495 16 5.86433 16 5.995C16 6.12567 15.9743 6.25505 15.9243 6.37577C15.8743 6.49649 15.801 6.60618 15.7086 6.69857C15.6162 6.79097 15.5065 6.86426 15.3858 6.91426C15.2651 6.96426 15.1357 6.99 15.005 6.99H2.995Z"
      fill="white"
    />
  </svg>
);

function AppBar({ setShowMenu, isShowMenu, path }): JSX.Element {
  const { i18n } = useLingui();
  const { account, chainId, library, connector } = useActiveWeb3React();
  const [darkMode, toggleDarkMode] = useDarkModeManager();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ""
  ];
  const [scrollY, setScrollY] = useState(window.scrollY);

  const iconWallet =
    connector === injected
      ? "/images/wallets/metamask.png"
      : connector === bsc
      ? "/images/wallets/bsc.png"
      : "/images/wallets/wallet-connect.svg";

  const toggleWalletModal = useWalletModalToggle();

  const handleNavigation = (e) => {
    const window = e.currentTarget;
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", (e) => handleNavigation(e));
    return () => {
      window.removeEventListener("scroll", (e) => handleNavigation(e));
    };
  }, [scrollY]);

  const handlePostAccount = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_LOTTERY}/api/user-connect`, {
        userId: account,
      })
      .catch((err) => console.log(`err`, err));
  };

  useEffect(() => {
    if (account) {
      handlePostAccount();
    }
  }, [account]);

  return (
    <header className="flex-shrink-0 w-full">
      <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
        <WrapperHeader
          className="wrap-header"
          path={path}
          isMobile={isMobile}
          style={{
            background: !isMobile && scrollY < 20 && "none",
            boxShadow: !isMobile && scrollY < 20 && "none",
          }}
        >
          <div className="px-4 header-main">
            <div
              className={`flex ${isMobile ? "justify-between" : "justify-end"}`}
            >
              {isMobile && (
                <HeaderMobile>
                  <div onClick={() => setShowMenu(!isShowMenu)}>{iconMenu}</div>
                  <img src={`/images/logo-${darkMode}.svg`} />
                </HeaderMobile>
              )}
              <div
                className={`fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full py-2 lg:w-auto bg-fixed ${
                  isMobile && "bg-mobile"
                } lg:relative lg:p-0 lg:bg-transparent`}
              >
                <StyleDiv className="flex items-center justify-between w-full sm:space-x-2 sm:justify-end container">
                  <div className="hidden sm:inline-block">
                    <Web3Network />
                  </div>

                  <div
                    className="w-auto flex items-center rounded whitespace-nowrap cursor-pointer select-none pointer-events-auto btn-primary3"
                    onClick={toggleWalletModal}
                  >
                    {account && chainId && (
                      <>
                        <div className="px-2 sm:px-4 py-2 text-primary text-bold btn-primary2 mr-2 sm:mr-4 flex items-end justify-center">
                          {/* <Image
                              src={iconWallet}
                              alt={"Icon"}
                              width="25px"
                              height="25px"
                            /> */}
                          <LogoWalletBlock>
                            <img src={iconWallet} width="25px" height="25px" />
                          </LogoWalletBlock>

                          <div
                            className="ml-1.5"
                            style={{ paddingBottom: "2px" }}
                          >
                            {userEthBalance?.toSignificant(4)}{" "}
                            {NATIVE[chainId]?.symbol}
                          </div>
                        </div>
                      </>
                    )}
                    <Web3Status />
                  </div>
                  <div>{/* <LanguageSwitch /> */}</div>
                  <div className="flex items-center">
                    <Toggle isActive={darkMode} toggle={toggleDarkMode} />
                    <TextMode className="text-color">
                      {darkMode ? i18n._(t`Dark`) : i18n._(t`Light`)}
                    </TextMode>
                  </div>
                </StyleDiv>
              </div>
              <div className="flex -mr-2 sm:hidden">
                {/* Mobile menu button */}
                <div className="sm:inline-block">
                  <Web3Network />
                </div>
              </div>
            </div>
          </div>
        </WrapperHeader>
      </Popover>
    </header>
  );
}

export default AppBar;

const StyleDiv = styled.div`
  font-family: SF UI Display;
  #web3-status-connected {
    padding-right: 10px !important;
  }
`;

const HeaderMobile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    path {
      fill: ${({ theme }) => theme.iconMenu};
    }
  }
  img {
    width: 47px;
  }
`;

const WrapperHeader = styled.div`
  background: ${({ theme, path, isMobile }) =>
    !isMobile ? theme.bgHeader : theme.bg1};
  position: fixed;
  width: 100%;
  z-index: 9999;
  transition: top 0.2s ease 0s;
  @media (max-width: 767px) {
  }
  > .container {
    margin: 0 auto;
  }

  .header-main {
    padding: ${isMobile ? "15px" : "24px 84px"};
  }

  .bg-mobile {
    background-color: ${({ theme }) => theme.bg2};
  }
  .bg-fixed {
    @media (max-width: 767px) {
      button,
      .text-language,
      .text-color {
        font-size: 12px;
      }
    }
  }
`;
