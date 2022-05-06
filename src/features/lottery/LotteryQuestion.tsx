import React from "react";
import styled from "styled-components";
import { useIsDarkMode } from "../../state/user/hooks";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  padding: 50px 70px 78px;
  width: 100%;
  background: ${({ theme }) => theme.bgQuestion};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  margin-bottom: ${isMobile ? "0px" : "50px"};

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 24px;
    .contain {
      flex-direction: column;
    }
    padding: 24px;
  }
`;
const BlockQuestion = styled.div`
  width: 100%;
`;

const Question = styled.div`
  .header {
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    color: ${({ theme }) => theme.primaryText2};
  }
  .description {
    font-size: 17px;
    line-height: 150%;
    color: ${({ theme }) => theme.primaryText3};
    width: 542px;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    margin-left: 0px;
    margin-bottom: 20px;
    .header {
      font-size: 18px;
      line-height: 29px;
      justify-content: center;
      margin-bottom: 14px;
    }
    .description {
      font-size: 14px;
      width: auto;
      text-align: center;
    }
    .button {
      justify-content: center;
    }
  }
`;
const Ticket = styled.div``;
const Button = styled.button`
  padding: 18px 32px;
  font-weight: 600;
  background: #72bf65;
  border-radius: 8px;
  font-size: 17px;
  line-height: 20px;
  color: #ffffff;
  img {
    margin-left: 14px;
    margin-top: 3px;
  }

  :hover {
    opacity: 0.8;
  }
  @media screen and (max-width: 768px) {
    padding: 11px 32px 12px;
    font-size: 14px;
  }
`;

export default function LotteryQuestion(): JSX.Element {
  const darkMode = useIsDarkMode();
  return (
    <BlockQuestion
      className={`grid h-full mx-auto ${
        isMobile ? " gap-6 px-4" : " gap-20 px-24"
      }`}
    >
      <Wrapper>
        <div className="flex items-center justify-between contain">
          <Question>
            <div className="header flex">Still got questions?</div>
            <p className="description">
              In case you’ve got any questions about the lottery, we invite you
              to go over our detailed explanation in the docs section.
            </p>
            <div className="button flex">
              <Button className="flex">
                More Detail
                <img
                  src={
                    isMobile
                      ? `/icons/arrow-right-resp.svg`
                      : `/icons/arrow-right.svg`
                  }
                />
              </Button>
            </div>
          </Question>
          <Ticket className="relative flex items-center justify-center">
            <div className="absolute ">
              <img
                src={darkMode ? "/icons/ticket.png" : "/icons/asset_2006.png"}
                height={isMobile && 40}
                width={isMobile && 200}
                className="ticket"
                style={{ marginTop: 20 }}
              />
            </div>
            {isMobile ? (
              <img src="/images/planet-lottery-mobile.png" />
            ) : (
              <img src="/images/planet-lottery.png" />
            )}
          </Ticket>
        </div>
      </Wrapper>
    </BlockQuestion>
  );
}
