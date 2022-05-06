import { useLingui } from "@lingui/react";
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import styled from "styled-components";
import { networkSupport } from "../../connectors";
import { formatNumber } from "../../functions";
import { useLpTokenContractV2, usePairContract } from "../../hooks";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import Provide from "../../pages/pool/provide";
import { getChartPairHour } from "../../services/graph/fetchers/pool";
import { useWalletModalToggle } from "../../state/application/hooks";
import { useDarkModeManager } from "../../state/user/hooks";
import { convertToNumber } from "../../utils/convertNumber";
import NewTooltip from "../NewTooltip";
import RemoveLiquidity from './RemoveLiquidity';

let options:any
const PoolList = ({dataDetail, price, networkLink, onProvideSuccess}) => {  
  const { i18n } = useLingui();
  const { account, chainId } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const [dataChartBar, setDataChartBar] = useState<any>();
  const [dataChartLiqui, setDataChartLiqui] = useState({labels: [],data: []});
  const [dataChartEar, setDataChartEar] = useState<any>();
  const [darkMode] = useDarkModeManager();

  const [tabIndex, setTabIndex] = useState(0);

  const data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#146143", "#9a3037"],
        borderWidth: 0,
      },
    ],
  };

  const dayFirstChart =  dayjs((dayjs.utc().unix() - 24*60*60*7)*1000).format('DD');

  const dataCanvas = canvas => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, 'rgba(46, 189, 107, 0.5)');
    gradient.addColorStop(0.5, 'rgba(46, 189, 107, 0.25)');
    gradient.addColorStop(1, 'rgba(46, 189, 107, 0)');
    return {
      labels: dataChartLiqui?.['labels'] || [],
      datasets: [{
        fill: 'start',
        backgroundColor: gradient,
        pointBackgroundColor: 'rgba(0,0,0,0)',
        pointBorderColor: 'rgba(0,0,0,0)',
        pointHoverBackgroundColor: '#2EBD6B',
        pointHoverPointBorderColor: '#2EBD6B',
        borderWidth: 1,
        borderColor: '#2EBD6B',
        data: dataChartLiqui?.['data'] || []
      }]
    }
  }

  const nFormatter = (num, digits) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

   options = useMemo(() => {
    let firsTemp = parseFloat(dayFirstChart)+1;
    if(dataChartBar?.['labels']?.[8].substr(0,2) === dayFirstChart || dataChartBar?.['labels']?.[15].substr(0,2) === dayFirstChart){
      firsTemp = parseFloat(dayFirstChart);
    }
    let firsTempString = firsTemp.toString();
    if(firsTemp < 10){
      firsTempString = `0${firsTemp.toString()}`
    }
    return  {
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        xAxis: {
          grid: {
            lineWidth: 0,
            borderColor: '#26263a',
            borderWidth: 1,
          },
          ticks: {
            callback: function(val, index) {
              // Hide the label of every 2nd dataset
              if(index === 15) return firsTempString;
              return (index % 7 === 1) ? this.getLabelForValue(val).substr(0,2) : '';
            },
            maxRotation: 0,
          }
        },
        yAxis: {
          grid: {
            lineWidth: 0,
            borderColor: '#26263a',
            borderWidth: 1,
          },
          ticks: {
            callback: function(val) {
              return nFormatter(val, 1);
            },
            maxRotation: 0,
          }
        }
      }
    };
  }, [dataChartBar, dataChartLiqui]);

  useEffect(() => {
    const id = dataDetail?.id;
    let colorRed = '#ff989b';
    let colorGreen = '#99efcc';
    if(darkMode){
      colorRed = '#9a3036';
      colorGreen = '#0a6143';
    }
    let dataLiqui = {labels: [],data: []}
    let dataEarning = {labels: [],datasets: [{data: [], backgroundColor: []}]}
    let priceCalc = price.priceETH;
    if(chainId === 56 || chainId === 97){
      priceCalc = price.priceBNB;
    }
    if(id){
      getChartPairHour(id, chainId).then(rs => {
        if(rs.length > 0){
          rs.map(it => {
            const dayItem = dayjs(it.date*1000).format('DD/MM/YYYY HH:mm')
            data.labels.push(dayItem);
            dataLiqui.labels.push(dayItem);
            dataEarning.labels.push(dayItem);
            data.datasets[0].data.push(parseFloat(it.dailyVolume)*priceCalc);
            dataLiqui.data.push(parseFloat(it.reserveETH)*priceCalc);
            dataEarning.datasets[0].data.push(parseFloat(it.dailyFee)*priceCalc);
          });
          let tempData = 0;
          data.datasets[0].data.map((it, index) => {
            if(it >= tempData){
              data.datasets[0].backgroundColor[index] = colorGreen;
            }else{
              data.datasets[0].backgroundColor[index] = colorRed;
            }
            tempData = it;
          });
          let tempData1 = 0;
          dataEarning.datasets[0].data.map((it, index) => {
            if(it >= tempData1){
              dataEarning.datasets[0].backgroundColor[index] = colorGreen;
            }else{
              dataEarning.datasets[0].backgroundColor[index] = colorRed;
            }
            tempData1 = it;
          });
          setDataChartBar(data);
          setDataChartEar(dataEarning);
          setDataChartLiqui(dataLiqui);
        } 
      }).catch(er => {
        console.log(er);
      })
    }
  }, [dataDetail, chainId, darkMode]);

  const [ isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] = useState(false)
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
    let valueStr = value !== undefined ? String(value) : '0' ;
    if (value % 1 == 0 ) {
        return (valueStr.length > 6 ) ?  (valueStr.substring(0, 6) + '... ')  : (valueStr) ;    
    } else {
      if (String(parseInt(valueStr)).length > 6) {
        valueStr = valueStr.substring(0, 6)  + '... ';
        return valueStr ;
      } else {
        let newSplitValue = valueStr.split(".");
        let stringDecimals = newSplitValue[1]?.substring(0,2);
        let lastValue = newSplitValue[0] + '.' + stringDecimals;
        return (lastValue) + '... ' ; 
      }
    } 
  }

  const [resultLiquility, setResultLiquidity]  = useState(0)
  const priceNetword = localStorage.getItem("price")
  const lpTokenContract = useLpTokenContractV2(dataDetail?.id);
  lpTokenContract.options.address = dataDetail?.id
  
  const fetchLiquidity = async () => {
      
      const totalLiquidityTokens = await lpTokenContract.methods.getReserves().call()
      const totalToken0 = convertToNumber(totalLiquidityTokens?._reserve0, dataDetail?.token0.decimals)
      const totalToken1 = convertToNumber(totalLiquidityTokens?._reserve1, dataDetail?.token1.decimals)
      const derivedToken0 = parseFloat(dataDetail?.token0?.derivedETH)
      const derivedToken1 = parseFloat(dataDetail?.token1?.derivedETH)
      const total = (totalToken0*derivedToken0 + totalToken1*derivedToken1) || 0;
      setResultLiquidity(total)
  }

useEffect(() => {
  fetchLiquidity()
}, []);

  return (
    <>
      <DetailPool className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Tabs
            forceRenderTabPanel
            selectedIndex={tabIndex}
            onSelect={(index: number) => setTabIndex(index)}
          >
            <TabList className="flex p-px rounded">
              <div className="w-2/6 inline-flex gap-10">
                <Tab
                  className="style-text-tab flex justify-center py-3 text-base rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
                  selectedClassName="text-high-emphesis style-underline"
                >
                  Volume
                </Tab>
                <Tab
                  className="style-text-tab flex justify-center py-3  text-base rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
                  selectedClassName="text-high-emphesis style-underline"
                >
                  Liquidity
                </Tab>
                <Tab
                  className="style-text-tab flex justify-center py-3  text-base rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
                  selectedClassName="text-high-emphesis style-underline"
                >
                  Earning
                </Tab>
              </div>
            </TabList>
            <TabPanel>
              {dataChartBar?.['labels']?.length > 0 && <Bar data={dataChartBar} options={options} />}
            </TabPanel>
            <TabPanel>
              {dataChartLiqui.labels.length > 0 && <Line data={dataCanvas} options={options} />}
            </TabPanel>
            <TabPanel>
              {dataChartEar?.['labels']?.length > 0 && <Bar data={dataChartEar} options={options} />}
            </TabPanel>
          </Tabs>
        </div>
        <div className="">
          <div className="flex justify-between my-1">
            <div className="order-first">Liquidity</div>
            <div>
              <NewTooltip dataValue={'$'+handleTooltipValue(resultLiquility*Number(priceNetword))} dataTip={'$'+ resultLiquility*Number(priceNetword)} ></NewTooltip>
              
            </div>
          </div>
          <div className="flex justify-between my-2">
            <div className="order-first">Volume (24h)</div>
            <div>{formatNumber(dataDetail?.volumeUSD, true)}</div>
          </div>
          <div className="flex justify-between my-2">
            <div className="order-first">Earning (24h)</div>
            <div>{formatNumber(dataDetail?.dailyFeeUSD, true)}</div>
          </div>
          <hr className=" border-t-2 border-dotted mb-1 my-2	" />
          {
            account && <div className="flex justify-between my-2"> 
              <div className="order-first">My Liquidity</div>
              <div>{dataDetail?.myLiquidity !== null ? formatNumber(dataDetail?.myLiquidity, true): '-'}</div>
            </div>
          }
           <IsConnectedBox>
              {
                  !account ?
                  <ButtonConnect onClick={toggleWalletModal}>Connect Wallet</ButtonConnect>
                  : 
                  <div className="flex  justify-between flex-row items-center btn-container">
                    <button 
                      className="btn-remove" 
                      onClick={handleOpenRemoveLiquidity}
                      disabled={!dataDetail.myLiquidity}
                    >
                      Remove Liquidity
                    </button>
                    {
                      isOpenRemoveLiquidity &&
                      <RemoveLiquidity 
                        isOpenRemoveLiquidity={isOpenRemoveLiquidity}
                        onDismissRemoveLiquidity={onDismissRemoveLiquidity}
                        dataDetails={dataDetail}
                      />
                    }
                    <button className="btn-provide" onClick={handleOpenProvide}>
                      Provide Liquidity
                    </button>
                    {
                      isOpenProvide && 
                      <Provide 
                        isOpenProvide={isOpenProvide} 
                        onDismissProvide={onDismissProvide}
                        dataDetails={dataDetail}
                        onProvideSuccess={onProvideSuccess}
                      />
                    }
                  </div>
                  }
             </IsConnectedBox>  
        </div>
      </DetailPool>
    </>
  );
};

export default PoolList;

const DetailPool = styled.div`
  .style-underline{
   
        position: relative;
        : before{
          content: "";
          display: inline-block;
          height: 2px;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 5px;
          background: ${({ theme }) => theme.primary1 };
        }
  }
  .style-text-tab{
     color: ${({ theme }) => theme.primaryText3};
  }
`
const ButtonConnect = styled.button`
  background: ${({theme}) => theme.greenButton};
  border-radius: 15px;
  color: ${({theme}) => theme.white};
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
    min-height: 40px !important;
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
    border-radius: 15px;
    color: ${({theme}) => theme.greenButton};
    min-height: 63px;
    
    border:1px solid ${({theme}) => theme.greenButton};
    padding:10px;
    width:50%;

    :disabled {
      background-color: rgba(31, 55, 100, 0.5);
      color: rgba(255, 255, 255, 0.5);
      border: none;
    }

    @media screen and  ( max-width: 1024px){
      font-size:16px;
    }
    @media screen and  ( max-width:768px){
      min-height: 40px !important;
    }
  
    
  }
  .btn-provide {
    width:50%;
    padding:10px;

    margin-left: 10px;

    background: ${({theme}) => theme.greenButton};
    border-radius: 15px;
    color: ${({theme}) => theme.white};
    min-height: 63px;

    font-style: normal;
    font-weight: bold;
    font-size: 18px;


    text-align: center;
    text-transform: capitalize;
    @media screen and  ( max-width:1024px){
      font-size:16px;
    }
    @media screen and  ( max-width:768px){
      min-height: 40px !important;
    }
  
  }  
`