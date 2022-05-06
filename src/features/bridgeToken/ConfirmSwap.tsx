import React from 'react';
import CloseIcon from '../../components/CloseIcon';
import Modal from '../../components/Modal';
import styled from 'styled-components';
import Image from 'next/image';
import { isMobile } from 'react-device-detect';
import { TokenStandLogo } from './AmountInput/SelectTokenButton';
import { NETWORK_LABEL } from '../../constants/networks';
import { useChainId } from '../../hooks/useContract';
import { useIsDarkMode } from '../../state/user/hooks';
import NewTooltip from '../../components/NewTooltip';
import {
  ConfirmationPendingContent,
  TransactionSubmittedContent,
} from '../../components/TransactionConfirmationModal';

const HeadModal = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
`;
const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const BodyModal = styled.div`
  margin-top: 20px;
  position: relative;
`;

const BlockInput = styled.div`
  background: ${({ theme }) => theme.bgrList};
  border-radius: 15px;
  padding: ${isMobile ? '14px 16px' : '17px 20px '};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${isMobile ? '16px' : '20px'};

  .network-name {
    font-weight: 600;
    font-size: ${isMobile ? '12px' : '16px'};
    color: ${({ theme }) => theme.primaryText2};
  }
`;

const BlockInputLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .value-number {
    font-weight: bold;
    color: ${({ theme }) => theme.primaryText2};
    font-size: ${isMobile ? '16px' : '24px'};
    padding-left: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: ${isMobile ? '160px' : '268px'};
  }
`;

const SwitchBox = styled.div`
  position: absolute;
  z-index: 10;
  top: 46%;
  left: 2%;
  width: ${isMobile ? '24px' : '33px'};
`;

const BlockFee = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${isMobile ? '16px 8px 0' : '24px 16px 0 '};
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: ${isMobile ? '14px' : '16px'};
`;

const SwapButton = styled.button`
  background: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  width: 100%;
  border-radius: 10px;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  margin-top: ${isMobile ? '24px' : '32px'};

  @media screen and (min-width: 576px) {
    border-radius: 15px;
    padding: 21px;
    font-size: 18px;
  }
`;

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  amount: any;
  amountTo: string;
  chainIdOuput: any;
  onConfirm: () => void;
  isAttempingTx: boolean;
  txHash: string;
};

const ConfirmSwap: React.FC<Props> = ({
  isOpen,
  onDismiss,
  amount,
  amountTo,
  chainIdOuput,
  onConfirm,
  isAttempingTx,
  txHash,
}) => {
  const { chainId } = useChainId();
  const darkMode = useIsDarkMode();

  const getModalContent = () => {
    if (isAttempingTx) {
      return (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText=""
          pendingText2=""
        />
      );
    }

    if (txHash) {
      return (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          onDismiss={onDismiss}
          // currencyToAdd={currencyToAdd}
        />
      );
    }

    return (
      <>
        <HeadModal className="flex justify-between">
          <TitleStyle className="text-lg font-bold"> Confirm Swap </TitleStyle>
          <CloseIcon onClick={onDismiss} />
        </HeadModal>
        <BodyModal>
          <BlockInput>
            <BlockInputLeft>
              <Image
                src={TokenStandLogo}
                alt="TokenStand Logo"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
              />
              <NewTooltip
                dataTip={amount}
                dataValue={amount}
                className="value-number"
              />
            </BlockInputLeft>
            <div className="network-name">{NETWORK_LABEL[chainId]}</div>
          </BlockInput>
          <SwitchBox className="ml-3 mr-3 z-10 flex">
            {darkMode ? (
              <img src="/icons/icon-down-bridge-dark.svg" />
            ) : (
              <img src="/icons/icon-down-bridge.svg" />
            )}
          </SwitchBox>
          <BlockInput>
            <BlockInputLeft>
              <Image
                src={TokenStandLogo}
                alt="TokenStand Logo"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
              />
              <NewTooltip
                dataTip={amountTo}
                dataValue={amountTo}
                className="value-number"
              />
            </BlockInputLeft>
            <div className="network-name">{NETWORK_LABEL[chainIdOuput]}</div>
          </BlockInput>
        </BodyModal>

        <SwapButton onClick={onConfirm}>Confirm Swap</SwapButton>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} padding={28}>
      {getModalContent()}
    </Modal>
  );
};

export default ConfirmSwap;
