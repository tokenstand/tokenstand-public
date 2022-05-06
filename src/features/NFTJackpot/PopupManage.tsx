import React, { useState, useEffect, useMemo } from "react";
import { Tab, TabPanel } from "react-tabs";
import { isMobile } from "react-device-detect";
import Modal from "../../components/Modal";
import {
  ButtonClose,
  ButtonGreen,
  ContentModal,
  HeadModal,
  TitleStyle,
  TabListNFTType,
  TabsNFTType,
  ButtonLightGreen,
  ButtonDetail,
  Loading,
  ManageBlock,
  BlockNote,
  IconCheck,
  NoticeRule,
  ButtonManage,
  NoticeRuleMobile,
  SetLock,
} from "./styled";
import CloseIcon from "../../components/CloseIcon";
import axios from "axios";
import { NFTTypeEnum } from "../../constants/nft-type";
import { useIsDarkMode } from "../../state/user/hooks";
import {
  useApproveNFTContract,
  useNFTJackpotContract,
} from "../../hooks/useContract";
import { NFT_JACKPOT_ADDRESS } from "../../constants/addresses";
import { calculateGasMargin } from "../../functions";
import TransactionFailedModal from "../../components/TransactionFailedModal";
import {
  isTransactionRecent,
  useAllTransactions,
  useTransactionAdder,
} from "../../state/transactions/hooks";
import { newTransactionsFirst } from "../../components/Web3Status";
import PopupNFTLocked from "./PopupNFTLocked";
import NewTooltip from "../../components/NewTooltip";
import { useActivePopups } from "../../state/application/hooks";
import { Spin, Empty } from "antd";
import { LazyImage } from "../../components/LazyLoadImg";
import InfiniteScroll from "react-infinite-scroll-component";
import SelectedNFTsPopup from "./SelectedNFTsPopup";
import LockNFTsNotesPopup from "./LockNFTsNotesPopup";

const STATUS_APPRROVE = {
  NOT_APPROVE: "NOT_APPROVE",
  APPROVING: "APPROVING",
  APPROVED: "APPROVED",
};

const PopupManage = ({
  isOpenManage,
  onDismissManage,
  context,
  campaign,
  loading,
  setLoading,
}: {
  isOpenManage: boolean;
  onDismissManage: () => void;
  context: any;
  campaign: any;
  loading: any;
  setLoading: any;
}) => {
  let tokenIds = [];
  let tokenIdsFinal = [];
  let collectionIndexes = [];
  let nftLocked = {};
  let lockAmounts = [];
  let unlockAmounts = [];

  const collectionsData = campaign?.collections.sort(
    (a, b) => a.collection_index - b.collection_index
  );

  const TOTAL_COLLECTION = campaign?.collections.length;
  let COLLECTION_ARRAY = [];
  let collectionHash = {};

  collectionsData.map((collection, index) => {
    collectionHash[collection.collection_index] = collection.collection_id;
    collectionHash = { ...collectionHash };

    COLLECTION_ARRAY.push(index);
  });

  const { account, chainId } = context;
  const darkMode = useIsDarkMode();
  const [NFTData, setNFTData] = useState<any>([]);
  const [currentCollection, setCurrentCollection] = useState(
    collectionsData[0]?.collection_id.toLowerCase()
  );
  const [NTFTypeIndex, setNFTTypeIndex] = useState(0);
  const [overTimeFinish, setOverTimeFinish] = useState<any>();
  const [happenningCampaign, setHappenningCampaign] = useState<any>();
  const [rewardRate, setrewardRate] = useState<any>();
  const [indexCollection, setIndexCollection] = useState<any>(0);
  const [isERC1155, setIsERC1155] = useState<any>(
    collectionsData[0]?.is_ERC1155
  );
  const [statusApprove, setStatusApprove] = useState<any>();
  const [showReject, setShowReject] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataLazy, setDataLazy] = useState<any>();
  const [indexData, setIndexData] = useState<any>();

  const [isAction, setIsAction] = useState<boolean>(false);
  const [listNFTIdSelected, setListNFTIdSelected] = useState<any>({});
  const [dataDetail, setDataDetail] = useState<any>([]);
  const [NFTLockedSelected, setNFTLockedSelected] = useState<any>({});
  const [isOpenSelected, setIsOpenSelected] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);

  const nftContract = useNFTJackpotContract();
  const aprroveContract = useApproveNFTContract(currentCollection, isERC1155);

  const addTransaction = useTransactionAdder();
  const allTransactions = useAllTransactions();

  //check pending transaction
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);

  const activePopups = useActivePopups();

  const hasPendingTransactions = !!pending.length;

  //handle param to pass to contract and backend
  Object.values(listNFTIdSelected).map((item: any) => {
    const counts = {};
    let amountFinal = [];
    item?.nftId.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });

    const differentNft = Array.from(new Set(item?.nftId));

    for (let i = 0; i < differentNft.length; i++) {
      const key: any = differentNft[i];
      amountFinal.push(counts[key]);
    }

    tokenIds.push(item?.nftId);
    lockAmounts.push(amountFinal);
    tokenIdsFinal.push(differentNft);
  });

  Object.keys(listNFTIdSelected).map((item) => {
    collectionIndexes.push(Number(item));
  });

  useEffect(() => {
    if (isAction && statusApprove === STATUS_APPRROVE.APPROVED) {
      setLoading(true);
    }
  }, [hasPendingTransactions, activePopups]);

  useEffect(() => {
    if (NTFTypeIndex === NFTTypeEnum.LOCKED_NFT) {
      fetchNFTLocked();
    } else {
      fetchAllNFTOfCollection();
    }
  }, [account, currentCollection, loading]);

  useEffect(() => {
    setTimeout(() => {
      if (NTFTypeIndex === NFTTypeEnum.LOCKED_NFT) {
        fetchNFTLocked();
      } else if (Object.keys(listNFTIdSelected).length > 0) {
        fetchAllNFTOfCollection();
        setListNFTIdSelected({});
      }
    }, 1000);
  }, [loading]);

  useEffect(() => {
    setListNFTIdSelected({});
    setNFTLockedSelected({});
  }, [account, chainId]);

  //check overtime Campaign finish
  const checkTimeCampaign = async () => {
    const timeNow = new Date().getTime() / 1000;
    const campaignInfo = await nftContract.campaignInfo(campaign.campaign_id);
    setOverTimeFinish(timeNow >= Number(campaignInfo.timestampFinish));
    setHappenningCampaign(
      timeNow < Number(campaignInfo.timestampFinish) &&
        timeNow >= Number(campaign.star_campaign)
    );
    setrewardRate(Number(campaignInfo.rewardRate));
  };

  //check status approve of collection
  const checkApprove = async () => {
    const statusApprove = await aprroveContract.isApprovedForAll(
      account,
      NFT_JACKPOT_ADDRESS[chainId]
    );

    setStatusApprove(
      statusApprove ? STATUS_APPRROVE.APPROVED : STATUS_APPRROVE.NOT_APPROVE
    );
  };

  useEffect(() => {
    checkTimeCampaign();
  }, []);

  useEffect(() => {
    NTFTypeIndex === NFTTypeEnum.MY_NFT && checkApprove();
  }, [currentCollection, NTFTypeIndex, chainId, account]);

  //check disable button Lock
  const checkEnoughSetLock = () => {
    let totalEligible = 0;

    if (tokenIds.length) {
      for (let i = 0; i < tokenIds.length; i++) {
        for (let k = i + 1; k < tokenIds.length; k++) {
          if (tokenIds[i].length !== tokenIds[k].length) {
            totalEligible++;
          }
        }
      }
    }
    return tokenIds.length === TOTAL_COLLECTION ? totalEligible : 1;
  };

  // get all nfts in collection
  const fetchAllNFTOfCollection = async () => {
    //setNFTData([]);
    const params = {
      owner: account,
      collectionAddress: currentCollection,
      chainId: chainId,
    };

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_NFT}/api/nft-owner`,
        { params: params }
      );
      const { data } = res;
      let dataNFT = [];
      let dataNFTFinal = [];

      if (data.length > 0) {
        if (!isERC1155) {
          data.map((item, index) => {
            dataNFT.push(item);
          });
        } else {
          data.map((item, key) => {
            for (let i = 0; i < item.value; i++) {
              dataNFT.push(item);
            }
          });
        }
        if (dataNFT.length > 0) {
          dataNFT.map((item, index) => {
            dataNFTFinal.push({
              ...item,
              index: index,
              collection_index: indexCollection,
            });
          });
        }

        setNFTData(dataNFTFinal);
        setDataLazy(dataNFTFinal.slice(0, 6));
        setIndexData(6);
      } else {
        setNFTData(data);
        setDataLazy(data.slice(0, 6));
        setIndexData(6);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // get set nft locked
  const fetchNFTLocked = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_NFT}/api/nft-lock?owner=${account}&campaign_id=${campaign.id}`
      );
      const { data } = res;
      setNFTData(data);
      setDataLazy(data.slice(0, 6));
    } catch (error) {
      console.log("error", error);
    }
  };

  // executed when changing the collection
  const handleChangeCollection = (collection) => {
    if (collection.collection_id.toLowerCase() !== currentCollection) {
      setCurrentCollection(collection.collection_id.toLowerCase());
      setIndexCollection(collection.collection_index);
      setIsERC1155(collection.is_ERC1155);
      setDataLazy([]);
      setIndexData(6);
    }
  };

  // executed when changing the tab menu: My NFT, Deposited, Locked NFT
  const handleChangeNFTType = (index) => {
    setNFTTypeIndex(index);
    setListNFTIdSelected({});
    setNFTLockedSelected({});
    setDataLazy([]);
    setIndexData(6);

    switch (index) {
      case NFTTypeEnum.MY_NFT:
        fetchAllNFTOfCollection();
        break;
      case NFTTypeEnum.LOCKED_NFT:
        //call api locked
        setStatusApprove(STATUS_APPRROVE.APPROVED);
        fetchNFTLocked();
        break;
    }
  };

  // when user click select nft
  const handleSelectNFT = async (nft: any) => {
    const { nft_id, id, index } = nft;
    const collectionAddress = nft.collection_address?.toLowerCase();

    let nftID = listNFTIdSelected[indexCollection]?.nftId || [];
    let indexNft = listNFTIdSelected[indexCollection]?.index || [];
    let idNft = listNFTIdSelected[indexCollection]?.id || [];

    if (!listNFTIdSelected[indexCollection]) {
      nftID.push(Number(nft_id));
      indexNft.push(index);
      idNft.push(id);

      listNFTIdSelected[indexCollection] = {
        collection_address: collectionAddress,
        nftId: nftID,
        index: indexNft,
        id: idNft,
      };
      setListNFTIdSelected({ ...listNFTIdSelected });
    } else if (
      listNFTIdSelected[indexCollection] &&
      listNFTIdSelected[indexCollection].index.indexOf(index) === -1
    ) {
      nftID.push(Number(nft_id));
      indexNft.push(index);
      idNft.push(id);

      listNFTIdSelected[indexCollection] = {
        collection_address: collectionAddress,
        nftId: nftID,
        index: indexNft,
        id: idNft,
      };
      setListNFTIdSelected({ ...listNFTIdSelected });
    } else {
      const findIndex = listNFTIdSelected[indexCollection].index.indexOf(index);
      nftID.splice(findIndex, 1);
      indexNft.splice(findIndex, 1);
      idNft.splice(findIndex, 1);

      listNFTIdSelected[indexCollection] = {
        collection_address: collectionAddress,
        nftId: nftID,
        index: indexNft,
        id: idNft,
      };
      if (listNFTIdSelected[indexCollection].nftId.length === 0) {
        delete listNFTIdSelected[indexCollection];
      }
      setListNFTIdSelected({ ...listNFTIdSelected });
    }
  };

  // when user click select set nft in tab "Locked NFT"
  const handleSelectSetLocked = (set, index) => {
    if (!NFTLockedSelected[index]) {
      NFTLockedSelected[index] = set;
      setNFTLockedSelected({ ...NFTLockedSelected });
    } else {
      delete NFTLockedSelected[index];
      setNFTLockedSelected({ ...NFTLockedSelected });
    }
  };

  //handle nft before withdraw
  const handleBeforeWithdraw = () => {
    Object.values(NFTLockedSelected).map((set: []) => {
      for (let i = 0; i < Object.keys(collectionHash).length; i++) {
        set.map((nft: any) => {
          if (
            nft.collection_address.toLowerCase() ===
            collectionHash[i].toLowerCase()
          ) {
            if (!nftLocked[i]) {
              nftLocked[i] = [Number(nft.nft_id)];
              nftLocked = { ...nftLocked };
            } else {
              nftLocked[i] = [...nftLocked[i], Number(nft.nft_id)];
              nftLocked = { ...nftLocked };
            }
          }
        });
      }
    });

    Object.values(nftLocked).map((item: any) => {
      let counts = {};
      let amountFinal = [];
      const differentNft = Array.from(new Set(item));

      item.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
      });

      for (let i = 0; i < differentNft.length; i++) {
        const key: any = differentNft[i];
        amountFinal.push(counts[key]);
      }

      tokenIdsFinal.push(differentNft);
      unlockAmounts.push(amountFinal);
    });
  };

  NTFTypeIndex === NFTTypeEnum.LOCKED_NFT && handleBeforeWithdraw();

  // handle approve collection
  const handleApprove = async () => {
    setStatusApprove(STATUS_APPRROVE.APPROVING);
    const estimate = aprroveContract.estimateGas.setApprovalForAll;
    const method = aprroveContract.setApprovalForAll;
    const args = [NFT_JACKPOT_ADDRESS[chainId], true];
    await estimate(...args)
      .then((estimatedGasLimit) =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then(async (response) => {
          addTransaction(response, { summary: "Approved collection" });
          setStatusApprove(STATUS_APPRROVE.APPROVED);
        })
      )
      .catch(async (e) => {
        setShowReject(true);
        setStatusApprove(STATUS_APPRROVE.NOT_APPROVE);
      });
  };

  const handleWidthDraw = async () => {
    setIsAction(true);
    const collectionIndex = COLLECTION_ARRAY;
    const estimate = nftContract.estimateGas.withdrawNFT;
    const method = nftContract.withdrawNFT;

    const args = [
      campaign.campaign_id,
      collectionIndex,
      tokenIdsFinal,
      unlockAmounts,
    ];

    await estimate(...args)
      .then((estimatedGasLimit) =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then(async (response) => {
          addTransaction(response, {
            summary: `Withdraw NFT`,
          });
          setNFTLockedSelected({});
          setIsAction(false);
        })
      )
      .catch((error) => {
        setShowReject(true);
        setIsAction(false);
        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  };

  const handleLock = async () => {
    setIsAction(true);
    const collectionIndex = COLLECTION_ARRAY;
    const estimate = nftContract.estimateGas.depositNFT;
    const method = nftContract.depositNFT;
    const args = [
      campaign.campaign_id,
      collectionIndex,
      tokenIdsFinal,
      lockAmounts,
    ];

    await estimate(...args)
      .then((estimatedGasLimit) =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then(async (response) => {
          addTransaction(response, {
            summary: `Lock NFT`,
          });
          setIsAction(false);
        })
      )
      .catch((error) => {
        setIsAction(false);
        setShowReject(true);

        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  };

  const renderButton = () => {
    if (NTFTypeIndex === NFTTypeEnum.MY_NFT)
      return statusApprove === STATUS_APPRROVE.APPROVED ? (
        <>
          <ButtonGreen
            className={`${
              (collectionIndexes.length < TOTAL_COLLECTION ||
                isAction ||
                overTimeFinish ||
                hasPendingTransactions ||
                checkEnoughSetLock() !== 0) &&
              "disable-btn"
            }`}
            onClick={handleLock}
            disabled={
              collectionIndexes.length < TOTAL_COLLECTION ||
              isAction ||
              overTimeFinish ||
              hasPendingTransactions ||
              checkEnoughSetLock() !== 0
            }
          >
            Lock NFT
          </ButtonGreen>
        </>
      ) : (
        <>
          <ButtonGreen
            className={`${
              statusApprove === STATUS_APPRROVE.APPROVING && "disable-btn"
            }`}
            onClick={
              statusApprove === STATUS_APPRROVE.APPROVED
                ? handleLock
                : handleApprove
            }
            disabled={statusApprove === STATUS_APPRROVE.APPROVING}
          >
            {statusApprove === STATUS_APPRROVE.APPROVING
              ? "Approving Collection"
              : "Approve Collection"}
          </ButtonGreen>
        </>
      );
    if (NTFTypeIndex === NFTTypeEnum.LOCKED_NFT)
      return (
        <ButtonLightGreen
          className={`${
            (hasPendingTransactions ||
              isAction ||
              (happenningCampaign && Number(rewardRate) !== 0
                ? true
                : overTimeFinish
                ? (NFTData.length > 0 &&
                    Object.keys(NFTLockedSelected).length !== NFTData.length) ||
                  NFTData.length === 0
                : Object.keys(NFTLockedSelected).length === 0)) &&
            "disable-btn"
          }`}
          disabled={
            hasPendingTransactions ||
            isAction ||
            (happenningCampaign && Number(rewardRate) !== 0
              ? true
              : overTimeFinish
              ? (NFTData.length > 0 &&
                  Object.keys(NFTLockedSelected).length !== NFTData.length) ||
                NFTData.length === 0
              : Object.keys(NFTLockedSelected).length === 0)
          }
          onClick={handleWidthDraw}
        >
          Withdraw NFT
        </ButtonLightGreen>
      );
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      if (NTFTypeIndex === NFTTypeEnum.MY_NFT) {
        if (
          NFTData[0] &&
          NFTData[0].collection_address?.toLowerCase() === currentCollection
        ) {
          setDataLazy(dataLazy.concat(NFTData.slice(indexData, indexData + 3)));
          setIndexData(indexData + 3);
        }
      } else {
        setDataLazy(dataLazy.concat(NFTData.slice(indexData, indexData + 3)));
        setIndexData(indexData + 3);
      }
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpenManage}
      onDismiss={onDismissManage}
      maxWidth={1046}
      isModalNFTJackpot={true}
    >
      <HeadModal className="flex justify-between">
        <TitleStyle className="text-lg font-bold">Manage NFT</TitleStyle>
        <CloseIcon onClick={onDismissManage} />
      </HeadModal>
      <ContentModal isNFTJackpot={true}>
        {isMobile && (
          <NoticeRuleMobile onClick={() => setIsOpenNote(true)}>
            <img src="/images/notice-rule.png" />
            <div>
              Before you lock NFTs, make sure you read{" "}
              <i>
                <u>this!</u>
              </i>
            </div>
          </NoticeRuleMobile>
        )}
        <TabsNFTType
          forceRenderTabPanel
          selectedIndex={NTFTypeIndex}
          onSelect={(index: number) => handleChangeNFTType(index)}
          className="flex flex-col flex-grow"
        >
          <TabListNFTType className="flex flex-shrink-0">
            <Tab
              className="cursor-pointer select-none focus:outline-none"
              selectedClassName="text-high-emphesis selected"
            >
              My NFT
            </Tab>
            <Tab
              className="cursor-pointer select-none focus:outline-none"
              selectedClassName="text-high-emphesis selected"
            >
              Locked NFT
            </Tab>
          </TabListNFTType>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabsNFTType>
        <ManageBlock>
          {NTFTypeIndex === NFTTypeEnum.MY_NFT ? (
            <>
              {isMobile && (
                <ButtonManage onClick={() => setIsOpenSelected(true)}>
                  Your Selected NFT
                </ButtonManage>
              )}
              <div className="filter-group">
                {collectionsData.length > 0 &&
                  collectionsData.map((value, index) => (
                    <div
                      className={`filter-group-item ${
                        value?.collection_id.toLowerCase() ===
                          currentCollection && "is-checked"
                      }`}
                      key={index}
                      onClick={() => handleChangeCollection(value)}
                    >
                      <div className="filter-item-left">
                        {value?.collection_name}
                      </div>
                    </div>
                  ))}

                {!isMobile && (
                  <BlockNote>
                    <div>You have selected:</div>
                    {collectionsData.length > 0 &&
                      collectionsData.map((value, index) => (
                        <div key={index}>
                          {listNFTIdSelected[value?.collection_index]
                            ? listNFTIdSelected[value?.collection_index].nftId
                                .length
                            : 0}{" "}
                          {value?.collection_name}
                        </div>
                      ))}
                  </BlockNote>
                )}
              </div>
            </>
          ) : (
            <div className="filter-group">
              <BlockNote style={{ marginTop: "15px" }}>
                <div>
                  You have locked {NFTData?.length}{" "}
                  {NFTData?.length > 0 ? "sets" : "set"} NFT
                </div>
              </BlockNote>
            </div>
          )}
          <div>
            {NTFTypeIndex === NFTTypeEnum.MY_NFT && !isMobile && (
              <NoticeRule>
                <img src="/images/notice-rule.png" />
                <div>
                  Please select the same NFT item amount of each collection to
                  enable button Lock NFT <br />
                  Example: If you selected one item of NFT each collection, it
                  counts for 1 set, 2 items of each collection
                  <br /> (10 items/5 collections) It counts for 2 set and goes
                  on.
                </div>
              </NoticeRule>
            )}

            <div
              className={
                `list-nft ` +
                (NFTData.length === 0 && "list-nft-no-data ") +
                (NTFTypeIndex === NFTTypeEnum.LOCKED_NFT &&
                  " list-nft-locked ") +
                (NTFTypeIndex === NFTTypeEnum.MY_NFT && " list-nft-my-nft")
              }
            >
              {NFTData?.length === 0 ? (
                <div className="no-data">
                  {" "}
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />{" "}
                </div>
              ) : loading ? (
                <Loading>
                  <Spin tip="Loading..." />
                </Loading>
              ) : NTFTypeIndex === NFTTypeEnum.LOCKED_NFT ? (
                //Lock_NFT screen
                <InfiniteScroll
                  dataLength={dataLazy?.length || 0}
                  next={fetchMoreData}
                  hasMore={dataLazy?.length < NFTData.length}
                  loader={
                    <Loading>
                      <Spin tip="Loading..." />
                    </Loading>
                  }
                  height={isMobile ? 280 : 538}
                  className="manage-nft"
                >
                  {dataLazy.map((set, index) => (
                    <div
                      key={index}
                      className={`nft-card nft-card-lock ${
                        NFTLockedSelected[index] ? "locked-sellect" : ""
                      }`}
                      onClick={() => handleSelectSetLocked(set, index)}
                    >
                      {NFTLockedSelected[index] && (
                        <IconCheck src="/images/icon-check.png" width="50px" />
                      )}
                      <div className="flex-column justify-center items-center h-full">

                      <SetLock >
                        {set?.map((item, index) => (
                          <div className="lower-card" key={index}>
                            {" "}
                            <img
                              src={
                                item?.image_url !== ""
                                  ? item?.image_url
                                  : "/images/nft-default.png"
                              }
                            />
                          </div>
                        ))}

                       
                      </SetLock>
                      <ButtonDetail
                          onClick={(e) => {
                            setOpenDetail(true);
                            setDataDetail(set);
                            e.stopPropagation();
                          }}
                        >
                          Detail
                        </ButtonDetail>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              ) : (
                //My_NFT  screen
                <InfiniteScroll
                  dataLength={dataLazy?.length || 0}
                  next={fetchMoreData}
                  hasMore={dataLazy?.length < NFTData.length}
                  loader={
                    <Loading>
                      <Spin tip="Loading..." />
                    </Loading>
                  }
                  height={isMobile ? 210 : 458}
                  className="manage-nft"
                >
                  {dataLazy?.map((nft, index) => (
                    <div
                      className={`nft-card ${
                        nft.collection_address &&
                        listNFTIdSelected[nft.collection_index] &&
                        listNFTIdSelected[nft.collection_index].index.indexOf(
                          nft.index
                        ) !== -1
                          ? "nft-card-is-selected"
                          : ""
                      }`}
                      id={"nft-card-" + nft.id}
                      data-nft-id={nft.nft_id}
                      key={index}
                      onClick={() =>
                        statusApprove === STATUS_APPRROVE.APPROVED &&
                        handleSelectNFT(nft)
                      }
                    >
                      {nft.collection_address &&
                        listNFTIdSelected[nft.collection_index] &&
                        listNFTIdSelected[nft.collection_index].index.indexOf(
                          nft.index
                        ) !== -1 && (
                          <IconCheck
                            src="/images/icon-check.png"
                            width="50px"
                          />
                        )}

                      <LazyImage
                        src={
                          nft?.image_url !== ""
                            ? nft?.image_url
                            : "/images/nft-default.png"
                        }
                        key={index}
                        height={"200px"}
                        className="img-nft"
                      />

                      <div className="nft-info">
                        <div className="nft-name">
                          <NewTooltip
                            dataTip={
                              nft?.name !== null ? nft?.name : `#${nft?.nft_id}`
                            }
                            dataValue={
                              nft?.name !== null ? nft?.name : `#${nft?.nft_id}`
                            }
                          ></NewTooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              )}
            </div>
            <div className="action-button-group">
              {renderButton()}
              {!isMobile && (
                <ButtonClose onClick={onDismissManage}>Close</ButtonClose>
              )}
            </div>
          </div>
        </ManageBlock>
      </ContentModal>
      <TransactionFailedModal
        isOpen={showReject}
        onDismiss={() => setShowReject(false)}
      />

      <SelectedNFTsPopup
        isOpen={isOpenSelected}
        onDismiss={() => setIsOpenSelected(false)}
        collectionsData={collectionsData}
        listNFTIdSelected={listNFTIdSelected}
      />
      <LockNFTsNotesPopup
        isOpen={isOpenNote}
        onDismiss={() => setIsOpenNote(false)}
      />

      <PopupNFTLocked
        isOpen={openDetail}
        onDismiss={() => setOpenDetail(false)}
        data={dataDetail}
        nftLength={NFTData.length}
      />
    </Modal>
  );
};

export default PopupManage;
