import { Token } from "@sushiswap/sdk";
import { useWeb3React } from "@web3-react/core";
import { AlertTriangle, ArrowUpCircle } from "react-feather";
import moment from "moment";
import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import CloseIcon from "../../../components/CloseIcon";
import { useIsDarkMode } from "../../../state/user/hooks";
import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

const CloseIconStyle = styled(CloseIcon)`
  stroke: ${({ theme }) => theme.smText};
`;

const TextBold = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.primaryText2};
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;
const ButtonStyle = styled(Button)`
  @media (max-width: 767px) {
    font-size: 14px;
    height: 40px;
    padding: 0px !important;
  }
`;

interface PopUpTransactionProps {
  isOpen: boolean;
  onDismiss: () => void;
  isCreate?: boolean
}

export default function PopUpTransaction({
  isOpen,
  onDismiss,
  isCreate
}: PopUpTransactionProps) {
  const { chainId } = useWeb3React();
  const darkMode = useIsDarkMode();

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      padding={28}
      maxWidth={523}
      maxHeight={400}
    >
      <div className="flex justify-end">
        <CloseIconStyle onClick={onDismiss} />
      </div>
      <div className="w-24 pb-4 m-auto">
        <ArrowUpCircle
          strokeWidth={0.5}
          size={90}
          style={{ stroke: "#72BF65" }}
        />
      </div>
      <div className="flex flex-col items-center justify-center ">
        <TextBold>{isCreate ? 'Create Order Successfully' : i18n._(t`Transaction Submitted`)}</TextBold>

        <ButtonStyle
          color="gradient"
          onClick={onDismiss}
          style={{
            margin: "20px 0 0 0",
            background: "#72BF65",
            padding: "16px",
          }}
        >
          {i18n._(t`Close`)}
        </ButtonStyle>
      </div>
    </Modal>
  );
}
