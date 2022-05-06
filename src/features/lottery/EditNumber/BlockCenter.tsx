import { spawn } from "child_process";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getTicketsForPurchase } from "../BuyTicket/generateTicketNumber";
import { handleShowTicketNumber } from "../History/PopupYourTicketHistory";

const Container = styled.div`
  .input-parent {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 9px;
    border: 1px solid ${({ theme }) => theme.border1};
    border-radius: 15px;
    height: 63px;
    margin-bottom: 24px;
    @media screen and (max-width: 768px) {
      margin-bottom: 16px;
      height: 40px;
    }
  }
  .text-warning {
    color: #eeb049;
    padding-right: 4px;
  }

  .ticket-number {
    font-size: 14px;
    color: ${({ theme }) => theme.text11};
    margin-bottom: 12px;
    @media screen and (max-width: 768px) {
      margin-bottom: 8px;
    }
  }
  .error {
    border: 1px solid #ec5656;
  }

  .warning {
    border: 1px solid #eeb049;
  }
`;
const Input = styled.input`
  color: ${({ theme }) => theme.text12};
  font-weight: bold;
  font-size: 18px;
  background: ${({ theme }) => theme.bg2};
  width: 20px;
  padding-left: 6px;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const SubInput = ({
  defaultValue,
  handleUpdateTicket,
  ticketIndex,
  numberIndex,
  setErrorTicket,
  setIsDisableButton,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = (value) => {
    const reg = new RegExp("^[0-9]d*$");

    if (!value || reg.test(value)) {
      setValue(value);
      if (reg.test(value)) {
        handleUpdateTicket(ticketIndex, numberIndex, value);
        setErrorTicket(false);
        setIsDisableButton(false);
      } else {
        setErrorTicket(true);
        setIsDisableButton(true);
      }
    }
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => handleChangeValue(e.target.value)}
      maxLength={1}
    />
  );
};

const BlockCenter = ({
  ticketItem,
  ticketIndex,
  handleUpdateTicket,
  setIsDisableButton,
  listDuplicate,
}): JSX.Element => {
  const [errorTicket, setErrorTicket] = useState(false);
  const reversedTicket = getTicketsForPurchase([ticketItem]);

  return (
    <Container>
      <div className="flex justify-between">
        <div className="ticket-number">
          {handleShowTicketNumber(ticketIndex)}
        </div>
        {listDuplicate.includes(reversedTicket[0]) && (
          <div className="text-warning">Duplicate</div>
        )}
      </div>

      <div
        className={`input-parent ${errorTicket && "error"} ${
          listDuplicate.includes(reversedTicket[0]) && "warning"
        }`}
      >
        {ticketItem.map((item, index) => (
          <div className="flex justify-center" key={index}>
            <SubInput
              defaultValue={item}
              handleUpdateTicket={handleUpdateTicket}
              ticketIndex={ticketIndex}
              numberIndex={index}
              setErrorTicket={setErrorTicket}
              setIsDisableButton={setIsDisableButton}
            />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default BlockCenter;
