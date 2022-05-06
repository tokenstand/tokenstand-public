import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layouts/DefaultLayout";
import Head from "next/head";
import Container from "../../components/Container";
import TabsReferral from "../../features/referral/components/TabsReferral";
import ReferralFarm from "../../features/referral/components/ReferralFarm";
import AboutTab from "../../features/referral/AboutTab";
import ReferralList from "../../features/referral/components/ReferralList";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import ClaimCard from "../../features/referral/ClaimCard";
import MyReferralLink from "../../features/referral/MyReferralLink";
import { useActiveWeb3React, useReferralContract } from "../../hooks";
import axios from "axios";
import { STAND } from "../../constants";
import { parseUnits } from "ethers/lib/utils";
import {
  isTransactionRecent,
  useAllTransactions,
  useTransactionAdder,
} from "../../state/transactions/hooks";
import PopUpTransaction from "../../features/exchange/limit-order/PopUpTransaction";
import TransactionFailedModal from "../../components/TransactionFailedModal";
import { io } from "socket.io-client";

const ClaimReward = styled.div`
  display: grid;
  grid-template-columns: ${isMobile ? "1fr" : "repeat(2, minmax(100px, 1fr))"};
  gap: ${isMobile ? "24px" : "56px"};
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const BlockTop = styled.div`
  background: ${({ theme }) => theme.bgReferral};
  padding-top: ${isMobile ? "115px" : "160px"};
  width: 100%;
`;

const socket = io(process.env.NEXT_PUBLIC_API_REFERRAL);

export interface FarmReward {
  id: string;
  user_id: string;
  token: string;
  symbol: string;
  total_earned: string;
}

export default function Referral(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);
  const { account, chainId } = useActiveWeb3React();
  const [myRef, setMyRef] = useState("");
  const [dataInfo, setDataInfo] = useState<any>();
  const [statusClaim, setStatusClaim] = useState("");
  const [farmRewardStand, setFarmRewardStand] = useState("");
  const [farmRewardList, setFarmRewardList] = useState<FarmReward[]>([]);
  const referralContract = useReferralContract(chainId);
  const [isTransactionFailed, setIsTransactionFailed] = useState(false);
  const [isAttempingTx, setIsAttempingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const addTransaction = useTransactionAdder();
  const [isOpenClaimFarmReward, setIsOpenClaimFarmReward] = useState(false);
  const [submitedClaimFriend, setSubmitedClaimFriend] = useState(false);
  const [submitedClaimFail, setSubmitedClaimFail] = useState(false);
  const [isPendingClaimFarmReward, setIsPendingClaimFarmReward] =
    useState(false);
  const [isPendingClaimFriendsReward, setIsPendingClaimFriendsReward] =
    useState(false);
  const allTransactions = useAllTransactions();

  const recentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent);
  }, [allTransactions]);

  const confirmedTransactions = recentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  useEffect(() => {
    if (confirmedTransactions.includes(txHash)) {
      setTxHash("");
      getFarmRewardList();
      getMyInfo();
    }
  }, [confirmedTransactions, txHash]);

  const getTabPanel = () => {
    switch (tabIndex) {
      case 1:
        return <ReferralFarm />;
      case 2:
        return <AboutTab />;
      default:
        return <ReferralList dataInfo={dataInfo} />;
    }
  };

  useEffect(() => {
    socket.on("withdraw_farm", (data) => {
      if (data.status === "claim_success") {
        setTxHash("");
        getFarmRewardList();
        getMyInfo();
      }
    });

    socket.on("withdraw_friend", (data) => {
      if (data.status === "claim_success") {
        getMyInfo();
      }
    });
  }, []);

  const getMyInfo = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_REFERRAL}/api/user-info`,
      { params: { userId: account, chainId: chainId } }
    );
    setDataInfo(res.data);

    setIsPendingClaimFriendsReward(
      res.data.send_gift && res.data.send_gift === "pending"
    );
    setIsPendingClaimFarmReward(
      res.data.send_farm_reward && res.data.send_farm_reward === "pending"
    );

    return res;
  };

  const getMyRef = async () => {
    const res = await getMyInfo();
    const myref = `${process.env.NEXT_PUBLIC_DOMAIN}/?ref=${res.data.refer_code}`;
    setMyRef(myref);
    setStatusClaim(res.data.send_gift);
  };

  const getFarmRewardList = async () => {
    try {
      const res = await axios.get("api/referral-reward", {
        baseURL: process.env.NEXT_PUBLIC_API_REFERRAL,
        params: {
          userId: account,
          chainId,
        },
      });

      const farmRewardList = res.data;

      if (farmRewardList) {
        const farmRewardStand = farmRewardList.find(
          (farmReward) => farmReward.symbol === STAND[chainId].symbol
        );
        setFarmRewardStand(farmRewardStand ? farmRewardStand.total_earned : "");
        setFarmRewardList(farmRewardList);
      }
    } catch (error) {
      setFarmRewardStand("");
      setFarmRewardList([]);
    }
  };

  const claimReferralReward = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_REFERRAL}/api/user-claim`,
      {
        userId: account,
        chainId: chainId,
      }
    );

    if (!res.data) {
      setSubmitedClaimFail(true);
      setIsPendingClaimFriendsReward(false);
    } else {
      setSubmitedClaimFriend(true);
      const resInfo = await getMyInfo();
      const statusClaim = resInfo?.data.send_gift;
      setStatusClaim(statusClaim);
      setIsPendingClaimFriendsReward(true);
    }
  };

  const claimFarmReward = async () => {
    try {
      setIsAttempingTx(true);
      setTxHash("");

      const otherAddresses = farmRewardList
        .filter(
          (farmReward) =>
            farmReward.symbol !== STAND[chainId].symbol &&
            farmReward.total_earned !== "0"
        )
        .map((farmReward) => farmReward.token);
      const params = [
        parseUnits(farmRewardStand, STAND[chainId].decimals),
        otherAddresses,
      ];

      const gasFee = await referralContract.estimateGas.claimFarming(...params);
      const tx = await referralContract.claimFarming(...params, {
        gasLimit: gasFee,
      });

      // update status clam farm reward
      const res = axios.post(
        `${process.env.NEXT_PUBLIC_API_REFERRAL}/api/update-farm-claim`,
        {
          userId: account,
          chainId,
        }
      );

      addTransaction(tx, {
        summary: `Claim reward`,
      });

      setIsPendingClaimFarmReward(true);
      setIsAttempingTx(false);
      setTxHash(tx.hash);
    } catch (error) {
      setIsPendingClaimFarmReward(false);
      setIsOpenClaimFarmReward(false);
      setIsAttempingTx(false);
      setTxHash("");
      setIsTransactionFailed(true);
    }
  };

  useEffect(() => {
    if (account) {
      getMyRef();
      getFarmRewardList();
      setIsPendingClaimFarmReward(false);
      setIsPendingClaimFriendsReward(false);
    }
  }, [account, chainId]);

  return (
    <Layout>
      <Head>
        <title>Referral | TokenStand</title>
        <meta name="description" content="Referral" />
      </Head>
      <Container maxWidth="full" className="grid h-full mx-auto gap-9">
        <BlockTop
          className={`grid h-full mx-auto ${
            isMobile ? " gap-6 px-4" : " gap-20 px-24"
          }`}
        >
          <MyReferralLink myRef={myRef} status={dataInfo?.status} />
          {account && (
            <>
              <ClaimReward>
                <ClaimCard
                  heading={"Farm Referral Reward"}
                  reward={farmRewardStand}
                  isFarmReward={true}
                  handleClaim={claimFarmReward}
                  farmRewardList={farmRewardList}
                  isAttempingTx={isAttempingTx}
                  txHash={txHash}
                  isOpenClaimFarmReward={isOpenClaimFarmReward}
                  setIsOpenClaimFarmReward={setIsOpenClaimFarmReward}
                  isPendingClaimFarmReward={isPendingClaimFarmReward}
                />
                <ClaimCard
                  heading={"Friends Referral Reward"}
                  reward={dataInfo?.gift}
                  isFarmReward={false}
                  handleClaim={claimReferralReward}
                  isPendingClaimFriendsReward={isPendingClaimFriendsReward}
                />
              </ClaimReward>
              <TabsReferral
                tabIndex={tabIndex}
                onTabSelect={(index) => setTabIndex(index)}
              />

              <PopUpTransaction
                isOpen={submitedClaimFriend}
                onDismiss={() => setSubmitedClaimFriend(false)}
              />
              <TransactionFailedModal
                isOpen={submitedClaimFail}
                onDismiss={() => setSubmitedClaimFail(false)}
              />
            </>
          )}
        </BlockTop>
        <div className={isMobile ? "px-4" : "px-24"}>
          {account ? getTabPanel() : <AboutTab />}
        </div>

        <TransactionFailedModal
          isOpen={isTransactionFailed}
          onDismiss={() => setIsTransactionFailed(false)}
        />
      </Container>
    </Layout>
  );
}
