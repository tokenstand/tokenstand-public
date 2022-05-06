

import LinkStyledButton from "../LinkStyledButton";
import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";


const IconWrapper = styled(LinkStyledButton)`
  //color: ${({ theme }) => theme.text3};
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: calc(0.25rem * var(--tw-space-x-reverse)) !important;
    margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse))) !important;
    `};
  svg{
    @media(max-width: 640px){
        width: 13px;
    }
  }
  
`;


export function TransactionHelper() {
    return (
        <IconWrapper>
            {isMobile ?
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M9.33329 9.9225V5.83333H8.16662V9.9225H6.41663L8.74996 12.25L11.0833 9.9225H9.33329ZM5.24996 1.75L2.91663 4.0775H4.66663V8.16667H5.83329V4.0775H7.58329L5.24996 1.75Z" fill="#72BF65"/>
                </svg>
                
            :
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M16 17.01V10H14V17.01H11L15 21L19 17.01H16ZM9 3L5 6.99H8V14H10V6.99H13L9 3Z" fill="#72BF65"/>
            </svg>
            
            }
            
        </IconWrapper>
    );
}

export function DisconnectHelper() {
    return (
        <IconWrapper>
            {isMobile ?
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.91667 2.91667H6.41667C6.7375 2.91667 7 2.65417 7 2.33333C7 2.0125 6.7375 1.75 6.41667 1.75H2.91667C2.275 1.75 1.75 2.275 1.75 2.91667V11.0833C1.75 11.725 2.275 12.25 2.91667 12.25H6.41667C6.7375 12.25 7 11.9875 7 11.6667C7 11.3458 6.7375 11.0833 6.41667 11.0833H2.91667V2.91667Z" fill="#72BF65"/>
                    <path d="M12.0458 6.79586L10.4183 5.16836C10.3778 5.12668 10.3257 5.09805 10.2687 5.08615C10.2118 5.07424 10.1526 5.07959 10.0988 5.10152C10.0449 5.12344 9.99877 5.16094 9.96634 5.20922C9.9339 5.2575 9.9166 5.31436 9.91667 5.37252V6.41669H5.83333C5.5125 6.41669 5.25 6.67919 5.25 7.00002C5.25 7.32086 5.5125 7.58336 5.83333 7.58336H9.91667V8.62752C9.91667 8.89002 10.2317 9.01836 10.4125 8.83169L12.04 7.20419C12.1567 7.09336 12.1567 6.90669 12.0458 6.79586Z" fill="#72BF65"/>
                </svg>
                
            :
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H11C11.55 21 12 20.55 12 20C12 19.45 11.55 19 11 19H5V5Z" fill="#72BF65"/>
                <path d="M20.65 11.65L17.86 8.85998C17.7905 8.78853 17.7012 8.73946 17.6036 8.71905C17.506 8.69863 17.4045 8.70781 17.3121 8.74539C17.2198 8.78298 17.1408 8.84727 17.0851 8.93003C17.0295 9.0128 16.9999 9.11027 17 9.20998V11H10C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13H17V14.79C17 15.24 17.54 15.46 17.85 15.14L20.64 12.35C20.84 12.16 20.84 11.84 20.65 11.65Z" fill="#72BF65"/>
            </svg>

            }
            
        </IconWrapper>
    );
}