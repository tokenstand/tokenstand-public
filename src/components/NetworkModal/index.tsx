import { NETWORK_ICON, NETWORK_LABEL } from "../../constants/networks";
import {
  useModalOpen,
  useNetworkModalToggle,
} from "../../state/application/hooks";

import { ApplicationModal, setChainIdDisconnect } from "../../state/application/actions";
import { ChainId } from "@sushiswap/sdk";
import Image from "next/image";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import React, { useEffect, useState } from "react";
import cookie from "cookie-cutter";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import styled from "styled-components";
import { bsc } from "../../connectors";
import usePrevious from "../../hooks/usePrevious";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { useChainId } from "../../hooks";

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
    font-size: 18px;
    line-height: 126.5%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text1};
  }
  img {
    border-radius: 100%;
  }
`;
export const PARAMS: {
  [chainId in ChainId]?: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
} = {
  [ChainId.MAINNET]: {
    chainId: "0x1",
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3"],
    blockExplorerUrls: ["https://etherscan.com"],
  },
  [ChainId.FANTOM]: {
    chainId: "0xfa",
    chainName: "Fantom",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpcapi.fantom.network"],
    blockExplorerUrls: ["https://ftmscan.com"],
  },
  [ChainId.RINKEBY]: {
    chainId: "0x4",
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "Rinkeby",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
  },
  [ChainId.BSC]: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  [ChainId.MATIC]: {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com"], // ['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ["https://explorer-mainnet.maticvigil.com"],
  },
  [ChainId.HECO]: {
    chainId: "0x80",
    chainName: "Heco",
    nativeCurrency: {
      name: "Heco Token",
      symbol: "HT",
      decimals: 18,
    },
    rpcUrls: ["https://http-mainnet.hecochain.com"],
    blockExplorerUrls: ["https://hecoinfo.com"],
  },
  [ChainId.XDAI]: {
    chainId: "0x64",
    chainName: "xDai",
    nativeCurrency: {
      name: "xDai Token",
      symbol: "xDai",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.xdaichain.com"],
    blockExplorerUrls: ["https://blockscout.com/poa/xdai"],
  },
  [ChainId.HARMONY]: {
    chainId: "0x63564C40",
    chainName: "Harmony One",
    nativeCurrency: {
      name: "One Token",
      symbol: "ONE",
      decimals: 18,
    },
    rpcUrls: ["https://api.s0.t.hmny.io"],
    blockExplorerUrls: ["https://explorer.harmony.one/"],
  },
  [ChainId.AVALANCHE]: {
    chainId: "0xA86A",
    chainName: "Avalanche",
    nativeCurrency: {
      name: "Avalanche Token",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://explorer.avax.network"],
  },
  [ChainId.OKEX]: {
    chainId: "0x42",
    chainName: "OKEx",
    nativeCurrency: {
      name: "OKEx Token",
      symbol: "OKT",
      decimals: 18,
    },
    rpcUrls: ["https://exchainrpc.okex.org"],
    blockExplorerUrls: ["https://www.oklink.com/okexchain"],
  },
  [ChainId.ARBITRUM]: {
    chainId: "0xA4B1",
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
  },
  [ChainId.CELO]: {
    chainId: "0xA4EC",
    chainName: "Celo",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
  },
  [ChainId.BSC_TESTNET]: {
    chainId: "0x61",
    chainName: "BSC Tesnet",
    nativeCurrency: {
      name: "BSC Tesnet",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://data-seed-prebsc-2-s3.binance.org:8545",
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  [ChainId.KOVAN]: {
    chainId: "0x2a",
    chainName: "Ethereum Testnet Kovan",
    nativeCurrency: {
      name: "Ethereum Testnet Kovan",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://kovan.poa.network"],
    blockExplorerUrls: ["https://kovan.etherscan.io/"],
  }
};

export default function NetworkModal(): JSX.Element | null {
  const { library, account, connector } = useActiveWeb3React();
  const { chainId } = useChainId();
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK);
  const toggleNetworkModal = useNetworkModalToggle();
  const dispatch = useDispatch<AppDispatch>();

  if (!chainId) return null;
  const arrNetWork =
    process.env.NEXT_PUBLIC_NETWORK === "TESTNET"
      ? [ChainId.RINKEBY, ChainId.BSC_TESTNET, ChainId.KOVAN]
      // ? [ChainId.RINKEBY, ChainId.BSC_TESTNET]
      : connector === bsc
        ? [ChainId.BSC]
        : [ChainId.MAINNET, ChainId.BSC, ChainId.ARBITRUM];
        // : [ChainId.MAINNET, ChainId.BSC];
    

  return (
    <Modal
      isOpen={networkModalOpen}
      onDismiss={toggleNetworkModal}
      maxWidth={400}
    >
      <ModalHeader onClose={toggleNetworkModal} title="Switch Network" />
      <ListNetWork className="grid grid-flow-row-dense grid-cols-1 gap-5 overflow-y-auto md:grid-cols-1">
        {arrNetWork.map((key: ChainId, i: number) => {
          return (
            <button
              key={i}
              onClick={() => {
                toggleNetworkModal();
                const params = PARAMS[key];
                cookie.set("chainId", key);
                if (account) {
                  if (key === ChainId.MAINNET) {
                    library?.send("wallet_switchEthereumChain", [
                      { chainId: "0x1" },
                      account,
                    ]);
                  } else if (key === ChainId.RINKEBY) {
                    library?.send("wallet_switchEthereumChain", [
                      { chainId: "0x4" },
                      account,
                    ]);
                  } else if (key === ChainId.KOVAN) {
                    library?.send("wallet_switchEthereumChain", [
                      { chainId: "0x2a" },
                      account,
                    ]);
                  }
                  else {
                    library?.send("wallet_addEthereumChain", [params, account]);
                  }
                }
                // else {
                //   if (key === ChainId.MAINNET) {
                //     (window.ethereum as any).request({
                //       method: 'wallet_switchEthereumChain',
                //       params: [{ chainId: '0x1' }]
                //     })
                //   } else if (key === ChainId.RINKEBY) {
                //     (window.ethereum as any).request({
                //       method: 'wallet_switchEthereumChain',
                //       params: [{ chainId: '0x4' }]
                //     })
                //   }
                //   else {
                //     (window.ethereum as any).request({
                //       method: 'wallet_addEthereumChain',
                //       params: [params]
                //     })
                //   }
                // }
                else {
                  localStorage.setItem("chainId", key.toString());
                  dispatch(setChainIdDisconnect({ chainId: key }))
                }
              }}
              className={`w-full col-span-1 p-3 space-x-3 rounded cursor-pointer ${chainId === Number(key) && "active"}`}
            >
              <div className="title-network">{NETWORK_LABEL[key]}</div>
              <Image
                src={NETWORK_ICON[key]}
                alt="Switch Network"
                className="rounded-md"
                width="32px"
                height="32px"
              />
            </button>
          );
        })}
      </ListNetWork>
    </Modal>
  );
}
