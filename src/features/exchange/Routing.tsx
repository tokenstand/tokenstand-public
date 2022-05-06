import React from "react";
import styled from "styled-components";
import { BigNumber } from "@ethersproject/bignumber";
import PriceTable from "./PriceTable";
import { useRoutingModalToggle } from "../../state/application/hooks";
import RoutingModal from "../../components/RoutingModal";
import SubTitle from "./SubTitle";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import { useIsDarkMode } from "../../state/user/hooks";
import { useChainId } from "../../hooks";
import { isMobile } from "react-device-detect";

export const StyleRouting = styled.div`
  font-family: "SF UI Display";
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border1};
  padding: 30px 40px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
  @media (max-width: 1023px) {
    margin-top: 33px;
    margin-bottom: 33px;
  }
  h3 {
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.text1};
  }
  @media (max-width: 767px) {
    padding: 0;
    overflow: hidden;
  }
`;

export const Title = styled.div`
  h2 {
    font-weight: 700;
    font-size: 24px;
    color: ${({ theme }) => theme.text1};
  }
  .icon-full-screen {
    cursor: pointer;
    path {
      fill: ${({ theme }) => theme.text1};
    }
  }
  @media (max-width: 767px) {
    padding: 20px 15px 0;
    h2 {
      font-size: 18px;
      margin-bottom: 0;
    }
  }
`;

const chainIDETH = [1, 4];
const chainBSC = [56, 97];
export default function Routing({
  routeData,
  currencies,
  amount,
  setSavedCost,
  platforms,
  showWrap,
  notFound,
  unitPrice,
  amountReturn,
  showNotFound,
  loadingPrice,
  loadingBestPrice,
  amountRawFormat,
}) {
  const { chainId } = useChainId();
  const toggleRouting = useRoutingModalToggle();
  const { i18n } = useLingui();
  const darkMode = useIsDarkMode();

  const iconLoading = chainBSC.includes(chainId)
    ? `/icons/loading-bsc-${darkMode}.gif`
    : `/icons/loading-big-${darkMode}.gif`;

  // const notFound = BigNumber.from(bestAmount ? bestAmount : 1).isZero();
  return (
    <StyleRouting>
      <Title className="flex items-center justify-between">
        <h2>{i18n._(t`Routing`)}</h2>
        {!showWrap && !notFound && amountRawFormat !== 0 ? (
          <span
            className="icon-full-screen"
            onClick={unitPrice === 0 ? null : toggleRouting}
          >
            <svg width="22" height="22" viewBox="0 0 22 22">
              <path d="M4.125 8.25H2.75V2.75H8.25V4.125H4.125V8.25Z" />
              <path d="M19.25 8.25H17.875V4.125H13.75V2.75H19.25V8.25Z" />
              <path d="M8.25 19.25H2.75V13.75H4.125V17.875H8.25V19.25Z" />
              <path d="M19.25 19.25H13.75V17.875H17.875V13.75H19.25V19.25Z" />
            </svg>
          </span>
        ) : (
          <></>
        )}
      </Title>

      {loadingBestPrice && amount !== "" ? (
        <div className="wrap-flex style-scroll-bar flex items-center justify-center w-full h-full pb-14">
          <img
            src={iconLoading}
            alt={"Loading"}
            width={isMobile ? "200px" : "350px"}
            height={isMobile ? "200px" : "350px"}
          />
        </div>
      ) : (
        <>
          {showNotFound && amount ? (
            <h3 className="text-center p-6 opacity-60">
              {i18n._(t`No Routings Found`)}
            </h3>
          ) : (
            <SubTitle
              routeData={routeData}
              currencies={currencies}
              unitPrice={unitPrice}
            />
          )}

          <PriceTable
            platforms={platforms}
            setSavedCost={setSavedCost}
            currencies={currencies}
            notFound={notFound}
            amount={amount}
            showWrap={showWrap}
            loadingBestPrice={loadingBestPrice}
            amountReturn={amountReturn}
            showNotFound={showNotFound}
            loadingPrice={loadingPrice}
            amountRawFormat={amountRawFormat}
            bestAmount={
              routeData?.totalReturnAmount
                ? BigNumber.from(routeData?.totalReturnAmount?.hex)
                : null
            }
          />
        </>
      )}

      <RoutingModal routeData={routeData} currencies={currencies} />
    </StyleRouting>
  );
}
