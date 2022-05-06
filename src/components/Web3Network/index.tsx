import { NETWORK_ICON, NETWORK_LABEL } from "../../constants/networks";

import Image from "next/image";
import NetworkModel from "../NetworkModal";
import React from "react";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useModalOpen, useNetworkModalToggle } from "../../state/application/hooks";
import styled from "styled-components";
import { ApplicationModal } from "../../state/application/actions";

const WrapDiv = styled.div`
padding: 5px 14px 5px 5px ;
>div:first-child {
  width: 30px;
  height: 30px;
}
.text{
  font-size: 17px;
}
img{
  border-radius: 50%;
}
`;
function Web3Network(): JSX.Element | null {
  const { chainId, account } = useActiveWeb3React();
  const defaultChainId = Number(localStorage.getItem("chainId")) ? Number(localStorage.getItem("chainId")) :
    process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? 4 : 1;
  const toggleNetworkModal = useNetworkModalToggle();
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK);


  if (!chainId) return null;

  const arrChainId = process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? [4, 97, 42] : [1, 56, 42161]
  // const chainIdSupport = arrChainId.includes(chainId) ? chainId : 1
  let chainIdSupport = defaultChainId;
  if (account) {
    chainIdSupport = arrChainId.includes(chainId) ? chainId : defaultChainId
  }
  else {
    chainIdSupport = arrChainId.includes(defaultChainId) ? defaultChainId : 1
  }
  return (
    <SwitchNetWorkBox
      className="flex items-center rounded whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleNetworkModal()}
    >
      <WrapDiv className="grid items-center grid-flow-col px-3 py-2 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max btn-secondary">
        <Image
          src={NETWORK_ICON[chainIdSupport] || "/"}
          alt="Switch Network"
          className="rounded-md"
          width="22px"
          height="22px"
        />

        <div className="hidden sm:inline-block text ">{NETWORK_LABEL[chainIdSupport]}</div>
        <ArrowDown className="sm:hidden inline-block ">
          <svg width="16" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.33325 1.24997L5.99992 5.91664L10.6666 1.24997" stroke="white" strokeWidth="1.45631" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ArrowDown>
      </WrapDiv>
      {networkModalOpen && <NetworkModel />}
    </SwitchNetWorkBox>
  );
}

export default Web3Network;
const ArrowDown = styled.div`

`
const SwitchNetWorkBox = styled.div`
@media screen and (max-width:639px){
  background: #5773E7;
  border-radius:30px;
}

`
