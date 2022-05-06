import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Main from "../components/Main";
import { bsc, injected, networkSupport } from "../connectors";
import { useChainId } from "../hooks";
import { useNetworkModalToggle } from "../state/application/hooks";
import { NetworkChainId } from "../utils/chainId";
import MenuMain from "../components/MenuMain";
import { useIsDarkMode } from "../state/user/hooks";
import axios from "axios";

const Wrapper = styled.div`
  background: ${({ src }) => `url(${src})`} no-repeat center center
    ${!isMobile && "fixed"};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: -2rem -15px 0;
  padding: 2rem 15px 0px;
  min-height: 100vh;
  ${({ path, darkMode }) =>
  isMobile &&
  darkMode &&
  `background-image: radial-gradient(ellipse at top, #080e21 0%, #141c26 45%)`};
   
`;

const ErrorMessage = styled.div`
  width: 100%;
  text-align: center;
  background: #ec5656;
  color: white;
  padding: ${isMobile ? "8px" : "10px"};
  font-weight: 500;
  font-size: ${isMobile ? "12px" : "16px"};
  opacity: 0.8;
  position: absolute;
  margin-top: ${ isMobile ? '75px' : '103px'};
  overflow: hidden;
  z-index: 2;

  .notice {
    ${isMobile && `width: 92%;`}
    strong {
      font-weight: 600;
      color: #feea00;
    }

    .note-message {
      font-size: ${isMobile ? "14px" : "20px"};
    }

    @media screen and (max-width: 1532px) {
      ${!isMobile && `padding-left: 190px;`}
    }
  }
`

const TextLink = styled.span`
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
`;

const Layout = ({ children }) => {
  const { i18n } = useLingui();
  const { error, chainId, account, connector } = useWeb3React();
  const router = useRouter();
  const chain = NetworkChainId();
  const toggleNetworkModal = useNetworkModalToggle();
  const isDisconnected = localStorage.getItem("isDisconnected");
  const darkMode = useIsDarkMode();
  const [smallMenu, setSmallMenu] = useState(false);
  const [isShowMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (connector && Number(isDisconnected)) {
      connector === injected || connector === bsc
        ? (connector as any).handleClose()
        : (connector as any).handleDisconnect();
    }
  }, []);

  useEffect(() => {
    if (networkSupport.supportedChainIds.includes(chainId)) {
      if (!Number(isDisconnected)) {
        localStorage.setItem("chainId", chainId.toString());
      } else {
        localStorage.setItem("chainId", chain.toString());
      }
    }
  }, [chainId]);

  const { query } = router;

  //referral
  const checkReferral = async () => {
    const refStorage = localStorage.getItem("ref")
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_REFERRAL}/api/create-referral`,
      { referCode: query.ref, refId: account, chainId: chainId }
    );

     refStorage && await axios.post(
      `${process.env.NEXT_PUBLIC_API_REFERRAL}/api/create-referral`,
      { referCode: refStorage, refId: account, chainId: chainId }
    );
   
    if(res.data.message){
      localStorage.setItem("ref", String(query.ref))
    }
  };

  useEffect(() => {
    account && query.ref && checkReferral();
  }, [query, account, chainId]);

  const path = router.pathname;

  let src = darkMode
  ? "/images/bg-referral-dark.png"
  : "/images/bg-referral-light.png";

  let srcMobile = "";
  
  switch (path) {
    case "/NFTJackpot":
      srcMobile = darkMode ? "" : `/images/bg-lottery-mobile.png`;
      break;
    case "/bridge-token":
      srcMobile = darkMode
        ? "/images/bg-bridge-dark.png"
        : "/images/bg-bridge-light.png";
      break;
    case "/referral":
      srcMobile = darkMode ? "" : `/images/bg-referral-mobile-false.png`;
      break;
      case "/lottery":
      srcMobile = darkMode ? "" : `/images/bg-lottery-mobile.png`;
      break;
  }

  return (
    <Wrapper
      src={isMobile ? srcMobile : src}
      className="z-0 flex flex-row relative"
      path={path}
      darkMode={darkMode}
    >
      {!isMobile ? (
        <MenuMain setSmallMenu={setSmallMenu} smallMenu={smallMenu} />
      ) : isShowMenu ? (
        <MenuMain setSmallMenu={setSmallMenu} smallMenu={smallMenu} />
      ) : (
        <></>
      )}
      <div className="w-full">
        <Header setShowMenu={setShowMenu} isShowMenu={isShowMenu} path={path} />
        
        {
          account && !networkSupport.supportedChainIds.includes(chainId) &&
          <ErrorMessage>
            <div>{i18n._(t`You are on the wrong network. You can change`)} <TextLink onClick={toggleNetworkModal}> {i18n._(t`here`)}</TextLink>.</div>
            </ErrorMessage>
        }
        {/* <div className="notice">
          <div>
            With the purpose of making a better farming reward mechanism, we are
            going to improve the farming function on <strong>March 31.</strong>
          </div>
          <div>
            To make sure that your rewards would not be affected, be kindly help
            us <strong>claim</strong> all your STAND rewards from LP farms and Token
            farm.
          </div>
          <div className="note-message">
          <strong>Note: Please remain your LP in farm to receive reward continuously!</strong> 
          </div>
        </div> */}
      
        {/* {
        chainId && !arrChainId.includes(chainId) ?
          <>
            <ErrorMessage>App network doesn&apos;t match to network selected in wallet.</ErrorMessage>
          </> : ""
      } */}
        {isMobile &&darkMode && (
          <div className="star"></div>
        )}
        <div
          style={{ marginLeft: !isMobile && (smallMenu ? "74px" : "224px") }}
          onClick={() => setShowMenu(false)}
        >
          <Main path={path}>{children}</Main>
          <Footer />
        </div>
      </div>
    </Wrapper>
  );
};

export default Layout;