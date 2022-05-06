import { AlertTriangle, ArrowUpCircle } from "react-feather";
import React, { FC } from "react";

import Button from "../Button";
import { ChainId, Currency } from "@sushiswap/sdk";
import CloseIcon from "../CloseIcon";
import ExternalLink from "../ExternalLink";
import Lottie from "lottie-react";
import Modal from "../Modal";
import { getExplorerLink } from "../../functions/explorer";
import loadingRollingCircle from "../../animation/loading-rolling-circle.json";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";
import styled from "styled-components";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   font-size: 18px;
  `};
`;
export const ConfirmText = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.primaryText2};
  @media (max-width: 640px){
    font-size: 14px;
  }
`;

const InfoSwap = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.primaryText2};
  padding-top: 8px;
  text-transform: capitalize;
  text-align: center;
  @media (max-width: 640px){
    font-size: 12px;
  }
`;

const TextStyle = styled.div`
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.primaryText3};
  text-transform: capitalize;
  @media (max-width: 640px){
    font-size: 12px;
  }
`;

export const LoadingIcon = styled.div`
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

const CloseIconStyle = styled(CloseIcon)`
  stroke: ${({ theme }) => theme.smText};
`

const TextView = styled.div`
  color: #0074DF;
  font-weight: normal;
  font-size: 16px;
  @media (max-width: 767px){
    font-size: 12px;
  }
`

const TextBold = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.primaryText2};
  @media (max-width: 767px){
    font-size: 14px;
  }
`
const ButtonStyle = styled(Button)`
@media (max-width: 767px){
  font-size: 14px;
  height: 40px;
  padding: 0px !important;
}
`
interface ConfirmationPendingContentProps {
  onDismiss: () => void;
  pendingText?: string;
  pendingText2?: string;
}

export const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> =
  ({ onDismiss, pendingText, pendingText2 }) => {
    const { i18n } = useLingui();
    return (
      <div>
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
          <InfoSwap>{pendingText}</InfoSwap>
          <InfoSwap>{pendingText2}</InfoSwap>
          <TextStyle>
            {i18n._(t`Confirm This Transaction In Your Wallet`)}
          </TextStyle>
        </div>
      </div>
    );
  };

interface TransactionSubmittedContentProps {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined
  inline?: boolean // not in modal
}

export const TransactionSubmittedContent: FC<TransactionSubmittedContentProps> =
  ({ onDismiss,
    chainId,
    hash,
    currencyToAdd, }) => {
    const { i18n } = useLingui();

    return (
      <div>
        <div className="flex justify-end">
          <CloseIconStyle onClick={onDismiss} />
        </div>
        <div className="w-24 pb-4 m-auto">
          <ArrowUpCircle strokeWidth={0.5} size={90} style={{ stroke: '#72BF65'}} />
        </div>
        <div className="flex flex-col items-center justify-center ">
          <TextBold>
            {i18n._(t`Transaction Submitted`)}
          </TextBold>
          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, "transaction")}>
              <TextView>{i18n._(t`View on explorer`)}</TextView>
            </ExternalLink>
          )}
          <ButtonStyle
            color="gradient"
            onClick={onDismiss}
            style={{ margin: "20px 0 0 0", background: "#72BF65", padding: "16px" }}
          >
            {i18n._(t`Close`)}
          </ButtonStyle>
        </div>
      </div>
    );
  };

interface ConfirmationModelContentProps {
  title: string;
  onDismiss: () => void;
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}

export const ConfirmationModalContent: FC<ConfirmationModelContentProps> = ({
  title,
  bottomContent,
  onDismiss,
  topContent,
}) => {
  return (
    <div className="sm:grid gap-3">
      <div>
        <div className="flex justify-between">
          <TitleStyle>{title}</TitleStyle>
          <CloseIcon onClick={onDismiss} />
        </div>
        {topContent()}
      </div>
      <div>{bottomContent()}</div>
    </div>
  );
};

interface TransactionErrorContentProps {
  message: string;
  onDismiss: () => void;
}

export const TransactionErrorContent: FC<TransactionErrorContentProps> = ({
  message,
  onDismiss,
}) => {
  const { i18n } = useLingui();

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex justify-between">
          <div className="text-red">
            {/* {i18n._(t`Error`)} */}
          </div>
          <CloseIconStyle onClick={onDismiss} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <AlertTriangle
            className="text-red"
            style={{ strokeWidth: 1.5 }}
            size={64}
          />
          <div className="font-semibold text-red text-lg">{message}</div>
        </div>
      </div>
      <div>
        <Button color="red" size="lg" onClick={onDismiss} style={{ background: '#EC5656'}}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  pendingText2?: string;
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  pendingText2,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} pendingText2={pendingText2} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
