import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { TabList, Tabs } from "react-tabs";

const HeadModal = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  padding: 10px 0;
`;

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const ContentModal = styled.div`
  .manage-nft {
    overflow: auto;
    display: flex;
    flex-flow: wrap;
    gap: 20px;

    .img-nft {
      height: 200px !important;
      object-fit: cover;
      object-position: center;
      width: 100%;
      transition: transform 0.2s;
      border-radius: 8px;
      ${!isMobile &&
      `:hover {
        opacity: 0.8;
        -ms-transform: scale(1.05); /* IE 9 */
        -webkit-transform: scale(1.05); /* Safari 3-8 */
        transform: scale(1.05);
      }`}
    }
  }

  margin-top: ${({ isNFTJackpot }) => isNFTJackpot && "12px"};
  .head-title {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-between;
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    @media screen and (max-width: 768px) {
      font-size: 10px;
    }
    line-height: 126.5%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text6};
    margin: 10px 0;
  }
  .available {
    cursor: pointer;
  }
  .detail-depo {
    & > div {
      padding: 15px 0;
      border-bottom: 1px solid ${({ theme }) => theme.border1};
    }
  }
  .filter-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: ${isMobile ? "row" : "column"};
    padding-bottom: 17px;
    font-family: SF UI Display;
    gap: ${isMobile ? "" : "17px"};

    ${isMobile &&
    `justify-content: space-between;
    .filter-group-item:nth-child(odd) {
      margin-right: 12px;
    }
    .filter-group-item:nth-child(3) {
  margin-top: 12px;
}

.filter-group-item:nth-child(4) {
  margin-top: 12px;
}
.filter-group-item:nth-child(5) {
  margin-top: 12px;
}
`}

    .filter-group-item {
      cursor: pointer;
      width: 174px;
      height: 45px;
      /* background: #181A1F; */
      background: tranparent;
      border: 1px solid ${({ theme }) => theme.borderNFT};
      color: ${({ theme }) => theme.primaryText2};
      border-radius: 5px;
      padding-right: ${isMobile ? "6px" : "10px"};
      padding-left: ${isMobile ? "8px" : "14px"};
      display: flex;
      justify-content: space-between;
      align-items: center;
      /* color: rgba(255, 255, 255, 0.6); */
      font-size: 14px;
      font-weight: 500;

      @media screen and (max-width: 960px) {
        height: 40px;
        width: 30%;
      }

      @media screen and (max-width: 768px) {
        height: 40px;
        width: 45%;
      }

      .filter-item-left {
        display: flex;
        align-items: center;
        ${isMobile && "line-height: 16px;"}
      }
      .filter-item-right {
        width: 20px;
        height: 20px;
        color: ${({ theme }) => theme.white};
        background: #ffba33;
        border-radius: 10px;
        text-align: center;
        line-height: 20px;
        div {
          font-size: 12px;
          with: 100%;
        }
      }
      .ant-checkbox-checked .ant-checkbox-inner {
        background: #72bf65;
      }
      .ant-checkbox-checked .ant-checkbox-inner::after {
        border-color: #181a1f !important;
      }
    }
    .is-checked {
      background: linear-gradient(315deg, #f8ef42 0%, #0fd64f 74%) !important;
      .filter-item-left {
        color: ${({ theme }) => theme.white};
      }
    }
  }

  .list-nft-no-data {
    justify-content: center !important;
    .no-data {
      .ant-empty-description {
        color: ${({ theme }) => theme.text6};
      }
    }
  }

  .list-nft-locked {
    ${!isMobile && `padding: 0 20px 30px !important ;`}

    .infinite-scroll-component__outerdiv {
      width: 100%;
      ${!isMobile &&
      `.manage-nft {
        padding-left: 20px;
      }`}
    }
    height: 570px !important;

    @media screen and (max-width: 768px) {
      height: 300px !important;
      .manage-nft {
        justify-content: center;
      }
    }
  }

  .list-nft-my-nft {
    .infinite-scroll-component__outerdiv {
      width: 100%;
    }
    height: 488px !important;
    @media screen and (max-width: 768px) {
      height: 230px !important;
      overflow: hidden;
    }
  }
  .list-nft {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 0 20px 20px;
    height: 324px;
    overflow-y: auto;
    margin: 5px -20px;
    @media screen and (min-width: 640px) {
      padding: 0 30px 30px;
      margin: 5px -30px;
    }
    @media screen and (max-width: 768px) {
      height: calc(90vh - 405px);
    }
    .infinite-scroll-component {
      &::-webkit-scrollbar {
        width: 7px;
      }
      &::-webkit-scrollbar-track {
        /* -webkit-box-shadow: ${({ theme }) =>
          `inset 0 0 6px ${theme.border2}`};  */
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: ${({ theme }) => `inset 0 0 6px ${theme.border2}`};
      }
    }

    .nft-card-lock {
      height: 290px !important;
      box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px,
        rgba(255, 255, 255, 0.2) -6px -2px 16px 0px;
      margin-bottom: 0px !important;
      margin-top: 15px !important;
      padding: 12px !important;
      ${isMobile && `width: 234px !important;`}

      .main-set {
        background-image: url("/images/bg-set.png");
        background-size: contain;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        display: flex;
        padding: 12px;
        position: relative;
      }
      .block-set {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        bottom: ${isMobile ? "10px" : "16px"};
        position: absolute;

        img {
          border-radius: 15px;
          height: 150px;
        }
      }
    }

    .nft-card {
      width: ${isMobile ? "31%" : "230px"};
      height: 270px;
      border: 1px solid ${({ theme }) => theme.borderNFT};
      cursor: pointer;
      box-sizing: border-box;
      border-radius: 15px;
      padding: 15px;
      margin-bottom: 15px;
      background: ${({ theme }) => theme.bg2};

      @media screen and (max-width: 960px) {
        width: 48%;
      }

      @media (max-width: 700px) {
        width: 100%;
        margin-bottom: 15px;
      }
      .nft-avatar-image {
        /* background: linear-gradient(89.89deg, #243329 0.15%, #1E2539 99.97%); */
        background-size: cover !important;
        background: ${({ theme }) => theme.bgBtn};
        border-radius: 10px;
        width: 100% - 15px;
        margin: auto;
        height: 201px;
      }
    }
    .locked-sellect {
      border: 1px solid #72bf65 !important;
      position: relative;
    }

    .nft-card-locked {
      width: 47%;
      border: 1px solid ${({ theme }) => theme.borderNFT};
      cursor: pointer;
      box-sizing: border-box;
      border-radius: 15px;
      padding: 15px;
      margin-bottom: 15px;

      @media screen and (max-width: 960px) {
        width: 48%;
      }

      @media (max-width: 700px) {
        width: 100%;
        margin-bottom: 15px;
      }
      .nft-avatar-image {
        /* background: linear-gradient(89.89deg, #243329 0.15%, #1E2539 99.97%); */
        background-size: cover !important;
        background: ${({ theme }) => theme.bgBtn};
        border-radius: 10px;
        width: 100% - 15px;
        margin: auto;
        height: 201px;
      }
    }
    .nft-card-is-selected {
      border: 1px solid #72bf65 !important;
      position: relative;
    }
  }
  .nft-info {
    padding: 15px 0 0 0;
    color: ${({ theme }) => theme.primaryText2};
    .nft-name {
      font-weight: 600;
      font-size: 18px;
      div {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      /* identical to box height, or 23px */

      letter-spacing: 0.015em;
      text-transform: capitalize;

      /* color: rgba(255, 255, 255, 0.87); */
    }
    .nft-data {
      display: flex;
      align-items: center;
      padding: 10px 0 0 0;
      .nft-logo {
      }
      .nft-price {
        /* color: #FFF; */
        padding-left: 10px;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
  .action-button-group {
    display: flex;
    justify-content: center;
    gap: ${isMobile ? "" : "25px"};
    padding: ${isMobile ? "22px 0 16px 0" : "38px 0 30px 0"};
    border-top: 1px solid;
    border-color: ${({ theme }) => theme.border2};

    .disable-btn {
      background-color: rgba(31, 55, 100, 0.5) !important;
      color: rgba(255, 255, 255, 0.5) !important;
      cursor: not-allowed;
      height: ${isMobile ? "55px" : "63px"};
    }

    .button-approve {
      width: ${isMobile ? "170px" : "215px"} !important;
    }

    ${isMobile && `> button { margin-right: 12px;}`}

    @media screen and (min-width: 840px) {
      /* padding-top: 10px; */
    }
  }
  .list-nft-detail {
    ${isMobile && `height: 300px !important;`}
  }
`;

const StyledNewTooltip = styled.div`
  display: inline-block;
`;

const ButtonDeposit = styled.div`
  width: 100%;
  @media (max-width: 600px) {
    width: 294px;
    border-radius: 10px;
  }

  & .disable-btn {
    background-color: rgba(31, 55, 100, 0.5) !important;
    color: rgba(255, 255, 255, 0.5) !important;
    cursor: not-allowed;
    @media (max-width: 767x) {
      border-radius: 10px;
      height: 40px;
    }
  }

  .btn-primary1 {
    margin-top: 42px;
    margin-left: auto;
    background: ${({ theme }) => theme.greenButton};
    border-radius: 15px;
    color: ${({ theme }) => theme.white};
    height: 63px;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    @media (max-width: 600px) {
      border-radius: 10px;
      height: 40px;
    }

    .label {
      font-size: 18px;
      line-height: 21.48px;
      font-weight: 700;
      @media (max-width: 767px) {
        font-size: 14px;
      }
    }

    .desc {
      font-size: 12px;
      line-height: 14.32px;
      font-weight: 600;
    }

    @media (max-width: 600px) {
      margin-top: 24px;
    }
  }
`;

const TextStake = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 126.5%;
  letter-spacing: 0.015em;
  color: ${({ theme }) => theme.colorDate};
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const TextEarning = styled.p`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 126.5%;
  /* or 20px */
  margin-bottom: 0;
  display: flex;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color: ${({ theme }) => theme.text1};
  /* width: 45%; */
  span {
    margin-right: 8px;
  }
  @media screen and (max-width: 768px) {
    font-size: 12px;
    /* width: 43%; */
  }
  svg {
    width: 15px;
    @media screen and (max-width: 768px) {
      width: 12px;
      margin-top: -1px;
    }
  }
`;

const CountStake = styled.p`
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.015em;
  color: ${({ theme }) => theme.colorStart};
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const PoolToken = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background: ${({ theme }) => theme.bgBtn};
  border-radius: 10px;
  padding: 10px;
  img {
    width: 32px;
  }
  @media screen and (max-width: 768px) {
    padding: 13px 11px;
    width: 100%;
  }
  .coin-box {
    display: flex;
    align-items: center;

    @media (max-width: 640px) {
      width: 40%;
    }

    .pool-tk {
      margin-left: 5px;

      @media (min-width: 640px) {
        margin-left: 10px;
      }
      .pool-tt {
        color: ${({ theme }) => theme.text6};
        font-family: SF UI Display;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 126.5%;
        /* or 20px */
        margin-bottom: 10px;
        letter-spacing: 0.015em;
        text-transform: capitalize;

        @media screen and (max-width: 768px) {
          font-size: 10px;
        }
      }
      .pool-vlue {
        white-space: nowrap;
        color: ${({ theme }) => theme.text1};
        font-family: SF UI Display;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 126.5%;
        /* identical to box height, or 23px */

        letter-spacing: 0.015em;
        text-transform: capitalize;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
      }
    }
  }
  .count-tk {
    text-align: right;
    @media (max-width: 600px) {
      width: 35%;
    }
    .count-tt {
      color: ${({ theme }) => theme.text6};
      font-family: SF UI Display;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 126.5%;
      margin-bottom: 10px;
      letter-spacing: 0.015em;
      text-transform: capitalize;
      margin-bottom: 10px;
      text-overflow: ellipsis;
      white-space: normal;
      overflow: hidden;
      @media screen and (max-width: 768px) {
        font-size: 10px;
      }
    }

    .count-input {
      input {
        width: 100%;
        color: ${({ theme }) => theme.text1};
        font-family: SF UI Display;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 126.5%;
        text-align: right;
        background-color: transparent;
        letter-spacing: 0.015em;
        text-transform: capitalize;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type="number"] {
        -moz-appearance: textfield;
      }
    }
  }
  .coin-logo {
    > div > div {
      width: 35px !important;
      height: 35px !important;
    }
  }
`;

const Table = styled.table`
  width: 100%;

  tr {
    border-bottom: 1px solid rgba(72, 110, 177, 0.15);

    td {
      padding: 15px 0;

      &:nth-child(n + 2) div {
        flex-grow: 1;
      }

      &:nth-child(3) div {
        text-align: right;
      }
    }
  }
`;

const ButtonGreen = styled.button`
  background: ${({ theme }) => theme.greenButton};
  border-radius: 15px;
  color: ${({ theme }) => theme.white};
  height: ${isMobile ? "55px" : "63px"};
  width: ${isMobile ? "142px" : "215px"};
  font-weight: 700;
  font-size: ${isMobile ? "14px" : "18px"};
  @media screen and (max-width: 768px) {
    padding-top: 0;
    font-size: 14px;
  }
`;

const ButtonLightGreen = styled.button`
  background: ${({ theme }) => theme.greenLightButton};
  border-radius: 15px;
  color: ${({ theme }) => theme.text9};
  height: ${isMobile ? "55px" : "63px"};
  width: ${isMobile ? "142px" : "215px"};
  font-weight: 700;
  font-size: ${isMobile ? "14px" : "18px"};
  @media screen and (max-width: 768px) {
    padding-top: 0;
    font-size: 14px;
  }
`;

const ButtonClose = styled.button`
  background: ${({ theme }) => theme.bgButtonClose};
  border-radius: 15px;
  color: ${({ theme }) => theme.red1};
  height: ${isMobile ? "55px" : "63px"};
  width: ${isMobile ? "142px" : "215px"};
  font-weight: 700;
  font-size: ${isMobile ? "14px" : "18px"};
  @media screen and (max-width: 768px) {
    padding-top: 0;
    font-size: 14px;
  }
`;

const TabListNFTType = styled(TabList)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border1};
  padding-bottom: 4px;
  li {
    margin-right: 50px;
  }

  @media screen and (max-width: 768px) {
    li {
      margin-right: 20px;
    }
  }
`;

const TabsNFTType = styled(Tabs)`
  color: ${({ theme }) => theme.farmText};
  font-weight: 600;
  font-size: 18px;
  line-height: 126, 5%;
  letter-spacing: 0.015rem;

  @media screen and (max-width: 960px) {
    padding-top: 0;
    font-size: 14px;
  }

  @media screen and (max-width: 768px) {
    padding-top: 0;
    font-size: 14px;
  }

  .selected {
    color: ${({ theme }) => theme.tabActive};
    position: relative;

    ::before {
      content: "";
      display: inline-block;
      height: 2px;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: -5px;
      background: ${({ theme }) => theme.primary1};
    }
  }
`;

const ButtonDetail = styled.button`
  height: 45px;
  background: ${({ theme }) => theme.greenButton};
  color: ${({ theme }) => theme.white};
  width: 100%;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
`;

const LinkCollection = styled.a`
  color: ${({ theme }) => theme.colorStart};
  :hover {
    color: ${({ theme }) => theme.text9};
    opacity: 0.8;
  }
`;

const NoticeMessage = styled.div`
  color: ${({ theme }) => theme.colorStart};
  font-size: ${isMobile ? "10px" : "14px"};
  font-weight: 500;
  padding-left: 8px;
  opacity: 0.7;
`;

const BlockNotice = styled.div`
  display: flex;
  align-items: end;
`;

const Loading = styled.div`
  width: 100%;
  text-align: center;
  span {
    width: 1.5em;
    height: 1.5em;
    margin-bottom: 8px;
    i {
      background-color: ${({ theme }) => theme.text9};
    }
  }
  div {
    color: ${({ theme }) => theme.text9};
    font-weight: 500;
    font-size: 16px;
  }
`;

const Promo = styled.div`
  height: 206px;
  display: flex;
  justify-content: center;
  align-items: center;
  --borderWidth: 0px;
  position: relative;
  border-radius: var(--borderWidth);

  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  :after {
    content: "";
    position: absolute;
    top: calc(-1 * var(--borderWidth));
    left: calc(-1 * var(--borderWidth));
    height: calc(100% + var(--borderWidth) * 2);
    width: calc(100% + var(--borderWidth) * 2);
    background: linear-gradient(
      60deg,
      #af9dc4,
      #8bee89,
      #07b39b,
      #6fba82,
      #335df7,
      #5f5876
    );
    border-radius: 20px;
    z-index: 2;
    animation: animatedgradient 5s ease alternate infinite;
    background-size: 300% 300%;
  }
`;

const PromoMain = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  z-index: 3;
  width: 100%;
`;

const TitlePromo = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color: #ffffff;
`;

const PromoLeft = styled.div`
  padding-top: 32px;
  padding-left: 72px;

  p {
    margin-bottom: 0;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: rgba(255, 255, 255, 0.87);
  }
`;

const ManageBlock = styled.div`
  ${!isMobile &&
  `display: grid;
  grid-template-columns: 0.3fr 1fr;`}
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("/images/bg-manage.png");
`;

const BlockNote = styled.div`
  width: ${isMobile ? "100%" : "174px"};
  border: 1px solid ${({ theme }) => theme.bgButtonClose};
  box-shadow: ${({ theme }) => theme.bgButtonClose} 0px 20px 30px -10px;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 16px;
  cursor: pointer;
  div {
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.015em;
    color: #ec5656;
  }
`;

const IconCheck = styled.img`
  position: absolute;
  right: 8px;
  width: 25px;
  top: 8px;
  z-index: 4;
`;

const NoticeRule = styled.div`
  display: flex;
  margin-bottom: 24px;
  img {
    margin-right: 12px;
    width: 24px;
    height: 24px;
  }
  div {
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    align-items: center;
    letter-spacing: 0.015em;
    color: ${({ theme }) => theme.primaryText3};
  }
`;

const NoticeRuleMobile = styled(NoticeRule)`
  margin-bottom: 12px;
  align-items: center;
  img {
    margin-right: 9px;
    width: 13px;
    height: 13px;
  }
  div {
    font-size: 12px;
  }
  u {
    color: ${({ theme }) => theme.red1};
  }
`;

const ButtonManage = styled.div`
  width: 302px;
  height: 35px;
  background: ${({ theme }) => theme.greenButton};
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  padding: 10px;
  margin-bottom: 12px;
`;

const SetLock = styled.div`
  position: relative;
  width: 100%;
  height: 80%;
  .lower-card {
    position: absolute;
    width: 178px;
    height: 178px;
   
    img {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      border: 1px solid ${({ theme}) => theme.border1};
    }
    &:nth-of-type(1) {
      top: 30px;
      z-index: 4;
    }
    &:nth-of-type(2) {
      top: 22px;
      left: 8px;
      z-index: 3;
      opacity: 0.6;
    }
    &:nth-of-type(3) {
      top: 14px;
      left: 16px;
      z-index: 2;
      opacity: 0.6;
    }

    &:nth-of-type(4) {
      top: 6px;
      left: 24px;
      z-index: 1;
      opacity: 0.6;
    }

    &:nth-of-type(5) {
      top: 0px;
      left: 30px;
      z-index: 1;
      opacity: 0.6;
    }
  }
`;

export {
  HeadModal,
  TitleStyle,
  ContentModal,
  StyledNewTooltip,
  ButtonDeposit,
  TextStake,
  TextEarning,
  CountStake,
  PoolToken,
  Table,
  ButtonGreen,
  ButtonClose,
  TabListNFTType,
  TabsNFTType,
  ButtonLightGreen,
  ButtonDetail,
  LinkCollection,
  NoticeMessage,
  BlockNotice,
  Loading,
  Promo,
  TitlePromo,
  PromoLeft,
  PromoMain,
  ManageBlock,
  BlockNote,
  IconCheck,
  NoticeRule,
  ButtonManage,
  NoticeRuleMobile,
  SetLock,
};
