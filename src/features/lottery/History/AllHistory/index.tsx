import React from "react";
import styled from "styled-components";
import MainHistory from "../MainHistory";
import HeaderAllHistory from "./HeaderAllHistory";

const MainContent = styled.div`
  background: ${({ theme }) => theme.bgNextDraw};
  border: 1px solid ${({ theme }) => theme.border1};
  box-sizing: border-box;
  border-radius: 20px;
`;

const AllHistory = ({
  roundCheck,
  setRoudCheck,
  dataHistory,
  priceSTAND,
  fetchHistory,
  roundId,
  ticketsRoundCheck,
  handleCheckReward,
  setIsOpenWinning,
  isClaimming,
  roundClaim,
  setIsOpenYourTickets,
  isOpenYourTickets
}) => {
  return (
    <MainContent>
      <HeaderAllHistory
        roundCheck={roundCheck}
        setRoudCheck={setRoudCheck}
        dataHistory={dataHistory }
        fetchHistory={fetchHistory}
        roundCurrentPrev={roundId}
      />
      <MainHistory
        dataHistory={dataHistory}
        priceSTAND={priceSTAND}
        ticketsRoundCheck={ticketsRoundCheck}
        handleCheckReward={handleCheckReward}
        setIsOpenWinning={setIsOpenWinning}
        isClaimming={isClaimming}
        roundClaim={roundClaim}
        setIsOpenYourTickets={setIsOpenYourTickets}
        isOpenYourTickets={isOpenYourTickets}
        roundId={roundId}
      />
    </MainContent>
  );
};

export default AllHistory;
