import Modal from "../../components/Modal";
import { NETWORK_ICON, NETWORK_LABEL } from "../../constants/networks";
import Image from "next/image";
import { ChainId } from "@sushiswap/sdk";
import styled from "styled-components";
import { useChainId } from "../../hooks";
import ModalHeader from "../../components/ModalHeader";
import { isMobile } from "react-device-detect";

const ListNetWork = styled.div`
  button {
    border: 1px solid ${({ theme }) => theme.border3};
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:hover {
      background: ${({ theme }) => theme.bg3};
    }
  }
  button.active {
    border: 1px solid #72bf65;
    cursor: auto;
    &:hover {
      background: transparent;
    }
  }
  .title-network {
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    line-height: 126.5%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    font-size: ${isMobile ? "14px" : "18px"};
    padding-left: ${isMobile ? "5px" : "12px"} !important;
    color: ${({ theme }) => theme.text1};
  }
  img {
    border-radius: 50%;
  }
  .image-network {
    margin-right: ${isMobile ? "5px" : "12px"} !important;
  }
`;

export default function SwitchNetworkModal(props: any): JSX.Element {
  const { switchNetwork, currentChainId, onDismiss, isOpen } = props;
  const { chainId } = useChainId();
  if (!chainId) return null;
  const arrNetwork =
    process.env.NEXT_PUBLIC_NETWORK === "TESTNET"
      ? [ChainId.RINKEBY, ChainId.BSC_TESTNET]
      : [ChainId.MAINNET, ChainId.BSC];

  const handleSwitchNetwork = (key) => {
    switchNetwork(key);
    onDismiss();
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth={isMobile ? 340 : 513}
    >
      <ModalHeader onClose={onDismiss} title="Switch to" />

      <ListNetWork
        className={`${
          isMobile ? "gap-4" : "gap-6"
        } grid grid-flow-row-dense grid-cols-1 overflow-y-auto md:grid-cols-1 magin`}
      >
        {arrNetwork.map((key: ChainId, i: number) => {
          return (
            <button
              onClick={() => {
                currentChainId !== Number(key) &&
                  handleSwitchNetwork(
                    currentChainId !== chainId ? currentChainId : key
                  );
              }}
              style={isMobile ? { height: "60px" } : { height: "81px" }}
              className={`w-full col-span-1 p-3 space-x-3 rounded cursor-pointer ${
                currentChainId === Number(key) && "active"
              }`}
              key={i}
            >
              <div className="title-network">{NETWORK_LABEL[key]}</div>
              <div className="image-network">
                <img
                  src={NETWORK_ICON[key]}
                  alt="Network Icon"
                  className=""
                  width={isMobile ? "32px" : "40px"}
                  height={isMobile ? "32px" : "40px"}
                />
              </div>
            </button>
          );
        })}
      </ListNetWork>
    </Modal>
  );
}
