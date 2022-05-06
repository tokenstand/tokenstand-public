import React from "react";
import styled from "styled-components";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useActiveWeb3React } from "../../hooks";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  position: relative;
  .question {
    font-weight: 600;
    font-size: 24px;
    color: ${({ theme }) => theme.text10};
    margin-bottom: 26px;
    margin-top: 100px;

    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }
  .button {
    margin-bottom: 81px;
  }
  .ticket {
    margin-top: 52px;
    top: -30px;
    right: -100px;
  }
`;

const Button = styled.button`
  padding: 18px 32px;
  background: #72bf65;
  border-radius: 8px;
  font-weight: 600;
  font-size: 17px;
  line-height: 20px;
  color: #ffffff;

  :hover {
    opacity: 0.8;
  }
  @media screen and (max-width: 768px) {
    padding: 11px 32px 12px;
    font-size: 14px;
  }
`;
const BlockCheckNow = styled.div`
  background: ${({ theme }) => theme.bgNextDraw};
  border: 1px solid ${({ theme }) => theme.border1};
  box-sizing: border-box;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  padding: 35px 0px;

  @media screen and (max-width: 768px) {
    padding: 30px 16px;
  }
`;

const Text = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  color: ${({ theme }) => theme.primaryText2};
  padding: 0px 32px;

  @media screen and (max-width: 768px) {
    font-size: 16px;
    padding: 0px 12px;
  }
`;

const LotteryCheckNow = ({
  setIsOpenWinning,
  isWinner,
  setIsCheck,
  isCheck,
}) => {
  const toggleWalletModal = useWalletModalToggle();
  const { account } = useActiveWeb3React();

  return (
    <div
      className={`grid h-full  ${isMobile ? " gap-2 px-4" : " gap-6 px-24"}`}
    >
      <BlockCheckNow>
        {isCheck && !isWinner ? (
          <div className={`flex justify-center items-center ${ isMobile ? 'm-2' : 'm-10'} `} >
            <img
              src="/images/no-winner-1.png"
              width={isMobile ? "42px" : "93px"}
            />
            <Text>
              <div>No prizes to collect... </div>
              <div> Better luck next time!</div>
            </Text>
            <img
              src="/images/no-winner-2.png"
              width={isMobile ? "42px" : "93px"}
            />
          </div>
        ) : (
          <Wrapper className="relative flex items-center justify-center">
            <div className="absolute ">
              <div className="question flex items-center justify-center">
                {account && <>Are you winner?</>}
                {!account && <>Connect your wallet to check if you've won!</>}
              </div>
              <div className="button flex items-center justify-center">
                {account ? (
                  <Button
                    onClick={() =>
                      isWinner ? setIsOpenWinning(true) : setIsCheck(true)
                    }
                  >
                    Check Now
                  </Button>
                ) : (
                  <Button onClick={() => toggleWalletModal()}>
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
            {isMobile ? (
              <img src="/images/planet-lottery-mobile.png" />
            ) : (
              <img src="/images/planet-lottery.png" />
            )}
          </Wrapper>
        )}
      </BlockCheckNow>
    </div>
  );
};
export default LotteryCheckNow;
