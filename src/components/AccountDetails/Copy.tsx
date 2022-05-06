import { CheckCircle, Copy } from "react-feather";

import LinkStyledButton from "../LinkStyledButton";
import React from "react";
import styled from "styled-components";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { isMobile } from "react-device-detect";


const CopyIcon = styled(LinkStyledButton)`
  // color: ${({ theme }) => theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  // font-size: 0.825rem;
  font-size : 1rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    // color: ${({ theme }) => theme.text2};
  }
`;
const TransactionStatusText = styled.span`
  margin-right: 0.25rem;
  font-size: 0.825rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  svg{
    @media(max-width: 640px){
        width: 14px;
    }
  }
`;

export default function CopyHelper(props: {
  toCopy: string;
  children?: React.ReactNode;
}): any {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyIcon onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={"16"} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          {isMobile ?
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.66675 2.33329V9.33329C3.66675 9.64271 3.78966 9.93946 4.00846 10.1582C4.22725 10.377 4.524 10.5 4.83341 10.5H9.50008C9.8095 10.5 10.1062 10.377 10.325 10.1582C10.5438 9.93946 10.6667 9.64271 10.6667 9.33329V4.22446C10.6667 4.06904 10.6357 3.91518 10.5753 3.77194C10.515 3.62869 10.4267 3.49893 10.3156 3.39029L8.38183 1.49913C8.16387 1.28601 7.87116 1.16666 7.56633 1.16663H4.83341C4.524 1.16663 4.22725 1.28954 4.00846 1.50833C3.78966 1.72713 3.66675 2.02387 3.66675 2.33329V2.33329Z" stroke="#72BF65"/>
              <path d="M8.33337 10.4999V11.6666C8.33337 11.976 8.21046 12.2728 7.99166 12.4915C7.77287 12.7103 7.47613 12.8333 7.16671 12.8333H2.50004C2.19062 12.8333 1.89388 12.7103 1.67508 12.4915C1.45629 12.2728 1.33337 11.976 1.33337 11.6666V5.24992C1.33337 4.9405 1.45629 4.64375 1.67508 4.42496C1.89388 4.20617 2.19062 4.08325 2.50004 4.08325H3.66671" stroke="#72BF65"/>
            </svg>
             :
             <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3V15C5 15.5304 5.21071 16.0391 5.58579 16.4142C5.96086 16.7893 6.46957 17 7 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V6.242C17 5.97556 16.9467 5.71181 16.8433 5.46624C16.7399 5.22068 16.5885 4.99824 16.398 4.812L13.083 1.57C12.7094 1.20466 12.2076 1.00007 11.685 1H7C6.46957 1 5.96086 1.21071 5.58579 1.58579C5.21071 1.96086 5 2.46957 5 3V3Z" stroke="#72BF65"/>
              <path d="M13 17V19C13 19.5304 12.7893 20.0391 12.4142 20.4142C12.0391 20.7893 11.5304 21 11 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H5" stroke="#72BF65"/>
            </svg>

          }
        </TransactionStatusText>
      )}
      {isCopied ? "" : props.children}
    </CopyIcon>
  );
}
