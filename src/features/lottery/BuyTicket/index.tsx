import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import styled from "styled-components";
import CloseIcon from "../../../components/CloseIcon";
import InputBuyTicket from "./InputBuyTicket";
import { ApprovalState } from "../../../hooks/useApproveCallback";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import Loader from "../../../components/Loader";
import { isMobile } from "react-device-detect";
import { useCurrencyBalance } from "../../../state/wallet/hooks";
import { STAND } from "../../../constants";
import { ButtonConnect } from "../../../components/MobileScreen/PoolItem";
import { formatEther, parseEther } from "ethers/lib/utils";
import { formatAmount } from "../../../utils";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const Balance = styled.div`
  color: ${({ theme }) => theme.balanceText};
  font-weight: 500;
  font-size: 14px;
  text-align: right;
  margin-top: 16px;
  @media screen and (max-width: 768px) {
    margin-top: 13px;
  }
`;

const ButtonNumber = styled.button`
  width: 100px;
  height: 40px;
  background: rgba(114, 191, 101, 0.15);
  color: #72bf65;
  border-radius: 8px;
  font-weight: bold;
  font-size: 17px;
  @media screen and (max-width: 768px) {
    width: 65px;
  }
`;

const Calculate = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText3};

  .percent {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 600;
    padding-right: 4px;
  }
`;

const YouPay = styled.div`
  padding: 24px 0px;
  border-top: 1px solid ${({ theme }) => theme.borderNFT};

  p {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 600;
    font-size: 17px;
  }
  @media screen and (max-width: 768px) {
    padding: 13px 0px 14px;
  }
`;
const Container = styled.div`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ButtonBuy = styled.button`
  background: #72bf65;
  border-radius: 15px;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  height: 63px;
  width: 100%;

  :disabled {
    background: ${({ theme }) => theme.buttonDisable};
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    :hover {
      opacity: 1;
    }
  }

  > span {
    margin-right: 8px;
  }

  :hover {
    opacity: 0.8;
  }

  @media screen and (max-width: 768px) {
    height: 40px;
    font-size: 14px;
  }
`;

const ButtonEdit = styled(ButtonBuy)`
  color: #72bf65;
  height: 63px;
  background: rgba(114, 191, 101, 0.15);
  margin-top: 16px;
  @media screen and (max-width: 768px) {
    height: 40px;
    font-size: 14px;
    margin-top: 12px;
  }
`;

const Note = styled.div`
  margin-top: 24px;
  color: ${({ theme }) => theme.primaryText3};
  font-size: 14px;

  @media screen and (max-width: 768px) {
    margin-top: 16px;
  }
`;
interface BuyTicketProps {
  isOpen: boolean;
  onDismiss: () => void;
  setIsOpenEditNumber: any;
  approvalState: any;
  approveCallback: any;
  handleConnect: any;
  setInputValue: any;
  inputValue: string;
  handleClickCloseBuy: () => void;
  handleBuyTicket: () => void;
  isBuying: boolean;
  dataLottery: any;
  setTotalCost: any;
}

const PopupBuyTicket = ({
  isOpen,
  onDismiss,
  setIsOpenEditNumber,
  approvalState,
  approveCallback,
  handleConnect,
  setInputValue,
  inputValue,
  handleClickCloseBuy,
  handleBuyTicket,
  isBuying,
  dataLottery,
  setTotalCost,
}: BuyTicketProps) => {
  const { account, chainId } = useActiveWeb3React();

  const [messageButtonBuy, setMessageButtonBuy] = useState("Buy Instantly");
  const balanceSTAND = useCurrencyBalance(account ?? undefined, STAND[chainId]);
  const [totalPriceTicket, setTotalPriceTicket] = useState(0);
  const [valueDiscount, setValueDiscount] = useState(0);
  const [pricePayFinal, setPricePayFinal] = useState("0");

  const priceTicketInStand = dataLottery.priceTicketInStand;

  const handleApprove = useCallback(async () => {
    await approveCallback();
  }, [approveCallback]);

  //validate when entering the purchase number of tickets
  const handleUserInput = (value) => {
    const regExp = new RegExp("^([0-9]{0,1}[0-9]{0,1})d*$"); // type from 1 to 100

    if (
      !value ||
      (regExp.test(value) && !value.includes("d")) ||
      Number(value) === 100
    ) {
      setInputValue(value);
    }
  };

  const calculatorPrice = (value) => {
    const totalPrice =
      priceTicketInStand && priceTicketInStand.mul(Number(value));
    setTotalPriceTicket(totalPrice);
    if (Number(value) > 1) {
      const payFinal = totalPrice.mul(10000 - 5 * Number(value - 1)).div(10000);
      setValueDiscount(totalPrice.mul(5 * Number(value - 1)).div(10000));
      setPricePayFinal(payFinal);
      setTotalCost(totalPrice.mul(10000 - 5 * Number(value - 1)).div(10000));
    } else {
      setValueDiscount(0);
      setPricePayFinal(totalPrice);
      setTotalCost(totalPrice);
    }
  };

  useEffect(() => {
    calculatorPrice(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (
      approvalState === ApprovalState.UNKNOWN ||
      approvalState === ApprovalState.NOT_APPROVED
    ) {
      setMessageButtonBuy("Approve STAND");
    } else if (approvalState === ApprovalState.PENDING) {
      setMessageButtonBuy("Approving");
    } else if (
      balanceSTAND &&
      parseEther(formatEther(pricePayFinal)).gt(
        parseEther(balanceSTAND?.toExact())
      )
    ) {
      setMessageButtonBuy("Insufficient STAND Blance");
    } else {
      setMessageButtonBuy("Buy Instantly");
    }
  }, [approvalState, balanceSTAND, pricePayFinal]);

  // when the Buy button is clicked
  const handleBuyClick = () => {
    if (
      approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.UNKNOWN
    ) {
      handleApprove();
    } else {
      handleBuyTicket();
    }
  };

  // when the View/Edit button is clicked
  const handleClickEdit = () => {
    onDismiss();
    setIsOpenEditNumber();
  };

  useEffect(() => {
    if (!inputValue) {
      setValueDiscount(0);
      setPricePayFinal("0");
      setTotalPriceTicket(0);
    }
  }, [inputValue]);

  const NOW = Date.now() / 1000;

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClickCloseBuy}
      padding={24}
      maxWidth={523}
    >
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">Buy Ticket</TitleStyle>
        <CloseIcon onClick={handleClickCloseBuy} />
      </div>

      <Container>
        <InputBuyTicket
          handleUserInput={handleUserInput}
          inputValue={inputValue}
          totalPriceTicket={totalPriceTicket}
        />
        <Balance>
          STAND Balance: {balanceSTAND ? balanceSTAND?.toExact() : "-"}
        </Balance>

        <div className={`flex justify-between ${isMobile ? "mt-5" : "mt-8"} `}>
          <ButtonNumber onClick={() => setInputValue("2")}>2</ButtonNumber>
          <ButtonNumber onClick={() => setInputValue("5")}>5</ButtonNumber>
          <ButtonNumber onClick={() => setInputValue("10")}>10</ButtonNumber>
          <ButtonNumber onClick={() => setInputValue("100")}>MAX</ButtonNumber>
        </div>

        <Calculate>
          <div
            className={`flex justify-between  ${isMobile ? "mt-5" : "mt-8"} `}
          >
            <span>Cost (STAND)</span>
            <span>
              ~ {formatAmount(formatEther(totalPriceTicket), 0, 4)} STAND
            </span>
          </div>

          <div className={`flex justify-between ${isMobile ? "mt-1" : "mt-2"}`}>
            <span className="flex justify-center">
              <p className="percent">
                {Number(inputValue) > 1
                  ? ((Number(inputValue) - 1) * 0.05).toFixed(2)
                  : "0.00"}
                %{" "}
              </p>{" "}
              Bulk discount
            </span>
            <span>
              ~ {formatAmount(formatEther(valueDiscount), 0, 4)} STAND
            </span>
          </div>

          <YouPay className="flex justify-between mt-2">
            <span>You Pay</span>
            <p>~ {formatAmount(formatEther(pricePayFinal), 0, 4)} STAND</p>
          </YouPay>
        </Calculate>

        {account ? (
          <ButtonBuy
            className="flex justify-center items-center"
            disabled={
              messageButtonBuy === "Approving" ||
              (approvalState === ApprovalState.APPROVED &&
                Number(inputValue) === 0) ||
              (approvalState === ApprovalState.APPROVED && balanceSTAND &&
                parseEther(formatEther(pricePayFinal)).gt(
                  parseEther(balanceSTAND?.toExact())
                )) ||
              isBuying ||
              dataLottery.endTime < NOW
            }
            onClick={handleBuyClick}
          >
            <span>{messageButtonBuy}</span>
            {approvalState === ApprovalState.PENDING && (
              <Loader stroke="white" />
            )}
          </ButtonBuy>
        ) : (
          <ButtonConnect onClick={handleConnect}>Connect Wallet</ButtonConnect>
        )}

        <ButtonEdit
          disabled={
            !account || 
            Number(inputValue) === 0 ||
            approvalState !== ApprovalState.APPROVED ||
            isBuying ||
            (balanceSTAND &&
              parseEther(formatEther(pricePayFinal)).gt(
                parseEther(balanceSTAND?.toExact())
              )) ||
            dataLottery.endTime < NOW
          }
          onClick={handleClickEdit}
        >
          View/ Edit Number
        </ButtonEdit>

        <Note>
          “Buy Instantly" chooses random numbers, with no duplicates among your
          tickets. Prices are set before each round starts equal to $5 at that
          time purchases are final.
        </Note>
      </Container>
    </Modal>
  );
};

export default PopupBuyTicket;
