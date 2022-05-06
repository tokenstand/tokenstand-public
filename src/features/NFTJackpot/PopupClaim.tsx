import React from "react";
import Modal from "../../components/Modal";
import styled from "styled-components";
import CloseIcon from "../../components/CloseIcon";
import { ButtonClose, ButtonGreen, HeadModal, TitleStyle } from "./styled";
import { handleToFixedDataTip } from "./ItemCampain";
import { isMobile } from "react-device-detect";
import BigNumber from "bignumber.js";

const RowInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 500;
  font-size: ${isMobile ? '14px' : '16px'};
  padding: ${isMobile ? '5px 0' : '8px 0'};;
  .text-left {
    color: ${({ theme }) => theme.primaryText3};
  }
  .number-stake {
    color: ${({ theme }) => theme.red1};
  }
`;

const RowTop = styled(RowInfo)`
  font-size: ${isMobile ? '16px' : '18px'};
  font-weight: 600;
  padding: 8px 0;
`;

const BlockTop = styled.div`
 margin-top: ${isMobile ? '6px' : '24px'};
`;

const BlockBody = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border1};
  border-top: 1px solid ${({ theme }) => theme.border1};
  padding: ${isMobile ? '6px 0' : '24px 0px'};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
`;

export default function PopupClaim({
  isOpen,
  onDismiss,
  handleClaim,
  dataCampaign
}: {
  isOpen: boolean;
  onDismiss: () => void;
  handleClaim: () => void;
  dataCampaign: any,
}) {

  const totalReward = handleToFixedDataTip(dataCampaign.standReward, 10)
  const claimableReward = handleToFixedDataTip(dataCampaign.claimableReward, 10)
  const remainingReward = handleToFixedDataTip(new BigNumber(totalReward).minus(claimableReward), 10)
  
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <HeadModal className="flex justify-between p-0">
        <TitleStyle className="text-lg font-bold">Claim Reward</TitleStyle>
        <CloseIcon onClick={onDismiss} />
      </HeadModal>

      <BlockTop>
        <RowTop>
          <div>Total reward</div>
          <div>{totalReward} STAND</div>
        </RowTop>
      </BlockTop>
      <BlockBody>
      <RowInfo>
        <div className="text-left">Your Stake</div>
        <div className="number-stake">{dataCampaign.yourStake}</div>
      </RowInfo>

      <RowInfo>
        <div className="text-left">Claimable Reward</div>
        <div>{Number(claimableReward) > Number(totalReward) ? totalReward : claimableReward.toString()} STAND</div>
      </RowInfo>

      <RowInfo>
        <div className="text-left">Remaining reward</div>
        <div>{Number(claimableReward) > Number(totalReward) ? '0' : remainingReward.toString()} STAND</div>
      </RowInfo>
      </BlockBody>

      

      <ButtonGroup>
        <ButtonGreen onClick={handleClaim}>Claim Reward</ButtonGreen>
        <ButtonClose onClick={onDismiss}>Close</ButtonClose>
      </ButtonGroup>
    </Modal>
  );
}
