import React, { useState, useCallback, useRef, useEffect } from "react";

import { ChainId } from "@sushiswap/sdk";
import Gas from "./Gas";
import Lottie from "lottie-react";
import NavLink from "./NavLink";
import Settings from "./Settings";
import { currencyId } from "../functions";
import profileAnimationData from "../animation/wallet.json";
import settingsAnimationData from "../animation/settings-slider.json";
import { t } from "@lingui/macro";
import { useActiveWeb3React, useChainId } from "../hooks";
import { useLingui } from "@lingui/react";
import styled from "styled-components";
import Tooltip from "./Tooltip";
import ReactTooltip from "react-tooltip";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";

const TitleExchange = styled.a`
  color: ${({ theme }) => theme.textBold};
  font-size: 24px;
  font-family: "SF UI Display";
  &:hover {
    color: ${({ theme }) => theme.textBold};
  }
  @media (max-width: 767px) {
    font-size: 18px;
  }
`;

const SettingButton = styled.div`
  border: 1px solid ${({ theme }) => theme.border1};
  background: ${({ theme }) => theme.bgSetting};
  box-sizing: border-box;
  border-radius: 10px;
  width: 31px;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RefreshButton = styled.div`
  border: 1px solid ${({ theme }) => theme.border1};
  background: ${({ theme }) => theme.bgSetting};
  box-sizing: border-box;
  border-radius: 10px;
  width: 31px;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Countdown = styled.div`
  position: relative;
  margin: auto;
  height: 30px;
  width: 30px;
  text-align: center;

  svg {
    position: absolute;
    top: 1px;
    right: 0;
    width: 26px;
    height: 26px;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }

  svg circle {
    stroke-dasharray: 50px;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 2px;
    stroke: ${({ theme }) => theme.iconDropdown};
    fill: none;
    animation: countdown 10s linear infinite forwards;
  }

  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 50px;
    }
  }
`;
const StyledReactTooltip = styled(ReactTooltip)`
  background: #5c6a86 !important;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600 !important;
  line-height: 126.5%;
  word-wrap: break-word; /* IE 5.5-7 */
  white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
  white-space: pre-wrap; /* current browsers */
  @media screen and (max-width: 768px) {
    max-width: 250px !important;
  }
  &.place-top {
    padding: 0.3rem 1rem;
    &:after {
      border-top-color: #5c6a86 !important;
    }
  }
  &.place-left {
    padding: 0.3rem 1rem;
    &:after {
      border-left-color: #5c6a86 !important;
    }
  }
  &.place-right {
    padding: 0.3rem 1rem;
    &:after {
      border-right-color: #5c6a86 !important;
    }
  }
  &.place-bottom {
    padding: 0.3rem 1rem;
    &:after {
      border-bottom-color: #5c6a86 !important;
    }
  }
`;

const TabExchange = styled.div<{ isLimitOrder }>`
  border-bottom: 2px solid
    ${(props) => (props.isLimitOrder ? "#72BF65" : "transparent")};
`;
function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        ReactTooltip.hide(ref.current);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
export default function ExchangeHeader({
  input = undefined,
  output = undefined,
  allowedSlippage = undefined,
  refresh,
  setRefresh,
  setLimitOrder,
  isLimitOrder,
  onChangeSwapTab,
}: any): JSX.Element {
  const { i18n } = useLingui();
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  localStorage.setItem("isLimitOrder", isLimitOrder);

  return (
    <div className="flex justify-between mb-4 space-x-3">
      <div className="flex space-x-3 rounded-md p-3px gap-8">
        <TabExchange
          onClick={() => setLimitOrder(false)}
          isLimitOrder={!isLimitOrder}
        >
          <TitleExchange
            className="flex items-center justify-center font-semibold text-center rounded-md "
            onClick={isLimitOrder ? onChangeSwapTab : () => {}}
          >
            {i18n._(t`Swap`)}
          </TitleExchange>
        </TabExchange>
        <TabExchange
            onClick={() => setLimitOrder(true)}
            isLimitOrder={isLimitOrder}
          >
            <TitleExchange className="flex items-center justify-center font-semibold text-center rounded-md ">
              {i18n._(t`Limit`)}
            </TitleExchange>
          </TabExchange>
      </div>
      <div className="flex gap-2">
        {/* <RefreshButton onClick={open}
          ref={wrapperRef}
          onMouseEnter={open}
          data-tip={isMobile ? '' : (refresh  ? 'Auto refresh countdown' : 'Auto refresh')}
          data-for='refresh-tooltip'
          onMouseLeave={close}
          data-iscapture='true'
          
          >
          {refresh ? (
            <Countdown id="countdown" onClick={handleRefresh}>
              <svg>
                <circle r="8" cx="12" cy="14"></circle>
              </svg>
            </Countdown>
          ) : (
            <img src="/icons/icon-refresh.svg" alt="" onClick={handleRefresh} />
          )}
           <StyledReactTooltip id='refresh-tooltip' />
        </RefreshButton> */}

        <SettingButton className="flex items-center rounded">
          {/* <div className="grid grid-flow-col gap-3"> */}
          {/* {chainId === ChainId.MAINNET && (
            <div className="hidden md:flex space-x-3 items-center bg-dark-800 rounded-sm h-full w-full px-2 py-1.5 cursor-pointer">
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z"
                  fill="#7CFF6B"
                />
              </svg>

              <div className="hidden md:block text-green text-baseline">
                <Gas />
              </div>
            </div>
          )} */}

          {/* <button
                        onMouseEnter={() => setAnimateSettings(true)}
                        onMouseLeave={() => setAnimateSettings(false)}
                        className="flex items-center justify-center w-full h-full p-1 rounded-sm bg-dark-800 hover:bg-dark-700 md:px-2"
                    >
                        <Lottie
                            animationData={settingsAnimationData}
                            autoplay={animateSettings}
                            loop={false}
                            style={{ width: 28, height: 28 }}
                            className="transform rotate-90"
                        />
                    </button> */}
          {/* <button
                        onMouseEnter={() => setAnimateWallet(true)}
                        onMouseLeave={() => setAnimateWallet(false)}
                        className="items-center justify-center hidden w-full h-full px-2 rounded-sm md:flex bg-dark-800 hover:bg-dark-700"
                    >
                        <Lottie
                            animationData={profileAnimationData}
                            autoplay={animateWallet}
                            loop={false}
                            style={{ width: 24, height: 24 }}
                        />
                    </button> */}
          <div className="relative rounded-sm">
            <Settings placeholderSlippage={allowedSlippage} />
          </div>
          {/* </div> */}
        </SettingButton>
      </div>
    </div>
  );
}
