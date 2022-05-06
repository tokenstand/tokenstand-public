import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import ReactTooltip from 'react-tooltip';
import styled from "styled-components";
import { networkSupport } from "../../../connectors";
import { shortenAddress } from "../../../functions";
import { useActiveWeb3React, useLpTokenContractV2, usePairContract } from '../../../hooks';
import Provide from "../../../pages/pool/provide";
import { useWalletModalToggle } from '../../../state/application/hooks';
import { convertToNumber } from "../../../utils/convertNumber";
import RemoveLiquidity from '../../PoolDetails/RemoveLiquidity';
const PoolItemBlock = styled.div`
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.border1};
  box-shadow: ${({ theme }) => theme.shadowExchange};
    min-width: 343px;
    // min-height: 325px;
  
    box-sizing: border-box;
    border-radius: 20px;
    width : 100%;
`;

const StyledReactTooltip = styled(ReactTooltip)`
  background: #5C6A86 !important;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600 !important;
  word-wrap: break-word;      /* IE 5.5-7 */
  white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
  white-space: pre-wrap;      /* current browsers */
  line-height: 126.5%;
  @media screen and (max-width:768px){
    max-width:250px !important;
  }
  &.place-top {
    padding: 0.3rem 1rem;
    &:after{
      border-top-color: #5C6A86 !important;
    }
  }
  &.place-left {
    padding: 0.3rem 1rem;
    &:after{
      
      border-left-color: #5C6A86 !important;
    }
  }
  &.place-right {
    padding: 0.3rem 1rem;
    &:after{
      
      border-right-color: #5C6A86 !important;
    }
  }
  &.place-bottom {
    padding: 0.3rem 1rem;
    &:after{
      
      border-bottom-color: #5C6A86 !important;
    }
  } 
`;

const PoolItemText = styled.a`
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 600;
    font-size: 14px;
    font-family: SF UI Display;
`
const PoolItemTextThin = styled.div`
    color : ${({ theme }) => theme.text6};
    font-weight: 500;
    font-size: 12px;
    font-family: SF UI Display;
`

const TitlePool = styled.div`
  font-size: 24px;
  line-height: 126.5%;
  color: ${({ theme }) => theme.text1};
  font-weight: 700;
  margin-bottom: 8px;
`;

const IconWrapper = styled.div<{ size?: number }>`
  // ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  // margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
  // ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`;

const LiquidityBlock = styled.div`
  height : fit-content;
  border-radius: 15px;
  background: ${({ theme }) => theme.bgNoti};
  min-width : 302px;
`
const LiquidityTitleText = styled.div`
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 126.5%;
    color : ${({ theme }) => theme.addText};
`

const LiquidityValueText = styled.div`
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 126.5%;
    color : ${({ theme }) => theme.primaryText2};
`

export const ButtonConnect = styled.button`
  background: ${({ theme }) => theme.greenButton};
  border-radius: 15px;
  color: ${({ theme }) => theme.white};
  min-height: 63px;
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  justify-content: center;
  @media screen and  ( max-width:1024px){
    font-size:16px;
  }
  @media screen and  ( max-width:768px){
    min-height: 40px ;
  }

`
const IsConnectedBox = styled.div`
  width: 100%;
  margin-top:10px;
  .btn-remove {
    box-sizing: border-box;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    text-transform: capitalize;
    border-radius: 10px;
    color: ${({ theme }) => theme.greenButton};
    height: 63px;
    border:1px solid ${({ theme }) => theme.greenButton};
    padding: 10px;
    width: 50%;

    :disabled {
      background-color: rgba(31, 55, 100, 0.5);
      color: rgba(255, 255, 255, 0.5);
      border: none;
    }

    @media screen and  ( max-width: 768px){
      font-size: 14px;
      height: 40px; 
      padding: 0;
    }
  }
  .btn-provide {
    width: 50%;
    padding: 10px;
    background: ${({ theme }) => theme.greenButton};
    border-radius: 10px;
    color: ${({ theme }) => theme.white};
    height: 63px;
    border:1px solid ${({ theme }) => theme.greenButton};
    font-style: normal;
    font-weight: bold;
    font-size: 18px;


    text-align: center;
    text-transform: capitalize;
    @media screen and ( max-width: 768px){
      font-size: 14px;
      height:40px;
      padding: 0px;
    }
  }  
`

const PoolItem = ({ data, networkLink, onProvideSuccess }) => {

  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const [isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] = useState(false);

  const crypto = require("crypto");
  const idTool = crypto.randomBytes(16).toString("hex");

  const handleOpenRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(true)
  }

  const onDismissRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(false)
  }

  const [isOpenProvide, setIsOpenProvide] = useState(false)
  const handleOpenProvide = () => {
    setIsOpenProvide(true)
  }

  const onDismissProvide = () => {
    setIsOpenProvide(false)
  }

  const handleTooltipValue = (value) => {
    let valueStr = value !== undefined ? String(value) : '0';
    let valueNum = value !== undefined ? Number(value) : 0;
    if (valueNum % 1 == 0) {
      return (valueStr.length > 6) ? (valueStr.substring(0, 6) + '... ') : (valueStr);
    }
    else {

      if (String(parseInt(valueStr)).length > 6) {
        valueStr = valueStr.substring(0, 6) + '... ';
        return valueStr;
      }
      else {
        let newSplitValue = valueStr.split(".");
        let stringDecimals = newSplitValue[1].substring(0, 2);
        let lastValue = newSplitValue[0] + '.' + stringDecimals;
        return (lastValue) + '... ';
      }
    }
  }

  const renderImages = (name, width?: number, height?: number) => {
    try {
      require(`../../../../public/images/tokens/${name}-square.jpg`);
      return <Image className="rounded-full" width={width ? width : 33} height={height ? height : 33} src={`/images/tokens/${name}-square.jpg`} />;
    } catch (err) {
      return <Image className="rounded-full" width={width ? width : 33} height={height ? height : 33} src={`/images/tokens/error-images.svg`} />;
    }
  }

  const [resultLiquility, setResultLiquidity]  = useState(0)
  const priceNetword = localStorage.getItem("price")
  const lpTokenContract = useLpTokenContractV2(data?.id);
  lpTokenContract.options.address = data?.id
  
  const fetchLiquidity = async () => {
      
      const totalLiquidityTokens = await lpTokenContract.methods.getReserves().call()
      const totalToken0 = convertToNumber(totalLiquidityTokens?._reserve0, data?.token0.decimals)
      const totalToken1 = convertToNumber(totalLiquidityTokens?._reserve1, data?.token1.decimals)
      const derivedToken0 = parseFloat(data?.token0?.derivedETH)
      const derivedToken1 = parseFloat(data?.token1?.derivedETH)
      const total = (totalToken0*derivedToken0 + totalToken1*derivedToken1) || 0;
      setResultLiquidity(total)
  }

useEffect(() => {
  fetchLiquidity()
}, []);

  return (
    <PoolItemBlock className="flex flex-col items-center py-6 px-4 space-y-4">
      <div className="flex w-full items-center">
        <IconWrapper size={33}>
          <img
            src={"https://app.1inch.io/assets/images/liquidity-pool-parts.svg"}
            width="33px"
            height="33px"
            style={{ borderRadius: "50%" }}
          />
        </IconWrapper>
        <PoolItemText className="ml-3" target="_blank" href={`${networkLink}/address/${data?.id}`}>{data?.id && shortenAddress(data.id)}</PoolItemText>
      </div>
      <div className="flex w-full space-x-6">
        <div className="flex items-center w-1/3">
          {
            renderImages(data?.token0?.symbol.toLowerCase())
          }
          <div className="ml-3">
            <PoolItemText target="_blank" href={`${networkLink}/address/${data?.token0?.id}`}>{data?.token0?.symbol}</PoolItemText>
            <PoolItemTextThin>50%</PoolItemTextThin>
          </div>
        </div>
        <div className="flex items-center w-1/3">
          {
            renderImages(data?.token1?.symbol.toLowerCase())
          }
          <div className="ml-3">
            <PoolItemText target="_blank" href={`${networkLink}/address/${data?.token1?.id}`}>{data?.token1?.symbol}</PoolItemText>
            <PoolItemTextThin>50%</PoolItemTextThin>
          </div>
        </div>
        {data.farming1 ? data.farming2 ?
          <img width="64" height="40" src={data.farming1} /> :
          <img height="40" src={data.farming1} /> : ""
        }
        {data.farming2 ? data.farming1 ?
          <img width="64" height="40" src={data.farming1} style={{ marginLeft: "0.25rem" }} /> :
          <img height="40" src={data.farming2} /> : ""
        }

      </div>
      <LiquidityBlock className="w-full space-y-3 p-4">
        <div className="flex justify-between">
          <LiquidityTitleText>{i18n._(t`Liquidity`)}</LiquidityTitleText>
          <LiquidityValueText>
            <div data-iscapture='true' data-for={idTool} data-tip={`$${Number(resultLiquility*Number(priceNetword))}`}>
              {'$' + handleTooltipValue(resultLiquility*Number(priceNetword))}
              <StyledReactTooltip id={idTool}></StyledReactTooltip>
            </div >
          </LiquidityValueText>
        </div>
        {
          account && <div className="flex justify-between">
          <LiquidityTitleText>{i18n._(t`My Liquidity`)}</LiquidityTitleText>
          <LiquidityValueText>
            {
              data?.myLiquidity ? <div data-iscapture='true' data-for={idTool} data-tip={`$${Number(data?.myLiquidity)}`}>
              {'$' + handleTooltipValue(data?.myLiquidity)}
              <StyledReactTooltip id={idTool}></StyledReactTooltip>
            </div > : '-'
            }
          </LiquidityValueText>
        </div>
        }
        <div className="flex justify-between">
          <LiquidityTitleText>{i18n._(t`Volume (24h)`)}</LiquidityTitleText>
          <LiquidityValueText>
            <div data-iscapture='true' data-for={idTool} data-tip={`$${Number(data?.volumeUSD)}`}>
              {'$' + handleTooltipValue(data?.volumeUSD)}
              <StyledReactTooltip id={idTool}></StyledReactTooltip>
            </div >
          </LiquidityValueText>
        </div>
        <div className="flex justify-between">
          <LiquidityTitleText>{i18n._(t`Earning (24h)`)}</LiquidityTitleText>
          <LiquidityValueText>
            <div data-iscapture='true' data-for={idTool} data-tip={`$${Number(data?.dailyFeeUSD || 0)}`}>
              {'$' + handleTooltipValue(data?.dailyFeeUSD || 0)}
              <StyledReactTooltip id={idTool}></StyledReactTooltip>
            </div >
          </LiquidityValueText>
        </div>
      </LiquidityBlock>
      <IsConnectedBox>
        {
          !account ?
            <ButtonConnect onClick={toggleWalletModal}>{i18n._(t`Connect Wallet`)}</ButtonConnect>
            :
            <div className="flex  justify-between flex-row items-center btn-container gap-4">
              <button
                className="btn-remove"
                onClick={handleOpenRemoveLiquidity}
                disabled={!data.myLiquidity}
              >
                {i18n._(t`Remove Liquidity`)}
              </button>
              {
                isOpenRemoveLiquidity &&
                <RemoveLiquidity
                  isOpenRemoveLiquidity={isOpenRemoveLiquidity}
                  onDismissRemoveLiquidity={onDismissRemoveLiquidity}
                  dataDetails={data}
                />
              }
              <button className="btn-provide" onClick={handleOpenProvide}>
                {i18n._(t`Provide Liquidity`)}
              </button>
              {
                isOpenProvide &&
                <Provide
                  isOpenProvide={isOpenProvide}
                  onDismissProvide={onDismissProvide}
                  dataDetails={data}
                  onProvideSuccess={onProvideSuccess}
                />
              }
            </div>
        }
      </IsConnectedBox>
    </PoolItemBlock>


  )
}
export default PoolItem;