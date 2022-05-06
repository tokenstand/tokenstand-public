import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { useLpTokenContractV2 } from "../../hooks/useContract";
import { handleTooltipValue } from "../../pages/pool";
import { convertToNumber } from "../../utils/convertNumber";

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
`

export const Liquidity = (it ) => {
    const [result, setResult]  = useState(0)
    const priceNetword = localStorage.getItem("price")
    const lpTokenContract = useLpTokenContractV2(it.it.id);
    lpTokenContract.options.address = it.it.id
    
    const fetch = async () => {
        
        const totalLiquidityTokens = await lpTokenContract.methods.getReserves().call()
        const totalToken0 = convertToNumber(totalLiquidityTokens?._reserve0, it.it.token0.decimals)
        const totalToken1 = convertToNumber(totalLiquidityTokens?._reserve1, it.it.token1.decimals)
        const derivedToken0 = parseFloat(it.it.token0?.derivedETH)
        const derivedToken1 = parseFloat(it.it.token1?.derivedETH)
        const total = (totalToken0*derivedToken0 + totalToken1*derivedToken1) || 0;
        setResult(total)
    }


  useEffect(() => {
    fetch()
  }, []);
  
    return ( <div className="inline-flex flex-row items-center">
    <div data-iscapture='true' data-for={it.it.id} data-tip={`$${Number(result*Number(priceNetword))}`}>
      {'$' + handleTooltipValue(result*Number(priceNetword))}
      <StyledReactTooltip id={it.it.id}></StyledReactTooltip>
    </div >
  
  </div >)
 
}