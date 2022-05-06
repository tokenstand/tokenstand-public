import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { shortenAddress } from "../../../functions";
import { useReferralFarmFetch } from "../hooks/useReferralFarmFetch";
import { Spin } from "antd";
import FooterTable from "../../../components/FooterTable";
import { isMobile } from "react-device-detect";
import SearchBar from "./SearchBar";
import moment from "moment";
import NewTooltip from "../../../components/NewTooltip";
import copy from "copy-to-clipboard";
import { removeZero, toFixedNumber } from "../../../utils/decimalAdjust";
// images
const NoDataImage = "/icons/icon-stand.svg";

const Wrapper = styled.div`
  background: transparent;
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media screen and (min-width: 768px) {
    margin-bottom: 41px;
    flex-direction: row;
    align-items: center;
  }

  h2 {
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.primaryText2};
    margin-bottom: 16px;
    
    @media screen and (min-width: 768px) {
      font-size: 24px;
      margin-bottom: 0px;
    }
  }
  }
`;

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.referralTableBg};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  position: relative;
  padding: 0 10px 15px;

  @media screen and (min-width: 768px) {
    padding: 0 100px 23px 100px;
  }

  table {
    width: 100%;
    table-layout: fixed;

    thead {
      .total-earn {
        padding-left: 8px;
      }
      .claim-reward {
        padding-left: 15px;
      }
      th {
        color: ${({ theme }) => theme.referralTableHeader};
        text-align: left;
        font-weight: 500;
        padding: 15px 2.5px;
        font-size: 12px;
        width: 15%;

        :nth-child(n+2) {
          width: 30%;
        }

        @media screen and (min-width: 768px) {
          padding: 17px 10px 24px;
          font-size: 17px;
          width: 25%;
        }
      }
    }

    tbody {
      .table-row:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.borderItem};
      }

      .address {
        vertical-align: top;
        cursor: pointer;
        color: #0074df;

        @media screen and (min-width: 768px) {
          vertical-align: middle;
        }

        :hover {
          opacity: 0.7;
        }
      }

      tr {
        .total-earn-amount {
          padding-left: 8px;
        }

        .claim-reward-amount {
          padding-left: 15px;
        }
      }

      td {
        color: ${({ theme }) => theme.referralTableBody};
        padding: 14.5px 3px;
        font-weight: 500;
        font-size: 12.3px;

        @media screen and (min-width: 768px) {
          font-size: 17px;
          padding: 10px;
        }

        > div {
          display: flex;

          span {
            margin-left: 5px;
          }
        }
      }
    }
  }
`;

const Loading = styled.div`
  position: absolute;
  inset: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.referralTableBg};
  border-radius: 20px;

  span i {
    background-color: ${({ theme }) => theme.text9};
  }

  div {
    color: ${({ theme }) => theme.text9};
    font-weight: 500;
    font-size: 16px;
  }
`;

const NoData = styled.div`
  margin: 0 0 9px 0;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 100px 0;

  img,
  .text {
    visibility: ${({ loading }) => (loading ? "hidden" : "visible")};
  }

  .text {
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.referralTableHeader};
    margin-top: 16px;

    @media screen and (min-width: 768px) {
      font-size: 17px;
    }
  }

  img {
    opacity: 0.4;
    width: 53px;
    height: 68px;

    @media screen and (min-width: 768px) {
      width: 78px;
      height: 100px;
    }
  }
`;

const TooltipStyled = styled(NewTooltip)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const formatAmount = (amount: string) => {
  if (isNaN(Number(amount))) {
    return "0.000";
  }

  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
};

const ReferralFarm: React.FC = () => {
  const {
    account,
    chainId,
    tableOptions,
    userReferralFarmList,
    loading,
    setSearchTerm,
    setTableOptions,
  } = useReferralFarmFetch();

  const [isCopy, setCopy] = useState(0);

  const formatDatetime = (datetimeStr: string) => {
    return moment(datetimeStr).format("MM/DD/YY, h:mm:ss A");
  };

  const handleCopy = (address, index) => {
    copy(address);
    setCopy(index);
  };

  useEffect(() => {
    isCopy &&
      setTimeout(() => {
        setCopy(0);
      }, 500);
  }, [isCopy]);

  const getTableBody = () => {
    if (!userReferralFarmList.length) {
      return (
        <NoData loading={loading}>
          <Image src={NoDataImage} alt="icon-nodata" width="79" height="100" />
          <div className="text">No Data</div>

          {loading && (
            <Loading>
              <Spin tip="Loading..." />
            </Loading>
          )}
        </NoData>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            {!isMobile && <th>Datetime</th>}
            <th>Wallet</th>
            <th className="claim-reward">Farm Claimed Reward</th>
            <th className="total-earn">Total Earn</th>
          </tr>
        </thead>
        <tbody>
          {userReferralFarmList.map((userReferralFarm, index) => (
            <tr className="table-row" key={userReferralFarm.id}>
              {!isMobile && (
                <td>{formatDatetime(userReferralFarm.createdAt)}</td>
              )}
              <td
                className="address"
                onClick={() => handleCopy(userReferralFarm.ref_id, index + 1)}
              >
                {Number(isCopy) === index + 1 ? (
                  <div>Copied</div>
                ) : (
                  <u>
                    {shortenAddress(userReferralFarm.ref_id, isMobile ? 2 : 4)}
                  </u>
                )}
              </td>
              <td className="claim-reward-amount">
                {JSON.parse(userReferralFarm.ref_claimed).map((item, key) => (
                  <div key={key}>
                    <TooltipStyled
                      dataValue={toFixedNumber(item.amount, 4)}
                      dataTip={`${removeZero(item.amount)} ${item.symbol}`}
                    />
                    <span>{item.symbol}</span>
                  </div>
                ))}
              </td>
              <td className="total-earn-amount">
                {JSON.parse(userReferralFarm.total_earned).map((item, key) => (
                  <div key={key}>
                    <TooltipStyled
                      dataValue={toFixedNumber(item.amount, 4)}
                      dataTip={`${removeZero(item.amount)} ${item.symbol}`}
                    />
                    <span>{item.symbol}</span>
                  </div>
                ))}
              </td>
            </tr>
          ))}
          {loading && (
            <Loading>
              <Spin tip="Loading..." />
            </Loading>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <Wrapper>
      <Header>
        <h2>Farm Referral Reward List</h2>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Header>

      <TableWrapper>{getTableBody()}</TableWrapper>

      {(userReferralFarmList.length && (
        <FooterTable
          dataSource={userReferralFarmList}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={tableOptions.totalResults}
        />
      )) ||
        null}
    </Wrapper>
  );
};

export default ReferralFarm;
