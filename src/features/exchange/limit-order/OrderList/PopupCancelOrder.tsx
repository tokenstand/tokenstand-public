import React, { useState, useEffect } from 'react'
import Modal from '../../../../components/Modal';
import CloseIcon from "../../../../components/CloseIcon";
import axios from "axios";
import {
  useLimitOrderContract,
} from "../../../../hooks";
import {
  calculateGasMargin
} from "../../../../functions";
import styled from 'styled-components';
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import { useWeb3React } from "@web3-react/core";
import TransactionFailedModal from "../../../../components/TransactionFailedModal";
import PopUpTransaction from "../PopUpTransaction";
import socketInstance from "../../../../hooks/useSocket";

interface Props {
  isOpen: boolean,
  orderId: number,
  onDismiss: any,
  getActiveOrder: any,
  all?: boolean,
  listOrder?: any,
  getHistoryOrder: any
  setOpenWaiting?: any
}
const CloseIconStyle = styled(CloseIcon)`
  stroke: ${({ theme }) => theme.smText};
`
const HeadModal = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
`;
const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  @media screen and (max-width:768px){
    font-size:18px;
  }
`;
const ModalContent = styled.div`
  padding: 1rem 0;
`;
const ModalFooter = styled.div`
    display: flex;
    justify-content: center;
    height: 70px;
    padding-top: 15px;
    button {
        width: 120px;
        height: 45px;
        border-radius: 10px;
        background: #72BF65;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        &:nth-child(2) {
            background: #EC5656;
            margin-left: 15px;
        }
    }

`
export default function PopupCancelOrder({ isOpen, orderId, onDismiss, getActiveOrder, getHistoryOrder, all, setOpenWaiting }: Props) {

  const limitOrderContract = useLimitOrderContract();
  const addTransaction = useTransactionAdder();
  const { account, library } = useWeb3React();
  const [showSuccess, setShowSuccess] = useState(false)
  const [showReject, setShowReject] = useState(false)
  
  useEffect(() => {
    socketInstance?.limitOrderSocket.on("update_order", data => {
      if(data === account)
        getActiveOrder();
        getHistoryOrder();
    })
  }, [socketInstance?.limitOrderSocket])
  const cancelOrder = async () => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (!all) {
      try {
        // cancel order on smart contract
        onDismiss()
        setOpenWaiting(true)
        let order = await axios.get(`${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/order?id=${orderId}`);
        
        await limitOrderContract
          .cancelOrder(order?.data?.order_structure)
          .then((response) => {
            addTransaction(response, { summary: "Cancel Order" });
          });

        // getActiveOrder();
        setOpenWaiting(false)
        setShowSuccess(true)
        // setTimeout(() => {
        //   getActiveOrder();
        // }, 15000)
      } catch (e) {
        console.error(e)
        onDismiss();
        setOpenWaiting(false)
        setShowReject(true)
      }
    } else {
      try {
        onDismiss()
        setOpenWaiting(true)
        await limitOrderContract
          .increaseNonce()
          .then((response) => {
            addTransaction(response, { summary: "Cancel Orders" });
          });
        // const result = await axios.put(
        // `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/cancel-all-order`, {makerAddress: account}, axiosConfig
        // );
        setOpenWaiting(false)
        setShowSuccess(true)
        // setTimeout(() => {
        //   getActiveOrder();
        // }, 15000)
      } catch (err) {
        console.error(err)
        onDismiss();
        setOpenWaiting(false)
        setShowReject(true)
      }
    }
  }
  const handleDismisReject = () => {
    setShowReject(false)
  }
  const handleDismisSuccess = () => {
    setShowSuccess(false)
  }
  return (
    <div>
      <Modal
        isOpen={isOpen}
        // onDismiss={onDismissTransaction}
        onDismiss={onDismiss}
        maxWidth={400}
        maxHeight={200}
        className="modal-style"
      >
        <HeadModal className="flex justify-end">
          <CloseIcon onClick={onDismiss} />
        </HeadModal>
        <ModalContent>
          <TitleStyle className="text-lg font-bold">{`Cancel ${all ? "all" : ""} Limit ${all && "Orders" || "Order"}`} </TitleStyle>
        </ModalContent>
        <ModalFooter>
          <button onClick={() => cancelOrder()}>Confirm</button>
          <button onClick={() => onDismiss()}>Exit</button>
        </ModalFooter>
      </Modal>
      {showReject && (
        <TransactionFailedModal
          isOpen={showReject}
          onDismiss={handleDismisReject}
        />
      )}
      {showSuccess && (
        <PopUpTransaction
          isOpen={showSuccess}
          onDismiss={handleDismisSuccess}
        />
      )}
      </div>
      )
}
