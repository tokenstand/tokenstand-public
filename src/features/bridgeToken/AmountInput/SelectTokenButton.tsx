import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
// images
export const TokenStandLogo = '/icons/tokenstand_circle_logo.png';

const Wrapper = styled.button`
  padding: 7px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  font-size: 12px;
  cursor: default;
  ${({ theme }) =>
    `background: ${theme.bgButton};
    border: 1px solid ${theme.borderButton}`};

  @media screen and (min-width: 576px) {
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 16px;
  }

  span {
    margin-left: 8px;
    font-weight: 600;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 20px;
  height: 20px;

  @media screen and (min-width: 576px) {
    width: 28px;
    height: 28px;
  }

  img {
    border-radius: 50%;
  }
`;

const SelectTokenButton = () => {
  return (
    <Wrapper>
      <ImageWrapper>
        <Image
          src={TokenStandLogo}
          alt="TokenStand Logo"
          layout="fill"
          objectFit="contain"
        />
      </ImageWrapper>
      <span>STAND</span>
    </Wrapper>
  );
};

export default SelectTokenButton;
