import React from "react";
import styled from "styled-components";
import { shortenAddress, Status, Type } from "./BridgeTokenHistory";
import { formatEther } from "ethers/lib/utils";
import { linkTransaction } from "../exchange/SwapHistory";
import { getChainIdToByChainId } from "../../pages/bridge-token";
import NewTooltip from "../../components/NewTooltip";

const WrapperMobile = styled.div`
  .box-item {
    border-bottom: 1px solid ${({ theme }) => theme.borderENSNamePopup};
    padding: 10px 0 10px 0;
  }
  height: 40vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const FieldLable = styled.p`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
`;
const FieldValue = styled.div`
  .value-number {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 105px;
    text-align: right;
    color: ${({ theme }) => theme.primaryText2};
  }
`;
const TxHash = styled.a``;

export default function BridgeTokenHistoryMobile({
  historyData,
  handleType,
}): JSX.Element {
  return (
    <WrapperMobile>
      {historyData.map((item: any) => (
        <>
          <div className="w-full box-item">
            <div className="flex justify-between">
              <FieldLable>Input Transaction</FieldLable>
              <TxHash
                href={`${linkTransaction(item.chainId)}${item.txHash}`}
                target="blank"
              >
                {shortenAddress(item.txHash)}
              </TxHash>
            </div>

            <div className="flex justify-between">
              <FieldLable>Input Amount</FieldLable>
              <FieldValue>
                <NewTooltip
                  dataTip={formatEther(item.amount)}
                  dataValue={formatEther(item.amount)}
                  className="value-number"
                />
              </FieldValue>
            </div>

            <div className="flex justify-between">
              <FieldLable>Output Transaction</FieldLable>
              <TxHash
                href={
                  item.txSwapHash &&
                  `${linkTransaction(getChainIdToByChainId(item.chainId))}${
                    item.txSwapHash
                  }`
                }
                target="blank"
              >
                {item.txSwapHash ? shortenAddress(item.txSwapHash) : "..."}
              </TxHash>
            </div>

            <div className="flex justify-between">
              <FieldLable>Output Amount</FieldLable>
              <FieldValue>
                {item.txSwapHash ? (
                  <NewTooltip
                    dataTip={formatEther(item.outAmount)}
                    dataValue={formatEther(item.outAmount)}
                    className="value-number"
                  />
                ) : (
                  <div className="value-number">...</div>
                )}
              </FieldValue>
            </div>

            <div className="flex justify-between">
              <FieldLable>Type</FieldLable>
              <Type type={handleType(item.from, item.to, item.chainId)}>
                {handleType(item.from, item.to, item.chainId)}
              </Type>
            </div>

            <div className="flex justify-between">
              <FieldLable>Status</FieldLable>
              <Status status={item.status}>{item.status}</Status>
            </div>
          </div>
        </>
      ))}
    </WrapperMobile>
  );
}
