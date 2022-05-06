import { Disclosure } from "@headlessui/react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DoubleLogo from "../../components/DoubleLogo";
import NewTooltip from "../../components/NewTooltip";
import { useChainId, useNFTJackpotContract } from "../../hooks";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { useWalletModalToggle } from "../../state/application/hooks";
import { FarmTypeEnum } from "../../constants/farm-type";
import PopupManage from "./PopupManage";
import { handleAdvancedDecimal } from "../../utils/decimalAdjust";
import { CountStake, LinkCollection, TextStake } from "./styled";
import { standardData } from "../farm/deposit";
import moment from "moment";
import { convertToNumber } from "../../utils/convertNumber";
import { handleValue } from "../exchange/SwapHistory";
import { STAND_TOKEN } from "../../constants";
import { getTokenPrice } from "../../functions/tokenPrice";
import BigNumber from "bignumber.js";
import { calculateGasMargin } from "../../functions";
import TransactionFailedModal from "../../components/TransactionFailedModal";
import { useTransactionAdder } from "../../state/transactions/hooks";
import PopupClaim from "./PopupClaim";
import PopUpWaitingClaim from "./PopUpWaitingClaim";
import { ChainId } from "@sushiswap/sdk";

export const handleToFixedDataTip = (value, numberFix) => {
  let valueStr =
    value !== undefined || value !== "undefined" ? String(value) : "0";
  let valueNum =
    value !== undefined || value !== "undefined" ? Number(value) : 0;
  if (valueNum % 1 == 0) {
    return valueStr;
  } else if (valueNum === 0 || valueStr === "0") {
    return 0;
  }
  return valueNum.toFixed(numberFix);
};

export const convertHexToDec = (hexVal: string, decimals: number) => {
  return parseInt(hexVal, 16) / Math.pow(10, decimals);
};

const ItemCampaign = ({ data,loading, setLoading }) => {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const { chainId } = useChainId();
  const toggleWalletModal = useWalletModalToggle();
  const [isOpenManage, setIsOpenManage] = useState(false);
  const [isOpenClaim, setIsOpenClaim] = useState(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [disableClaim, setDisableClaim] = useState<boolean>(false);

  const addTransaction = useTransactionAdder();

  const nftContract = useNFTJackpotContract();

  const campaignId = data.campaign_id;

  const [dataCampaign, setDataCampaign] = useState<any>({
    totalStaked: 0,
    yourStake: 0,
    totalRewardOfCampaign: 0,
    standReward: 0,
    standRewardUSD: 0,
    lastClaimedTimestamp: 0,
    periodClaim: 0,
  });
  let standReward;
  let claimableReward;

  const fetchData = async () => {
    const [
      totalStaked,
      yourStake,
      campaignInfo,
      vestingInfo,
      claimablePercent,
    ] = await Promise.all([
      (nftContract && nftContract.totalCampaignSupply(campaignId)) || 0,
      (nftContract &&
        account &&
        nftContract.collectorInfo(campaignId, account)) ||
        0,
      (nftContract && nftContract.campaignInfo(campaignId)) || 0,

      (nftContract &&
        account &&
        nftContract.vestingInfo(account, campaignId)) ||
        0,
      (nftContract && nftContract.claimablePercent()) || 0,
    ]);

    const standPriceUSD =
      (await getTokenPrice(STAND_TOKEN[chainId], chainId)) || 0;

    const periodClaim = account ? await nftContract.cliffDuration() : 0;
    const timeNow = new Date().getTime() / 1000;
    const timestampFinish = campaignInfo.timestampFinish;

    //campgin end and use not claim
    if (
      Number(timestampFinish < timeNow) &&
      Number(vestingInfo.claimedAmount) !== 0
    ) {
      standReward = new BigNumber(
        convertToNumber(vestingInfo.totalReward, 18)
      ).minus(new BigNumber(convertToNumber(vestingInfo.claimedAmount, 18)));

      claimableReward = new BigNumber(
        convertToNumber(vestingInfo.totalReward, 18)
      )
        .div(100)
        .times(Number(claimablePercent) / 100);
    } else {
      const standRewardResult =
        (nftContract &&
          account &&
          (await nftContract.getCampaignEarned(campaignId, account))) ||
        0;
      standReward = convertToNumber(standRewardResult, 18);
      claimableReward = new BigNumber(standReward)
        .div(100)
        .times(Number(claimablePercent) / 100);
    }

    setDataCampaign({
      ...dataCampaign,
      totalStaked: totalStaked.toNumber(),
      yourStake: account ? yourStake.amount.toNumber() : 0,
      totalRewardOfCampaign: convertToNumber(campaignInfo.totalReward, 18),
      standReward: standReward,
      standRewardUSD: new BigNumber(standReward)
        .times(standPriceUSD)
        .toNumber(),
      lastClaimedTimestamp: Number(yourStake.lastClaimedTimestamp),
      periodClaim: account ? periodClaim.toNumber() : 0,
      claimableReward: claimableReward,
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [account, chainId]);

  const handleTimeClaim = () => {
    const timeNow = new Date().getTime() / 1000;
    const timeClaim =
      Number(dataCampaign.lastClaimedTimestamp) +
      Number(dataCampaign.periodClaim);

    return timeClaim > timeNow;
  };

  useEffect(() => {
    setIsOpenManage(false);
    setIsOpenClaim(false)
  }, [chainId]);

  const handleClaim = async () => {
    setIsOpenClaim(false);
    setIsWaiting(true);
    const estimate = nftContract.estimateGas.claimCampaignSTAND;
    const method = nftContract.claimCampaignSTAND;
    const args = [campaignId];

    await estimate(...args)
      .then((estimatedGasLimit) =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setIsWaiting(false);
          addTransaction(response, {
            summary: `Claim STAND`,
          });
          setDisableClaim(true);
        })
      )
      .catch((error) => {
        setIsWaiting(false);
        setShowReject(true);

        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  };

  const linkCollectionContract = (adsress) => {
    switch (chainId) {
      case ChainId.MAINNET:
        return `https://etherscan.io/address/${adsress}`;
      case ChainId.BSC:
        return `https://bscscan.com/address/${adsress}`;
      case ChainId.RINKEBY:
        return `https://rinkeby.etherscan.io/address/${adsress}`;
      case ChainId.BSC_TESTNET:
        return `https://testnet.bscscan.com/address/${adsress}`;
    }
  };

  return (
    <Disclosure as="div">
      <>
        <FarmItem>
          <div className="text-left select-none text-primary text-sm md:text-lg item-list">
            <div className="item-total">
              <div className="flex flex-col justify-center">
                <TextTotal>{i18n._(t`Total Staked`)}</TextTotal>
                <NumberTotal>
                  <NewTooltip
                    dataTip={dataCampaign.totalStaked}
                    dataValue={dataCampaign.totalStaked}
                  />
                </NumberTotal>
              </div>
              <div className="flex flex-col text-right">
                <TextTotal>
                  {i18n._(t`Campaign`)} #{data.campaign_id}
                </TextTotal>
                <NumberTotal className="text-right">
                  <NewTooltip
                    dataTip={`${dataCampaign.totalRewardOfCampaign}`}
                    dataValue={`${handleValue(
                      dataCampaign.totalRewardOfCampaign
                    )} STAND`}
                  />
                </NumberTotal>
                <div></div>
              </div>
            </div>
            <div className="tit-token">
              <DoubleLogo farmType={FarmTypeEnum.NFT} />
              <div className="flex flex-col justify-center mt-4">
                <div className="font-bold title-token">
                  <div className="flex justify-center">
                    {i18n._(t`Collections support:`)}
                  </div>
                  <div
                    className="flex flex-col justify-center"
                    style={{ textAlign: "center" }}
                  >
                    {data.collections.map((item, index) => (
                      <LinkCollection
                        key={index}
                        href={linkCollectionContract(item.collection_id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.collection_name} <br />
                      </LinkCollection>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <BoxContent>
              <div className="flex justify-between items-center py-1">
                <TextStake>{i18n._(t`Start date`)}</TextStake>
                <CountStake>
                  <div>
                    {moment
                      .unix(data.star_campaign)
                      .format("DD MMM YYYY HH:mm:ss")}
                  </div>
                </CountStake>
              </div>

              <div className="flex justify-between items-center py-1">
                <TextStake>{i18n._(t`End date`)}</TextStake>
                <CountStake>
                  <div>
                    {moment
                      .unix(data.end_campaign)
                      .format("DD MMM YYYY HH:mm:ss")}
                  </div>
                </CountStake>
              </div>

              <div className="flex justify-between items-center py-1">
                <TextStake>{i18n._(t`Your stake`)}</TextStake>
                <CountStake>
                  <NewTooltip
                    dataValue={dataCampaign.yourStake}
                    dataTip={dataCampaign.yourStake}
                  />
                </CountStake>
              </div>

              <div className="flex justify-between py-1 items-center">
                <TextStake>STAND {i18n._(t`reward`)}</TextStake>
                <CountStake>
                  <NewTooltip
                    dataTip={
                      "$" +
                      handleToFixedDataTip(
                        standardData(dataCampaign.standRewardUSD),
                        10
                      )
                    }
                    dataValue={
                      "$" +
                      handleAdvancedDecimal(
                        standardData(dataCampaign.standRewardUSD),
                        10
                      )
                    }
                  />
                </CountStake>
              </div>

              <div className="flex justify-between py-1 items-center">
                <TextStake>STAND {i18n._(t`reward`)}</TextStake>
                <CountStake>
                  <NewTooltip
                    dataTip={handleToFixedDataTip(
                      standardData(dataCampaign.standReward),
                      10
                    )}
                    dataValue={handleAdvancedDecimal(
                      standardData(dataCampaign.standReward),
                      10
                    )}
                  />
                </CountStake>
              </div>
              {!account ? (
                <ButtonConnect onClick={toggleWalletModal}>
                  {i18n._(t`Connect wallet`)}
                </ButtonConnect>
              ) : (
                <div>
                  <div
                    className="flex flex-row items-center btn-container"
                    style={{ marginBottom: "40px" }}
                  >
                    <button
                      className="btn-primary1"
                      onClick={() => setIsOpenManage(true)}
                    >
                      <div className="label">{i18n._(t`Manage`)}</div>
                    </button>

                    <button
                      className={`btn-primary1 ${
                        (Number(dataCampaign.standReward) === 0 ||
                          disableClaim ||
                          handleTimeClaim()) &&
                        "disable-btn"
                      }`}
                      disabled={
                        Number(dataCampaign.standReward) === 0 ||
                        disableClaim ||
                        handleTimeClaim()
                      }
                      onClick={() => setIsOpenClaim(true)}
                    >
                      <div className="label">{i18n._(t`Claim`)}</div>
                      <div className="desc">STAND reward</div>
                    </button>
                    {isOpenManage && (
                      <PopupManage
                        isOpenManage={isOpenManage}
                        onDismissManage={() => setIsOpenManage(false)}
                        context={{ chainId, account }}
                        campaign={data}
                        loading={loading}
                        setLoading={setLoading}
                      />
                    )}
                  </div>
                </div>
              )}
            </BoxContent>
          </div>
          {showReject && (
            <TransactionFailedModal
              isOpen={showReject}
              onDismiss={() => setShowReject(false)}
            />
          )}

          {isOpenClaim && (
            <PopupClaim
              isOpen={isOpenClaim}
              onDismiss={() => setIsOpenClaim(false)}
              handleClaim={handleClaim}
              dataCampaign={dataCampaign}
            />
          )}

          {isWaiting && (
            <PopUpWaitingClaim
              isOpen={isWaiting}
              onDismiss={() => setIsWaiting(false)}
            />
          )}
        </FarmItem>
      </>
    </Disclosure>
  );
};
export default ItemCampaign;

const FarmItem = styled.div`
  width: 100%;
  margin-bottom: 40px;
  border-radius: 20px;
  background: ${({ theme }) => theme.bg1};

  & .item-list {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.borderColor};
    box-sizing: border-box;
    box-shadow: 0px 4px 30px ${({ theme }) => theme.shadowColor};
    border-radius: 20px;
  }

  & .tit-token {
    padding: 30px 46px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -50px;
    @media screen and (max-width: 768px) {
      padding: 30px 20px;
    }
  }

  & .title-token {
    font-weight: 600;
    font-size: 16px;
    line-height: 126.5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    letter-spacing: 0.015em;
    color: ${({ theme }) => theme.titleToken};
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
  }

  & .item-total {
    display: flex;
    justify-content: space-between;
    background: ${({ theme }) => theme.bgrLinear};
    padding: 27px 29px;
    border-radius: 20px 20px 0px 0px;
    @media screen and (max-width: 768px) {
      padding: 18px 21px;
    }
  }

  & .disable-btn {
    background-color: rgba(31, 55, 100, 0.5) !important;
    color: rgba(255, 255, 255, 0.5) !important;
    cursor: not-allowed;
  }

  .btn-container {
    margin-left: -10px;
    margin-right: -10px;
  }

  .mb-36 {
    margin-bottom: 36px;
  }

  .btn-primary1 {
    margin-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
    background: ${({ theme }) => theme.greenButton};
    border-radius: 15px;
    color: ${({ theme }) => theme.white};
    min-height: 63px;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;

    .label {
      font-size: 18px;
      line-height: 21.48px;
      font-weight: 700;
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }

    .desc {
      font-size: 12px;
      line-height: 14.32px;
      font-weight: 600;
      @media screen and (max-width: 768px) {
        font-size: 10px;
      }
    }
    @media screen and (max-width: 768px) {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
`;

const TextTotal = styled.p`
  color: ${({ theme }) => theme.textTotal};
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.015em;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
  text-transform: capitalize;
`;
const NumberTotal = styled.div`
  font-weight: 600;

  font-size: 16px;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color: ${({ theme }) => theme.textTotal};
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const BoxContent = styled.div`
  padding: 0 29px;
  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const ButtonConnect = styled.button`
  background: ${({ theme }) => theme.greenButton};
  border-radius: 15px;
  color: ${({ theme }) => theme.white};
  min-height: 63px;
  width: 100%;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 17px;
  margin: 10px 0 36px;

  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin: 10px 0 27px;
  }
`;
