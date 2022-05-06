import React from 'react';
import styled from 'styled-components';
import Modal from '../../components/Modal';
import CloseIcon from '../../components/CloseIcon';

const Content = styled.div`
  position: relative;
  font-weight: 500;
  font-size: 12px;
  color: #001c4e99;

  svg {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const Text = styled.div`
  p {
    margin: 0;
  }
`;

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  collectionsData: any[];
  listNFTIdSelected: any
};

export default function SelectedNFTsPopup({
  isOpen,
  onDismiss,
  collectionsData,
  listNFTIdSelected
}: Props) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <Content>
        <CloseIcon onClick={onDismiss} />

        <Text>
          <p>You have selected:</p>
          <ul>
            {collectionsData.length > 0 && collectionsData.map((value, index) => (
              <li key={index}>- {listNFTIdSelected[value?.collection_index]
                ? listNFTIdSelected[value?.collection_index].nftId
                    .length
                : 0}{" "}
              {value?.collection_name}</li>
            ))}
          </ul>
        </Text>
      </Content>
    </Modal>
  );
}