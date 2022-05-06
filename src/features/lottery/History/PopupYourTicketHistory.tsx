import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import CloseIcon from "../../../components/CloseIcon";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useIsDarkMode } from "../../../state/user/hooks";
import Image from "next/image";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
const NumberOfRound = styled.div`
  color: #72bf65;
  font-weight: 600;
  font-size: 17px;
  margin: 36px 0px;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin: 20px 0px;
  }
`;

const ButtonBuy = styled.button`
  background: #72bf65;
  border-radius: 15px;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  height: 63px;
  width: 100%;
  @media screen and (max-width: 768px) {
    height: 40px;
    font-size: 14px;
  }
`;

const TicketContainer = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6.6px;
    height: 6.6px;
    background-color: ${({ theme }) => theme.bg3};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${({ theme }) => theme.bg4};
  }
}
`;

const Container = styled.div`
  .input-parent {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 9px;
    border: 1px solid ${({ theme }) => theme.border1};
    border-radius: 15px;
    height: 63px;
    font-weight: 600;
    margin-bottom: 24px;
    color: ${({ theme }) => theme.text12};
    width: 96%;
    @media screen and (max-width: 768px) {
      width: 95%;
      margin-bottom: 16px;
      height: 40px;
    }
  }

  .ticket-number {
    font-size: 14px;
    color: ${({ theme }) => theme.text11};
    margin-bottom: 12px;
    @media screen and (max-width: 768px) {
      margin-bottom: 8px;
    }
  }

  .matchs div {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    color: ${({ theme }) => theme.text11};
    position: relative;
    padding: 28px;

    @media screen and (max-width: 768px) {
      padding: 15px;
    }
  }

  .matchs div::after {
    content: "";
    position: absolute;
    display: block;
    border: 2px solid #72bf65;
    inset: -5px -35px -5px;
    border-left: none;
    border-right: none;

    @media screen and (min-width: 768px) {
      inset: -5px -45px -5px;
    }
  }

  .matchs:first-of-type div::after {
    inset: -5px;
    border-radius: 15px 0 0 15px;
    border-left: 2px solid #72bf65;
  }

  .matchs.last-matchs div::after {
    inset: -5px;
    border-radius: 0 15px 15px 0;
    border-right: 2px solid #72bf65;
  }

  .matchs.last-matchs div::before {
    content: "";
    position: absolute;
    display: block;
    inset: -5px 25px -5px -35px;
    border: 2px solid #72bf65;
    border-right: none;
    border-left: none;
    left: -35px;
    right: 25px;

    @media screen and (min-width: 768px) {
      inset: -5px 35px -5px -45px;
    }
  }

  .matchs.first-matchs.last-matchs div::before {
    display: none;
  }

  .matchs.first-matchs.last-matchs div::after {
    border-radius: 15px;
    border-left: 2px solid #72bf65;
  }
`;

const Number = styled.div`
  background: ${({ theme }) => theme.bgNumberWinning};
  border-radius: 15px;
  padding: 15px 42px;
  margin-top: 20px;

  @media screen and (max-width: 768px) {
    margin-top: 12px;
  }
`;

const TitleRowLeft = styled.div`
  display: flex;
  align-items: center;

  span {
    padding-left: 13px;
  }
`;

const TicketInfo = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 500;
  font-size: 16px;

  .title {
    font-size: 17px;
    color: #72bf65;
  }
`;

const Line = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border4};
  margin: 26px 0px;
  @media screen and (max-width: 768px) {
    margin: 16px 0px;
  }
`;

const ButtonClaim = styled.button`
  text-align: center;
  color: #fff;
  padding: 21px;
  background: #72bf65;
  border-radius: 15px;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;

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
    padding: 12px;
    font-size: 14px;
    margin-top: 12px;
  }
`;

const Question = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  cursor: pointer;
  span {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: normal;
    font-size: 14px;
    padding-left: 6px;
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
    font-size: 18px;
    color: #fff;
    text-shadow: -0.75px -0.75px 0 #000, 0.75px -0.75px 0 #000,
      -0.75px 0.75px 0 #000, 0.75px 0.75px 0 #000;

    @media screen and (min-width: 768px) {
      font-size: 32px;
    }
  }
`;

type YourTicketPopupProps = {
  isOpen: boolean;
  onDismiss: () => void;
  winningNumbers?: any[];
  ticketsAsStringArray: any;
  ticketsRoundCheck: any;
  handleCheckReward;
  setIsOpenWinning;
  isClaimed;
  isClaimming;
  roundClaim;
};

const Ticket = ({ index, item, winningNumbers }): JSX.Element => {
  const [matchNumbers, setMatchNumbers] = useState<number[]>([]);

  useEffect(() => {
    if (winningNumbers) {
      const matchNumbers = [];
      for (let i = 0; i < winningNumbers.length; i++) {
        if (winningNumbers[i] === item[i]) {
          matchNumbers.push(winningNumbers[i]);
        } else break;
      }
      setMatchNumbers(matchNumbers);
    }
  }, [winningNumbers, item]);

  return (
    <Container>
      <div className="ticket-number">{handleShowTicketNumber(index)}</div>
      <div className="input-parent">
        {item.map((item, index) => (
          <div
            className={
              "flex justify-center items-center " +
              `${matchNumbers[index] === item ? "matchs " : ""}` +
              `${matchNumbers.length - 1 === index ? "last-matchs " : ""}` +
              `${!index ? "first-matchs" : ""}`
            }
            key={index}
          >
            <div className="flex justify-center items-center">{item}</div>
          </div>
        ))}
      </div>
    </Container>
  );
};

const YourTicketHistory: React.FC<YourTicketPopupProps> = ({
  isOpen,
  onDismiss,
  winningNumbers,
  ticketsAsStringArray,
  ticketsRoundCheck,
  handleCheckReward,
  setIsOpenWinning,
  isClaimed,
  isClaimming,
  roundClaim,
}) => {
  const darkMode = useIsDarkMode();

  const amountTicketWinning = () => {
    let count = 0;
    for (let i = 0; i < ticketsRoundCheck?.ticket_status?.length; ++i) {
      if (ticketsRoundCheck?.ticket_status[i] === true) count++;
    }
    return count;
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">
          Round #{ticketsRoundCheck?.round}
        </TitleStyle>
        <CloseIcon onClick={onDismiss} />
      </div>

      <NumberOfRound>
        <div>Winning Number</div>
        <Number
          className={`flex  ${isMobile ? "gap-2" : "gap-4"} justify-center`}
        >
          {winningNumbers.map((item, key) => (
            <NumberWrapper key={key}>
              <Image
                src={`/numbers/bg-${key + 1}.svg`}
                alt={`number-${item}-img`}
                layout="fill"
              />
              <span className="number">{item}</span>
            </NumberWrapper>
          ))}
        </Number>
      </NumberOfRound>

      <TicketInfo>
        <div className="title">Your Ticket</div>
        <div className={`flex justify-between ${isMobile ? "mt-2" : "mt-4"}`}>
          <TitleRowLeft>
            {" "}
            <img src="/icons/ticket-mobile-svg.svg" />{" "}
            <span>Total Ticket:</span>
          </TitleRowLeft>
          <div>{ticketsAsStringArray?.length}</div>
        </div>
        <div className={`flex justify-between ${isMobile ? "mt-2" : "mt-4"}`}>
          <TitleRowLeft>
            {" "}
            <img src="/icons/gift-mobile-svg.svg" />{" "}
            <span>Winning Ticket:</span>
          </TitleRowLeft>
          <div>{amountTicketWinning()}</div>
        </div>
      </TicketInfo>

      <Line />

      <TicketContainer>
        {ticketsAsStringArray?.map((item, index) => (
          <Ticket
            index={index}
            item={item}
            key={index}
            winningNumbers={winningNumbers}
          />
        ))}
      </TicketContainer>

      {amountTicketWinning() === 0 ? (
        <Question>
          <img src={`/icons/question-${darkMode}.svg`} />
          <span>Why didn’t I win?</span>
        </Question>
      ) : (
        <ButtonClaim
          disabled={
            isClaimed ||
            ticketsRoundCheck?.claim_status ||
            isClaimming ||  roundClaim === ticketsRoundCheck?.round
          }
          onClick={() => {
            handleCheckReward(ticketsRoundCheck?.round);
            setIsOpenWinning(true);
          }}
        >
          Claim Reward
        </ButtonClaim>
      )}
    </Modal>
  );
};

export default YourTicketHistory;

export const handleShowTicketNumber = (index) => {
  let ticketNumber = index + 1;
  if (ticketNumber.toString().length === 1) {
    return (
      <>
        #00<span>{ticketNumber}</span>
      </>
    );
  }
  if (ticketNumber.toString().length === 2) {
    return (
      <>
        #0<span>{ticketNumber}</span>
      </>
    );
  }
  return (
    <>
      #<span>{ticketNumber}</span>
    </>
  );
};
