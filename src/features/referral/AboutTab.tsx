import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const Wapper = styled.div``;
const Header = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600;
  font-size: ${isMobile ? "18px" : "24px"};
  line-height: 29px;
  color: ${({ theme }) => theme.textRef};
  margin: ${isMobile ? "0 0 32px" : "40px 0 56px"};
`;
const Feature = styled.div`
  display: grid;
  grid-template-columns: ${isMobile ? "1fr" : "1fr 1fr"};
  gap: ${isMobile ? "32px" : "80px"};
  margin-top: ${isMobile ? "40px" : "80px"};
  margin-bottom: 100px;
  width: 100%;
`;
const FeatureItemContainer = styled.div`
  width: 100%;
  height: fit-content;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: normal;
  .feature-title {
    font-weight: 600;
    font-size: ${isMobile ? "18px" : "24px"};
    line-height: 29px;
    letter-spacing: 0.015em;
    color: ${({ theme }) => theme.textRef};
  }
  .feature-des {
    font-size: ${isMobile ? "14px" : "17px"};
    line-height: 150%;
    color: ${({ theme }) => theme.textRef};
    margin-top: 24px;
  }
`;
const ItemContainer = styled.div`
  background: ${({ theme }) => theme.bgAboutCard};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
  border-radius: 20px;
`;
const RowAbout = styled.div`
  display: grid;
  grid-template-columns: ${isMobile ? "1fr" : "1fr 1fr 1fr"};
  gap: ${isMobile ? "24px" : "22px"};
  width: 100%;
`;
const ItemContent = styled.div`
  padding: 32px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: normal;
  .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-background {
    display: flex;
    height: ${isMobile ? "60px" : "80px"};
    width: ${isMobile ? "60px" : "80px"};
    background: rgba(114, 191, 101, 0.15);
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: ${isMobile ? "18px" : "24px"};
    color: ${({ theme }) => theme.titleImport};
    letter-spacing: 0.015em;
  }
  .des {
    margin-top: 12px;
  }
  .des2,
  .des1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${isMobile ? "14px" : "16.5px"};
    line-height: 150%;
    color: ${({ theme }) => theme.lblToken};
  }
  .content {
    margin-top: 32px;
  }
`;

const AboutItem = ({ title, desc1, desc2, image }) => {
  return (
    <ItemContainer>
      <ItemContent>
        <div className="img-container">
          <div className="img-background">{image}</div>
        </div>
        <div className="content">
          <div className="title">{title}</div>
          <div className="des">
            <div className="des1">{desc1}</div>
            <div className="des2">{desc2}</div>
          </div>
        </div>
      </ItemContent>
    </ItemContainer>
  );
};
const FeatureItem = ({ title, desc }) => {
  return (
    <FeatureItemContainer>
      <div className="feature-title">{title}</div>
      <div className="feature-des">{desc}</div>
    </FeatureItemContainer>
  );
};

const AboutTab = () => {
  const ChainSgv = (
    <svg
      width={isMobile ? "31.25px" : "43px"}
      height={isMobile ? "15.62px" : "22px"}
      viewBox="0 0 43 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.917 0.583252H23.5837V4.74992H31.917C35.3545 4.74992 38.167 7.56242 38.167 10.9999C38.167 14.4374 35.3545 17.2499 31.917 17.2499H23.5837V21.4166H31.917C37.667 21.4166 42.3337 16.7499 42.3337 10.9999C42.3337 5.24992 37.667 0.583252 31.917 0.583252ZM19.417 17.2499H11.0837C7.64616 17.2499 4.83366 14.4374 4.83366 10.9999C4.83366 7.56242 7.64616 4.74992 11.0837 4.74992H19.417V0.583252H11.0837C5.33366 0.583252 0.666992 5.24992 0.666992 10.9999C0.666992 16.7499 5.33366 21.4166 11.0837 21.4166H19.417V17.2499ZM13.167 8.91658H29.8337V13.0833H13.167V8.91658Z"
        fill="#72BF65"
      />
    </svg>
  );
  const SvgFriend = (
    <svg
      width={isMobile ? "31.25px" : "43px"}
      height={isMobile ? "21.88px" : "30px"}
      viewBox="0 0 43 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.8753 15.0001C33.7503 15.0001 36.0628 12.6667 36.0628 9.79175C36.0628 6.91675 33.7503 4.58342 30.8753 4.58342C28.0003 4.58342 25.667 6.91675 25.667 9.79175C25.667 12.6667 28.0003 15.0001 30.8753 15.0001ZM15.2503 12.9167C18.7087 12.9167 21.4795 10.1251 21.4795 6.66675C21.4795 3.20842 18.7087 0.416748 15.2503 0.416748C11.792 0.416748 9.00033 3.20842 9.00033 6.66675C9.00033 10.1251 11.792 12.9167 15.2503 12.9167ZM30.8753 19.1667C27.0628 19.1667 19.417 21.0834 19.417 24.8959V29.5834H42.3337V24.8959C42.3337 21.0834 34.6878 19.1667 30.8753 19.1667ZM15.2503 17.0834C10.3962 17.0834 0.666992 19.5209 0.666992 24.3751V29.5834H15.2503V24.8959C15.2503 23.1251 15.9378 20.0209 20.1878 17.6667C18.3753 17.2917 16.6253 17.0834 15.2503 17.0834Z"
        fill="#72BF65"
      />
    </svg>
  );
  const ImgLogo = (
    <img
      src="./icons/tokenstand_circle_logo.png"
      alt=""
      height={isMobile ? "37.5px" : "50px"}
      width={isMobile ? "37.5px" : "50px"}
    />
  );
  return (
    <Wapper>
      <Header>How to invite friends</Header>
      <RowAbout>
        <AboutItem
          title={"Get a referral link"}
          image={ChainSgv}
          desc1={"Connect a wallet and generate your "}
          desc2={"referral link in the Referal section "}
        />
        <AboutItem
          title={"Invite friends"}
          image={SvgFriend}
          desc1={"Invite your friends to register via your"}
          desc2={"referral link"}
        />
        <AboutItem
          title={"Earn crypto"}
          image={ImgLogo}
          desc1={"Receive referral rewards in STAND tokens "}
          desc2={"from your friends' earnings & swaps "}
        />
      </RowAbout>
      <Feature>
        <FeatureItem
          title={"Farm Referral Rewards"}
          desc={
            "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
          }
        />
        <FeatureItem
          title={" Swaps Referral Rewards"}
          desc={
            "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet."
          }
        />
      </Feature>
    </Wapper>
  );
};
export default AboutTab;
