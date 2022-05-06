import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import Column from "../Column";
import CurrencyModalView from "./CurrencyModalView";
import ManageLists from "./ManageLists";
import ManageTokens from "./ManageTokens";
import ModalHeader from "../ModalHeader";
import { Token } from "@sushiswap/sdk";
import { TokenList } from "@uniswap/token-lists";
import styled from "styled-components";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

const ContentWrapper = styled(Column)`
  height: 100%;
  width: 100%;
  // flex: 1 1;
  // position: relative;
  // overflow-y: hidden;
  justify-content: flex-start;
  .style-title{
    h2{
      @media (max-width: 767px){
        font-size: 18px !important;
      }
    }
  }
`;

function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const { i18n } = useLingui();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ContentWrapper>
      <ModalHeader
        className="style-title"
        onClose={onDismiss}
        title={i18n._(t`Manage`)}
        onBack={() => setModalView(CurrencyModalView.search)}
      />
      <Tabs
        forceRenderTabPanel
        selectedIndex={tabIndex}
        onSelect={(index: number) => setTabIndex(index)}
        className="flex flex-col flex-grow relative"
      >
        <StyledTabList className="flex flex-shrink-0 p-1 rounded bg-dark-800">
          <Tab
            className="flex items-center justify-center flex-1 px-1 py-2 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
            selectedClassName="active"
          >
            {i18n._(t`Lists`)}
          </Tab>
          <Tab
            className="flex items-center justify-center flex-1 px-1 py-2 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
            selectedClassName="active"
          >
            {i18n._(t`Tokens`)}
          </Tab>
        </StyledTabList>
        <TabPanel style={{ flexGrow: 1 }}>
          <ManageLists
            setModalView={setModalView}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        </TabPanel>
        <TabPanel style={{ flexGrow: 1 }}>
          <ManageTokens
            setModalView={setModalView}
            setImportToken={setImportToken}
          />
        </TabPanel>
        {/* <Tip className="absolute bottom-0 text-sm w-full">
          <div className=" flex justify-center w-full">
             Tip: Custom tokens are stored locally in your browser
          </div>
        </Tip> */}
        
      </Tabs>
    </ContentWrapper>
  );
}

export default Manage;
const StyledTabList = styled(TabList)`
  background: ${({ theme }) => theme.bgNoti};
  border: 1px solid ${({ theme }) => theme.border1};
  max-width: 462px;
  max-height: 63px;
  li{
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 126.5%;
    padding:17px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text1};
    @media (max-width: 640px){
      font-size: 12px;
      padding: 15px;
    }
  }
  li.active{
   background: ${({ theme }) => theme.greenButton};
   color: #ffffff;
  }
  @media (max-width: 640px){
   height: 50px;
  }
`
const Tip = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-size: 14px;
  // left: 10px;
  @media (max-width: 640px){
    font-size: 12px;
    bottom: 20px !important;
  }
`