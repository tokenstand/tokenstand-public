import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { useIsDarkMode } from "../../../../state/user/hooks";
import { Input as NumericalInput } from "../../../../components/NumericalInput";
import moment from "moment";
import useDebounce from "../../../../hooks/useDebounce";

const Header = styled.div`
  padding: 18px 56px;
  border-bottom: 1px solid ${({ theme }) => theme.border1};

  @media screen and (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderLeft = styled.div`
  gap: ${isMobile ? "12px" : "24px"};
  .text-round {
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 600;
    font-size: ${isMobile ? "14px" : "17px"};
  }

  .info-round {
    color: ${({ theme }) => theme.thinText};
    font-weight: 500;
    font-size: ${isMobile ? "14px" : "17px"};
  }
`;

const HeaderRight = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const InputSearch = styled(NumericalInput)`
  padding: 10px 24px;
  font-size: ${isMobile ? "14px" : "17px"};
  border-radius: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.border1};
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 500;
  width: 82px;
  text-align: center;

  ::placeholder {
    color: transparent;
  }

  @media screen and (max-width: 768px) {
    padding: 10px 18px;
    width: 66px;
  }
`;

const ButtonNext = styled.button`
  width: 40px;
  height: 40px;
  background: ${({ theme, disabled }) => (disabled ? theme.bgTab : "#72BF65")};
  border-radius: 8px;
  align-items: center;
  display: flex;
  justify-content: center;

  :disabled {
    cursor: not-allowed;
    :hover {
      opacity: 1;
    }
  }

  :hover {
    opacity: 0.8;
  }

  svg path {
    fill: ${({ darkMode, disabled }) => disabled ? (darkMode ? "white" : "rgba(0, 28, 78, 0.6)") : 'white'};
    fill-opacity: ${({ disabled }) => (disabled ? "0.38" : "1")};
  }
`;

const ButtonPrev = styled(ButtonNext)`
  svg {
    transform: rotate(180deg);
  }
`;

const HeaderAllHistory = ({
  roundCheck,
  setRoudCheck,
  dataHistory,
  fetchHistory,
  roundCurrentPrev,
}) => {
  const darkMode = useIsDarkMode();
  const roundCheckDebounce =  useDebounce(roundCheck, 300)
  const handleUserInput = (value) => {
    const reg = /^(?!00)\d+$/;

    if (
      (new RegExp(reg).test(value) || !value) &&
      Number(roundCurrentPrev) >= Number(value)
    ) {
      setRoudCheck(value);
    }
  };  

  useEffect(() => {
    fetchHistory(roundCheck);
  }, [roundCheckDebounce]);

  return (
    <Header className="flex justify-between items-center">
      <HeaderLeft className="flex items-center">
        <div className="text-round">Round</div>
        <InputSearch
          value={roundCheck}
          onUserInput={(value) => handleUserInput(value)}
          decimals={0}
          placeholder={""}
        />
        {dataHistory?.endRoundTime && (
          <div className="info-round">
            Drawn {moment(dataHistory?.endRoundTime * 1000).format("HH:mm, DD MMM YYYY ")}
          </div>
        )}
      </HeaderLeft>

      <HeaderRight className="flex gap-4" darkMode={darkMode}>
        <ButtonPrev
          disabled={roundCheck < 2}
          onClick={() => setRoudCheck(roundCheck - 1)}
          darkMode={darkMode}
        >
          {arrowIcon}
        </ButtonPrev>
        <ButtonNext
          disabled={roundCheck >= roundCurrentPrev}
          onClick={() => setRoudCheck(Number(roundCheck) + 1)}
          darkMode={darkMode}
        >
          {arrowIcon}
        </ButtonNext>
        <ButtonNext
          disabled={roundCheck >= roundCurrentPrev}
          onClick={() => setRoudCheck(roundCurrentPrev)}
          darkMode={darkMode}
        >
          {iconNext}
        </ButtonNext>
      </HeaderRight>
    </Header>
  );
};

export default HeaderAllHistory;

const arrowIcon = (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="prev"
  >
    <path
      d="M1.29002 9.88047L5.17002 6.00047L1.29002 2.12047C0.90002 1.73047 0.90002 1.10047 1.29002 0.710469C1.68002 0.320469 2.31002 0.320469 2.70002 0.710469L7.29002 5.30047C7.68002 5.69047 7.68002 6.32047 7.29002 6.71047L2.70002 11.3005C2.31002 11.6905 1.68002 11.6905 1.29002 11.3005C0.910019 10.9105 0.90002 10.2705 1.29002 9.88047Z"
      fill="white"
      fillOpacity="0.38"
    />
  </svg>
);

const iconNext = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.58 10.89L7.35 6.82C7.91 6.42 7.91 5.58 7.35 5.19L1.58 1.11C0.91 0.65 0 1.12 0 1.93V10.07C0 10.88 0.91 11.35 1.58 10.89ZM10 1V11C10 11.55 10.45 12 11 12C11.55 12 12 11.55 12 11V1C12 0.45 11.55 0 11 0C10.45 0 10 0.45 10 1Z"
      fill="white"
      fillOpacity="0.38"
    />
  </svg>
);
