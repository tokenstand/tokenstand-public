import React from "react";
import styled from "styled-components";
import BlockTop from "./component/lotteryInstruction/BlockTop";
import BlockCenter from "./component/lotteryInstruction/BlockCenter";
import BlockBottom from "./component/lotteryInstruction/BlockBottom";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  width: 100%;
  .header {
    text-align: center;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    color: ${({ theme }) => theme.primaryText2};
    @media screen and (max-width: 768px) {
      font-size: 18px;
    }
  }
  .description {
    text-align: center;
    font-size: 17px;
    line-height: 20px;
    color: ${({ theme }) => theme.primaryText3};
    margin: 20px 0 60px;
  }
  @media screen and (max-width: 768px) {
    .description {
      font-size: 14px;
      margin: 24px 0 40px;
    }
  }
`;

const Container = styled.div`
  display: grid;
  row-gap: ${isMobile ? "40px" : "100px"};
  width: 100%;
`;
const BlockHowtoPlay = styled.div`
  background: ${({ theme }) => theme.bgHowtoPlay};
  padding-top: ${isMobile ? "40px" : "60px"};
  width: 100%;
`;

const LotteryInstruction = () => {
  return (
    <BlockHowtoPlay
      className={`grid h-full mx-auto ${
        isMobile ? " gap-6 px-4" : " gap-20 px-24"
      }`}
    >
      <Wrapper>
        <div>
          <p className="header">How To Play</p>
          <p className="description">
            If the digits on your tickets match the winning numbers in the
            correct order, you win a portion of the prize pool. Simple!
          </p>
        </div>
        <Container>
          <BlockTop />
          <BlockCenter />
          <BlockBottom />
        </Container>
      </Wrapper>
    </BlockHowtoPlay>
  );
};
export default LotteryInstruction;
