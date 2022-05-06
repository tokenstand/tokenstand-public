
import { useWeb3React } from "@web3-react/core";
import React from "react";
import styled from "styled-components";
import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import CloseIcon from "../../components/CloseIcon";
import Modal from "../../components/Modal";

const CloseIconStyle = styled(CloseIcon)`
  stroke: ${({ theme }) => theme.smText};
`;

const LoadingIcon = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  svg {
    animation: rotate-s-loader 1s linear infinite;
    @keyframes rotate-s-loader {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @media (max-width: 640px){
      width: 110px;
    }
  }
`;

const ConfirmText = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.primaryText2};
  @media (max-width: 640px){
    font-size: 14px;
  }
`;

interface PopUpTransactionProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export default function PopUpWaitingClaim({
  isOpen,
  onDismiss,
}: PopUpTransactionProps) {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      padding={28}
    >
      <div className="flex justify-end">
          <CloseIconStyle onClick={onDismiss} />
        </div>
        <LoadingIcon className=" pb-4 m-auto">
          <svg
            width="153"
            height="153"
            viewBox="0 0 153 153"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M76.5001 132.009C107.157 132.009 132.009 107.157 132.009 76.5C132.009 45.8431 107.157 20.9908 76.5001 20.9908C45.8433 20.9908 20.991 45.8431 20.991 76.5C20.991 107.157 45.8433 132.009 76.5001 132.009Z"
              stroke="#D7D7D7"
              strokeWidth="5"
            />
            <path
              d="M37.4177 115.919C47.4493 125.865 61.2571 132.009 76.4998 132.009V132.009C107.157 132.009 132.009 107.157 132.009 76.5C132.009 45.8431 107.157 20.9908 76.4998 20.9908"
              stroke="#72BF65"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </LoadingIcon>
        <div className="flex flex-col items-center justify-center">
          <ConfirmText>{i18n._(t`Waiting For Confirmation`)}</ConfirmText>
        </div>
    </Modal>
  );
}