import React, { useState, useEffect } from "react";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import Modal from "../../components/Modal";
import styled from "styled-components";
import CloseIcon from "../../components/CloseIcon";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import SwapTransactionHistory from "./SwapTransaction";
import AddTransaction from "./AddTransaction";
import RemoveTransaction from "./RemoveTransaction";
import AllTransaction from "./AllTransaction";
import { getNativePrice } from "../../functions/tokenPrice";

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     font-size: 18px;
    `};
`;

const TabsTransaction = styled.div`
  color: ${({ theme }) => theme.farmText};
  font-weight: 600;
  font-size: 18px;
  line-height: 126, 5%;
  letter-spacing: 0.015rem;
  text-transform: capitalize;
  padding-top: 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 14px;
        height: 370px;
        `};
  @media screen and (max-width: 768px) {
    padding-top: 0;
  }
  @media screen and (min-width: 769px) {
    padding-left: 24px;
    padding-right: 24px;
    height: 370px;
  }
  .selected {
    color: ${({ theme }) => theme.tabActive};
    position: relative;
    :before {
      content: "";
      display: inline-block;
      height: 2px;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: -5px;
      background: ${({ theme }) => theme.primary1};
    }
  }
`;
const TabListTransaction = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 50px;

  @media screen and (max-width: 768px) {
    grid-gap: 0px;
    margin: 10px 10px 20px 0;
    padding-left: 24px;
    padding-right: 24px;
  }
  li {
    @media screen and (max-width: 768px) {
      margin-right: 30px;
    }
  }
`;

const TabStyle = styled.div`
  cursor: pointer;
  @media screen and (max-width: 768px) {
    margin-right: 30px;
  }
`;

const TabPanelStyle = styled.div`
  padding-top: 24px;
`;

export default function ModalTransaction({
  isOpenTransaction,
  onDismissTransaction,
  tabSwap
}: {
  isOpenTransaction: boolean;
  onDismissTransaction: () => void;
  tabSwap
}) {
  const [tabIndex, setTabIndex] = useState(tabSwap);
  const { account, chainId } = useActiveWeb3React();
  const [ethPrice, setEthprice] = useState("");

  const fetchPrice = async (chainId) => {
    const price = await getNativePrice(chainId);
    setEthprice(price);
  };

  useEffect(() => {
    fetchPrice(chainId);
  }, [chainId]);

  return (
    <Modal
      isOpen={isOpenTransaction}
      onDismiss={onDismissTransaction}
      maxWidth={856}
      maxHeight={80}
      className="modal-style"
    >
      <div className="flex justify-between">
        <TitleStyle className="text-lg font-bold">
          Transaction History
        </TitleStyle>
        <CloseIcon onClick={onDismissTransaction} />
      </div>
      <div
        className=""
        style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem" }}
      >
        <TabsTransaction className="flex flex-col flex-grow">
          <TabListTransaction className="flex flex-shrink-0 rounded">
            <TabStyle
              className={tabIndex === 0 ? "selected" : ""}
              onClick={() => setTabIndex(0)}
            >
              All
            </TabStyle>
            <TabStyle
              className={tabIndex === 1 ? "selected" : ""}
              onClick={() => setTabIndex(1)}
            >
              Swaps
            </TabStyle>
            <TabStyle
              className={tabIndex === 2 ? "selected" : ""}
              onClick={() => setTabIndex(2)}
            >
              Adds
            </TabStyle>
            <TabStyle
              className={tabIndex === 3 ? "selected" : ""}
              onClick={() => setTabIndex(3)}
            >
              Removes
            </TabStyle>
          </TabListTransaction>
          {tabIndex === 0 && (
            <TabPanelStyle>
              <AllTransaction tabIndex={tabIndex} ethPrice={ethPrice} />
            </TabPanelStyle>
          )}{" "}
          {tabIndex === 1 && (
            <TabPanelStyle>
              <SwapTransactionHistory
                tabIndex={tabIndex}
                ethPrice={ethPrice}
              />
            </TabPanelStyle>
          )}
          {tabIndex === 2 && (
            <TabPanelStyle>
              <AddTransaction tabIndex={tabIndex} ethPrice={ethPrice} />
            </TabPanelStyle>
          )}
          {tabIndex === 3 && (
            <TabPanelStyle>
              <RemoveTransaction tabIndex={tabIndex} ethPrice={ethPrice} />
            </TabPanelStyle>
          )}
        </TabsTransaction>
      </div>
    </Modal>
  );
}
