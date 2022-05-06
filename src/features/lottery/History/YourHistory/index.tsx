import React, { useState } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useIsDarkMode } from "../../../../state/user/hooks";
import ItemYourHistory from "./ItemYourHistory";
import MainHistory from "../MainHistory";
import { useActiveWeb3React } from "../../../../hooks";
import { useWalletModalToggle } from "../../../../state/application/hooks";
import moment from "moment";

const MainContent = styled.div`
  background: ${({ theme }) => theme.bgNextDraw};
  border: 1px solid ${({ theme }) => theme.border1};
  box-sizing: border-box;
  border-radius: 20px;
  width: 100%;
`;

const Header = styled.div`
  padding: 33px 56px;
  border-bottom: 1px solid ${({ theme }) => theme.border4};
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText2};
  font-size: ${isMobile ? "14px" : "17px"};

  @media screen and (max-width: 768px) {
    padding: 26px 17px;
  }
`;

const HeaderMain = styled(Header)`
  padding: 18px 56px;

  .go-back {
    font-weight: 600;
    font-size: ${isMobile ? "14px" : "18px"};
    color: ${({ theme }) => theme.primaryText2};
    cursor: default;
    img {
      margin-right: 12px;
      cursor: pointer;
    }
  }

  .time-draw {
    color: ${({ theme }) => theme.thinText};
    font-weight: 500;
    font-size: ${isMobile ? "14px" : "17px"};
    padding-top: 4px;
  }

  @media screen and (max-width: 768px) {
    padding: 16px;
  }
`;

const Container = styled.div`
  margin: 80px 0px;
  p {
    font-weight: 500;
    font-size: 17px;
    color: ${({ theme }) => theme.text11};
    margin: 20px 0 40px;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      margin: 20px 0px 30px;
    }
  }
  @media screen and (max-width: 768px) {
    margin: 100px 0px;
  }
`;

const Table = styled.div`
  padding: 33px 56px;
  display: grid;
  grid-template-columns: ${isMobile
    ? "1fr 1.5fr 1fr 0.5fr"
    : "0.8fr 1fr 1fr 1fr 0.5fr"};
  row-gap: 30px;
  font-weight: 500;
  font-size: 17px;
  .table-field {
    color: ${({ theme }) => theme.titleHistory};
    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
  }
  .value {
    color: ${({ theme }) => theme.primaryText2};
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }
  @media screen and (max-width: 768px) {
    padding: 23px 30px;
  }
`;

const ConnectWalletWrapper = styled.div`
  margin: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-weight: 600;
    font-size: 15px;
    color: ${({ theme }) => theme.text10};
    margin-bottom: 26px;

    @media screen and (min-width: 768px) {
      font-size: 24px;
    }
  }

  button {
    background: ${({ theme }) => theme.greenButton};
    border-radius: 8px;
    color: ${({ theme }) => theme.white};
    font-weight: 600;
    font-size: 14px;
    padding: 11px 32px 12px;
    line-height: 20px;

    @media screen and (min-width: 768px) {
      font-size: 18px;
      padding: 18px 32px;
    }

    :hover {
      opacity: 0.8;
    }
  }
`;

const Button = styled.button`
  text-align: center;
  color: #fff;
  padding: 18px 32px;
  background: #72bf65;
  border-radius: 8px;
  font-weight: bold;
  font-size: 17px;

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
    padding: 12px;
    font-size: 14px;
  }
`;

const YourHistory = ({
  showDetailHistory,
  setShowYourHistory,
  dataYourHistory,
  dataHistory,
  priceSTAND,
  ticketsRoundCheck,
  setRoudCheck,
  roundCheck,
  handleCheckReward,
  setIsOpenWinning,
  setIsOpenBuyTicket,
  disabledBuy,
  isClaimming,
  roundClaim,
  setIsOpenYourTickets,
  isOpenYourTickets,
  roundId
}): JSX.Element => {
  const darkMode = useIsDarkMode();
  const { account } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  const handleClickConnectWallet = () => {
    toggleWalletModal();
  };

  return (
    <MainContent>
      {showDetailHistory ? (
        <HeaderMain>
          {" "}
          <div className="flex  items-center">
            <button className="flex items-center go-back">
              <img
                src={`./icons/back-icons-${darkMode}.png`}
                alt=""
                width={isMobile && 13}
                height={isMobile && 13}
                onClick={() => setShowYourHistory(false)}
              />
              <div className="text-left ml-2">
                Round #{roundCheck}
                <div className="time-draw">
                  Drawn{" "}
                  {moment(dataHistory?.endRoundTime * 1000).format(
                    "HH:mm, DD MMM YYYY "
                  )}
                </div>
              </div>
            </button>
          </div>
        </HeaderMain>
      ) : (
        <Header className="text-round">Round</Header>
      )}

      {!account ? (
        <ConnectWalletWrapper>
          <p>Connect your wallet to check your history</p>
          <button onClick={handleClickConnectWallet}>Connect Wallet</button>
        </ConnectWalletWrapper>
      ) : dataYourHistory?.total > 0 ? (
        showDetailHistory ? (
          <MainHistory
            dataHistory={dataHistory}
            priceSTAND={priceSTAND}
            ticketsRoundCheck={ticketsRoundCheck}
            handleCheckReward={handleCheckReward}
            setIsOpenWinning={setIsOpenWinning}
            isClaimming={isClaimming}
            roundClaim={roundClaim}
            setIsOpenYourTickets={setIsOpenYourTickets}
            isOpenYourTickets={isOpenYourTickets}
            roundId={roundId}
          />
        ) : (
          <Table>
            <div className="table-field">#</div>
            {!isMobile && <div className="table-field">Date</div>}
            <div className="table-field">Your Tickets</div>
            <div className="table-field">Winning</div>
            <div className="table-field">{""}</div>
            {dataYourHistory?.data.map((itemRound, index) => (
              <ItemYourHistory
                setShowDetail={setShowYourHistory}
                key={index}
                itemRound={itemRound}
                setRoundCheck={setRoudCheck}
              />
            ))}
          </Table>
        )
      ) : (
        //No Data
        <Container>
          <div className="flex items-center justify-center">
            <img
              src={
                isMobile
                  ? `./icons/icon-nodata-res-${darkMode}.png`
                  : `./icons/icon-nodata-stand-${darkMode}.png`
              }
              alt="token-stand-icon"
            />
          </div>
          <div className="flex items-center justify-center">
            <p>No Lottery History Found</p>
          </div>
          <div className="flex items-center justify-center">
            <Button
              disabled={disabledBuy}
              onClick={() => setIsOpenBuyTicket(true)}
            >
              Buy Ticket
            </Button>
          </div>
        </Container>
      )}
    </MainContent>
  );
};

export default YourHistory;
