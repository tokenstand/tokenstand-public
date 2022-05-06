import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { TabTitle } from "../../PriceTable";
import OrderDetail from "./OrderDetail";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { TextWarning } from "../../SwapHistory";
import axios from "axios";
import { StyleRouting, Title } from "../../Routing";
import { isMobile } from "react-device-detect";
import PopupCancelOrder from "./PopupCancelOrder";
import { useChainId } from "../../../../hooks";
import PopUpWaiting from "../PopUpWaiting";

const ButtonCancel = styled.button`
  padding: ${isMobile ? "12px 18px" : "21px 51px"};
  color: ${({ theme }) => theme.red1};
  background: rgba(236, 86, 86, 0.2);
  font-weight: bold;
  font-size: ${isMobile ? "14px" : "18px"};
  border-radius: ${isMobile ? "10px" : "15px"};
  line-height: ${isMobile ? "17px" : "21px"};
`;

export default function OrderList({ showSuccess }) {
  const [tabTitle, setTabTitle] = useState<string>("Active");
  const { account } = useWeb3React();
  const { chainId } = useChainId();
  const [dataActiveOrder, setDataActive] = useState([]);
  const [dataHistoryOrder, setHistoryOrder] = useState([]);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(0);
  const [isCancelAll, setIsCancelAll] = useState(false);
  const [openWaiting, setOpenWaiting] = useState<boolean>(false);
  const getActiveOrder = async () => {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/active-order?makerAddress=${account}&chainId=${chainId}`
      );
      setDataActive(result.data);
    } catch (e) {
      return 0;
    }
  };

  const getHistoryOrder = async () => {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/history-order?makerAddress=${account}&chainId=${chainId}`
      );
      setHistoryOrder(result.data);
    } catch (e) {
      return 0;
    }
  };
  const openCancelOrder = (id) => {
    setIsCancelOpen(true);
    setCancelOrderId(id);
  };
  useEffect(() => {
    account && tabTitle === "Active" && getActiveOrder();
    account && tabTitle === "History" && getHistoryOrder();
  }, [tabTitle, account, showSuccess, chainId]);

  return (
    <StyleRouting>
      <Title className="flex items-center justify-between">
        <h2>{i18n._(t`Limit Order`)}</h2>
      </Title>
      <TabTitle>
        <span
          className={`${tabTitle === "Active" ? "active" : ""}`}
          onClick={() => setTabTitle("Active")}
        >
          Active Orders
        </span>
        <span
          className={`${tabTitle !== "Active" ? "active" : ""}`}
          onClick={() => setTabTitle("History")}
        >
          {i18n._(t`Orders History`)}
        </span>
      </TabTitle>

      {account ? (
        <>
          {tabTitle === "Active" ? (
            <>
              <OrderDetail
                tabTitle="Active"
                data={dataActiveOrder}
                onOpenCancel={openCancelOrder}
              />

              {dataActiveOrder.length ? (
                <div
                  className={`text-center ${isMobile ? "mt-4 mb-4" : "mt-16"} `}
                >
                  <ButtonCancel
                    onClick={() => {
                      setIsCancelAll(true);
                      openCancelOrder(0);
                    }}
                  >
                    Cancel All Orders
                  </ButtonCancel>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <OrderDetail
              tabTitle="History"
              data={dataHistoryOrder}
              onOpenCancel={openCancelOrder}
            />
          )}{" "}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <TextWarning>
            Please connect your wallet to see your order
          </TextWarning>
        </div>
      )}
      <PopupCancelOrder
        listOrder={dataActiveOrder}
        getActiveOrder={getActiveOrder}
        getHistoryOrder={getHistoryOrder}
        orderId={cancelOrderId}
        all={isCancelAll}
        isOpen={isCancelOpen}
        onDismiss={() => {
          setIsCancelOpen(false);
          setIsCancelAll(false);
        }}
        setOpenWaiting={setOpenWaiting}
      />

      <PopUpWaiting
        isOpen={openWaiting}
        onDismiss={() => setOpenWaiting(false)}
      />
    </StyleRouting>
  );
}
