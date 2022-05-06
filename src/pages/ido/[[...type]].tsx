import Head from "next/head";
import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import styled from "styled-components";
import Container from "../../components/Container";
import NextIdo from "../../features/ido/NextIdo";
import PastIdo from "../../features/ido/PastIdo";
import Layout from "../../layouts/DefaultLayout";

export default function Ido(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Layout>
      <Head>
        <title>IDO | TokenStand</title>
        <meta name="description" content="Farm SUSHI" />
      </Head>
      <Container maxWidth="full" className="grid h-full mx-auto gap-9">
        <div className="space-y-6">
          <WrapIdo>
            <div className="container">
              <Coming>
                <img src="/images/coming.png" />
                <div>Coming soon!</div>
              </Coming>

              {/* <TabsIdo
            forceRenderTabPanel
            selectedIndex={tabIndex}
            onSelect={(index: number) => setTabIndex(index)}
            className="flex flex-col flex-grow"
          >
            <TabListIdo className="flex flex-shrink-0 rounded">
            <Tab
              className="cursor-pointer select-none focus:outline-none"
              selectedClassName="text-high-emphesis selected"
            >
                Next IDO
            </Tab>
            <Tab
                  className="cursor-pointer select-none focus:outline-none"
                  selectedClassName="text-high-emphesis selected"
                >
                  Past IDO
            </Tab>
            </TabListIdo>
            <TabPanel>
              <NextIdo/>
            </TabPanel>
            <TabPanel>
              <PastIdo />
            </TabPanel>
          </TabsIdo> */}
            </div>
          </WrapIdo>
        </div>
      </Container>
    </Layout>
  );
}

const WrapIdo = styled.div`
  margin-bottom: 50px;
  > .container {
    margin: 0 auto;
  }
`;

const TabListIdo = styled(TabList)`
  display: flex;
  align-items: center;
  grid-gap: 50px;
  margin-bottom: 38px;
`;

const TabsIdo = styled(Tabs)`
  color: ${({ theme }) => theme.farmText};
  font-weight: 600;
  font-size: 18px;
  line-heigr: 126, 5%;
  letter-spacing: 0.015rem;
  // text-transform: capitalize;
  padding-top: 42px;

  .selected {
    color: ${({ theme }) => theme.tabActive};
    position: relative;
    :before  {
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

const Coming = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    font-weight: 800;
    font-size: 32px;
    line-height: 39px;
    color: ${ ({ theme }) => theme.text1};
  }
`;
