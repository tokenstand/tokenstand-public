import { Col, Row } from "antd";
import React from "react";
import styled from "styled-components";
import IDOCard from "../../components/NextIdoCard";
import { isMobile } from "react-device-detect";
import { useActiveWeb3React } from "../../hooks";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
const NextIdo = (props) => {

  const { chainId } = useActiveWeb3React();
  const { i18n } = useLingui();

  const TokenNative = (chainId === 1 || chainId === 4) ? "ETH" : "BNB"

  return (
    <NextIdoContainter >
      <GroupNextCard>
        <IDOCard />
      </GroupNextCard>
      <RowIDO className="next-row">
        <Col
          className="next-col"
          style={isMobile ? { padding: "22px 21px 33px 20px" } : { padding: "37px 55px 46px 51px" }}>
          <div className="title">
            {i18n._(t`How to take part`)}
          </div>
          <div className="label">{i18n._(t`Before Sale:`)}</div>
          <ul>
            <li className="desc">{`${i18n._(t`Buy STAND and`)} ${TokenNative} ${i18n._(t`tokens`)}`}</li>
            <li className="desc">{`${i18n._(t`Get STAND`)}-${TokenNative} ${i18n._(t`LP tokens by adding STAND and`)} ${TokenNative} ${i18n._(t`liquidity`)}`}</li>
          </ul>
          <div className="flex justify-between btn-container" >
            <ButtonCutom1 >
              {i18n._(t`Buy Token`)}
            </ButtonCutom1>
            <ButtonCutom2>
              <div>{i18n._(t`Get LP Token`)}</div>
              <svg width={isMobile ? "11" : "13"} height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
                <path d="M1.33301 1.5L7.99967 8.16667L14.6663 1.5" stroke="#72BF65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonCutom2>
          </div>
          <div className="label">{i18n._(t`During Sale:`)}</div>
          <ul>
            <li className="desc">{i18n._(t`While the sale is live, commit your STAND-LP tokens to buy the IFO tokens`)}</li>
          </ul>
          <div className="label">{i18n._(t`After Sale:`)}</div>
          <ul>
            <li className="desc">{i18n._(t`Claim the tokens you purchased, along with any unspent funds.`)}</li>
            <li className="desc">{i18n._(t`Done!`)}</li>
          </ul>
          <div className="btn-container">
            <ButtonCutom2>
              <div>{i18n._(t`See More`)}</div>
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-svg">
                <path d="M1.33301 7H14.6663" stroke="#72BF65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.83301 1.16669L14.6663 7.00002L8.83301 12.8334" stroke="#72BF65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonCutom2>
          </div>
        </Col>
        <Col
          className="next-col">
          <div className="title">{i18n._(t`Want to launch your own IFO?`)}</div>
          <p className="desc-sub">{i18n._(t`Launch your project with TOKENSTAND, Binance Smart Chain’s most-used AMM project and liquidity provider, to bring your token directly to the most active and rapidly growing community on BSC.`)}</p>
          <ButtonCutom1>{i18n._(t`Apply to Launch`)}</ButtonCutom1>
        </Col>
      </RowIDO>
    </NextIdoContainter>
  );
}

export default NextIdo;

const NextIdoContainter = styled.div`
font-family: "SF UI Display";
  .next-row {
    @media (max-width: 768px) {
      display: grid;
      grid-template-rows: repeat(1, minmax(0, 1fr));
      grid-template-columns: repeat(1, minmax(0, 1fr));
      row-gap: 39px;
    }
    @media (min-width: 769px) {
      display: grid;
      // grid-template-rows: repeat(2, minmax(0, 1fr));
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-gap: 40px 50px;
    }
    .next-col {
      color: ${({ theme }) => theme.primaryText2};
      padding: 37px 55px 46px 51px;
      border: 1px solid ${({ theme }) => theme.border1};
      background-color: ${({ theme }) => theme.bg2};
      border-radius: 20px;
      box-shadow: 0px 4px 30px rgba(0, 28, 78, 0.05);
      @media (max-width : 640px) {
        padding: 22px 21px 33px 20px;
        margin-left: 0px;
        margin-right: 0px;
      }

      .btn-container {
        margin-top: 29px;
        @media (max-width : 640px) {
          margin-top: 22px;
        }
      }

      ul {
        list-style-type: disc;
        margin-left: 25px;
      }

      .title {
        font-weight: 600;
        font-size: 24px;
        @media (max-width : 640px) {
          font-size: 18px;
        }
      }

      .label {
        margin-top: 19px;
        font-weight: 600;
        font-size: 18px;
        @media (max-width : 640px) {
          font-size: 16px;
          margin-top: 12px;
        }
      }
      .desc {
        margin-top: 14px;
        font-weight: normal;
        font-size: 16px;
        @media (max-width : 640px) {
          font-size: 14px;
          margin-top: 17px;
        }
      }
      .desc-sub{
        text-transform: capitalize;
        margin-top: 14px;
        font-weight: normal;
        font-size: 16px;
        letter-spacing: 0.015em;
        @media (max-width : 640px) {
          font-size: 14px;
          margin-top: 17px;
        }
      }
    }
  }
`

const ButtonCutom1 = styled.button`
  background: ${({ theme }) => theme.greenButton};
  border-radius: 15px;
  color: ${({ theme }) => theme.white};
  font-size: 18px;
  font-weight: 700;
  height: 63px;
  width: 41.5%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  @media (max-width : 640px) {
    font-size: 14px;
    height: 40px;
    border-radius : 10px;
    width: 47%;
  }
`
const ButtonCutom2 = styled.button`
  color: ${({ theme }) => theme.greenButton};
  backgound-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.greenButton};
  border-radius: 15px;
  font-size: 18px;
  font-weight: 700;
  height: 63px;
  width: 50%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;
  @media (max-width : 640px) {
    font-size: 14px;
    height: 40px;
    border-radius : 10px;
    width: 47%;
  }
`
const RowIDO = styled.div``
const GroupNextCard = styled.div`
  margin-bottom: 50px;
  @media (max-width: 768px) {
    display: grid;
    grid-template-rows: repeat(1, minmax(0, 1fr));
    grid-template-columns: repeat(1, minmax(0, 1fr));
    row-gap: 39px;
  }
  @media (min-width: 769px) {
    display: grid;
    // grid-template-rows: repeat(2, minmax(0, 1fr));
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px 50px;
  }
`