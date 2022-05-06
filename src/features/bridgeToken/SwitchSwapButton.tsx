import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.button`
  background: ${({ theme }) => theme.bgSwitch};
  border: 1px solid ${({ theme }) => theme.borderSwitch};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 9;

  @media (min-width: 576px) {
    width: 33px;
    height: 33px;
  }

  svg {
    path {
      fill: ${({ theme }) => theme.iconSwitch};
    }
  }
`;

const SwitchSwapButton = ({ callback }) => {
  return (
    <Wrapper onClick={callback}>
      <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1667 16.0925V9.66667H13.3333V16.0925H10.5833L14.25 19.75L17.9167 16.0925H15.1667ZM8.75001 3.25L5.08334 6.9075H7.83334V13.3333H9.66668V6.9075H12.4167L8.75001 3.25Z"
          fill="#667795"
        />
      </svg>
    </Wrapper>
  );
};

export default SwitchSwapButton;
