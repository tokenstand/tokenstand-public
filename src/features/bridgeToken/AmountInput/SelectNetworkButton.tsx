import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { ChainId } from "@sushiswap/sdk";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { NETWORK_ICON, NETWORK_LABEL } from "../../../constants/networks";
import SwitchNetworkModal from "../ModalSwitch";

export const NETWORK_LABEL_BRIDGE: { [chainId in ChainId]?: string } =
  process.env.NEXT_PUBLIC_NETWORK === "TESTNET"
    ? { [ChainId.RINKEBY]: "Rinkeby", [ChainId.BSC_TESTNET]: "BSC"}
    : { [ChainId.MAINNET]: "Ethereum", [ChainId.BSC]: "BSC" };

const Wrapper = styled.button`
  padding: 7px 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  border-radius: 4px;
  font-size: 12px;
  width: 118px;
  ${({ theme }) =>
    `background: ${theme.bgButton};
    border: 1px solid ${theme.borderButton}`};

  @media screen and (min-width: 576px) {
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 16px;
    width: 177px;
  }

  span {
    white-space: nowrap;
    margin: 0 8px;
    font-weight: 600;
  }
`;

const ChevronDownIconStyled = styled(ChevronDownIcon)`
  stroke: ${({ theme }) => theme.primaryText3};
  width: 16px;
  height: 16px;
  margin-left: auto;

  @media screen and (min-width: 576px) {
    width: 18px;
    height: 18px;
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

type Props = {
  inputChainId: ChainId;
  switchNetwork: Function;
};

const SelectNetworkButton: React.FC<Props> = ({
  inputChainId,
  switchNetwork,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Wrapper onClick={() => setIsOpen(true)}>
      <ImageWrapper>
        <Image
          src={NETWORK_ICON[inputChainId]}
          alt={`${NETWORK_LABEL_BRIDGE[inputChainId]} Logo`}
          layout="fill"
          objectFit="contain"
        />
      </ImageWrapper>
      <span>{NETWORK_LABEL_BRIDGE[inputChainId]}</span>
      <ChevronDownIconStyled />
      <SwitchNetworkModal
        switchNetwork={switchNetwork}
        currentChainId={inputChainId}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />
    </Wrapper>
  );
};

export default SelectNetworkButton;
