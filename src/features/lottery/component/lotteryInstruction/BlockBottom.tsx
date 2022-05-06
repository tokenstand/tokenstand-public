import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${isMobile ? "10px" : "80px"};
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;
const Description = styled.div`
  width: 540px;
  h4 {
    font-weight: 600;
    font-size: 24px;
    color: ${({ theme }) => theme.primaryText2};
  }
  p {
    font-size: 17px;
    color: ${({ theme }) => theme.primaryText3};
  }
  h5 {
    font-size: 17px;
    color: ${({ theme }) => theme.primaryText2};
  }
  @media screen and (max-width: 768px) {
    margin-bottom: 30px;
    width: 100%;
    p,
    h5 {
      font-size: 14px;
    }
    h4 {
      font-size: 18px;
    }
  }
`;

const ChartReward = styled.div`
  padding: 48px 45px 40px;
  background: ${({ theme }) => theme.bgChart};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
  border-radius: 20px;

  div {
    width: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    margin-top: 32px;
    font-size: 17px;
    color: ${({ theme }) => theme.title1};
  }
  .item {
    display: flex;
    margin-bottom: 20px;
    .title,
    .percent {
      font-size: 17px;
      color: ${({ theme }) => theme.textchart};
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }
    .dotted {
      border-bottom: 2px dotted ${({ theme }) => theme.textchart};
      width: 100%;
      margin-left: 8px;
      margin-right: 8px;
    }
    .title {
      white-space: nowrap;
      display: block;
      vertical-align: middle;
      margin-left: 8px;
    }
  }
  .percent-reward {
    display: block;
    margin-bottom: 18px;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    div {
      width: 100%;
    }
    .chart {
      img {
        height: 200px;
        width: 200px;
      }
    }
    p {
      font-size: 14px;
    }
    .item {
      margin-bottom: 16px;
      .title {
        font-size: 14px;
      }
      img {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

const ListReward = [
  {
    img: "/icons/reward_1.png",
    title: "Matches all 6",
    percent: "40%",
  },
  {
    img: "/icons/reward_2.png",
    title: "Matches first 5",
    percent: "20%",
  },
  {
    img: "/icons/reward_3.png",
    title: "Matches first 4",
    percent: "10%",
  },
  {
    img: "/icons/reward_4.png",
    title: "Matches first 3",
    percent: "5%",
  },
  {
    img: "/icons/reward_5.png",
    title: "Matches first 2",
    percent: "3%",
  },
  {
    img: "/icons/reward_7.png",
    title: "Matches first 1",
    percent: "2%",
  },
  {
    img: "/icons/reward_6.png",
    title: "Burn",
    percent: "20%",
  },
];

const BlockBottom = () => {
  return (
    <Wrapper>
      <Description>
        <h4>Prize Funds</h4>
        <p>The prizes for each lottery round come from two sources:</p>
        <h5>Ticket Purchases</h5>
        <p>
          80% of the STAND paid by people buying tickets that round goes back
          into the prize pools.
        </p>
        <h5>Rollover Prizes</h5>
        <p>
          After every round, if nobody wins in one of the prize brackets, the
          unclaimed STAND tokens for that bracket will roll over into the next
          round and will be redistributed among the prize pools.
        </p>
      </Description>
      <ChartReward>
        <div className="chart">
          <img src="/icons/chart-reward.png" />
        </div>
        <p>Distribution of funds from purchased tickets:</p>
        <div className="percent-reward">
          {ListReward.map((item, index) => (
            <div className="item" key={index}>
              <img src={item.img} alt="" />
              <span className="title">{item.title}</span>
              <div className="dotted"></div>
              <span className="percent">{item.percent}</span>
            </div>
          ))}
        </div>
      </ChartReward>
    </Wrapper>
  );
};

export default BlockBottom;
