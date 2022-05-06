import { Empty } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { arrowDownImg, arrowUpImg, IconShow } from "../NextDraw";
import WinningNumber from "./AllHistory/WinningNumber";
import RoundDetail from "./RoundDetail";

const Wrapper = styled.div`
  .text-show {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 600;
    font-size: 17px;
    padding-bottom: 32px;
  }

  .detail {
    padding: 0px 56px;
  }

  @media screen and (max-width: 768px) {
    .text-show {
      font-size: 14px;
    }
    .detail {
      padding: 0px 19px;
    }
  }
`;

const NoData = styled.div`
  margin: 179px 0;
  .ant-empty-description {
    color: ${({ theme }) => theme.text6};
  }
`;

const MainHistory = ({
  dataHistory,
  priceSTAND,
  ticketsRoundCheck,
  handleCheckReward,
  setIsOpenWinning,
  isClaimming,
  roundClaim,
  setIsOpenYourTickets,
  isOpenYourTickets,
  roundId
}) => {
  const [isShow, setIsShow] = useState(false);

  return dataHistory?.round ? (
    <Wrapper>
      <WinningNumber
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
      {isShow && (
        <div className="detail">
          <RoundDetail dataHistory={dataHistory} priceSTAND={priceSTAND} />
        </div>
      )}
      <IconShow
        className="flex items-center justify-center text-show"
        onClick={() => setIsShow(!isShow)}
      >
        <span className="px-2">{!isShow ? "More" : "Hide"}</span>{" "}
        {!isShow ? arrowDownImg : arrowUpImg}
      </IconShow>{" "}
    </Wrapper>
  ) : (
    <NoData>
      {" "}
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
    </NoData>
  );
};

export default MainHistory;
