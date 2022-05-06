import React, { useState } from "react";
import { ChainId } from "@sushiswap/sdk";
import styled from "styled-components";
import { Input as NumericalInput } from "../../../components/NumericalInput";
import SelectNetworkButton from "./SelectNetworkButton";
import SelectTokenButton from "./SelectTokenButton";
import NewTooltip from "../../../components/NewTooltip";

const Wrapper = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.bgInputPanel};
  padding: 12px;

  @media screen and (min-width: 576px) {
    border-radius: 15px;
    padding: 16px 24px;
  }
`;

const TextRow = styled.div`
  color: ${({ theme }) => theme.textInputPanel};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 7px;

  .balance {
    width: 120px;
    cursor: pointer;
    text-align: right;
    div {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  @media screen and (min-width: 576px) {
    font-weight: 500;
    margin-bottom: 5px;
  }
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.primaryText2};

  .buttons-group {
    display: flex;

    > button:not(:last-child) {
      margin-right: 10px;

      @media screen and (min-width: 576px) {
        margin-right: 8px;
      }
    }
  }
`;

const NumericalInputStyled = styled(NumericalInput)`
  background: transparent;
  padding: 7px 10px 7px 0;
  font-size: 16px;
  width: 50px;
  color: ${({ theme }) => theme.primaryText2};

  @media screen and (min-width: 576px) {
    padding: 10px 8px 10px 0;
    font-size: 24px;
    width: auto;
  }

  &::placeholder {
    color: ${({ theme }) => theme.subText};
  }
`;

type Props = {
  isTokenFrom: boolean;
  inputChainId: ChainId;
  balance?: any;
  amount: any;
  handleUserInput?: any;
  handleBalanceMax?: any;
  switchNetwork?: any;
};

const AmountInput: React.FC<Props> = ({
  isTokenFrom,
  inputChainId,
  balance,
  amount,
  handleUserInput,
  handleBalanceMax,
  switchNetwork,
}) => {
  const getInputLabel = () => {
    return (isTokenFrom && "From:") || "To (est):";
  };

  return (
    <Wrapper>
      <TextRow>
        <span>{getInputLabel()}</span>
        {isTokenFrom && (
          <span
            className="balance"
            onClick={() => balance !== "-" && handleBalanceMax(balance)}
          >
            <NewTooltip dataTip={balance} dataValue={"Balance: " + balance} />
          </span>
        )}
      </TextRow>

      <AmountRow>
        <NumericalInputStyled
          value={amount}
          disabled={!isTokenFrom}
          onUserInput={(value) => handleUserInput(value)}
        />

        <div className="buttons-group">
          <SelectTokenButton />
          <SelectNetworkButton
            inputChainId={inputChainId}
            switchNetwork={switchNetwork}
          />
        </div>
      </AmountRow>
    </Wrapper>
  );
};

export default AmountInput;
