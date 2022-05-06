import React from "react";
import { isMobile } from "react-device-detect";
import Modal from "../../../components/Modal";
import ModalHeader from "../../../components/ModalHeader";
import NewTooltip from "../../../components/NewTooltip";
import styled from "styled-components";
import { Button } from "./ClaimRewardModal";

const TooltipStyled = styled(NewTooltip)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Amount = styled.div`
  width: 50%;
`;

const Content = styled.div`
  color: #72bf65;
  font-size: ${isMobile ? "16px" : "28px"};
  font-weight: 700;
  margin-top: 12px;
`;

const Note = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: ${isMobile ? "12px" : "16px"};
  margin-top: 24px;
  opacity: 0.8;

  span {
    color: #ec5656;
  }
`;

type Props = {
  onDismiss: () => void;
  isOpen: boolean;
  handleClaim: () => void;
  reward: any;
};

const ConfirmClaimFriend = ({
  onDismiss,
  isOpen,
  reward,
  handleClaim,
}: Props) => {
  const handleClaimReward = () => {
    onDismiss();
    handleClaim();
  };
  return (
    <Modal
      onDismiss={onDismiss}
      isOpen={isOpen}
      maxWidth={isMobile ? 343 : 450}
    >
      <ModalHeader onClose={onDismiss} title={" Friends Referral Reward"} />
      <Content className="flex justify-center items-center">
        <Amount>
          <TooltipStyled dataValue={`${reward}`} dataTip={reward} />
        </Amount>
        <div> STAND</div>
      </Content>

      <Note>
        <span>※</span>{" "}
        <i>
          Click the "Confirm" button to receive the rewards. This transaction
          may take 1 to 2 minutes
        </i>
      </Note>

      <Button onClick={handleClaimReward}>Confirm</Button>
    </Modal>
  );
};

export default ConfirmClaimFriend;
