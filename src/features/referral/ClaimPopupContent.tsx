import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useIsDarkMode } from "../../state/user/hooks";
import { isMobile } from "react-device-detect";
import { FarmReward } from "../../pages/referral";
import { formatAmount } from "./components/ReferralFarm";
import { useCurrencyChain } from "../../hooks/Tokens";
import { useChainId } from "../../hooks";
import { renderImages } from "../exchange/RoutingHeadItem";
import NewTooltip from "../../components/NewTooltip";
import copy from "copy-to-clipboard";
import Image from "next/image";
import { removeZero, toFixedNumber } from "../../utils/decimalAdjust";
import { shortenAddress } from "../../functions";

const copyIcon = '/icons/copy.svg';
const copyIconLight = '/icons/copy-light.svg';

const Wrapper = styled.div`
  background: ${({ darkMode }) => (darkMode ? "#0e1013" : " #EDF1F8")};
  border-radius: 15px;
  padding: ${isMobile ? "10px 12px" : "15px 24px"};
`;
const RewardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .content {
    display: flex;
    font-weight: 500;
    justify-content: space-between;
    align-items: center;
    font-size: ${isMobile ? "14px" : "17px"};
    line-height: 20px;
    color: ${({ darkMode }) =>
      darkMode ? "#ffffff" : " rgba(0, 28, 78, 0.87)"};

    .amount {
      width: 60px;
      
      @media screen and (min-width: 768px) {
        width: 100px;
      }
    }
  }
  .logo-stand {
    display: flex;
    height: 32px;
    div {
      margin-left: 8px;
      display: flex;
      align-items: center;
    }
  }
  button {
    background: transparent;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #ffffff;
    font-family: SF UI Display;
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-left: 20px;
    cursor: auto;
    justify-content: flex-end;
    
    @media screen and (min-width: 768px) {
      margin-left: 45px;
      justify-content: space-between;
    }

    span {
      display: none;
      color: ${({ darkMode }) =>
      darkMode ? "#ffffff" : " rgba(0, 28, 78, 0.87)"};

      @media screen and (min-width: 768px) {
        display: block;
      }
    }

    img {
      cursor: pointer;
    }
  }
`;

const TooltipStyled = styled(NewTooltip)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  farmReward: FarmReward
}

const ClaimPopupContent: React.FC<Props> = ({ farmReward }) => {
  const { chainId } = useChainId();
  const darkMode = useIsDarkMode();
  const [isCopy, setIsCopy] = useState(false);
  const token = useCurrencyChain(farmReward.token, chainId);

  useEffect(() => {
    isCopy &&
      setTimeout(() => {
        setIsCopy(false);
      }, 800);
  }, [isCopy]);

  const handleCopy = (tokenAddress: string) => {
    copy(tokenAddress);
    setIsCopy(true);
  }

  return (
    <Wrapper darkMode={darkMode}>
      <RewardContainer darkMode={darkMode}>
        <div className="content">
          <div className="amount">
            <TooltipStyled
              dataValue={toFixedNumber(farmReward.total_earned, 4)}
              dataTip={removeZero(farmReward.total_earned)}
            />
          </div>
          <div className="logo-stand">
            {token && renderImages(token.symbol.toLowerCase(), token.symbol, token, 32, 32)}
            <div>{farmReward.symbol}</div>
          </div>
        </div>
        <button>
          <span>{shortenAddress(farmReward.token, isMobile ? 2 : 4)}</span>
          {isCopy ? 'Copied' : (
            <Image
              src={darkMode ? copyIcon : copyIconLight}
              alt="copy-icon"
              width={24}
              height={24}
              onClick={() => handleCopy(farmReward.token)}
            />
          )}
        </button>
      </RewardContainer>
    </Wrapper>
  );
};

export default ClaimPopupContent;
