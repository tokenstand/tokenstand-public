import React, { useMemo } from "react";
import Image from "next/image";
import styled from "styled-components";
import NewTooltip from "../../../../components/NewTooltip";
import { removeZero, toFixedNumber } from "../../../../utils/decimalAdjust";
import { formatEther, parseEther } from "ethers/lib/utils";
import { isMobile } from "react-device-detect";
// images
const TOTAL_FRIENDS_IMG = "/images/total-friends.svg";
const TOTAL_EARNED = "/images/tokenstand.svg";

const Wrapper = styled.div`
  background: ${({ theme }) => theme.referalCardBg};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px 24px;
  margin-bottom: 40px;

  @media screen and (min-width: 768px) {
    padding: 40px;
    margin-bottom: 66px;
  }
`;

const Heading = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
  margin: 0;

  @media screen and (min-width: 768px) {
    font-size: 24px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media screen and (min-width: 992px) {
    flex-direction: row;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    padding: 32px 0 0;

    > div {
      flex-basis: 50%;
      width: 50%;
      margin-bottom: 12px;

      @media screen and (min-width: 768px) {
        margin-bottom: 16px;
      }

      &:nth-child(2n) {
        padding-left: 10px;
        padding-right: 10px;
      }

      h3 {
        white-space: nowrap;
        color: ${({ theme }) => theme.primaryText3};
        font-size: 12px;
        margin-bottom: 0;

        @media screen and (min-width: 768px) {
          font-size: 17px;
        }
      }

      p {
        color: ${({ theme }) => theme.text1};
        font-size: 16px;
        margin: 0;
        font-weight: 600;
        display: flex;

        @media screen and (min-width: 768px) {
          font-size: 24px;
        }

        span {
          margin-left: 5px;
        }
      }
    }
  }

  .total {
    background: rgba(114, 191, 101, 0.1);
    border: 1px solid #72bf65;
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    margin-top: 16px;

    .total-earned {
      width: ${ isMobile ? '150px' : '178px'};
    }

    @media screen and (min-width: 992px) {
      padding: 32px 40px;
      width: 370px;
      margin-top: 0;
    }

    &__item {
      display: flex;
      align-items: center;

      &:first-child {
        margin-bottom: 32px;
      }
    }

    &__description {
      margin-left: 16px;
      width: 100%;
    }

    &__label {
      white-space: nowrap;
      color: ${({ theme }) => theme.primaryText2};
      font-size: 12px;
      margin-bottom: 0;
      font-weight: 500;

      @media screen and (min-width: 768px) {
        font-size: 14px;
      }
    }

    &__value {
      color: #72bf65;
      font-size: 16px;
      margin: 0;
      font-weight: 600;
      display: flex;

      @media screen and (min-width: 768px) {
        font-size: 24px;
      }

      span {
        margin-left: 5px;
      }
    }
  }
`;

const TooltipStyled = styled(NewTooltip)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  dataInfo: any;
};

const Dashboard: React.FC<Props> = ({ dataInfo }) => {
  const totalEarned = useMemo(() => {
    if (!dataInfo?.total_farm_earned && !dataInfo?.total_referral_earned) {
      return 0;
    }

    return formatEther(parseEther(dataInfo?.total_farm_earned || '0').add(parseEther(dataInfo?.total_referral_earned || '0')).toString());
  }, [dataInfo])

  return (
    <Wrapper>
      <Heading>Dashboard</Heading>

      <Content>
        <div className="items">
          <div>
            <h3>Total Farms Friends</h3>
            <p>{dataInfo?.total_farm_friend || 0}</p>
          </div>
          <div>
            <h3>Total Referral Friends</h3>
            <p>{dataInfo?.total_active_referral || 0}</p>
          </div>
          <div>
            <h3>Total Farms Earned STAND</h3>
            <p>
              <TooltipStyled
                dataValue={toFixedNumber(dataInfo?.total_farm_earned, 4)}
                dataTip={`${removeZero(dataInfo?.total_farm_earned) || '0.00'} STAND`}
              />
              <span>STAND</span>
            </p>
          </div>
          <div>
            <h3>Total Referral Earned STAND</h3>
            <p>
              <TooltipStyled
                dataValue={toFixedNumber(dataInfo?.total_referral_earned, 4)}
                dataTip={`${removeZero(dataInfo?.total_referral_earned) || '0.00'} STAND`}
              />
              <span>STAND</span>
            </p>
          </div>
        </div>

        <div className="total">
          <div className="total__item">
            <Image
              src={TOTAL_FRIENDS_IMG}
              alt="total-friends"
              width="50"
              height="50"
              layout="fixed"
            />
            <div className="total__description">
              <h4 className="total__label">Active Friends/ Total Friends</h4>
              <p className="total__value">
                {dataInfo?.total_active_referral || 0}/
                {dataInfo?.total_referral_friend || 0}
              </p>
            </div>
          </div>
          <div className="total__item">
            <Image
              src={TOTAL_EARNED}
              alt="total-earned"
              width="50"
              height="50"
              layout="fixed"
            />
            <div className="total__description">
              <h4 className="total__label">Total Earned</h4>
              <p className="total__value total-earned">
                <TooltipStyled
                  dataValue={`${toFixedNumber(totalEarned, 4)}`}
                  dataTip={`${totalEarned} STAND`}
                />
                <span>STAND</span>
              </p>
            </div>
          </div>
        </div>
      </Content>
    </Wrapper>
  );
};

export default Dashboard;
