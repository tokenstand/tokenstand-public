/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Trans, t } from "@lingui/macro";
import styled from "styled-components";
import UnlockPopup from './UnlockPopup'
import { isMobile } from "react-device-detect";


export default function IDOCard() {
  const [isOpenUnlockPopup, setIsOpenUnlockPopup] = useState(false)
  const [showDescription, setShowDescription] = useState(false);
  const showDescriptionEvent = () => {
    setShowDescription(!showDescription);
}
  const handleUnlockWallet = () => {
    setIsOpenUnlockPopup(true)
  }

  const onDismissUnlockPopup = () => {
    setIsOpenUnlockPopup(false)
  }

  const IdoItem = styled.div`
  width: 100%;

  box-shadow: 0px 4px 30px rgba(0, 28, 78, 0.05);
  border: 1px solid ${({ theme }) => theme.borderSwitch};
  border-radius: 20px;

    & .item-total {
      display: flex;
      justify-content: space-between;
      background: ${({ theme }) => theme.bgrLinear};
      padding: 27px 29px;
      align-items: center;
      text-align: center;
      place-content: center;
      flex-direction: column;
       border-radius: 20px 20px 0px 0px;
       border-bottom: 1px solid ${({ theme }) => theme.borderSwitch};
      
    }

    & .tip {
      display: flex;
      place-content: center;
      flex-direction: column;
      align-items: center;
      text-align: center;
      place-content: center;
      margin-top: 1rem;
      & .hide-title {
        f
      }
      & .tip-key {
        font-size: 16px;
      }
    }
    & .ido-content {
      & .key {
        font-size: 16px;
        color: ${({ theme }) => theme.primaryText3};
        @media (max-width : 640px) {
          font-size : 14px;
        }
        @media (max-width : 1024px) {
          @media (min-width : 768px) {
            font-size : 14px;
          }
        }
      }
      & .value {
        color: ${({ theme }) => theme.primaryText2};
        font-size: 16px;
        @media (max-width : 640px) {
          font-size : 14px;
        }
        @media (max-width : 1024px) {
          @media (min-width : 768px) {
            font-size : 14px;
          }
        }
      }
      .value-color{
        color: #72BF65;
      }
     
      .style-border{
        border: 1px dashed ${({ theme }) => theme.borderDashColor};
      }
    }
    
  `;

  const Title = styled.h4`
    color: ${({ theme }) => theme.text1};
    font-size: 24px;
    @media (max-width : 640px) {
      font-size : 18px;
    }
    @media (max-width : 1024px) {
      @media (min-width : 768px) {
        font-size : 18px;
      }
    }

  `;
  const Description = styled.p`
    font-weight: normal;
    font-size: 16px;
    color: ${({ theme }) => theme.primaryText2};
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    line-height: 150%;
    font-family: SF UI Display;

    @media (max-width : 640px) {
      font-size : 14px;
    }
    @media (max-width : 1024px) {
      @media (min-width : 768px) {
        font-size : 14px;
      }
    }
    
  `;
  const BoxContent = styled.div`
    padding: 0 29px;
    // border: 1px solid ${({ theme }) => theme.borderSwitch};
    // border-radius: 0px 0px 20px 20px;
    @media (max-width : 640px) {
      padding: 0 16px;
    }
    @media (max-width : 1024px) {
      @media (min-width : 768px) {
        padding: 0 16px;
      }
    }
    .style-Button{
      
    }
    .icon-svg{
      display: block;
    
      @media (max-width: 500px){
        display: none;
      }
    }
  `;

  const Status = styled.span`
    color: ${({ theme }) => theme.primary1};
    font-size: 16px;
    @media (max-width : 640px) {
      font-size : 14px;
    }
    @media (max-width : 1024px) {
      @media (min-width : 768px) {
        font-size : 14px;
      }
    }
  `;

  const SmallLine = styled.div`
    background: ${({ theme }) => theme.primary1};
    width: 43px;
    height: 6px;
    border-radius: 20px;
    margin-bottom: 0.4rem;
  `;
  const ButtonCutom1 = styled.button`
    background: ${({ theme }) => theme.greenButton};
    border-radius: 15px;
    color: ${({ theme }) => theme.white};
    font-size: 18px;
    font-weight: 700;
    height: 63px;
    width: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-bottom : 40px;
    @media (max-width : 640px) {
      font-size : 14px;
      height : 40px;
      border-radius: 10px;
      margin-bottom : 20px;
    }

    @media (max-width : 1024px) {
      @media (min-width : 768px) {
        font-size : 14px;
        height : 40px;
      border-radius: 10px;
      margin-bottom : 20px;
      }
    }
  `;
  const ButtonCutom2 = styled.button`
    color: ${({ theme }) => theme.greenButton};
    backgound-color: ${({ theme }) => theme.white};
    border: 1px solid ${({ theme }) => theme.greenButton};
    border-radius: 15px;
    font-size: 18px;
    font-weight: 700;
    height: 63px;
    width: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-bottom : 40px;
    grid-gap: 10px;
    @media (max-width : 640px) {
      font-size : 14px;
      height : 40px;
      border-radius: 10px;
      margin-bottom : 20px;
    }

    @media (max-width : 1024px) {
      @media (min-width : 768px) {
        font-size : 14px;
        height : 40px;
      border-radius: 10px;
      margin-bottom : 20px;
      }
    }

  `;
  const ButtonToggle = styled.button`
    font-size: 18px;
    color: ${({ theme }) => theme.primaryText2};
    line-height: 170%;
    display: flex;
    align-items: center;
    grid-gap: 8px;
    @media (max-width : 640px) {
      font-size : 16px;
    }
  `
  const StyleButton = styled.div`
     grid-gap: 18px;
     padding-top: ${({ isOpen }) => (isOpen ? '30px' : '79px')};
  `

  return (
    <IdoItem>
      <div className="item-total">
        <img
          width={isMobile ? "33" : "50"}
          height={isMobile ? "33" : "50"}
          src={
            "https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
          }
        />{" "}
        <Title className="font-bold">Soteria</Title>
        <Description>
          A blockchain based mutual to share the risk of DeFi on Binance Smart
          Chain
        </Description>
        <SmallLine />
        <Status>Finish</Status>
      </div>

      <BoxContent>
        <div className="tip">
          <ButtonToggle className="font-bold hide-title" onClick={showDescriptionEvent}>
            {
              showDescription ? 
              <div className="flex gap-2 items-center">
                <span>Hide</span>
                <img src="/icons/icon-up.svg" />
              </div>
            :
            <div className="flex gap-2 items-center">
                <span>Show</span>
                <img src="/icons/icon-down.svg" />
            </div>
            }
          </ButtonToggle>
          
          <Description isOpen={showDescription}>
            Soteria allows users to buy insurance cover to greatly diminish or
            reduce the financial risk of hacks.
          </Description>
        </div>

        <div className="ido-content">
          <hr className="style-border" />
          <div className="flex justify-between my-1 pt-3">
            <span className="order-first key">Launch Time</span>
            <span className="value">Jan.21, <span className="value-color">4PM UTC</span></span>
          </div>
          <div className="flex justify-between my-2">
            <span className="order-first key">For sale</span>
            <span className="value">$1,236,000</span>
          </div>
          <div className="flex justify-between my-2">
            <div className="order-first key">To raise (USD)</div>
            <div className="value">10 SDC-BNB LP</div>
          </div>
          <div className="flex justify-between my-2">
            <span className="order-first key">CAKE to burn</span>
            <span className="value">9.55%</span>
          </div>
          <div className="flex justify-between my-2">
            <span className="order-first key">Pool APY</span>
            <span className="value">9.55%</span>
          </div>
          <StyleButton className="flex justify-between my-2 pt-2 "  isOpen={showDescription}>
            <ButtonCutom1 onClick={handleUnlockWallet} className="order-first ">Unlock wallet</ButtonCutom1>
            <UnlockPopup isOpenUnlockPopup={isOpenUnlockPopup} onDismissUnlockPopup={onDismissUnlockPopup} />
            <ButtonCutom2>
              <div>View Project Site </div> {' '}
              <svg
                width="16"
                height="16"
                className="icon-svg"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4367 1.01417C15.3951 0.913874 15.3342 0.822711 15.2575 0.745834L15.2542 0.7425C15.0982 0.586996 14.8869 0.499773 14.6667 0.5H9.66667C9.44565 0.5 9.23369 0.587798 9.07741 0.744078C8.92113 0.900358 8.83333 1.11232 8.83333 1.33333C8.83333 1.55435 8.92113 1.76631 9.07741 1.92259C9.23369 2.07887 9.44565 2.16667 9.66667 2.16667H12.655L6.5775 8.24417C6.49791 8.32104 6.43442 8.41299 6.39075 8.51466C6.34707 8.61633 6.32409 8.72568 6.32312 8.83633C6.32216 8.94698 6.34325 9.05672 6.38515 9.15913C6.42705 9.26154 6.48893 9.35459 6.56717 9.43283C6.64541 9.51107 6.73846 9.57295 6.84087 9.61485C6.94328 9.65675 7.05302 9.67784 7.16367 9.67688C7.27432 9.67591 7.38367 9.65293 7.48534 9.60925C7.58701 9.56558 7.67896 9.50209 7.75583 9.4225L13.8333 3.345V6.33333C13.8333 6.55435 13.9211 6.76631 14.0774 6.92259C14.2337 7.07887 14.4457 7.16667 14.6667 7.16667C14.8877 7.16667 15.0996 7.07887 15.2559 6.92259C15.4122 6.76631 15.5 6.55435 15.5 6.33333V1.33333V1.33083C15.5 1.2225 15.4783 1.11583 15.4367 1.01417ZM0.5 4.66667C0.5 3.5616 0.938987 2.50179 1.72039 1.72039C2.50179 0.938987 3.5616 0.5 4.66667 0.5H5.5C5.72101 0.5 5.93297 0.587798 6.08926 0.744078C6.24554 0.900358 6.33333 1.11232 6.33333 1.33333C6.33333 1.55435 6.24554 1.76631 6.08926 1.92259C5.93297 2.07887 5.72101 2.16667 5.5 2.16667H4.66667C4.00363 2.16667 3.36774 2.43006 2.8989 2.8989C2.43006 3.36774 2.16667 4.00363 2.16667 4.66667V11.3333C2.16667 11.9964 2.43006 12.6323 2.8989 13.1011C3.36774 13.5699 4.00363 13.8333 4.66667 13.8333H11.3333C11.9964 13.8333 12.6323 13.5699 13.1011 13.1011C13.5699 12.6323 13.8333 11.9964 13.8333 11.3333V10.5C13.8333 10.279 13.9211 10.067 14.0774 9.91074C14.2337 9.75447 14.4457 9.66667 14.6667 9.66667C14.8877 9.66667 15.0996 9.75447 15.2559 9.91074C15.4122 10.067 15.5 10.279 15.5 10.5V11.3333C15.5 12.4384 15.061 13.4982 14.2796 14.2796C13.4982 15.061 12.4384 15.5 11.3333 15.5H4.66667C3.5616 15.5 2.50179 15.061 1.72039 14.2796C0.938987 13.4982 0.5 12.4384 0.5 11.3333V4.66667Z"
                  fill="#72BF65"
                />
              </svg>
            </ButtonCutom2>
          </StyleButton>
        </div>
      </BoxContent>
    </IdoItem>
  );
}
