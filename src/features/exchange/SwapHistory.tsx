import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { isMobile } from "react-device-detect";
import SwapHistoryMobile from "../exchange/SwapHistoryMobile";
import { client } from "../../services/graph/apollo/client";
import { transactionsSwapQuery } from "../../services/graph/queries/exchange";
import { Field } from "../../state/swap/actions";
import FooterTable from "../../components/FooterTable";
import { formattedNum, handleTime } from "../../utils";
import ModalTransaction from "../../components/AccountDetails/popupTransaction";
import NewTooltip from "../../components/NewTooltip";
import { getNativePrice } from "../../functions/tokenPrice";
import { NETWORK_LINK } from "../../constants/networks";

const TableRouting = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr 1fr"};
  grid-gap: 28px 8px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
  .rounded-full {
    height: 32px !important;
  }
  .color-gray {
    color: ${({ theme }) => theme.text1};
    opacity: 0.6;
    svg {
      fill: ${({ theme }) => theme.iconDropdown};
    }
  }
  .btn {
    font-weight: 600;
    font-size: 16px;
    width: 100%;
    height: 33px;
    text-transform: uppercase;
  }
`;

const LinkHistory = styled.a`
  font-weight: normal;
  font-size: 14px;
  color: #0074df;
  cursor: pointer;
`;

const HistoryItem = styled.div`
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText2};
  display: ${(props) => (props.isMobile ? "none" : "block")};
`;

const HistoryTime = styled(HistoryItem)`
  display: block;
`;

const iconSortESC = (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.24701 7.14L0.451011 1.658C-0.114989 1.013 0.345011 3.67706e-07 1.20401 3.67706e-07H10.796C10.9883 -0.000164459 11.1765 0.0550878 11.3381 0.159141C11.4998 0.263194 11.628 0.411637 11.7075 0.586693C11.7869 0.761749 11.8142 0.955998 11.7861 1.14618C11.758 1.33636 11.6757 1.51441 11.549 1.659L6.75301 7.139C6.65915 7.24641 6.5434 7.3325 6.41352 7.39148C6.28364 7.45046 6.14265 7.48098 6.00001 7.48098C5.85737 7.48098 5.71638 7.45046 5.5865 7.39148C5.45663 7.3325 5.34087 7.24641 5.24701 7.139V7.14Z"
      fill="#667795"
    />{" "}
  </svg>
);

const SortDESC = styled.div`
  svg {
    fill: ${({ theme }) => theme.iconDropdown};
    -ms-transform: rotate(180deg); /* IE 9 */
    transform: rotate(180deg);
  }
`;

const FieldTable = styled.div`
  display: ${(props) => (props.isMobile ? "none" : "flex")};
`;
export const TextWarning = styled.p`
  color: ${({ theme }) => theme.addText};
  margin: 0 0 9px 0;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     font-size: 12px;
 `};
`;

const TextAddress = styled.p`
  font-size: 14px;
  line-height: 126.5%;
  letter-spacing: 0.015em;
  cursor: pointer;

  color: ${({ theme }) => theme.textActive};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     font-size: 10px;
 `};
`;

const FieldTime = styled.div``;

const iconSortDESC = <SortDESC> {iconSortESC}</SortDESC>;

const SORT_FIELD = {
  VALUE: "amountUSD",
  AMOUNT0: "amount0",
  AMOUNT1: "amount1",
  TIMESTAMP: "timestamp",
};

export const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const linkTransaction = (chainId) => {
  return `${NETWORK_LINK[chainId]}/tx/`;
};

export const handleValue = (value) => {
  let valueNew = value.toString();

  if (valueNew.length > 8) {
    valueNew = valueNew.substring(0, 8) + "...";
  }

  return valueNew;
};
let transactions = [];

export default function SwapHistory({
  currencies,
  input,
  output,
  tabTitle,
  amount,
}) {
  const { account, chainId } = useActiveWeb3React();
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState(true);
  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 10,
    itemStart: 1,
    itemEnd: isMobile ? 5 : 10,
    totalPage: null,
  });

  const [swapHistory, setSwapHistory] = useState([]);
  const [isOpenTransaction, setIsOpenTransaction] = useState(false);

  const handleOpenTransaction = () => {
    setIsOpenTransaction(true);
  };

  const onDismissTransaction = () => {
    setIsOpenTransaction(false);
  };

  const token0 = currencies[Field.INPUT]?.isNative
    ? "0x0000000000000000000000000000000000000000"
    : currencies[Field.INPUT]?.address.toLowerCase();
  const token1 = currencies[Field.OUTPUT]?.isNative
    ? "0x0000000000000000000000000000000000000000"
    : currencies[Field.OUTPUT]?.address.toLowerCase();

  const getSwapTransactions = async () => {
    try {
      let result = await client(chainId).query({
        query: transactionsSwapQuery,
        variables: {
          account: account,
          desc: sortDirection ? "desc" : "asc",
          field: sortField,
          token0: token0,
          token1: token1,
        },
        fetchPolicy: "cache-first",
      });
      transactions = result?.data?.swaps;

      setSwapHistory(transactions);
      setTableOptions({
        ...tableOptions,
        totalPage: Math.ceil(transactions.length / tableOptions.pageSize),
      });
    } catch (e) {
      console.log(e);
    }
    return transactions;
  };

  useEffect(() => {
    getSwapTransactions();
  }, [currencies, sortDirection]);

  const [ethPrice, setEthPrice] = useState<any>();

  const fetchPrice = async (chainId) => {
    const price = await getNativePrice(chainId);
    setEthPrice(price);
  };

  useEffect(() => {
    fetchPrice(chainId);
  }, [tabTitle, chainId]);

  const getDataSource = (current, pageSize) => {
    return swapHistory.slice((current - 1) * pageSize, current * pageSize);
  };
  return swapHistory?.length > 0 ? (
    isMobile ? (
      <SwapHistoryMobile
        dataSource={swapHistory}
        dataSwapHistory={getDataSource(
          tableOptions.current,
          tableOptions.pageSize
        )}
        tabTitle={tabTitle}
        tableOptions={tableOptions}
        setTableOptions={setTableOptions}
        ethPrice={ethPrice}
      />
    ) : (
      <>
        <TableRouting isMobile={isMobile}>
          <div className="text-left  color-gray">Swap</div>

          <FieldTable
            className="text-left color-gray cursor-pointer flex items-center"
            onClick={() => {
              setSortField(SORT_FIELD.VALUE);
              setSortDirection(
                sortField !== SORT_FIELD.VALUE ? true : !sortDirection
              );
            }}
            isMobile={isMobile}
          >
            <div className="pr-3">Total Value</div>
            {sortField === SORT_FIELD.VALUE
              ? !sortDirection
                ? iconSortDESC
                : iconSortESC
              : ""}
          </FieldTable>

          <FieldTable
            className="text-left color-gray cursor-pointer flex items-center"
            onClick={() => {
              setSortField(SORT_FIELD.AMOUNT0);
              setSortDirection(
                sortField !== SORT_FIELD.AMOUNT0 ? true : !sortDirection
              );
            }}
            isMobile={isMobile}
          >
            <div className="pr-3">Total Amount</div>
            {sortField === SORT_FIELD.AMOUNT0
              ? !sortDirection
                ? iconSortDESC
                : iconSortESC
              : ""}
          </FieldTable>

          <FieldTable
            className="text-left color-gray cursor-pointer flex items-center"
            onClick={() => {
              setSortField(SORT_FIELD.AMOUNT1);
              setSortDirection(
                sortField !== SORT_FIELD.AMOUNT1 ? true : !sortDirection
              );
            }}
            isMobile={isMobile}
          >
            <div className="pr-3">Total Amount</div>
            {sortField === SORT_FIELD.AMOUNT1
              ? !sortDirection
                ? iconSortDESC
                : iconSortESC
              : ""}
          </FieldTable>

          <FieldTime
            className=" color-gray cursor-pointer flex items-center justify-center"
            onClick={() => {
              setSortField(SORT_FIELD.TIMESTAMP);
              setSortDirection(
                sortField !== SORT_FIELD.TIMESTAMP ? true : !sortDirection
              );
            }}
            isMobile={isMobile}
          >
            <div className="pr-3">Time</div>
            {sortField === SORT_FIELD.TIMESTAMP
              ? !sortDirection
                ? iconSortDESC
                : iconSortESC
              : ""}
          </FieldTime>
          {swapHistory &&
            getDataSource(tableOptions.current, tableOptions.pageSize).map(
              (item) => (
                <>
                  <div>
                    <LinkHistory
                      href={`${linkTransaction(chainId)}${item.transaction.id}`}
                      target="blank"
                    >
                      {" "}
                      Swap {item.token0.symbol} for {item.token1.symbol}
                    </LinkHistory>
                  </div>

                  <HistoryItem isMobile={isMobile}>
                    <NewTooltip
                      dataTip={
                        Number(ethPrice) *
                        (Number(item.amount0) * Number(item.token0.derivedETH) +
                          Number(item.amount1) * Number(item.token1.derivedETH))
                      }
                      dataValue={
                        "$" +
                        handleValue(
                          Number(ethPrice) *
                            (Number(item.amount0) *
                              Number(item.token0.derivedETH) +
                              Number(item.amount1) *
                                Number(item.token1.derivedETH))
                        )
                      }
                    ></NewTooltip>
                  </HistoryItem>

                  <HistoryItem isMobile={isMobile}>
                    <NewTooltip
                      dataTip={item.amount0}
                      dataValue={
                        handleValue(item.amount0) + " " + item.token0.symbol
                      }
                    ></NewTooltip>
                  </HistoryItem>

                  <HistoryItem isMobile={isMobile}>
                    <NewTooltip
                      dataTip={item.amount1}
                      dataValue={
                        handleValue(item.amount1) + " " + item.token1.symbol
                      }
                    ></NewTooltip>
                  </HistoryItem>

                  <HistoryTime className="text-center" isMobile={isMobile}>
                    {handleTime(item.transaction.timestamp)}
                  </HistoryTime>
                </>
              )
            )}
        </TableRouting>
        <FooterTable
          dataSource={swapHistory}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
        />
      </>
    )
  ) : account ? (
    <div className="flex flex-col items-center justify-center py-12">
      <TextWarning>
        Can&apos;t find any swaps for {input?.symbol}/{output?.symbol} pair
      </TextWarning>
      <TextAddress onClick={handleOpenTransaction}>
        View full transaction history
      </TextAddress>
      <ModalTransaction
        isOpenTransaction={isOpenTransaction}
        onDismissTransaction={onDismissTransaction}
        tabSwap={1}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12">
      <TextWarning>
        Please connect your wallet to see your transactions history
      </TextWarning>
    </div>
  );
}
