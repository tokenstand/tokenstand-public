import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import BridgeTokenHistoryModal from "./BridgeTokenHistory";
import { useActiveWeb3React } from "../../hooks";

const Wrapper = styled.div`
  border-radius: 20px;
  padding: 21px 16px 30px;
  position: absolute;
  z-index: 10;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  ${({ theme }) =>
    `border: 1px solid ${theme.borderCard};
    background: ${theme.bgCard1};
    box-shadow: 0px 4px 30px ${theme.boxShadowCard};`}

  @media screen and (min-width: 576px) {
    max-width: 585px;
    margin: 0 auto;
    padding: 31px 30px 30px;
  }
`;

const Content = styled.div``;
const SwapHeader = styled.div`
  display: flex;
  position: relative;
`;
const ButtonHistory = styled.button`
  display: flex;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600;
  font-size: ${isMobile ? "12px" : "16px"};
  line-height: 126.5%;
  position: absolute;
  right: 0;
  width: ${isMobile ? "83px" : "122px"};
  height: ${isMobile ? "28px" : "40px"};
  background: ${({ theme }) => theme.ButtonHistory};
  justify-content: space-evenly;
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${({ theme }) => theme.primaryText2};
  svg {
    path {
      fill: ${({ theme }) => theme.primaryText2};
    }
  }
`;

const Heading = styled.h1`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 12px;

  @media screen and (min-width: 576px) {
    font-size: 24px;
    margin-bottom: 26px;
  }
`;

const SwapCard = ({ heading, children }) => {
  const { account } = useActiveWeb3React();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <SwapHeader>
        <Heading>{heading}</Heading>
        {account && (
          <ButtonHistory
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <svg
              width={`${isMobile ? "14px" : "21px"}`}
              height={`${isMobile ? "12px" : "18px"}`}
              viewBox="0 0 21 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C9.61305 0 7.32387 0.948211 5.63604 2.63604C3.94821 4.32387 3 6.61305 3 9H0L3.89 12.89L3.96 13.03L8 9H5C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 12.87 15.87 16 12 16C10.07 16 8.32 15.21 7.06 13.94L5.64 15.36C6.47341 16.198 7.46449 16.8627 8.55606 17.3158C9.64764 17.769 10.8181 18.0015 12 18C14.3869 18 16.6761 17.0518 18.364 15.364C20.0518 13.6761 21 11.3869 21 9C21 6.61305 20.0518 4.32387 18.364 2.63604C16.6761 0.948211 14.3869 3.55683e-08 12 0ZM11 5V10L15.25 12.52L16.02 11.24L12.5 9.15V5H11Z"
                fill="white"
                fillOpacity="0.87"
              />
            </svg>
            History
          </ButtonHistory>
        )}
      </SwapHeader>
      <Content>{children}</Content>
      {isOpen && (
        <BridgeTokenHistoryModal
          isOpen={isOpen}
          onDismiss={() => {
            setIsOpen(false);
          }}
        />
      )}
    </Wrapper>
  );
};

export default SwapCard;
