import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { getStartGestureState } from "react-use-gesture/dist/recognizers/Recognizer";
import { networkSupportLottery } from "../../connectors";
import { useChainId } from "../../hooks";

const NumberTime = styled.div`
  width: 70px;
  height: 70px;
  background: ${({ theme }) => theme.bgNumber};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    width: 56px;
    height: 56px;
  }
`;

const CountDownBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 32px;
  color: ${({ theme }) => theme.primaryText2};
  span {
    padding: 0 8px;
    margin-top: -24px;
  }

  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
`;
const TextTime = styled.div`
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText3};
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 14px;
    padding-top: 8px;
  }
`;

const TimeBlock = styled.div``;

const handleTime = (time: number) => {
  return time < 10 ? "0" + time : time;
};

const CountDown = ({ timeDraw }) => {
  const { chainId } = useChainId();
  const [timeList, setTimeList] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const NOW = Date.now() / 1000;
  const periodTime = Math.floor(timeDraw - NOW);

  const handleCountDown = () => {
    const days = Math.floor(periodTime / (3600 * 24));
    const hours = Math.floor((periodTime - days*3600*24)/3600);
    const minutes = Math.floor((periodTime % 3600) / 60);
    const seconds = periodTime - hours * 3600 - minutes * 60;
    setTimeList({ ...timeList, days, hours, minutes, seconds });
  };

  useEffect(() => {
    if (Math.floor(periodTime) > 0) {
      const refreshInterval = setInterval(handleCountDown, 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [timeList, timeDraw]);

  useEffect(() => {
    setTimeList({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  }, [chainId]);

  return (
    <>
      <CountDownBlock>
        <TimeBlock>
          <NumberTime>{handleTime(timeList.days)}</NumberTime>
          <TextTime>Day(s)</TextTime>
        </TimeBlock>
        <span>:</span>
        <TimeBlock>
          <NumberTime>{handleTime(timeList.hours)}</NumberTime>
          <TextTime>Hour(s)</TextTime>
        </TimeBlock>
        <span>:</span>
        <TimeBlock>
          <NumberTime>{handleTime(timeList.minutes)}</NumberTime>
          <TextTime>Minute(s)</TextTime>
        </TimeBlock>
      </CountDownBlock>
    </>
  );
};

export default CountDown;
