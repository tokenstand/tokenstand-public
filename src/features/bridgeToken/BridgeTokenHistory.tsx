import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import ModalHeader from "../../components/ModalHeader";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { linkTransaction } from "../exchange/SwapHistory";
import { getChainIdToByChainId } from "../../pages/bridge-token";
import { formatEther } from "ethers/lib/utils";
import { Spin, Empty } from "antd";
import { useActiveWeb3React } from "../../hooks";
import NewTooltip from "../../components/NewTooltip";
import BridgeTokenHistoryMobile from "./BridgeTokenHistoryMobile";
import FooterTable from "../../components/FooterTable";
import axios from "axios";

const TableRouting = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isMobile ? "1fr 1fr" : "140px 120px 150px 130px 70px 70px"};
  font-size: ${(props) => (props.isMobile ? "12px" : "16px")};
  grid-gap: 18px 8px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const FieldTable = styled.div`
  font-weight: 600;
`;
const FieldItem = styled.div`
  color: ${({ theme }) => theme.primaryText2};
`;
const Loading = styled.div`
  span {
    i {
      background-color: ${({ theme }) => theme.text9};
    }
  }
  div {
    color: ${({ theme }) => theme.text9};
    font-weight: 500;
    font-size: 16px;
  }
`;

const IconNoData = styled.div`
  margin: 0 0 9px 0;
  font-size: 16px;
  .ant-empty-description {
    color: ${({ theme }) => theme.text6};
  }
`;
export const Type = styled.div`
  color: ${(props) => (props?.type === "Sender" ? "#44B1F0" : "#948cfc")};
  font-weight: 600;
`;
const TxHash = styled.a``;
const Amount = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  .value-number {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const Status = styled.div`
  text-transform: capitalize;
  color: ${(props) => (props?.status === "completed" ? "#72BF65" : "#F3BB32")};
  font-weight: 600;
`;
export const shortenAddress = (address = "", start = 8, chars = 4) => {
  return `${address?.substring(0, start)}...${address?.substring(
    address.length - chars
  )}`;
};

export default function BridgeTokenHistoryModal({ isOpen, onDismiss }) {
  const [historyData, setHistoryData] = useState([]);
  const { account, chainId } = useActiveWeb3React();
  const [loading, setLoading] = useState(true);

  const [totalItem, setTotalItem] = useState(null);
  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 10,
    itemStart: 1,
    itemEnd: isMobile ? 5 : 10,
    totalPage: null,
  });

  const getHistoryBridgeToken = async () => {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BRIDGE_TOKEN}/api/history`,
        {
          params: {
            limit: tableOptions.pageSize,
            page: tableOptions.current,
            address: account,
            chainId: chainId,
          },
        }
      );
      if (result.status === 200) {
        setHistoryData(result?.data.data);
        setLoading(false);
        setTotalItem(result?.data.total);
        setTableOptions({
          ...tableOptions,
          totalPage: Math.ceil(result?.data.total / tableOptions.pageSize),
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistoryBridgeToken();
  }, [tableOptions.pageSize, tableOptions.current, account]);

  const handleType = (from, to, chainIdSender) => {
    const fromAddress = from.toLowerCase();
    const toAddress = to.toLowerCase();
    const accountReal = account.toLowerCase();
    if (fromAddress === accountReal && chainId === chainIdSender) {
      return "Sender";
    } else if (toAddress === accountReal && chainId !== chainIdSender) {
      return "Receiver";
    }
  };

  return (
    <Modal onDismiss={onDismiss} isOpen={isOpen} maxWidth={800} maxHeight={80}>
      <ModalHeader onClose={onDismiss} title="Bridge Token History" />
      {historyData && historyData.length > 0 ? (
        isMobile ? (
          <BridgeTokenHistoryMobile
            historyData={historyData}
            handleType={handleType}
          />
        ) : (
          <TableRouting isMobile={isMobile}>
            <FieldTable>
              <FieldItem>Input Transaction</FieldItem>
            </FieldTable>
            <FieldTable>
              <FieldItem>Input Amount</FieldItem>
            </FieldTable>
            <FieldTable>
              <FieldItem>Output Transaction</FieldItem>
            </FieldTable>
            <FieldTable>
              <FieldItem>Output Amount</FieldItem>
            </FieldTable>
            <FieldTable>
              <FieldItem>Type</FieldItem>
            </FieldTable>
            <FieldTable>
              <FieldItem>Status</FieldItem>
            </FieldTable>
            {historyData.map((item) => (
              <>
                <TxHash
                  href={`${linkTransaction(item.chainId)}${item.txHash}`}
                  target="blank"
                >
                  {shortenAddress(item.txHash)}
                </TxHash>
                <Amount className="input-amount">
                  <NewTooltip
                    dataTip={formatEther(item.amount)}
                    dataValue={formatEther(item.amount)}
                    className="value-number"
                  />
                </Amount>
                <TxHash
                  href={
                    item.txSwapHash &&
                    `${linkTransaction(getChainIdToByChainId(item.chainId))}${
                      item.txSwapHash
                    }`
                  }
                  target="blank"
                >
                  {item.txSwapHash
                    ? shortenAddress(item.txSwapHash)
                    : ".............................."}
                </TxHash>
                <Amount className="output-amount">
                  {item.txSwapHash ? (
                    <NewTooltip
                      dataTip={formatEther(item.outAmount)}
                      dataValue={formatEther(item.outAmount)}
                      className="value-number"
                    />
                  ) : (
                    ".............................."
                  )}
                </Amount>
                <Type type={handleType(item.from, item.to, item.chainId)}>
                  {handleType(item.from, item.to, item.chainId)}
                </Type>
                <Status status={item.status}>{item.status}</Status>
              </>
            ))}
          </TableRouting>
        )
      ) : (
        <>
          <div className="flex flex-col items-center justify-center py-11">
            {loading ? (
              <Loading>
                <Spin tip="Loading..." />
              </Loading>
            ) : (
              <IconNoData>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </IconNoData>
            )}
          </div>
        </>
      )}
      {loading || historyData.length === 0 ? (
        ""
      ) : (
        <FooterTable
          dataSource={historyData}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={totalItem}
          isBridge={true}
        />
      )}
    </Modal>
  );
}
