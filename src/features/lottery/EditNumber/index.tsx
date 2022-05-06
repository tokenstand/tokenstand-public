import React, { useState } from "react";
import Modal from "../../../components/Modal";
import Header from "./Header";
import BlockBottom from "./BlockBottom";
import BlockCenter from "./BlockCenter";
import styled from "styled-components";
import { useIsDarkMode } from "../../../state/user/hooks";
import { formatEther } from "ethers/lib/utils";
import { formatAmount } from "../../../utils";

const Content = styled.div`
  margin: 32px 0px;
  max-height: 260px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6.6px;
    height: 6.6px;
    background-color: ${({ theme }) => theme.bg3};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: ${({ theme }) => theme.bg4};
  }
  @media screen and (max-width: 768px) {
    margin: 16px 0px 24px;
  }
`;

const ContentContainer = styled.div`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Block = styled.div`
  margin-top: 30px;
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.text11};
    margin: 24px 0px;
    @media screen and (max-width: 768px) {
      margin: 16px 0px;
    }
  }
  .amount {
    .cost {
      font-size: 17px;
      color: ${({ theme }) => theme.text11};
    }
    .stand-amount {
      font-weight: 600;
      font-size: 17px;
      color: ${({ theme }) => theme.text12};
    }
  }
  @media screen and (max-width: 768px) {
    .amount {
      .cost {
        font-size: 14px;
      }
      .stand-amount {
        font-size: 14px;
      }
    }
  }
`;
const ButtonRandom = styled.button`
  background: rgba(114, 191, 101, 0.15);
  width: 100%;
  height: 63px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: #72bf65;

  :hover {
    opacity: 0.8;
  }

  @media screen and (max-width: 768px) {
    height: 40px;
    font-size: 14px;
  }
`;

const EditNumber = ({
  onDismiss,
  isOpen,
  setIsOpenBuyTicket,
  arrTicketFinal,
  handleRadonmize,
  handleUpdateTicket,
  handleBuyTicket,
  listDuplicate,
  isBuying,
  totalCost,
}): JSX.Element => {
  const [isDisableButton, setIsDisableButton] = useState(false);

  const handleClose = () => {
    onDismiss();
    setIsOpenBuyTicket();
  };

  return (
    <Modal
      onDismiss={onDismiss}
      isOpen={isOpen}
      className="modal-style"
      maxHeight={400}
    >
      <Header onDismiss={onDismiss} handleClose={handleClose} />
      <ContentContainer>
        <Block>
          <div className="amount flex justify-between">
            <div className="cost">Total Cost</div>
            <div className="stand-amount">
              ~ {formatAmount(formatEther(totalCost), 0, 4)} STAND
            </div>
          </div>
          <p>
            Numbers are randomized, with no duplicates among your tickets. Tap a
            number to edit it available digits: 0-9
          </p>
          <ButtonRandom onClick={handleRadonmize}>Randomize</ButtonRandom>
        </Block>
        <Content>
          {arrTicketFinal.map((item, index) => (
            <BlockCenter
              ticketItem={item}
              ticketIndex={index}
              key={index}
              handleUpdateTicket={handleUpdateTicket}
              setIsDisableButton={setIsDisableButton}
              listDuplicate={listDuplicate}
            />
          ))}
        </Content>
        <BlockBottom
          handleClose={handleClose}
          handleBuyTicket={handleBuyTicket}
          isDisableButton={isDisableButton}
          isBuying={isBuying}
        />
      </ContentContainer>
    </Modal>
  );
};
export default EditNumber;
