import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import Image from "next/image";
import SortETH from "./SortETH";
import { Field } from "../../state/swap/actions";
import ROUTER_ABI from "../../constants/abis/router.json";
import {
  useActiveWeb3React,
  useContract,
  useMulticall,
  useMulticallContract,
} from "../../hooks";
import usePrice from "./usePrice";
import getPrices from "./usePrice";
import { BigNumber, BigNumberish, FixedNumber } from "@ethersproject/bignumber";
import { orderBy } from "lodash";
import {
  SUSHI_ROUTER_ADDRESS,
  UNI_V1_ROUTER_ADDRESS,
  UNI_V2_ROUTER_ADDRESS,
  WRAP_NATIVE_TOKEN_ADDRESS,
} from "../../constants";
import SwapHistory from "./SwapHistory";
import FooterTable from "../../components/FooterTable";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";
import { isMobile } from "react-device-detect";
import MemoImage from "../../components/Image/MemoImage";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";

export const TabTitle = styled.div`
  margin-bottom: ${isMobile ? ' 17px' : '30px'};
  margin-top: 10px;
  span {
    display: inline-block;
    position: relative;
    padding-bottom: 5px;
    margin-right: 40px;
    opacity: 0.6;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &.active {
      opacity: 1;
      border-bottom: 2px solid ${({ theme }) => theme.primary1};
    }
  }
  @media (max-width: 767px) {
    padding: 0 15px;
    span {
      margin-right: 10px;
    }
  }
`;
const NotFound = styled.h3`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.text1};
`;
const TableRouting = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr 1fr 90px;
  grid-gap: 28px 8px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
  @media (max-width: 767px) {
    padding: 0 15px;
  }
  .rounded-full {
    height: 32px !important;
  }
  .grid-first-2 {
    grid-column: 1 / span 2;
  }
  .color-gray {
    color: ${({ theme }) => theme.text1};
    opacity: 0.6;
  }
  .btn {
    font-weight: 600;
    font-size: 16px;
    width: 100%;
    height: 33px;
    text-transform: uppercase;
  }
  .bg-blue {
    background: rgba(0, 116, 223, 0.1);
    color: rgba(0, 116, 223, 1);
  }
  @media (min-width: 768px) {
    .routing-value {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column: 2 / span 2;
      grid-column-gap: 8px;
    }
  }
  @media (max-width: 767px) {
    grid-template-columns: 32px 1fr 90px;
    grid-gap: 15px 8px;
    .grid-first-2 {
      display: none;
    }
    .color-gray:nth-child(2) {
      grid-column: 1 / span 2;
    }
    .routing-value {
      > span {
        font-size: 14px;
        line-height: 20px;
        word-break: break-word;
      }
      .color-value {
        color: ${({ theme }) => theme.primaryText3};
      }
    }
  }
  @media (max-width: 440px) {
    grid-template-columns: 32px 1fr 65px;
    .btn {
      font-size: 12px;
    }
  }
`;

export default function PriceTable({
  currencies,
  bestAmount,
  amount,
  setSavedCost,
  platforms,
  showWrap,
  notFound,
  showNotFound,
  amountReturn,
  amountRawFormat,
  loadingBestPrice,
  loadingPrice,
}) {
  const [tabTitle, setTabTitle] = useState<string>("Exchange");
  const [textSort, setTextSort] = useState<string>(
    `${currencies[Field.INPUT]?.symbol}/${currencies[Field.OUTPUT]?.symbol}`
  );
  const { i18n } = useLingui();
  const input = currencies[Field.INPUT];
  const output = currencies[Field.OUTPUT];
  if (input && output) {
  }
  const loadData = amount;
  const realAmount = amount
    ? parseEther(formatUnits(amount, currencies[Field.INPUT]?.decimals))
    : BigNumber.from("1000000000000000000").toString();
  const bestAmountReal = bestAmount ? bestAmount?.toString() : "0";
  const bestAmoutEther = formatUnits(
    bestAmountReal,
    currencies[Field.OUTPUT]?.decimals
  );

  const price1Inch = FixedNumber.from(
    formatUnits(bestAmountReal, currencies[Field.OUTPUT]?.decimals)
  )
    .divUnsafe(
      FixedNumber.from(
        Number(formatUnits(realAmount, currencies[Field.INPUT]?.decimals)) === 0
          ? "10000000000000000"
          : formatUnits(realAmount, 18)
      )
    )
    .toString();
  const handleSort = async (text?: string) => {
    setTextSort(text);
  };
  const isExchange = tabTitle === "Exchange";
  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: 10,
    itemStart: 1,
    itemEnd: platforms?.length < 10 ? platforms?.length : 10,
    totalPage: platforms && Math.ceil(platforms.length / 10),
  });

  return (
    <>
      {!showWrap && (
        <>
          <TabTitle>
            <span
              className={`${isExchange ? "active" : ""}`}
              onClick={() => setTabTitle("Exchange")}
            >
              Exchanges
            </span>
            <span
              className={`${!isExchange ? "active" : ""}`}
              onClick={() => setTabTitle("Swap")}
            >
              {`${i18n._(t`Swap History`)} (${input?.symbol}/${
                output?.symbol
              })`}
            </span>
          </TabTitle>
          {tabTitle === i18n._(t`Exchange`) ? (
            !notFound &&
            realAmount &&
            Number(realAmount) !== 0 &&
            (Number(price1Inch) != 0 ||
              loadingBestPrice ||
              Number(amountRawFormat) == 0) ? (
              <>
                <TableRouting>
                  <div className="grid-first-2 color-gray">
                    {i18n._(t`Name`)}
                  </div>
                  <SortETH
                    textSort={textSort}
                    onSort={handleSort}
                    currencyA={input?.symbol}
                    currencyB={output?.symbol}
                  />
                  <div className="text-center color-gray">
                    {i18n._(t`Diff`)}
                  </div>
                  {/* {loadingPrice && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/icons/icon-loader.gif`}
                      alt={"Loading"}
                      width="40px"
                      height="40px"
                      style={{ margin: "auto" }}
                    />
                  )} */}

                  {amount ? (
                    <>
                      {" "}
                      <div className="flex icon-routing items-center">
                        <Image
                          className="rounded-full"
                          src="/icons/tokenstand_circle_logo.png"
                          alt="Tokenstand"
                          width="32px"
                          height="32px"
                        />
                      </div>
                      <div className="routing-value">
                        <span className="flex items-center">TokenStand</span>
                        <span className="flex items-center color-value">
                          {!loadingBestPrice
                            ? price1Inch.toString().indexOf("e") !== -1
                              ? price1Inch
                              : price1Inch
                            : "-"}
                        </span>
                      </div>
                      <div className="routing-diff flex items-center">
                        <span className="btn btn-primary2 flex items-center justify-center">
                          {loadingBestPrice ? "-" : "Best"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {platforms &&
                    Array.isArray(platforms) &&
                    platforms
                      .filter((platform) => platform.price !== '0')
                      .map(
                      (platform) =>
                        platform?.price && (
                          <>
                            <div className="flex icon-routing items-center">
                              <MemoImage
                                className="rounded-full"
                                src={platform.logo}
                                alt={platform.name}
                                width="32px"
                                height="32px"
                              />
                            </div>
                            <div className="routing-value">
                              <span className="flex items-center">
                                {platform.name}
                              </span>
                              <span className="flex items-center color-value">
                                {Number(realAmount) === 0
                                  ? platform.amount
                                  : FixedNumber.from(platform.amount)
                                      .divUnsafe(FixedNumber.from(realAmount))
                                      .toString()}
                              </span>
                            </div>
                            {bestAmoutEther ==
                            formatUnits(platform.amount, 18) && amount ? (
                              <div className="routing-diff flex items-center">
                                <span className="btn btn-primary2 flex items-center justify-center bg-blue">
                                  {!loadingBestPrice ? "Match" : "-"}
                                </span>
                              </div>
                            ) : !loadingBestPrice && amount ? (
                              <div className="routing-diff flex items-center">
                                <span className="btn btn-red2 flex items-center justify-center">
                                  {platform.diff > 0 && "-"}
                                  {platform.diff < 0.001
                                    ? "<0.001"
                                    : platform.diff}
                                  %
                                </span>
                              </div>
                            ) : (
                              <div className="routing-diff flex items-center">
                                <span className="btn btn-primary2 flex items-center justify-center">
                                  -
                                </span>
                              </div>
                            )}
                          </>
                        )
                    )}
                </TableRouting>
                {isMobile ? (
                  ""
                ) : (
                  // <FooterTable
                  //   dataSource={platforms}
                  //   tableOptions={tableOptions}
                  //   setTableOptions={setTableOptions}
                  //   className="sm:block hidden"
                  // />
                  // <Pagination
                  //   sizePerPage={
                  //     amount
                  //       ? 1 +
                  //         platforms.filter((platform) => {
                  //           return platform.price;
                  //         }).length
                  //       : platforms.filter((platform) => {
                  //           return platform.price;
                  //         }).length
                  //   }
                  // />
                  <></>
                )}
              </>
            ) : (
              <>
                <NotFound className="text-center opacity-60 p-10">
                  {i18n._(t`No Results Found`)}
                </NotFound>
              </>
            )
          ) : (
            <>
              <SwapHistory
                amount={amount}
                currencies={currencies}
                input={input}
                output={output}
                tabTitle={tabTitle}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
