import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { useIsDarkMode } from "../../../../state/user/hooks";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column-reverse;
  }
`;
const Description = styled.div`
  width: 570px;
  .header_1 {
    font-size: 24px;
    line-height: 29px;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryText2};
  }
  .header_2 {
    font-size: 17px;
    line-height: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.primaryText2};
  }
  div {
    color: ${({ theme }) => theme.primaryText3};
    font-size: 17px;
    line-height: 150%;
    ul {
      li {
        display: flex;
        div {
          font-size: 50px;
          margin-right: 12px;
          margin-top: -40px;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    margin-left: 0px;
    margin-bottom: 40px;
    width: 100%;
    div {
      font-size: 14px;
    }
    .header_1 {
      font-size: 18px;
    }
    .header_2 {
      font-size: 14px;
    }
  }
`;

const BlockCenter = () => {
  const darkMode = useIsDarkMode();
  return (
    <Wrapper>
      <div className=" flex items-center justify-center">
        {isMobile ? (
          <img src={`/icons/group_2237-${darkMode}.svg`} alt="" />
        ) : (
          <img src={`/icons/asset-planet-${darkMode}.png`} alt="" />
        )}
      </div>
      <Description>
        <p className="header_1">Winning Criteria</p>
        <p className="header_2">
          The digits on your ticket must match in the correct order to win.
        </p>
        <div>
          <p>Here’s an example of a lottery draw, with two tickets, A and B.</p>
          <ul className="list">
            <li>
              <div>.</div>{" "}
              <p>
                Ticket A: The first 3 digits and the last 2 digits match, but
                the 4th digit is wrong, so this ticket only wins a “Match first
                3” prize.
              </p>
            </li>
            <li>
              <div>.</div>{" "}
              <p>
                Ticket B: Even though the last 5 digits match, the first digit
                is wrong, so this ticket doesn’t win a prize.
              </p>
            </li>
          </ul>
          Prize brackets don’t ‘stack’: if you match the first 3 digits in
          order, you’ll only win prizes from the ‘Match 3’ bracket, and not from
          ‘Match 1’ and ‘Match 2’.
        </div>
      </Description>
    </Wrapper>
  );
};

export default BlockCenter;
