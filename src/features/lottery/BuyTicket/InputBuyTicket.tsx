import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { formatEther } from "ethers/lib/utils";
import { formatAmount } from "../../../utils";

const MainInput = styled.div`
  margin-top: 36px;
  color: ${({ theme }) => theme.lblColor};

  .text-buy {
    font-size: 17px;
    font-weight: 500;
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }

  .text-ticket {
    color: ${({ theme }) => theme.primaryText2};
    font-size: 17px;
    font-weight: 600;
    span {
      margin-right: 14px;
    }
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }

  .md-text {
    color: ${({ theme }) => theme.primaryText3};
    font-weight: 500;
    font-size: 14px;
  }
`;

const InputBlock = styled.div`
  background: ${({ theme }) => theme.bgTab};
  border-radius: 15px;
  padding: 15px 24px;
  margin-top: 16px;
  text-align: right;

  .thin-text {
    color: ${({ theme }) => theme.titleHistory};
    font-size: 14px;
    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
  }
  @media screen and (max-width: 768px) {
    padding: 12px 16px;
    margin-top: 13px;
  }
`;

const InputNumber = styled.input`
  width: 100%;
  background: transparent;
  font-size: 17px;
  font-weight: 500;
  text-align: right;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.primaryText2};

  &::placeholder {
    color: ${({ theme }) => theme.subText};
  }
`;

interface InputBuyTicketProps {
  handleUserInput: (value) => void;
  inputValue: any;
  totalPriceTicket: any;
}

const InputBuyTicket = ({
  handleUserInput,
  inputValue,
  totalPriceTicket,
}: InputBuyTicketProps) => {
  return (
    <MainInput>
      <div className="flex justify-between">
        <span className="text-buy">Buy</span>
        <div className="flex justify-center items-center text-ticket">
          <span>Ticket</span>
          <img
            src="/images/icon-ticket.png"
            width={isMobile && 20}
            height={isMobile && 15}
          />
        </div>
      </div>

      <InputBlock>
        <InputNumber
          placeholder="0"
          value={inputValue}
          onChange={(e) => handleUserInput(e.target.value)}
        />
        <div className="thin-text">
          ~ {formatAmount(formatEther(totalPriceTicket), 0, 4)} STAND
        </div>
      </InputBlock>
    </MainInput>
  );
};

export default InputBuyTicket;
