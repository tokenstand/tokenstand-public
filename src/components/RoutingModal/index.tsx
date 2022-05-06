import React from "react";
import Image from "next/image";
import Modal from "../Modal";
import {
  useModalOpen,
  useRoutingModalToggle,
} from "../../state/application/hooks";
import { ApplicationModal } from "../../state/application/actions";
import styled from "styled-components";
import SubTitle from "../../features/exchange/SubTitle";

const Title = styled.div`
  h2 {
    margin-bottom: 0;
    color: ${({ theme }) => theme.text1};
    font-size: 24px;
    font-weight: 700;
  }
  margin-bottom: 30px;
`;


export default function RoutingModal({ routeData, currencies }) {
  const routingModalOpen = useModalOpen(ApplicationModal.ROUTING_FULL_SCREEN);
  const toggleRoutingModal = useRoutingModalToggle();
  return (
    <Modal
      isOpen={routingModalOpen}
      onDismiss={toggleRoutingModal}
      maxWidth={920}
      width={"calc(100vw - 30px) !important"}
    >
      <Title className="flex justify-between items-center">
        <h2>Routing</h2>
        <div
          className="close-icon flex items-center justify-center w-6 h-6 cursor-pointer text-primary hover:text-high-emphesis"
          onClick={toggleRoutingModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
      </Title>
      <SubTitle routeData={routeData} currencies={currencies} unitPrice=''/>
    </Modal>
  );
}
