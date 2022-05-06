import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import DrawDetail from "./DetailDraw";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import moment from "moment";
import ViewTicket from "./ViewTicket";
import { formatAmount } from "../../../utils";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  .title {
    font-size: 24px;
    color: ${({ theme }) => theme.primaryText2};
  }

  .date-time {
    color: ${({ theme }) => theme.primaryText3};
    font-size: 17px;
  }

  @media screen and (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    .title {
      font-size: 18px;
      padding-left: 4px;
    }
    .date-time {
      font-size: 14px;
      padding: 8px 0px 16px 4px;
    }
  }
`;

const MainContent = styled.div`
  background: ${({ theme }) => theme.bgNextDraw};
  border: 1px solid ${({ theme }) => theme.border1};
  box-sizing: border-box;
  border-radius: 20px;
  padding: 84px 56px 32px 56px;

  .text-show {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 600;
    font-size: 17px;
  }

  @media screen and (max-width: 768px) {
    padding: 30px 16px;

    .block-top {
      flex-direction: column;
    }

    .text-show {
      font-size: 14px;
    }
  }
`;

const BlockTicket = styled.div`
  padding: 32px;
  justify-content: space-between;
  background: rgba(114, 191, 101, 0.1);
  border: 1px solid #72bf65;
  border-radius: 20px;
  width: 50%;

  .your-ticket {
    font-weight: bold;
    font-size: 24px;
    color: ${({ theme }) => theme.textYourTicket};
    letter-spacing: 0.015em;
  }
  .des-ticket {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: normal;
    font-size: 17px;
    padding-top: 4px;
    span {
      color: #72bf65;
      cursor: pointer;
      :hover {
        opacity: 0.7;
      }
    }
  }

  @media screen and (max-width: 768px) {
    width: 96%;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    margin: 0 10px;
    .your-ticket {
      font-size: 18px;
    }
    .des-ticket {
      font-size: 14px;
      padding-top: 0px;
    }
  }
`;

const ButtonBuy = styled.button`
  font-weight: bold;
  font-size: 17px;
  line-height: 20px;
  color: #ffffff;
  background: #72bf65;
  padding: 18px 32px;
  border-radius: 30px;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    background: ${({ theme }) => theme.buttonDisable};
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    :hover {
      opacity: 1;
    }
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    padding: 12px 32px;
    margin-top: 20px;
  }
`;

const BlockRight = styled.div`
  font-weight: bold;
  .text-prize {
    color: ${({ theme }) => theme.textYourTicket};
    font-size: 17px;
  }

  .number-prize {
    font-size: 36px;
    color: #72bf65;
  }

  .small-text {
    font-weight: normal;
    font-size: 17px;
    color: ${({ theme }) => theme.primaryText3};
    margin-bottom: 16px;
  }

  @media screen and (max-width: 768px) {
    margin-top: 40px;
    width: 100%;
    .text-prize,
    .small-text {
      font-size: 14px;
    }

    .number-prize {
      font-size: 24px;
      line-height: 32px;
    }

    img {
      width: 100%;
    }
  }
`;

export const IconShow = styled.div`
  margin-top: 32px;
  cursor: pointer;

  :hover {
    opacity: 0.7;
  }

  svg {
    path {
      fill: ${({ theme }) => theme.text1};
    }
  }
`;

const NextDraw = ({ setIsOpenBuyTicket, dataLottery }) => {
  const { account } = useActiveWeb3React();
  const [isShow, setIsShow] = useState(false);
  const [isShowYourTicket, setIsShowYourTicket] = useState(false);
  const ticketCurrent = dataLottery.ticketCurrent;

  const NOW = Date.now() / 1000;

  return (
    <div
      className={`grid h-full  ${isMobile ? " gap-2 px-4" : " gap-6 px-24"}`}
    >
      <Header>
        <div className="title">Next Draw</div>
        <div className="date-time">
          #{dataLottery.roundId} | Draw:{" "}
          {moment((dataLottery.endTime + 60) * 1000).format(
            "HH:mm, MMM DD, YYYY"
          )}
        </div>
      </Header>

      <MainContent>
        <div className="flex items-center justify-between block-top">
          <BlockTicket className="flex justify-between items-center">
            <div>
              <div className="your-ticket">Your Tickets</div>
              {account && (
                <div className="des-ticket">
                  You have{" "}
                  <span
                    onClick={() =>
                      ticketCurrent?.length > 0
                        ? setIsShowYourTicket(true)
                        : dataLottery.endTime < NOW
                        ? null
                        : setIsOpenBuyTicket(true)
                    }
                  >
                    {" "}
                    {ticketCurrent?.length || 0}{" "}
                    {ticketCurrent?.length > 1 ? "tickets" : "ticket"}
                  </span>{" "}
                  this round
                </div>
              )}
            </div>
            <ButtonBuy
              disabled={dataLottery.endTime < NOW}
              onClick={setIsOpenBuyTicket}
            >
              Buy Ticket
            </ButtonBuy>
          </BlockTicket>
          <BlockRight className="relative flex items-center justify-center">
            <div className="absolute flex items-center justify-center flex-col">
              <div className="text-prize">Prize Pot</div>
              <div className="number-prize">
                ${formatAmount(dataLottery.prizePotUSD, 0, 4)}
              </div>
              <div className="small-text">
                {" "}
                {formatAmount(dataLottery.prizePotSTAND, 0, 4)} STAND
              </div>
              <img
                src="/images/to-the-moon.png"
                className="mt-4"
                width={isMobile ? "155px" : "100%"}
              />
            </div>
            {isMobile ? (
              <img src="/images/planet-lottery-mobile.png" />
            ) : (
              <img src="/images/planet-lottery.png" />
            )}
          </BlockRight>
        </div>
        {isShow && <DrawDetail dataDetail={dataLottery} />}
        <IconShow
          className="flex items-center justify-center text-show"
          onClick={() => setIsShow(!isShow)}
        >
          <span className="px-2">{!isShow ? "More" : "Hide"}</span>
          {""}
          {!isShow ? arrowDownImg : arrowUpImg}
        </IconShow>
      </MainContent>

      <ViewTicket
        isOpen={isShowYourTicket}
        onDismiss={() => setIsShowYourTicket(false)}
        setIsOpenBuyTicket={() => setIsOpenBuyTicket(true)}
        ticketCurrent={ticketCurrent}
        roundId={dataLottery.roundId}
        endTime={dataLottery.endTime}
      />
    </div>
  );
};

export default NextDraw;

export const arrowDownImg = (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.76668 0.741797L5.00002 3.97513L8.23335 0.741797C8.55835 0.416797 9.08335 0.416797 9.40835 0.741797C9.73335 1.0668 9.73335 1.5918 9.40835 1.9168L5.58335 5.7418C5.25835 6.0668 4.73335 6.0668 4.40835 5.7418L0.58335 1.9168C0.25835 1.5918 0.25835 1.0668 0.58335 0.741797C0.90835 0.42513 1.44168 0.416797 1.76668 0.741797Z"
      fill="white"
      fillOpacity="0.6"
    />
  </svg>
);

export const arrowUpImg = (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.76644 5.2582L4.99977 2.02487L8.23311 5.2582C8.55811 5.5832 9.08311 5.5832 9.40811 5.2582C9.73311 4.9332 9.73311 4.4082 9.40811 4.0832L5.58311 0.258203C5.25811 -0.0667968 4.73311 -0.0667968 4.40811 0.258203L0.583105 4.0832C0.258105 4.4082 0.258105 4.9332 0.583105 5.2582C0.908105 5.57487 1.44144 5.5832 1.76644 5.2582Z"
      fill="white"
      fillOpacity="0.6"
    />
  </svg>
);