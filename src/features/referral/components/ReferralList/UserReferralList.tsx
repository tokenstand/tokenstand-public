import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Spin } from "antd";
import Image from "next/image";
import FooterTable from "../../../../components/FooterTable";
import { shortenAddress } from "../../../../functions";
import { UserReferral } from "../../hooks/useReferralListFetch";
import SearchBar from "../SearchBar";
import { ChainId } from "@sushiswap/sdk";
import { isMobile } from "react-device-detect";
import NewTooltip from "../../../../components/NewTooltip";
import copy from "copy-to-clipboard";
import { removeZero, toFixedNumber } from "../../../../utils/decimalAdjust";
// images
const NoDataImage = "/icons/icon-stand.svg";

const Wrapper = styled.div`
  background: transparent;
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: grid;
  grid-template-areas:
    'heading'
    'sub-heading'
    'search-bar';
  margin-bottom: 24px;

  @media screen and (min-width: 768px) {
    margin-bottom: 32px;
    grid-template-areas:
      'heading search-bar'
      'sub-heading sub-heading';
  }

  h2 {
    grid-area: heading;
    align-self: center;
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.primaryText2};
    margin-bottom: 20px;
    
    @media screen and (min-width: 768px) {
      font-size: 24px;
      margin-bottom: 0;
    }
  }
  
  p {
    grid-area: sub-heading;
    color: #EC5656;
    font-size: 14px;
    margin-bottom: 20px;

    @media screen and (min-width: 768px) {
      font-size: 17px;
      margin-bottom: 0;
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
      th {
        color: ${({ theme }) => theme.referralTableHeader};
        text-align: left;
        font-weight: 500;
        padding: 15px 3.5px;
        font-size: 12px;
        width: 25%;

        @media screen and (min-width: 768px) {
          padding: 17px 10px 24px;
          font-size: 17px;
        }
      }
    }

    tbody {
      .wallet-address {
        cursor: pointer;
        color: #0074df;

        :hover {
          opacity: 0.7;
        }
      }

      td {
        color: ${({ theme }) => theme.referralTableBody};
        font-weight: 500;
        font-size: 12.3px;
        padding: 10px 2.5px;

        @media screen and (min-width: 768px) {
          font-size: 17px;
          padding: 10px;
        }
      }
    }
  }
`;

const Status = styled.div`
  ${({ status }) => `
    color: ${status === StatusEnum.ACTIVE ? "#72BF65" : "#EC5656"};
    background: ${
      status === StatusEnum.ACTIVE
        ? "rgba(114, 191, 101, 0.2)"
        : "rgba(236, 86, 86, 0.2)"
    };
  `}
  display: inline-block;
  padding: 8px 10px;
  border-radius: 500px;
  font-size: 12px;

  @media screen and (min-width: 768px) {
    padding: 10px 16px;
    font-size: 17px;
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

enum StatusEnum {
  ACTIVE = "active",
  INACTIVE = "in_active",
}

const StatusLabels = {
  [StatusEnum.ACTIVE]: "Active",
  [StatusEnum.INACTIVE]: "Inactive",
};

type Props = {
  account: string;
  chainId: ChainId;
  tableOptions: any;
  userReferralList: UserReferral[];
  loading: boolean;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setTableOptions: React.Dispatch<React.SetStateAction<any>>;
};

const UserReferralList: React.FC<Props> = ({
  account,
  chainId,
  tableOptions,
  userReferralList,
  loading,
  setSearchTerm,
  setTableOptions,
}) => {
  const [isCopy, setCopy] = useState(0);

  const formatAmount = (amount: string) => {
    if (isNaN(Number(amount))) {
      return "$0.000";
    }

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    return formatter.format(Number(amount));
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
    if (!userReferralList.length) {
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
            <th>Wallet</th>
            <th>Swap Amount</th>
            <th>Farm Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {userReferralList.map((userReferral, index) => (
            <tr key={userReferral.id}>
              <td
                className="wallet-address"
                onClick={() => handleCopy(userReferral.ref_id, index+1)}
              >
                {Number(isCopy) === index+1 ? (
                  <div>Copied</div>
                ) : (
                  <u>{shortenAddress(userReferral.ref_id, isMobile ? 2 : 4)}</u>
                )}
              </td>
              <td>
                <TooltipStyled
                  dataValue={toFixedNumber(userReferral.swap_amount, 4)}
                  dataTip={removeZero(userReferral.swap_amount)}
                />
              </td>
              <td>
                <TooltipStyled
                  dataValue={toFixedNumber(userReferral.farm_amount, 4)}
                  dataTip={removeZero(userReferral.farm_amount)}
                />
              </td>
              <td>
                <Status status={userReferral.status}>
                  {StatusLabels[userReferral.status]}
                </Status>
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
        <h2>User Referral List</h2>
        <p>*  Notice: Swap and Farm Amount will stop being synced since user is actived</p>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Header>

      <TableWrapper>{getTableBody()}</TableWrapper>

      {(userReferralList.length && (
        <FooterTable
          dataSource={userReferralList}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={tableOptions.totalResults}
        />
      )) ||
        null}
    </Wrapper>
  );
};

export default UserReferralList;
