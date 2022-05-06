import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import useActiveWeb3React from "../../../../hooks/useActiveWeb3React";
import { formatAmount } from "../../../../utils";
import { parseRetrievedNumber } from "../../BuyTicket/generateTicketNumber";
import YourTicketHistory from "../PopupYourTicketHistory";
import Image from "next/image";
import { getWinningTickets } from "../../getWinningTicketForClaim";
import { useLotteryContract } from "../../../../hooks";

const Main = styled.div`
  padding: 40px 56px 0px 56px;
  display: grid;
  grid-template-columns: 1fr 0.8fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 40px 24px 0px 24px;
  }
`;

const NumberWinning = styled.div`
  .winning-text {
    font-weight: 600;
    margin-top: 30px;

    span {
      color: ${({ theme }) => theme.primaryText2};
      font-size: 24px;
      padding-right: 16px;
    }

    .lastest {
      background: #72bf65;
      border-radius: 20px;
      padding: 6px 16px;
      color: #ffffff;
      font-size: 14px;
    }
  }
  @media screen and (max-width: 768px) {
    margin-bottom: 48px;
    .winning-text {
      margin-top: 0px;
      span {
        font-size: 18px;
      }
    }
  }
`;

const PricePot = styled.div`
  background: rgba(114, 191, 101, 0.1);
  border: 1px solid #72bf65;
  border-radius: 20px;
  padding: 32px;
  font-weight: bold;

  .lg-text {
    font-size: 24px;
    color: ${({ theme }) => theme.primaryText2};
  }

  .usd-price {
    font-size: 36px;
    color: #72bf65;
  }

  .sm-text {
    font-size: 14px;
    color: ${({ theme }) => theme.lblToken};
  }

  .md-text {
    font-weight: normal;
    font-size: 17px;
    color: ${({ theme }) => theme.lblToken};

    span {
      color: #72bf65;
      cursor: pointer;

      &.disable {
        color: inherit;
        cursor: auto;
      }
    }
  }

  @media screen and (max-width: 768px) {
    padding: 24px;

    .lg-text {
      font-size: 18px;
    }

    .usd-price {
      font-size: 24px;
    }

    .md-text {
      font-size: 14px;
    }
  }
`;

const NumberWrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;

  @media screen and (min-width: 768px) {
    width: 60px;
    height: 60px;
  }

  .number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 900;
    font-size: 24px;
    color: #fff;
    text-shadow: -0.75px -0.75px 0 #000, 0.75px -0.75px 0 #000,
      -0.75px 0.75px 0 #000, 0.75px 0.75px 0 #000;

    @media screen and (min-width: 768px) {
      font-size: 32px;
    }
  }
`;

const WinningNumber = ({
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
  const { account } = useActiveWeb3React();
  const [isClaimed, setisClaimed] = useState(false);
  const lotteryContract = useLotteryContract();

  const numberWinning = dataHistory?.win_number
    ? parseRetrievedNumber(String(dataHistory?.win_number)).split("")
    : [0, 0, 0, 0, 0, 0];

  const ticketsAsStringArray = ticketsRoundCheck?.ticket_detail?.map((ticket) =>
    parseRetrievedNumber(ticket.toString()).split("")
  );


  // check isClaimed with sc
  const checkClaimed = async () => {
    let _ticketIds = [];

    const listTicketClaim = getWinningTickets(ticketsRoundCheck);

    listTicketClaim?.map((item) => {
      _ticketIds.push(item.id);
    });

    const checkClaimed =
      await lotteryContract.viewNumbersAndStatusesForTicketIds(_ticketIds);

    setisClaimed(checkClaimed[1].includes(true));
  };

  useEffect(() => {
   if(isOpenYourTickets){
    checkClaimed();
    const interval = setInterval(checkClaimed, 500);
    return () => clearInterval(interval);
   }
   
  }, [dataHistory, isOpenYourTickets]);

  return (
    <Main>
      <NumberWinning>
        <div className="winning-text flex justify-center items-center">
          <span>Winning Number</span> {roundId === dataHistory.round && <div className="lastest">Latest</div>}
        </div>
        <div
          className={`flex  ${
            isMobile ? "gap-2 mt-6" : "gap-4 mt-10"
          } justify-center`}
        >
          {numberWinning.map((item, key) => (
            <NumberWrapper key={key}>
              <Image
                src={`/numbers/bg-${key + 1}.svg`}
                alt={`number-${item}-img`}
                layout="fill"
              />
              <span className="number">{item}</span>
            </NumberWrapper>
          ))}
        </div>
      </NumberWinning>

      <PricePot>
        <div className="lg-text">Prize Pot</div>
        <div className="usd-price">
          ${formatAmount(String(priceSTAND * dataHistory?.prize_pot), 0, 4)}
        </div>
        <div className="sm-text">
          {formatAmount(dataHistory?.prize_pot, 0, 4)} STAND
        </div>
        {/* <div className="md-text">Total tickets this round: 1 154</div> */}

        {account && (
          <>
            <div className="lg-text mt-6">Your Tickets</div>
            <div className="md-text">
              You have{" "}
              <span
                className={
                  ticketsRoundCheck?.numberOfTicket === 0 ? "disable" : ""
                }
                onClick={() =>
                  ticketsRoundCheck?.numberOfTicket > 0 &&
                  setIsOpenYourTickets(true)
                }
              >
                {ticketsRoundCheck?.numberOfTicket || 0}{" "}
                {ticketsRoundCheck?.numberOfTicket > 1 ? "tickets" : "ticket"}
              </span>{" "}
              this round
            </div>
          </>
        )}
      </PricePot>

      {isOpenYourTickets && (
        <YourTicketHistory
          isOpen={isOpenYourTickets}
          onDismiss={() => setIsOpenYourTickets(false)}
          winningNumbers={numberWinning}
          ticketsAsStringArray={ticketsAsStringArray}
          ticketsRoundCheck={ticketsRoundCheck}
          handleCheckReward={handleCheckReward}
          setIsOpenWinning={setIsOpenWinning}
          isClaimed={isClaimed}
          isClaimming={isClaimming}
          roundClaim={roundClaim}
        />
      )}
    </Main>
  );
};

export default WinningNumber;
