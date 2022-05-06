import { ChevronLeftIcon, XIcon } from "@heroicons/react/outline";

import React from "react";
import { theme } from "../../theme";
import Typography from "../Typography";
import { isMobile } from "react-device-detect";
import styled from 'styled-components'
import { useIsDarkMode } from "../../state/user/hooks";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";

function ModalHeader({
  title = undefined,
  onClose = undefined,
  className = "",
  onBack = undefined,
}: {
  title?: string;
  className?: string;
  onClose?: () => void;
  onBack?: () => void;
}): JSX.Element {
  const { i18n } = useLingui();
  const darkMode = useIsDarkMode();

  return (
    <ModalHead className={`flex items-center justify-between mb-4 ${className}`}>
      {onBack && (
        <ChevronLeftIcon
          style={{ color: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.38)" }}
          onClick={onBack}
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      {title && (

        <Typography component="h2" variant="h3" className="font-bold text-general-popup"
          style={{
            //fontWeight: "600",
            fontSize: isMobile ? "18px" : "20px",
          }}
        >
          {i18n._(t`${title}`)}
        </Typography>
      )
      }
      <div
        className="close-icon flex items-center justify-center w-6 h-6 cursor-pointer text-primary hover:text-high-emphesis"
        onClick={onClose}
      >
        <XIcon width={24} height={24} />
      </div>
    </ModalHead>
  );
}

export default ModalHeader;
const ModalHead = styled.div`
  
  .head-title{
    color:${({ theme }) => theme.text1};
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 126.5%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
  }
  .text-general-popup{
    margin: 0;
  }
  .close-icon{
    color:${({ theme }) => theme.text6};
    &:hover{
      color:${({ theme }) => theme.text1};
    }
  }
`
