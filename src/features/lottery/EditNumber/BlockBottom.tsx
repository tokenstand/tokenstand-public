import React from "react";
import styled from "styled-components";
import { useIsDarkMode } from "../../../state/user/hooks";
import { isMobile } from "react-device-detect";

const Block = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border1};
  .go-back {
    font-weight: 600;
    font-size: 17px;
    color: ${({ theme }) => theme.text12};
    img {
      margin-right: 12px;
      margin-top: 5px;
    }
    @media screen and (max-width: 768px) {
      font-size: 14px;
      img {
        margin-right: 11px;
      }
    }
  }
`;
const ButtonConfirm = styled.button`
  width: 100%;
  height: 63px;
  background: #72bf65;
  border-radius: 15px;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  margin: 33px 0px;
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
    height: 40px;
    font-size: 14px;
    margin: 24px 0px;
  }
`;

const BlockBottom = ({
  handleClose,
  handleBuyTicket,
  isDisableButton,
  isBuying,
}) => {
  const darkMode = useIsDarkMode();

  return (
    <Block>
      <ButtonConfirm disabled={isDisableButton || isBuying} onClick={handleBuyTicket}>
        Confirm And Buy
      </ButtonConfirm>
      <div className="flex justify-center items-center">
        <button className="flex go-back" onClick={handleClose}>
          <img
            src={`./icons/back-icons-${darkMode}.png`}
            alt=""
            width={isMobile && 13}
            height={isMobile && 13}
          />
          <div>Go Back</div>
        </button>
      </div>
    </Block>
  );
};
export default BlockBottom;
