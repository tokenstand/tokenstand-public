import { i18n } from "@lingui/core";
import { t } from "@lingui/macro";
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Container from "../../components/Container";
import { GroupItemFarm } from "../../features/farm/FarmList";
import ItemCampaign from "../../features/NFTJackpot/ItemCampain";
import { useActiveWeb3React } from "../../hooks";
import { useChainId } from "../../hooks/useContract";
import Layout from "../../layouts/DefaultLayout";
import { useIsDarkMode } from "../../state/user/hooks";
import { socketInstance } from "../../functions/socketInstance";
import { Promo, PromoLeft, PromoMain, TitlePromo } from "../../features/NFTJackpot/styled";
import { isMobile } from "react-device-detect";
import { TabListFarm, TabsFarm } from "../farming";

const WrapFarm = styled.div`
  > .container {
    margin: 0 auto;
  }
`;

export default function Farm(): JSX.Element {
  const { chainId } = useChainId();
  const { account } = useActiveWeb3React();
  const [listCampaignActive, setListCampaignActive] = useState<any>([]);
  const [listCampaignEnded, setListCampaignEnded] = useState<any>([]);
  const darkMode = useIsDarkMode();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const timeNow = new Date().getTime() / 1000;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_NFT}/api/campaign?chainId=${chainId}`
    );
    const { data } = res;
    const dataActive = data.filter(
      (campaign) => campaign.end_campaign >= timeNow
    );
    setListCampaignActive(dataActive);
    const dataEnd = data.filter((campaign) => campaign.end_campaign < timeNow);
    setListCampaignEnded(dataEnd);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [chainId, account]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  useEffect(() => {
    socketInstance.getInstance().on("connect", () => {
      socketInstance.getInstance().on("nftSocket", (dataNFT) => {
        console.log("event socket", dataNFT);
        if (dataNFT.data.owner === account) {
          setLoading(false);
        }
      });
    });
  }, [account, chainId]);

  return (
    <Layout>
      <Head>
        <title>NFT Jackpot | TokenStand</title>
        <meta name="description" content="NFT Jackpot" />
      </Head>
      <Container maxWidth="full" className="grid h-full mx-auto gap-9">
        <div className="space-y-6">
          <WrapFarm>
            { !isMobile &&<Promo>
              <PromoMain>
              <PromoLeft>
                <TitlePromo>NFT Jackpot</TitlePromo>
                <p>Join the new staking program with NFT Jackpot</p>
                <p>Reward unlock every week (5% on total)</p>
                <p>Free to lock/withdraw before campaign start</p>
              </PromoLeft>
              <img src="/coin.png"/>
              </PromoMain>
            </Promo>}
  
            <TabsFarm
              selectedIndex={tabIndex}
              onSelect={(index: number) => handleTabChange(index)}
              className="flex flex-col flex-grow"
            >
              <TabListFarm className="flex flex-shrink-0 rounded">
                <Tab
                  className="cursor-pointer select-none focus:outline-none"
                  selectedClassName="text-high-emphesis selected"
                >
                  {i18n._(t`Active`)}
                </Tab>
                <Tab
                  className="cursor-pointer select-none focus:outline-none"
                  selectedClassName="text-high-emphesis selected"
                >
                  {i18n._(t`Ended`)}
                </Tab>
              </TabListFarm>

              <TabPanel>
                {tabIndex == 0 && (
                  <GroupItemFarm className="nft-block">
                    {listCampaignActive && listCampaignActive.length > 0 ? (
                      listCampaignActive.map((item, key) => (
                        <ItemCampaign
                          data={item}
                          key={key}
                          loading={loading}
                          setLoading={setLoading}
                        />
                      ))
                    ) : (
                      <div
                        style={{ color: darkMode ? "#ffffffde" : "#001c4ede" }}
                      >
                        No data
                      </div>
                    )}
                  </GroupItemFarm>
                )}
              </TabPanel>

              <TabPanel>
                {tabIndex == 1 && (
                  <GroupItemFarm className="nft-block">
                    {listCampaignEnded && listCampaignEnded.length > 0 ? (
                      listCampaignEnded.map((item, key) => (
                        <ItemCampaign
                          data={item}
                          key={key}
                          loading={loading}
                          setLoading={setLoading}
                        />
                      ))
                    ) : (
                      <div
                        style={{ color: darkMode ? "#ffffffde" : "#001c4ede" }}
                      >
                        No data
                      </div>
                    )}
                  </GroupItemFarm>
                )}
              </TabPanel>
            </TabsFarm>
          </WrapFarm>
        </div>
      </Container>
    </Layout>
  );
}
