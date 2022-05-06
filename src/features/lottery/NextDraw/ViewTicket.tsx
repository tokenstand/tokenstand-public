import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import CloseIcon from "../../../components/CloseIcon";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { parseRetrievedNumber } from "../BuyTicket/generateTicketNumber";
import { ButtonBuy } from "../BuyTicket";
import { handleShowTicketNumber } from "../History/PopupYourTicketHistory";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const TicketContainer = styled.div`
  margin-top: 24px;
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
    @media screen and (max-width: 768px) {
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
`;

type ViewTicketProps = {
  isOpen: boolean;
  onDismiss: () => void;
  setIsOpenBuyTicket?: React.Dispatch<React.SetStateAction<boolean>>;
  ticketCurrent: any;
  roundId: any;
  endTime: any;
};

const Ticket = ({ index, item }): JSX.Element => {
  return (
    <Container>
      <div className="ticket-number">{handleShowTicketNumber(index)}</div>
      <div className="input-parent">
        {item.map((item, index) => (
          <div className="flex justify-center items-center" key={index}>
            <div className="flex justify-center items-center">{item}</div>
          </div>
        ))}
      </div>
    </Container>
  );
};

const ViewTicket: React.FC<ViewTicketProps> = ({
  isOpen,
  onDismiss,
  setIsOpenBuyTicket,
  ticketCurrent,
  roundId,
  endTime,
}) => {
  const NOW = Date.now() / 1000;

  const handleShowBuyTicket = () => {
    setIsOpenBuyTicket(true);
    onDismiss();
  };

  const ticketsAsStringArray = ticketCurrent?.map((ticket) =>
    parseRetrievedNumber(ticket.toString()).split("")
  );

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">Round #{roundId}</TitleStyle>
        <CloseIcon onClick={onDismiss} />
      </div>

      <TicketContainer>
        {ticketsAsStringArray?.map((item, index) => (
          <Ticket index={index} item={item} key={index} />
        ))}
      </TicketContainer>

      <div className="mt-7">
        <ButtonBuy disabled={endTime < NOW} onClick={handleShowBuyTicket}>
          Buy Ticket
        </ButtonBuy>
      </div>
    </Modal>
  );
};

export default ViewTicket;
