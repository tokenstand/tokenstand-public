import React from "react";
import styled from "styled-components";
import { useIsDarkMode } from "../../../../state/user/hooks";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 45px;
  width: 100%;
  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ItemContainer = styled.div`
  padding: 34px 32px 40px;
  background: ${({ theme }) => theme.bgItemBlock};
  text-transform: capitalize;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  border-radius: 20px;
  .title {
    font-weight: 600;
    font-size: 24px;
    color: #72bf65;
    margin-top: 10px;
  }
  .img {
    height: 128.38px;
  }
  .des {
    font-size: 17px;
    color: ${({ theme }) => theme.textchart};
    line-height: 150%;
    text-align: center;
  }
  @media screen and (max-width: 768px) {
    .title {
      font-size: 18px;
    }
    .des {
      font-size: 14px;
    }
  }
`;

const Item = ({ img, title, des, isHasPlanet }) => {
  return (
    <ItemContainer className="">
      <div className="img relative">
        {isHasPlanet && (
          <div className="items-center justify-center absolute planet">
            <img
              src={
                isMobile
                  ? "./icons/countdown_planet_resp.svg"
                  : "./icons/countdown_planet.svg"
              }
              alt=""
            />
          </div>
        )}
        <img src={img} alt="" />
      </div>
      <div className="title">{title}</div>
      <div className="des">{des}</div>
    </ItemContainer>
  );
};

const BlockTop = () => {
  const darkMode = useIsDarkMode();
  return (
    <Wrapper>
      <Item
        img={
          isMobile
            ? "/icons/asset_ticket_repon.svg"
            : "/icons/asset_ticket_false.svg"
        }
        title={"Buy Ticket"}
        isHasPlanet={false}
        des={
          "Prices are set when the round starts, equal to $5 in STAND per ticket."
        }
      />
      <Item
        img={
          isMobile
            ? `/icons/time_count_down_resp_${darkMode}.svg`
            : `/icons/time_count_down_${darkMode}.svg`
        }
        title={"Wait for the Draw"}
        isHasPlanet={true}
        des={
          "The lottery drawing is held every 3 days. Just prepare STAND to join with us."
        }
      />
      <Item
        img={`/icons/asset-false.svg`}
        title={"Check for Prizes"}
        isHasPlanet={false}
        des={
          "Once the round’s over, come back to the page and check the results."
        }
      />
    </Wrapper>
  );
};
export default BlockTop;
