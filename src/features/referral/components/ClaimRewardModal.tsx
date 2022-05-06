import React from 'react';
import Image from 'next/image';
import Modal from '../../../components/Modal';
import ModalHeader from '../../../components/ModalHeader';
import ClaimPopupContent from '../ClaimPopupContent';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { FarmReward } from '../../../pages/referral';
import {
  ConfirmationPendingContent,
  TransactionSubmittedContent,
} from '../../../components/TransactionConfirmationModal';
import { useChainId } from '../../../hooks';
// images
const NoDataImage = '/icons/icon-stand.svg';

export const Button = styled.button`
  background: #72bf65;
  border-radius: 10px;
  height: ${isMobile ? '40px' : '56px'};
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  font-size: ${isMobile ? '14px' : '18px'};
  line-height: 17px;
  margin-top: 24px;
  color: #ffffff;
`;

const RewardGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const NoData = styled.div`
  margin: 0 0 9px 0;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 0;

  img {
    opacity: 0,7;
  }

  .text {
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.referralTableHeader};
    margin-top: 16px;

    @media screen and (min-width: 768px) {
      font-size: 17px;
    }
  }
`;

type Props = {
  onDismiss: () => void;
  isOpen: boolean;
  handleClaim: () => void;
  farmRewardList: FarmReward[];
  isAttempingTx: boolean;
  txHash: string;
};

const ClaimRewardModal = ({
  onDismiss,
  isOpen,
  handleClaim,
  farmRewardList,
  isAttempingTx,
  txHash,
}: Props) => {
  const { chainId } = useChainId();

  const getModalContent = () => {
    if (isAttempingTx) {
      return <ConfirmationPendingContent onDismiss={onDismiss} />;
    }

    if (txHash) {
      return (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          onDismiss={onDismiss}
        />
      );
    }
    const farmRewardFinal = farmRewardList && farmRewardList.filter(
      (item) =>  item.total_earned !== "0"
    );

    return (
      <>
        <ModalHeader onClose={onDismiss} title="Farm Claim Referral Reward" />
        <RewardGroup>
          {farmRewardFinal?.length ? (
            farmRewardFinal.map((farmReward) => (
              <ClaimPopupContent key={farmReward.id} farmReward={farmReward} />
            ))
          ) : (
            <NoData>
              <Image
                src={NoDataImage}
                alt="icon-nodata"
                width="79"
                height="100"
              />
              <div className="text">No Data</div>
            </NoData>
          )}
        </RewardGroup>
        <Button
          onClick={handleClaim}
          disabled={!farmRewardList?.length}
        >Claim Reward</Button>
      </>
    );
  };

  return (
    <Modal
      onDismiss={onDismiss}
      isOpen={isOpen}
      maxWidth={isMobile ? 343 : 532}
    >
      {getModalContent()}
    </Modal>
  );
};

export default ClaimRewardModal;
