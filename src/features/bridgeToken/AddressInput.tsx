import React from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
  margin: 20px 0 24px;
`;

const Text = styled.div`
  color: ${({ theme }) => theme.primaryText3};
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;

  @media screen and (min-width: 576px) {
    font-weight: 500;
    margin-bottom: 5px;
    padding: 0 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  padding: 8px 12px;
  ${({ theme, messageAddress }) =>
    `color: ${theme.textInputPanel};
    border-bottom: 2px solid ${
      messageAddress === "" ? theme.borderCard : theme.red1
    };`}

  font-size: ${isMobile ? "11px" : "16px"};

  @media screen and (min-width: 576px) {
    padding: 10px 24px;
  }
  
  :focus {
    border-color: ${({ theme, messageAddress }) =>
      messageAddress === "" ? "#72bf65" : theme.red1};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red1};
  padding-top: 4px;
`;

type Props = {
  address: any;
  handleAddressTo: any;
  messageAddress: string;
};

const AddressInput: React.FC<Props> = ({
  address,
  handleAddressTo,
  messageAddress,
}) => {
  return (
    <Wrapper>
      <Text>To Address</Text>
      <Input
        value={address}
        onChange={(e) => handleAddressTo(e.target.value)}
        messageAddress={messageAddress}
      />
      <ErrorMessage>{messageAddress}</ErrorMessage>
    </Wrapper>
  );
};

export default AddressInput;
