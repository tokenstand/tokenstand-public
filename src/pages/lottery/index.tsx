import React, { useState } from "react";
import Layout from "../../layouts/DefaultLayout";
import Head from "next/head";
import Container from "../../components/Container";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import LotteryInstruction from "../../features/lottery/LotteryInstruction";
import LotteryQuestion from "../../features/lottery/LotteryQuestion";
import CountDown from "../../features/lottery/CountDown";
import LotteryCheckNow from "../../features/lottery/LotteryCheckNow";
import PopupWinning from "../../features/lottery/PopupWinning";
import { formatAmount } from "../../utils";
import { useIsDarkMode } from "../../state/user/hooks";
import NextDraw from "../../features/lottery/NextDraw";
import History from "../../features/lottery/History";
import EditNumber from "../../features/lottery/EditNumber";
import PopupBuyTicket from "../../features/lottery/BuyTicket";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useEffect } from "react";
import { useApproveCallback } from "../../hooks/useApproveCallback";
import { LOTTERY_ADDRESS, STAND, STAND_TOKEN } from "../../constants";
import { tryParseAmount } from "../../functions";
import generateTicketNumbers, {
  getTicketsForPurchase,
  parseRetrievedNumber,
  checkDuplicate,
} from "../../features/lottery/BuyTicket/generateTicketNumber";
import _, { truncate } from "lodash";
import { useTransactionAdder } from "../../state/transactions/hooks";
import { useChainId, useLotteryContract } from "../../hooks/useContract";
import TransactionFailedModal from "../../components/TransactionFailedModal";
import PopUpWaiting from "../../features/exchange/limit-order/PopUpWaiting";
import PopUpTransaction from "../../features/exchange/limit-order/PopUpTransaction";
import { formatEther } from "ethers/lib/utils";
import { getTokenPrice } from "../../functions/tokenPrice";
import { convertToNumber } from "../../utils/convertNumber";
import BigNumber from "bignumber.js";
import axios from "axios";
import { getWinningTickets } from "../../features/lottery/getWinningTicketForClaim";
import { networkSupportLottery } from "../../connectors";

const BlockTop = styled.div`
  background: ${({ theme }) => theme.bgLottery};
  padding-top: ${isMobile ? "110px" : "130px"};
  // padding-top: ${isMobile ? "200px" : "180px"};
  padding-bottom: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const TopRight = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  .title-lottery {
    font-size: 48px;
    color: ${({ theme }) => theme.primaryText2};
  }

  .prize-lottery {
    font-size: 64px;
    color: ${({ theme }) => theme.text9};
  }

  .small-text {
    font-size: 32px;
    color: ${({ theme }) => theme.primaryText2};
  }

  @media screen and (max-width: 768px) {
    margin-left: 12px;
    .title-lottery,
    .prize-lottery,
    .small-text {
      font-size: 24px;
    }
  }
`;

const TopLeft = styled.div`
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const BuyTicket = styled.div`
  margin-top: 24px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    img {
      width: 209px;
    }
  }
`;

const ButtonBuy = styled.button`
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 16px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  font-size: 17px;
  position: absolute;
  left: 23%;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    background: ${({ darkMode }) =>
      darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.4)"};
    opacity: ${({ darkMode }) => (darkMode ? "0.38" : "0.8")};
    color: rgba(255, 255, 255);
    cursor: not-allowed;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
  }
`;

export default function Lottery(): JSX.Element {
  const darkMode = useIsDarkMode();
  const { account } = useActiveWeb3React();
  const { chainId } = useChainId();
  const [isOpenWinning, setIsOpenWinning] = useState(false);
  const [isOpenEditNumber, setIsOpenEditNumber] = useState(false);
  const [isOpenBuyTicket, setIsOpenBuyTicket] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const toggleWalletModal = useWalletModalToggle();
  const [arrTicketFinal, setArrTicketFinal] = useState([]);
  const [listDuplicate, setListDuplicate] = useState([]);
  const [currentLotteryId, setCurrentLotteryId] = useState(0);
  const [isTransactionFailed, setIsTransactionFailed] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isClaimming, setIsClaimming] = useState(false);
  const [isOpenSubmited, setIsOpenSubmited] = useState(false);
  const [totalCost, setTotalCost] = useState(10);
  const [isOpenWinningHistory, setIsOpenWinningHistory] = useState(false);
  const [dataClaim, setDataClaim] = useState<any>({
    _ticketIds: [],
    _brackets: [],
    totalRewards: 0,
    totalRewardsUSD: 0,
  });
  const [isWinner, setIsWinner] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const [dataLottery, setDataLottery] = useState<any>({
    startTime: 0,
    endTime: 0,
    priceTicketInStand: 0,
    prizePot: 0,
    roundId: 0,
    ticketCurrent: [],
  });

  const [roundClaim, setRoundClaim] = useState(0);

  const [approvalState, approveCallback] = useApproveCallback(
    STAND[chainId] && tryParseAmount("1", STAND[chainId]),
    LOTTERY_ADDRESS[chainId]
  );

  const addTransaction = useTransactionAdder();
  const lotteryContract = useLotteryContract();

  const fetchDataLottery = async () => {
    const currentLotteryId =
      (await lotteryContract.currentLotteryId.call()) || 0;
    const [infoCurrentRound, priceSTAND, currentTickets] = await Promise.all([
      lotteryContract.viewLottery(Number(currentLotteryId)) || 0,
      getTokenPrice(STAND_TOKEN[`${chainId}`], chainId) || 0,
      await axios.get("/api/user-lottery", {
        baseURL: process.env.NEXT_PUBLIC_API_LOTTERY,
        params: {
          userId: account,
          round: Number(currentLotteryId),
          chainId,
        },
      }),
    ]);

    setCurrentLotteryId(Number(currentLotteryId));
    setDataLottery({
      ...dataLottery,
      roundId: Number(currentLotteryId),
      startTime: Number(infoCurrentRound.startTime),
      endTime: Number(infoCurrentRound.endTime) - 60,
      priceTicketInStand: infoCurrentRound.priceTicketInStand,
      prizePotSTAND: formatEther(infoCurrentRound.amountCollectedInStand),
      prizePotUSD: new BigNumber(
        convertToNumber(infoCurrentRound.amountCollectedInStand, 18)
      )
        .times(priceSTAND)
        .toNumber(),
      priceSTAND: priceSTAND,
      ticketCurrent: currentTickets.data.ticket_detail,
    });
  };

  const handleConnect = async () => {
    toggleWalletModal();
  };

  //random number ticket
  const handleRadonmize = () => {
    const randomTickets = generateTicketNumbers(Number(inputValue));
    const randomTicketsAsStringArray = randomTickets.map((ticket) =>
      parseRetrievedNumber(ticket.toString()).split("")
    );
    setArrTicketFinal(randomTicketsAsStringArray);
  };

  //update ticket when user edit
  const handleUpdateTicket = (ticketIndex, numberIndex, newNumber) => {
    arrTicketFinal[ticketIndex][numberIndex] = newNumber;
    setArrTicketFinal(arrTicketFinal);
    const listTicket = getTicketsForPurchase(arrTicketFinal);
    const listDuplicate = checkDuplicate(listTicket);
    setListDuplicate(listDuplicate);
  };

  const handleClickCloseBuy = () => {
    setIsOpenBuyTicket(false);
    setArrTicketFinal([]);
    setInputValue("");
  };

  //handle call contract to buy ticket
  const handleBuyTicket = async () => {
    const listTicket = getTicketsForPurchase(arrTicketFinal);

    try {
      setIsBuying(true);
      const params = [currentLotteryId, listTicket];
      const gasFee = await lotteryContract.estimateGas.buyTickets(...params);
      const tx = await lotteryContract.buyTickets(...params, {
        gasLimit: gasFee,
      });

      setIsOpenSubmited(true);
      setIsBuying(false);
      setArrTicketFinal([]);
      setInputValue("");

      addTransaction(tx, {
        summary: "Buy Tickets",
      });
    } catch (error) {
      console.log("error buy ticket", error);
      setIsBuying(false);
      setIsTransactionFailed(true);
    }
  };

  //handle call contract to buy ticket
  const handleClaimRewards = async (roundId) => {
    setIsClaimming(true);

    try {
      const params = [roundId, dataClaim._ticketIds, dataClaim._brackets];
      const gasFee = await lotteryContract.estimateGas.claimTickets(...params);
      const tx = await lotteryContract.claimTickets(...params, {
        gasLimit: gasFee,
      });

      setIsOpenSubmited(true);
      setIsClaimming(false);
      setIsOpenWinning(false);
      addTransaction(tx, {
        summary: "Claim rewards",
      });
      setRoundClaim(roundId);
    } catch (error) {
      console.log("error buy ticket", error);
      setIsClaimming(false);
      setIsTransactionFailed(true);
    }
  };

  useEffect(() => {
    handleRadonmize();
  }, [inputValue]);

  useEffect(() => {
    if (networkSupportLottery.supportedChainIds.includes(chainId)) {
      fetchDataLottery();
      const interval = setInterval(fetchDataLottery, 5000);
      return () => clearInterval(interval);
    } else {
      setDataLottery({
        startTime: 0,
        endTime: 0,
        priceTicketInStand: 0,
        prizePot: 0,
        roundId: 0,
        ticketCurrent: [],
      });
    }
    setRoundClaim(0);
  }, [chainId, account]);

  useEffect(() => {
    if (!isOpenBuyTicket && !isOpenEditNumber) {
      setInputValue("");
    }
  }, [isOpenBuyTicket, isOpenEditNumber]);

  const NOW = Date.now() / 1000;

  //handle check total rewards, ticket win

  const handleCheckReward = async (roundId) => {
    const dataUser = await axios.get("/api/user-lottery", {
      baseURL: process.env.NEXT_PUBLIC_API_LOTTERY,
      params: {
        userId: account,
        round: roundId,
        chainId,
      },
    });

    const isWinner = dataUser?.data.ticket_status?.includes(true);
    setIsWinner(isWinner);

    if (isWinner) {
      let _ticketIds = [],
        _brackets = [];

      const listTicketClaim = getWinningTickets(dataUser.data);

      listTicketClaim.map((item) => {
        _ticketIds.push(item.id);
        _brackets.push(item.rewardBracket);
      });

      const checkClaimed =
        await lotteryContract.viewNumbersAndStatusesForTicketIds(_ticketIds);

      // totol rewards
      let count = 0;
      for (let i = 0; i < _brackets.length; i++) {
        if (_brackets[i] === 0) {
          count += Number(
            JSON.parse(dataUser.data.lottery_round?.match_1).standPerWinner
          );
        } else if (_brackets[i] === 1) {
          count += Number(
            JSON.parse(dataUser.data.lottery_round?.match_2).standPerWinner
          );
        } else if (_brackets[i] === 2) {
          count += Number(
            JSON.parse(dataUser.data.lottery_round?.match_3).standPerWinner
          );
        } else if (_brackets[i] === 3) {
          count += Number(
            JSON.parse(dataUser.data.lottery_round?.match_4).standPerWinner
          );
        } else if (_brackets[i] === 4) {
          count += Number(
            JSON.parse(dataUser.data.lottery_round?.match_5).standPerWinner
          );
        } else if (_brackets[i] === 5) {
          count += Number(
            JSON.parse(dataUser.data.lottery_round?.match_6).standPerWinner
          );
        }
      }
      const totalRewardsUSD = count * dataLottery.priceSTAND;

      setDataClaim({
        ...dataClaim,
        _ticketIds,
        _brackets,
        totalRewards: count,
        totalRewardsUSD: totalRewardsUSD,
        claimStatus: dataUser?.data.claim_status,
        isClaimed: checkClaimed[1].includes(true),
      });
    }
  };

  useEffect(() => {
    if (!isOpenWinningHistory) {
      handleCheckReward(dataLottery.roundId - 1);
    }

    setIsCheck(null);
    setIsClaimming(false);
  }, [
    dataLottery.roundId,
    isOpenWinning,
    account,
    chainId,
    isOpenWinningHistory,
  ]);

  useEffect(() => {
    setIsOpenWinning(false);
    setIsOpenWinningHistory(false);
  }, [account, chainId]);

  return (
    <Layout>
      <Head>
        <title>Lottery | TokenStand</title>
        <meta name="description" content="Lottery" />
      </Head>
      <Container maxWidth="full" className="grid h-full mx-auto gap-9">
        <BlockTop
          className={`grid h-full mx-auto ${
            isMobile ? " gap-6 px-4" : " gap-20 px-24"
          }`}
        >
          <TopLeft className="relative flex items-center justify-center">
            <div className="absolute">
              <CountDown timeDraw={dataLottery.endTime} />
              <BuyTicket>
                <ButtonBuy
                  disabled={dataLottery.endTime < NOW}
                  onClick={() => setIsOpenBuyTicket(true)}
                  darkMode={darkMode}
                >
                  Buy Ticket
                </ButtonBuy>
                {dataLottery.endTime < NOW ? (
                  <img src={`/images/ticket-lottery-disable-${darkMode}.png`} />
                ) : (
                  <img src={`/images/ticket-lottery-${darkMode}.png`} />
                )}
              </BuyTicket>
            </div>
            {isMobile ? (
              <img src="/images/bg-countdown-mobile.png" />
            ) : (
              <img src="/images/bg-countdown.png" />
            )}
          </TopLeft>
          <TopRight>
            <div className="title-lottery">The TokenStand Lottery</div>
            <div className="prize-lottery">
              ${formatAmount(dataLottery.prizePotUSD, 0, 4)}
            </div>
            <div className="small-text">in Prizes</div>
          </TopRight>
        </BlockTop>

        <NextDraw
          setIsOpenBuyTicket={() => setIsOpenBuyTicket(true)}
          dataLottery={dataLottery}
        />

        <LotteryCheckNow
          setIsOpenWinning={setIsOpenWinning}
          isWinner={isWinner}
          setIsCheck={setIsCheck}
          isCheck={isCheck}
        />

        <History
          roundId={dataLottery.roundId > 0 ? dataLottery.roundId - 1 : 0}
          priceSTAND={dataLottery.priceSTAND}
          handleCheckReward={handleCheckReward}
          handleClaimRewards={handleClaimRewards}
          dataClaim={dataClaim}
          setIsOpenBuyTicket={setIsOpenBuyTicket}
          disabledBuy={dataLottery.endTime < NOW}
          setIsOpenWinning={setIsOpenWinningHistory}
          isOpenWinning={isOpenWinningHistory}
          isClaimming={isClaimming}
          roundClaim={roundClaim}
        />

        <LotteryInstruction />

        <LotteryQuestion />

        {isOpenWinning && !isClaimming && isWinner && (
          <PopupWinning
            isOpen={isOpenWinning}
            onDismiss={() => {
              setIsOpenWinning(false);
            }}
            handleClaimRewards={handleClaimRewards}
            roundId={dataLottery.roundId - 1}
            dataClaim={dataClaim}
            roundClaim={roundClaim}
          />
        )}

        {isOpenEditNumber && (
          <EditNumber
            isOpen={isOpenEditNumber}
            onDismiss={() => {
              setIsOpenEditNumber(false);
            }}
            setIsOpenBuyTicket={() => setIsOpenBuyTicket(true)}
            arrTicketFinal={arrTicketFinal}
            handleRadonmize={handleRadonmize}
            handleUpdateTicket={handleUpdateTicket}
            handleBuyTicket={handleBuyTicket}
            listDuplicate={listDuplicate}
            isBuying={isBuying}
            totalCost={totalCost}
          />
        )}

        <PopupBuyTicket
          isOpen={isOpenBuyTicket}
          onDismiss={() => setIsOpenBuyTicket(false)}
          setIsOpenEditNumber={() => setIsOpenEditNumber(true)}
          approvalState={approvalState}
          approveCallback={approveCallback}
          handleConnect={handleConnect}
          setInputValue={setInputValue}
          inputValue={inputValue}
          handleClickCloseBuy={handleClickCloseBuy}
          handleBuyTicket={handleBuyTicket}
          isBuying={isBuying}
          dataLottery={dataLottery}
          setTotalCost={setTotalCost}
        />

        <TransactionFailedModal
          isOpen={isTransactionFailed}
          onDismiss={() => setIsTransactionFailed(false)}
        />

        <PopUpWaiting
          isOpen={isBuying || isClaimming}
          onDismiss={() => {
            setIsBuying(false);
            setIsOpenWinning(false);
          }}
        />

        <PopUpTransaction
          isOpen={isOpenSubmited}
          onDismiss={() => {
            setIsOpenSubmited(false);
            setIsOpenEditNumber(false);
            setIsOpenBuyTicket(false);
            setIsOpenWinning(false);
            setIsOpenWinningHistory(false);
          }}
        />
      </Container>
    </Layout>
  );
}
