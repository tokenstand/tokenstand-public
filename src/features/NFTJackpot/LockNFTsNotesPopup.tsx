/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from 'styled-components';
import Modal from '../../components/Modal';
import CloseIcon from '../../components/CloseIcon';

const Title = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  padding: 0 0 10px;
`;

const Content = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.primaryText3};
  display: flex;
  align-items: flex-start;
`;

const Text = styled.div`
  margin-left: 5px;

  p {
    margin: 0;
  }
`;

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
};

export default function LockNFTsNotesPopup({ isOpen, onDismiss }: Props) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <Title className="flex justify-end pt-0">
        <CloseIcon onClick={onDismiss} />
      </Title>
      <Content>
        <img
          src="/icons/icon-warning.svg"
          alt="warning-icon"
          width="24px"
          height="24px"
        />
        <Text>
          <p>
            Please select the same NFT amount of each collection to enable button
            Lock NFT
          </p>
          <p>Example:</p>
          <p>
            If you selected one NFT each collection, it will count for 1 set, 2
            items of each collection (10 items/5 collections) will count as 2 sets
            and goes on
          </p>
        </Text>
      </Content>
    </Modal>
  );
}
