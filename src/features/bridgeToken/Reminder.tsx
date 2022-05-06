import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ChainId } from "@sushiswap/sdk";
import {
  cancelBridgeTokenFee,
  fetchBridgeTokenFee,
} from "../../context/globalData";
import { formatUnits, parseEther, parseUnits } from "ethers/lib/utils";

const Wrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.bgButton};
`;

const Heading = styled.h5`
  color: ${({ theme }) => theme.primaryText2};
  font-size: 14px;

  @media screen and (min-width: 576px) {
    font-size: 16px;
  }
`;

const ReminderList = styled.ul`
  color: ${({ theme }) => theme.textInput};
  font-size: 12px;

  li {
    display: flex;

    &::before {
      content: "-";
      display: block;
      margin-right: 5px;
    }
  }
`;

type Props = {
  chainId: ChainId;
  amount: string;
  onBridgeTokenFeeChange: (
    minAmount: string,
    maxAmount: string,
  ) => void;
  setAmountTo: React.Dispatch<React.SetStateAction<string>>;
};

type BridgeTokenFee = {
  gasFee: string;
  crosschainFee: string;
  minCrosschainFee: string;
  maxCrosschainFee: string;
  minAmount: string;
  maxAmount: string;
};

const initialBridgeTokenFee: BridgeTokenFee = {
  gasFee: "0.00",
  crosschainFee: "0.1",
  minCrosschainFee: "0.00",
  maxCrosschainFee: "0.00",
  minAmount: "0.00",
  maxAmount: "0.00",
};

const Reminder: React.FC<Props> = ({
  chainId,
  amount,
  onBridgeTokenFeeChange,
  setAmountTo,
}) => {
  const [bridgeTokenFee, setBridgeTokenFee] = useState<BridgeTokenFee>(
    initialBridgeTokenFee
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!chainId) {
        if (cancelBridgeTokenFee) {
          cancelBridgeTokenFee();
        }
        setBridgeTokenFee(initialBridgeTokenFee);
        setAmountTo("");
        return;
      }
      const res = await fetchBridgeTokenFee(
        chainId,
        amount && amount !== ("." || "") ? amount : "0"
      );
      const bridgeTokenFee: BridgeTokenFee = res?.data;
      if (bridgeTokenFee) {
        setBridgeTokenFee((prev) => ({
          ...prev,
          ...bridgeTokenFee,
        }));
        setAmountTo(
          getAmountTo(
            bridgeTokenFee.gasFee,
            bridgeTokenFee.minCrosschainFee,
            bridgeTokenFee.minAmount
          )
        );
        onBridgeTokenFeeChange(
          bridgeTokenFee.minAmount,
          bridgeTokenFee.maxAmount
        );
      }
    };

    fetchData();
  }, [chainId, amount]);

  const getCrosschainFee = () => {
    return Number(bridgeTokenFee?.minCrosschainFee)
      ? `${formatNumberStr(bridgeTokenFee?.minCrosschainFee)} STAND`
      : `${bridgeTokenFee?.crosschainFee}%`;
  };

  const formatNumberStr = (numberStr: string) => {
    if (!numberStr) {
      return "0.000";
    }

    return Number(numberStr).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  };

  const getAmountTo = (
    gasFee: string,
    crosschainFee: string,
    minAmount: string
  ) => {
    if (
      amount &&
      amount !== ("." || "") &&
      parseEther(amount).lt(parseEther(Number(minAmount).toFixed(3)))
    ) {
      return "0";
    }

    const decimals = Math.max(
      gasFee.split(".")[1]?.length || 0,
      crosschainFee.split(".")[1]?.length || 0
    );

    const totalFeeParsed = parseUnits(gasFee, decimals).add(
      parseUnits(crosschainFee, decimals)
    );
    const amountToParsed =
      amount &&
      amount !== ("." || "") &&
      parseUnits(amount, decimals).sub(totalFeeParsed);

    return amount && amount !== ("." || "") && !amountToParsed.isNegative()
      ? formatUnits(amountToParsed, decimals).toString()
      : amount && amount !== ("." || "")
      ? "0"
      : "";
  };

  return (
    <Wrapper>
      <Heading>Reminder:</Heading>
      <ReminderList>
        <li>
          Crosschain Fee is {getCrosschainFee()}, Gas Fee is{" "}
          {formatNumberStr(bridgeTokenFee?.gasFee)} STAND
        </li>
        <li>
          Minimum Crosschain Amount is{" "}
          {formatNumberStr(bridgeTokenFee?.minAmount)} STAND
        </li>
        {/* <li>Maximum Crosschain Amount is {formatNumberStr(bridgeTokenFee?.maxAmount)} STAND</li> */}
        <li>Estimated Time of Crosschain Arrival is 10-30 min</li>
        {/* <li>
          Crosschain amount larger than {bridgeTokenFee?.maxAmount} STAND could take up to 24
          hours
        </li> */}
      </ReminderList>
    </Wrapper>
  );
};

export default Reminder;
