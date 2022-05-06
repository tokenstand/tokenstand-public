import React from "react";
import styled from "styled-components";
import Modal from "../../components/Modal";
import CloseIcon from "../../components/CloseIcon";
import { isMobile } from "react-device-detect";
import { formatAmount } from "../../utils";
import NewTooltip from "../../components/NewTooltip";
import Confetti from "react-confetti";

const Button = styled.button`
  background: #72bf65;
  border-radius: 15px;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  color: #ffffff;
  height: 63px;

  :disabled {
    background: ${({ theme }) => theme.buttonDisable};
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    :hover {
      opacity: 1;
    }
  }
  @media screen and (max-width: 768px) {
    font-size: 14px;
    height: 40px;
  }
`;
const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
const Content = styled.div`
  margin-top: 24px;
  .reward {
    display: grid;
    grid-template-columns: 0.75fr 1.5fr 0.55fr;

    .customer {
      font-weight: bold;
      font-size: 17px;
      line-height: 20px;
      color: ${({ theme }) => theme.text7};
      @media screen and (max-width: 768px) {
        font-size: 14px;
        padding-top: 5px;
      }
    }
    .amount {
      .amount-stand {
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        color: #72bf65;
        .tootip-stand {
          max-width: 125px;
          margin-right: 3px;
          @media screen and (max-width: 768px) {
            max-width: 82px;
          }
          div {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
        @media screen and (max-width: 768px) {
          font-size: 18px;
        }
      }
      .amount-usd {
        font-size: 14px;
        line-height: 150%;
        color: ${({ theme }) => theme.primaryText3};
        padding-top: 8px;
        .tootip-usd {
          max-width: 68px;
          margin-right: 3px;
          div {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
  .round {
    margin-top: 40px;
    margin-bottom: 24px;
    font-size: 14px;
    line-height: 150%;
    color: ${({ theme }) => theme.primaryText3};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

type PopupWinningProps = {
  isOpen;
  onDismiss;
  handleClaimRewards;
  roundId;
  dataClaim;
  roundClaim?: any;
};

const PopupWinning: React.FC<PopupWinningProps> = ({
  isOpen,
  onDismiss,
  handleClaimRewards,
  roundId,
  dataClaim,
  roundClaim,
}) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <Confetti recycle={false} numberOfPieces={isMobile ? 200 : 800} />
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">Collect Winnings</TitleStyle>
        <CloseIcon onClick={onDismiss} />
      </div>
      <Content>
        <div className="reward">
          <div className="customer">You Won</div>
          <div className="amount">
            <div className="amount-stand flex">
              <span className="tootip-stand">
                {" "}
                <NewTooltip
                  dataTip={"~ " + formatAmount(dataClaim.totalRewards, 0, 4)}
                  dataValue={"~ " + formatAmount(dataClaim.totalRewards, 0, 4)}
                />{" "}
              </span>{" "}
              <span>STAND</span>
            </div>
            <div className="amount-usd flex">
              <span className="tootip-usd">
                <NewTooltip
                  dataTip={"~ " + formatAmount(dataClaim.totalRewardsUSD, 0, 4)}
                  dataValue={
                    "~ " + formatAmount(dataClaim.totalRewardsUSD, 0, 4)
                  }
                />
              </span>{" "}
              <span>USD</span>
            </div>
          </div>
          <div>
            <img
              src="/icons/present.png"
              height={isMobile && 40}
              width={isMobile && 56}
            />
          </div>
        </div>

        <div className="round">Round: #{roundId}</div>
      </Content>

      <Button
        disabled={
          dataClaim.claimStatus ||
          dataClaim.isClaimed ||
          (roundClaim && roundClaim === roundId)
        }
        onClick={() => handleClaimRewards(roundId)}
      >
        Claim
      </Button>
    </Modal>
  );
};
export default PopupWinning;
