import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import ModalHeader from "../../../components/ModalHeader";
import styled from "styled-components";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { isMobile } from "react-device-detect";
import moment from "moment";
import FooterTable from "../../../components/FooterTable";
import { Spin, Empty } from "antd";
import NewTooltip from "../../../components/NewTooltip";
import { formatAmount } from "./ReferralFarm";
import Image from 'next/image';
import { removeZero, toFixedNumber } from "../../../utils/decimalAdjust";
// images
const TokenStandLogo = '/icons/tokenstand_circle_logo.png';

const Wrapper = styled.div`
padding: 20px 20px 26px;
  background: ${({ theme }) => theme.bgInput};
  border-radius: 20px;

  @media screen and (min-width: 768px) {
    padding: 40px 8px 46px 40px;
  }
`;
const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 0.75fr 1fr 1fr;
  gap: 24px;
  font-family: SF UI Display;
  color: ${({ theme }) => theme.titleImport};
  font-size: ${isMobile ? '14px' : '17px'};
  line-height: 20px;
  font-weight: 500;
  .token {
    display: flex;
    .token-stand {
      display: flex;
      font-family: SF UI Display;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      font-weight: 500;
    }
  }
  .amount {
    white-space: nowrap;
    display: flex;
    align-items: center;
    width: ${isMobile ? '62px' : '100px'};
  }

  .date-time {
    display: flex;
    align-items: center;
  }
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
const TitleTable = styled.div`
  font-weight: 400;
  font-size: 17px;
  line-height: 20px;
  color: ${({ theme }) => theme.referralTableHeader};
`;

const TooltipStyled = styled(NewTooltip)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;

  @media screen and (min-width: 768px) {
    width: 32px;
    height: 32px;
  }
`

const HistoryFriendReward = ({ isOpen, onDismiss }) => {
  const { account, chainId } = useWeb3React();
  const [historyFriendData, setHistoryFriendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItem, setTotalItem] = useState(null);
  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 10,
    itemStart: 1,
    itemEnd: isMobile ? 5 : 10,
    totalPage: null,
  });

  const getFriendHistory = async () => {
    try {
      const res = await axios.get("api/friend-referral-reward", {
        baseURL: process.env.NEXT_PUBLIC_API_REFERRAL,
        params: {
          userId: account,
          chainId: chainId,
          page: tableOptions.current,
          limit: tableOptions.pageSize,
        },
      });

      if (res.status === 200) {
        setHistoryFriendData(res?.data.data);
        setLoading(false);
        setTotalItem(res?.data.total);
        setTableOptions({
          ...tableOptions,
          totalPage: Math.ceil(res?.data.total / tableOptions.pageSize),
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const formatDatetime = (datetimeStr: string) => {
    return moment(datetimeStr).format("MM/DD/YY");
  };

  useEffect(() => {
    getFriendHistory();
  }, [tableOptions.pageSize, tableOptions.current, account, chainId]);

  return (
    <Modal onDismiss={onDismiss} isOpen={isOpen}>
      <ModalHeader onClose={onDismiss} title={"Friend Referral Reward"} />
      <Wrapper>
        {historyFriendData && historyFriendData.length > 0 ? (
          <ContentContainer>
            <TitleTable>Datetime</TitleTable>
            <TitleTable>Token</TitleTable>
            <TitleTable>Amount</TitleTable>
            {historyFriendData.map((item) => (
              <>
                <div className="date-time">
                  {formatDatetime(item.createdAt)}
                </div>
                <div className="token">
                  <ImageWrapper>
                    <Image
                      src={TokenStandLogo}
                      alt="tokenstand-logo"
                      layout="fill"
                    />
                  </ImageWrapper>
                  {!isMobile &&  <div className="token-stand">STAND</div>}
                </div>
                <div className="amount">
                  <TooltipStyled
                    dataValue={toFixedNumber(item.amountStand, 4)}
                    dataTip={removeZero(String(item.amountStand))}
                  />
                </div>
              </>
            ))}
          </ContentContainer>
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
      </Wrapper>
      {loading || historyFriendData.length === 0 ? (
        ""
      ) : (
        <FooterTable
          dataSource={historyFriendData}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={totalItem}
        />
      )}
    </Modal>
  );
};
export default HistoryFriendReward;
