import CloseIcon from "./CloseIcon";
import Image from "next/image";
import Modal from "./Modal";
import React from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import styled from 'styled-components'

const CloseIconStyle = styled(CloseIcon)`
  stroke: ${({ theme }) => theme.smText};
`

interface TransactionFailedModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export default function TransactionFailedModal({
  isOpen,
  onDismiss,
}: TransactionFailedModalProps) {
  const { i18n } = useLingui();

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} padding={28} maxWidth={523} maxHeight={400}>
      <div className=" h-80">
        <div className="flex justify-end">
          <CloseIconStyle onClick={onDismiss} />
        </div>
        <div className="flex justify-center pt-7">
          <Image
            src={"/images/transaction-rejected.svg"}
            width="96px"
            height="96px"
            alt="transaction rejected"
          />
        </div>
        <div className="flex items-baseline justify-center mt-3 text-3xl flex-nowrap">
          {/* <p className="text-high-emphesis">Uh Oh!&nbsp;</p> */}
          <TextStyle className="text-pink">Transaction rejected.</TextStyle>
        </div>
        <div className="flex justify-center mt-5">
          <ButtonDismiss
            onClick={onDismiss}
            className="flex items-center justify-center w-full h-12 text-lg font-medium rounded bg-pink hover:bg-opacity-90 text-high-emphesis"
          >
            {i18n._(t`Dismiss`)}
          </ButtonDismiss>
        </div>
      </div>
    </Modal>
  );
}
const TextStyle = styled.p`
  font-size: 18px;
  line-height: 126.5%;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  font-weight: 600;
  color: rgba(236, 86, 86, 1);
  margin-top: 32px;
  @media (max-width: 767px){
    font-size: 14px;
  }
`
const ButtonDismiss = styled.button`
  background: rgba(236, 86, 86, 1);
  border: 1px solid #rgba(236, 86, 86, 1);
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 18px;
  line-height: 126.5%;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.015em;
  text-transform: capitalize;

  color: #FFFFFF;
  @media (max-width: 767px){
    font-size: 14px;
    height: 40px;
  }
`
