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
import TokenLogo from "./TokenLogo";
import { removeZero, toFixedNumber } from "../../../utils/decimalAdjust";
import NewTooltip from "../../../components/NewTooltip";

const Wrapper = styled.div`
  padding: 20px 20px 26px;
  background: ${({ theme }) => theme.bgInput};
  border-radius: 20px;

  @media screen and (min-width: 768px) {
    padding: 40px 8px 46px 40px;
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
const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 0.75fr 1fr 1fr;
  gap: 24px;
  color: ${({ theme }) => theme.titleImport};
  font-size: ${isMobile ? '14px' : '17px'};
  line-height: 20px;
  font-weight: 500;
  .amount,
  .date-time {
    display: flex;
    align-items: center;
  }
`;
const TitleTable = styled.div`
  font-weight: 400;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 20px;
  color: ${({ theme }) => theme.referralTableHeader};
`;

const TooltipStyled = styled(NewTooltip)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HistoryFarmReward = ({ isOpen, onDismiss }) => {
  const { account, chainId } = useWeb3React();
  const [data, setData] = useState([]);
  const [historyFarmData, setHistoryFarmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItem, setTotalItem] = useState(null);
  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 10,
    itemStart: 1,
    itemEnd: isMobile ? 5 : 10,
    totalPage: null,
  });

  const getFarmHistory = async () => {
    try {
      const res = await axios.get("api/farm-referral-reward", {
        baseURL: process.env.NEXT_PUBLIC_API_REFERRAL,
        params: {
          userId: account,
          chainId: chainId,
          page: tableOptions.current,
          limit: tableOptions.pageSize,
        },
      });

      if (res.status === 200) {
        setData(res?.data.data);
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
    getFarmHistory();
  }, [tableOptions.pageSize, tableOptions.current, account, chainId]);

  useEffect(() => {
    setHistoryFarmData(
      data.map((obj) => ({
        ...obj,
        amountList: JSON.parse(obj.amountList),
      }))
    );
  }, [data]);

  return (
    <Modal onDismiss={onDismiss} isOpen={isOpen}>
      <ModalHeader onClose={onDismiss} title={"Farm Referral Reward"} />
      <Wrapper>
        {historyFarmData && historyFarmData.length > 0 ? (
          <ContentContainer>
            <TitleTable>Datetime</TitleTable>
            <TitleTable>Token</TitleTable>
            <TitleTable>Amount</TitleTable>
            {historyFarmData.map((item) => (
              <>
                <div className="date-time">
                  {formatDatetime(item.createdAt)}
                </div>
                {item.amountList.map((item, index) => (
                  <>
                    {index !== 0 ? (
                      <div></div>
                    ) : null}
                    <TokenLogo tokenAddress={item.address} chainId={chainId} />
                    <div className="amount">
                      <TooltipStyled
                        dataValue={toFixedNumber(item.amount, 4)}
                        dataTip={removeZero(String(item.amount))}
                      />
                    </div>
                  </>
                ))}
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
      {loading || historyFarmData.length === 0 ? (
        ""
      ) : (
        <FooterTable
          dataSource={historyFarmData}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={totalItem}
        />
      )}
    </Modal>
  );
};
export default HistoryFarmReward;
