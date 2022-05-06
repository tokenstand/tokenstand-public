import React from "react";
import styled from "styled-components";
import CloseIcon from "../../../components/CloseIcon";
import { useIsDarkMode } from "../../../state/user/hooks";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 24px;
  button {
    margin-right: 20px;
  }
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const Header = ({ onDismiss, handleClose }) => {
  const darkMode = useIsDarkMode();

  return (
    <div className="flex justify-between">
      <TitleStyle className="text-lg font-bold">
        Edit Numbers
      </TitleStyle>
      <CloseIcon onClick={handleClose} />
    </div>
  );
};
export default Header;
