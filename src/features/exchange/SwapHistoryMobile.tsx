import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { handleTime } from "../../utils";
import { handleValue, linkTransaction } from "./SwapHistory";
import { useActiveWeb3React } from "../../hooks";
import { getNativePrice } from "../../functions/tokenPrice";
import NewTooltip from "../../components/NewTooltip";
import ExternalLink from "../../components/ExternalLink";
import FooterTable from "../../components/FooterTable";

const WrapMobile = styled.div`
  font-family: "SF UI Display";
  .box-item {
    border-bottom: 1px solid ${({ theme }) => theme.borderENSNamePopup};
    padding: 24px 0 10px 0;
  }
  .box-item:last-child {
    border: none;
  }
  .box-item:first-child {
    padding: 0px 0 10px 0;
  }

  max-height: 70vh;
  overflow-y: auto;
  padding: 0 15px;
`;

const LabelStyle = styled.p`
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.lblColor};
`;
const SwapStyle = styled(ExternalLink)`
  color: ${({ theme }) => theme.textActive};
  font-size: 12px;
  font-weight: normal;
`;
const PriceStyle = styled.p`
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.priceAdd};
`;
const TextTime = styled.p`
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.priceAdd};
`;
const HorizontalBar = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.borderENSNamePopup};
`;

export default function SwapHistoryMobile({
  dataSwapHistory,
  tabTitle,
  tableOptions,
  setTableOptions,
  dataSource,
  ethPrice
}) {
  const { chainId } = useActiveWeb3React();

  return (
    <>
      <WrapMobile>
        {dataSwapHistory &&
          dataSwapHistory.map((item: any) => (
            <>
              <div className="w-full box-item">
                <div className="flex justify-between items-center">
                  <LabelStyle>Swaps</LabelStyle>
                  <SwapStyle
                    href={`${linkTransaction(chainId)}${item.transaction.id}`}
                  >
                    Swap {item.token0.symbol} for{" "}
                    {item.token1.symbol}
                  </SwapStyle>
                </div>
                <div className="flex justify-between">
                  <LabelStyle>Total Value</LabelStyle>
                  <PriceStyle>
                    <NewTooltip
                      dataTip={ Number(ethPrice) *
                        (Number(item.amount0) * Number(item.token0.derivedETH) +
                          Number(item.amount1) * Number(item.token1.derivedETH))}
                      dataValue={
                        "$" +
                        handleValue( Number(ethPrice) *
                        (Number(item.amount0) * Number(item.token0.derivedETH) +
                          Number(item.amount1) * Number(item.token1.derivedETH)))
                      }
                    ></NewTooltip>
                  </PriceStyle>
                </div>
                <div className="flex justify-between">
                  <LabelStyle>Total Amount</LabelStyle>
                  <PriceStyle>
                    <NewTooltip
                      dataTip={item.amount0}
                      dataValue={
                        handleValue(item.amount0) +
                        " " +
                        item.token0.symbol
                      }
                    ></NewTooltip>
                  </PriceStyle>
                </div>
                <div className="flex justify-between">
                  <LabelStyle>Total Amount</LabelStyle>
                  <PriceStyle>
                    {" "}
                    <NewTooltip
                      dataTip={item.amount1}
                      dataValue={
                        handleValue(item.amount1) +
                        " " +
                        item.token1.symbol
                      }
                    ></NewTooltip>
                  </PriceStyle>
                </div>
                <div className="flex justify-between">
                  <LabelStyle>Time</LabelStyle>
                  <TextTime>
                    {" "}
                    {handleTime(item.transaction.timestamp)}
                    {}
                  </TextTime>
                </div>
              </div>
            </>
          ))}

        <FooterTable
          dataSource={dataSource}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
        />
      </WrapMobile>
    </>
  );
}
