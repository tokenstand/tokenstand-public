import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AllHistory from "./AllHistory";
import YourHistory from "./YourHistory";
import { useEffect } from "react";
import axios from "axios";
import { useActiveWeb3React, useChainId } from "../../../hooks";
import { chain } from "lodash";
import FooterTable from "../../../components/FooterTable";
import PopupWinning from "../PopupWinning";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;

  .title {
    font-size: 24px;
    color: ${({ theme }) => theme.primaryText2};
  }

  @media screen and (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    .title {
      font-size: 18px;
      padding-left: 4px;
    }
  }
`;

const TabHistory = styled(Tabs)``;

const TabHistoryList = styled(TabList)`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.bgTab};
  border-radius: 8px;
  color: ${({ theme }) => theme.thinText};

  .selected {
    background: ${({ theme }) => theme.text9};
    border-radius: 8px;
    color: #fff;
  }

  @media screen and (max-width: 768px) {
    margin-top: 24px;
  }
`;

const TabTitle = styled(Tab)`
  padding: 20px 32px;
  font-size: ${isMobile ? "14px" : "17px"};

  @media screen and (max-width: 768px) {
    padding: 11px 32px;
  }
`;

const History = ({
  roundId,
  priceSTAND,
  handleCheckReward,
  handleClaimRewards,
  dataClaim,
  setIsOpenBuyTicket,
  disabledBuy,
  setIsOpenWinning,
  isOpenWinning,
  isClaimming,
  roundClaim,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showDetailHistory, setShowYourHistory] = useState(false);
  const [roundCheck, setRoudCheck] = useState(roundId);
  const { account } = useActiveWeb3React();
  const { chainId } = useChainId();
  const [dataHistory, setDataHistory] = useState<any>();
  const [dataYourHistory, setDataYourHistory] = useState<any>();
  const [ticketsRoundCheck, setTicketRoundCheck] = useState<any>([]);
  const [isOpenYourTickets, setIsOpenYourTickets] = useState(false);

  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 10,
    itemStart: 1,
    itemEnd: isMobile ? 5 : 10,
    totalPage: null,
  });

  const fetchHistory = async (round) => {
    try {
      const res = await axios.get("/api/single-lottery", {
        baseURL: process.env.NEXT_PUBLIC_API_LOTTERY,
        params: {
          round,
          chainId,
        },
      });
      setDataHistory(res.data);
      viewTicket(round);
    } catch (e) {
      return;
    }
  };

  const fetchYourHistory = async () => {
    try {
      const res = await axios.get("/api/lottery-history", {
        baseURL: process.env.NEXT_PUBLIC_API_LOTTERY,
        params: {
          userId: account,
          chainId,
          limit: tableOptions.pageSize,
          page: tableOptions.current,
        },
      });
      setDataYourHistory(res.data);
      setTableOptions({
        ...tableOptions,
        totalPage: Math.ceil(res?.data.total / tableOptions.pageSize),
      });
    } catch (e) {
      return;
    }
  };

  const viewTicket = async (round) => {
    const res = await axios.get("/api/user-lottery", {
      baseURL: process.env.NEXT_PUBLIC_API_LOTTERY,
      params: {
        userId: account,
        round,
        chainId,
      },
    });

    setTicketRoundCheck(res.data);
  };

  useEffect(() => {
    if (!isOpenYourTickets && !isOpenWinning && roundId > 0) {
      setRoudCheck(roundId);
      fetchHistory(roundId);
    }
  }, [tabIndex, roundId, account, chainId]);

  useEffect(() => {
    fetchYourHistory();
  }, [tableOptions.pageSize, tableOptions.current, account, chainId]);

  useEffect(() => {
    setShowYourHistory(false)
    setIsOpenYourTickets(false)
  }, [account, chainId]);

  return (
    <div className={`grid h-full  ${isMobile ? "px-4" : " px-24"}`}>
      <TabHistory
        forceRenderTabPanel
        selectedIndex={tabIndex}
        onSelect={(index: number) => setTabIndex(index)}
        className="flex flex-col flex-grow"
      >
        <Header className="mb-4">
          {" "}
          <div className="title">
            {tabIndex === 0 ? "Finished Rounds" : "Your History"}
          </div>{" "}
          <TabHistoryList>
            <TabTitle
              className="cursor-pointer select-none focus:outline-none"
              selectedClassName="text-high-emphesis selected"
              onClick={() => setShowYourHistory(false)}
            >
              All History
            </TabTitle>
            <TabTitle
              className="cursor-pointer select-none focus:outline-none"
              selectedClassName="text-high-emphesis selected"
            >
              Your History
            </TabTitle>
          </TabHistoryList>
        </Header>

        <TabPanel>
          {roundId > 0 && (
            <AllHistory
              roundCheck={roundCheck}
              roundId={roundId}
              setRoudCheck={setRoudCheck}
              dataHistory={dataHistory}
              priceSTAND={priceSTAND}
              fetchHistory={fetchHistory}
              ticketsRoundCheck={ticketsRoundCheck}
              handleCheckReward={handleCheckReward}
              setIsOpenWinning={setIsOpenWinning}
              isClaimming={isClaimming}
              roundClaim={roundClaim}
              setIsOpenYourTickets={setIsOpenYourTickets}
              isOpenYourTickets={isOpenYourTickets}
            />
          )}
        </TabPanel>
        <TabPanel>
          <YourHistory
            setShowYourHistory={setShowYourHistory}
            showDetailHistory={showDetailHistory}
            dataYourHistory={dataYourHistory}
            dataHistory={dataHistory}
            priceSTAND={priceSTAND}
            ticketsRoundCheck={ticketsRoundCheck}
            setRoudCheck={setRoudCheck}
            roundCheck={roundCheck}
            handleCheckReward={handleCheckReward}
            setIsOpenWinning={setIsOpenWinning}
            setIsOpenBuyTicket={setIsOpenBuyTicket}
            disabledBuy={disabledBuy}
            isClaimming={isClaimming}
            roundClaim={roundClaim}
            setIsOpenYourTickets={setIsOpenYourTickets}
            isOpenYourTickets={isOpenYourTickets}
            roundId={roundId}
          />
        </TabPanel>
      </TabHistory>
      {tabIndex === 1 && (
        <FooterTable
          dataSource={dataYourHistory?.data}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={dataYourHistory?.total}
        />
      )}

      {isOpenWinning && (
        <PopupWinning
          isOpen={isOpenWinning}
          onDismiss={() => {
            setIsOpenWinning(false);
          }}
          handleClaimRewards={handleClaimRewards}
          roundId={roundCheck}
          dataClaim={dataClaim}
        />
      )}
    </div>
  );
};

export default History;
