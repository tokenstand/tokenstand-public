import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/router";
import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { useIsDarkMode } from "../../state/user/hooks";
import NavLink from "../NavLink";
import { imageSvg } from "./image";

function MenuMain({ setSmallMenu, smallMenu }): JSX.Element {
  const { i18n } = useLingui();
  const router = useRouter();
  const darkMode = useIsDarkMode();
  const pathName = router?.asPath;

  return (
    <Nav className="fixed" smallMenu={smallMenu}>
      {!isMobile && (
        <div className="logo relative" onClick={() => setSmallMenu(!smallMenu)}>
          {smallMenu ? (
            <img src="/images/logo-mini.png" />
          ) : (
            <img src={`/images/logo-${darkMode}.svg`} />
          )}

          <div className="absolute icon-arrow">
            {darkMode ? imageSvg.iconDark : imageSvg.iconLight}
          </div>
        </div>
      )}

      <div className="flex flex-col px-4 pt-2 pb-3">
        <NavLink href="/swap">
          <a
            id={`swap-nav-link`}
            onClick={() =>
              pathName === "/swap" ? window.location.reload() : null
            }
            className={`text-baseline text-primary   whitespace-nowrap ${
              pathName === "/swap" ? "active" : ""
            }`}
          >
            {imageSvg.exchange}

            {!smallMenu && i18n._(t`Exchange`)}
          </a>
        </NavLink>
        <NavLink href="/pool">
          <a
            id={`pool-nav-link`}
            onClick={() =>
              pathName === "/pool" ? window.location.reload() : null
            }
            className={`text-baseline text-primary whitespace-nowrap ${
              pathName === "/pool" ? "active" : ""
            }`}
          >
            {imageSvg.pool}

            {!smallMenu && i18n._(t`Pool`)}
          </a>
        </NavLink>
        <NavLink href={"/farming"}>
          <a
            id={`farm-nav-link`}
            onClick={() =>
              pathName === "/farming" ? window.location.reload() : null
            }
            className={`text-baseline text-primary whitespace-nowrap ${
              pathName === "/farming" ? "active" : ""
            }`}
          >
            {imageSvg.farm}
            {!smallMenu && i18n._(t`Farming`)}
          </a>
        </NavLink>

        {/* <NavLink href={"/NFTJackpot"}>
          <a
            id={`nft-nav-link`}
            onClick={() =>
              pathName === "/NFTJackpot" ? window.location.reload() : null
            }
            className={`text-baseline text-primary whitespace-nowrap ${
              pathName === "/NFTJackpot" ? "active" : ""
            }`}
          >
            {imageSvg.jackpot}

            {!smallMenu && i18n._(t`NFT Jackpot`)}
          </a>
        </NavLink> */}

        <NavLink href={"/bridge-token"}>
          <a
            id={`bridge-nav-link`}
            onClick={() =>
              pathName === "/bridge-token" ? window.location.reload() : null
            }
            className={`text-baseline text-primary whitespace-nowrap ${
              pathName === "/bridge-token" ? "active" : ""
            }`}
          >
            {imageSvg.bridgeToken}

            {!smallMenu && i18n._(t`Bridge Token`)}
          </a>
        </NavLink>

        <NavLink href={"/referral"}>
          <a
            id={`referral-nav-link`}
            onClick={() =>
              pathName === "/referral" ? window.location.reload() : null
            }
            className={`text-baseline text-primary whitespace-nowrap ${
              pathName === "/referral" ? "active" : ""
            }`}
          >
            {imageSvg.referral}

            {!smallMenu && i18n._(t`Referral`)}
          </a>
        </NavLink> 

        <NavLink href={"/lottery"}>
          <a
            id={`lottery-nav-link`}
            onClick={() =>
              pathName === "/lottery" ? window.location.reload() : null
            }
            className={`text-baseline text-primary whitespace-nowrap ${
              pathName === "/lottery" ? "active" : ""
            }`}
          >
            {imageSvg.lottery}

            {!smallMenu && i18n._(t`Lottery`)}
          </a>
        </NavLink>

        <NavLink href="https://docs.tokenstand.finance/">
          <a
           id={`docs-nav-link`}
           className={`text-baseline text-primary hover:text-high-emphesis whitespace-nowrap `}
           target="_blank"
          >
            {imageSvg.docs}

            {!smallMenu && i18n._(t`Docs`)}
          </a>
        </NavLink>
      </div>
    </Nav>
  );
}

export default MenuMain;

const Nav = styled.div`
  width: ${(props) => (props.smallMenu ? "74px" : "224px")};
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text9};
  border: 1px solid ${({ theme }) => theme.borderMenu};
  box-sizing: border-box;
  transition: padding-top 0.2s ease 0s, width 0.2s ease 0s;
  transform: translate3d(0px, 0px, 0px);
  z-index: 999999;
  height: 100%;
  top: ${ isMobile ? '75px' : ''};
 
  &:hover {
    .icon-arrow {
      display: block !important;
    }
  }

  .logo {
    padding: ${(props) => (props.smallMenu ? "16px" : "43px")};
    display: flex;
    justify-content: center;

    .icon-arrow {
      display: ${(props) => (props.smallMenu ? "block" : "none")};
      right: -13px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      transform: ${(props) => (props.smallMenu ? "rotate(0deg)" : "rotate(180deg)")};

      svg {
        width: 100%;
      }
    }
  }
  div {
    padding: 0;
    a {
      font-family: SF UI Display;
      color: ${({ theme }) => theme.primaryText3};
      font-style: normal;
      font-weight: 500;
      font-size: ${isMobile ? '16px' : '18px'};
      line-height: 21px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: 0.015em;
      text-transform: capitalize;
      :hover {
        background: ${({ theme }) => theme.bg7};
        color: ${({ theme }) => theme.text9};
        svg {
          path {
            fill: ${({ theme }) => theme.text9};
            fill-opacity: 1;
          }
        }
      }
    }

    .active {
      background: ${({ theme }) => theme.bg7};
      color: ${({ theme }) => theme.text9};
      svg {
        path {
          fill: ${({ theme }) => theme.text9};
          fill-opacity: 1;
        }
      }
    }
  }
  svg {
    margin-right: ${(props) => (props.smallMenu ? "0px" : "18px")};
    width: ${isMobile ? '20px' : ''};
    path {
      fill: ${({ theme }) => theme.primaryText3};
      fill-opacity: 1;
    }
  }
`;