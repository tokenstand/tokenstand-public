/* eslint-disable react/display-name */
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Select, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from 'dayjs';
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ReactTooltip from 'react-tooltip';
import styled from "styled-components";
import FooterTable from "../../components/FooterTable";
import PoolItem from "../../components/MobileScreen/PoolItem";
import PoolDetail from "../../components/PoolDetails";
import { networkSupport } from "../../connectors";
import { NETWORK_LINK } from "../../constants/networks";
import { formatNumber } from "../../functions";
import { shortenAddress } from "../../functions/format";
import { useChainId, useFarmingContract, useLpTokenContract, useTokenContractWeb3 } from "../../hooks";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import Layout from "../../layouts/DefaultLayout";
import { getPrice } from "../../services/covalent/fetchers";
import { getPairsFilter, getPairsLength, getPairsPoolWhere, getTokensAll } from "../../services/graph/fetchers/pool";
import { useChainIdDisconnect } from "../../state/application/hooks";
import { isTransactionRecent, useAllTransactions } from "../../state/transactions/hooks";
import Add from "./add";
import { convertToNumber } from "../../utils/convertNumber";
import { Liquidity } from "../../features/pool/Liquidity";

const PoolPage = styled.div`
font-family: "SF UI Display";
.ant-table-thead th.ant-table-column-sort{
  background: none;
}
  .title-pool-page {
    color: ${({ theme }) => theme.title1};
    font-size: 1.5rem;
  }
  .min-width-60{
    min-width: 60px;
  }

  .min-width-100{
    min-width: 100px;
  }

  .filter-pool {
    margin-top: 0.813rem;
    margin-bottom: 1.75rem;
    height: 3.938rem;

    .input-cell {
      
    }

    .disable-btn {
      background: ${({ theme }) => theme.bgBtn};
      color: ${({ theme }) => theme.label1};
      svg{
        fill: ${({ theme }) => theme.label1};
      }
    }

    .confirm-btn {
      background: ${({ theme }) => theme.greenButton};
      color: ${({ theme }) => theme.white};
      svg{
        fill: ${({ theme }) => theme.white};
      }
    }

    .btn-create-mobile {
      margin-left: 0.625rem;
      border-radius: 0.938rem;
      font-size: 3.5rem;
      font-weight: 100;
      line-height: 1.313rem;
      padding-bottom : 12px;

      @media (max-width: 768px){
        margin-left: 0.625rem;
        border-radius: 0.938rem;
        font-size: 31px;
        font-weight: 100;
        line-height: 1.313rem;
        width:  44px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px;
      }
      width : auto;
    }

    .btn-create:hover {
      transition: all 1s ease;
    }
  }

  .table-container {
    border-radius: 1.25rem;
    box-shadow: 0px 4px 30px rgba(0, 28, 78, 0.05);
    border: 1px solid ${({ theme }) => theme.border1};
    background: ${({ theme }) => theme.bgFooter} !important;
  }

  .ant-table-cell {
    border-color: ${({ theme }) => theme.borderCell};
    cursor: pointer;
  }

  .ant-table-cell,
  .table-container {
    background: none;
    font-family: "SF UI Display";

    .ant-table-thead > tr > th {
      color: ${({ theme }) => theme.primaryText3};
    }

    .ant-table-tbody > tr > td {
      color: ${({ theme }) => theme.primaryText2};
      font-weight: 600;

      .ant-empty-description {
        color: ${({ theme }) => theme.primaryText3};
      }
    }

    .percent {
      color: ${({ theme }) => theme.primaryText3};
      font-size: 0.875rem;
    }

    .stroke-svg {
      stroke: ${({ theme }) => theme.text1};
    }

    .fill-svg {
      fill: ${({ theme }) => theme.text1};
    }

    .icon-dropdown {
      fill: ${({ theme }) => theme.iconDropdown};
    }
  }
`;

const CreateButton = styled.button`
  margin-left: 1.625rem;
  border-radius: 0.938rem;
  font-size: 1.125rem;
  line-height: 1.313rem;
  width: 14.375rem;
  min-width: fit-content;

`

const WrapFilter = styled.div`
.ant-select-multiple .ant-select-selection-placeholder{
  padding: 0 6px;
}
.ant-select-focused,.ant-select:hover{
  .ant-select-selector{
    border-color: #72BF65 !important;
    box-shadow: none !important;
  }
}
.ant-select{
  .ant-select-selection-overflow-item-suffix{
    flex: 1;
    .ant-select-selection-search{
      width: 100% !important;
      @media(max-width: 767px){
        font-size: 12px;
      }
    }
  }
  @media(max-width: 767px){
    .ant-select-selection-overflow-item-rest{
      font-size: 12px;
    }
  }
  .ant-select-selector{
    padding: 0 10px;
    border: 1px solid ${({ theme }) => theme.border1};
    background: ${({ theme }) => theme.bg2};
    border-radius: 20px;
    width: 31.563rem;
    font-size: 16px;
    height: 62px;
    color: ${({ theme }) => theme.primaryText2};
    overflow-x: inherit;
    transition: inherit;
    ::placeholder{
      color: ${({ theme }) => theme.smText};
    }
    @media screen and (max-width:767px){
      height: 40px;
      border-radius: 10px;
      box-shadow: 0px 4px 30px rgba(0, 28, 78, 0.05);
    }
  }
  .ant-select-selection-item{
    border-radius: 8px;
    height: 36px;
    background: ${({ theme }) => theme.bgTagsInput};
    border-color: ${({ theme }) => theme.bgTagsInput};
    display: flex;
    align-items: center;
    .ant-select-selection-item-remove{
      display: flex;
      align-items: center;
      svg{
        color: ${({ theme }) => theme.text1};
      }
    }
    @media screen and (max-width:768px){
      height: 32px;
    }
  }
  .wrap-item-flex{
    display: flex;
    align-items: center;
    h3, p{
      margin: 0px;
      font-size: 12px;
    }
    h3{
      color: ${({ theme }) => theme.text1};
    }
    .images{
      margin-right: 5px;
    }
    @media screen and (max-width:767px){
      h3,p{
        font-size: 10px;
        line-height: 15px;
      }
    }
  }
  .ant-select-selector{
    @media(max-width: 767px){
      max-width: 328px !important;
    }
    @media(max-width: 360px){
      width: 240px !important;
    }
  }
}
`

const LinkWhite = styled.a`
  color: ${({ theme }) => theme.text1};
  :hover{
    text-decoration: underline;
    color: ${({ theme }) => theme.text1};
  }
`
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

export const handleTooltipValue = (value) => {
  let valueStr = value !== undefined ? String(value) : '0';
  let valueNum = value !== undefined ? Number(value) : 0;
  if (valueNum % 1 == 0) {
    return (valueStr.length > 6) ? (valueStr.substring(0, 6) + '... ') : (valueStr);
  }
  else {

    if (String(parseInt(valueStr)).length > 6) {
      valueStr = valueStr.substring(0, 6) + '... ';
      return valueStr;
    } else if (valueStr.indexOf('.') < 0) {
      return valueStr;
    } else {
      let newSplitValue = valueStr.split(".");
      let stringDecimals = newSplitValue[1].substring(0, 2);
      let lastValue = newSplitValue[0] + '.' + stringDecimals;
      return (lastValue) + '... ';
    }
  }
}

export default function Pool() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { Option } = Select;
  const [dataSource, setDataSource] = useState([]);
  const { account } = useActiveWeb3React();
  const { chainId } = useChainId();
  const useChainIdDisconnected = useChainIdDisconnect(); //rerender when switch network (disconnect)
  const [networkLink, setNetworkLink] = useState('');
  const [keyState, setKeyState] = useState(Math.random());
  const [price, setPrice] = useState({ priceETH: 0, priceBNB: 0 });
  const [dataSearch, setDataSearch] = useState([]);
  const [provideSummary, setProvideSummary] = useState('');
  const [sortName, setSortName] = useState({ name: 'liquidity', value: true });
  const crypto = require("crypto");
  const [defaultFilter, setDefaultFilter] = useState([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [tokenSearch, setTokenSearch] = useState({ token0: '', token1: '' });
  const [tableOptions, setTableOptions] = useState({
    current: 1,
    pageSize: isMobile ? 5 : 25,
    itemStart: 1,
    itemEnd: isMobile ? 5 : 25,
    totalPage: 1,
  });
  const [getDataSource, setGetDatatSource] = useState<any>([])
  const idTool = crypto.randomBytes(16).toString("hex");
  const allTransactions = useAllTransactions();

  const pending = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).filter((tx) => {
      if (tx.receipt) {
        return false;
      } else if (tx.archer && tx.archer.deadline * 1000 - Date.now() < 0) {
        return false;
      } else if(tx?.summary === provideSummary){
        return true;
      }else{
        return false;
      }
    }).map((tx) => tx.hash); 
  }, [allTransactions, provideSummary]);

  const getLength = async (chainId) => {
    const dataLength = await getPairsLength(chainId);
    setDataTotal(dataLength);
    let totalPage = Math.floor(dataLength/tableOptions.pageSize) || 1;
    if(dataLength > tableOptions.pageSize && dataLength%tableOptions.pageSize > 0){
      totalPage = Math.floor(dataLength/tableOptions.pageSize) + 1; 
    }
    setTableOptions({...tableOptions, totalPage});
  }
  const getTokens = async (chainId) => {
    const dataTokens = await getTokensAll(chainId);
    setDataSearch(dataTokens);
  }

  useEffect(() => {
    getPrice().then(rs => {
      const priceNew = { priceETH: 0, priceBNB: 0 };
      rs.map(it => {
        if (it.symbol === 'ETH') {
          priceNew.priceETH = it.price_usd
        } else if (it.symbol === 'BNB') {
          priceNew.priceBNB = it.price_usd;
        }
      })
      setPrice(priceNew);
    }).catch(er => console.log(er));
  }, []);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const callApi = async (valueParam?: any, filter?: boolean) => {
    const param = {
      chainId: chainId,
      userId: account,
      pageSize: tableOptions.pageSize,
      ofset: tableOptions.current,
      ...valueParam
    }
    const a = await getPairsPoolWhere(param);
    setDataSource(a);

    if (filter) {
      getPairsFilter({
        chainId: 4, 
        token0: tokenSearch.token0,
        token1: tokenSearch.token1,
      }).then(res => {
        setDataTotal(res);
        let totalPage = Math.floor(res/tableOptions.pageSize) || 1;
        if(res > tableOptions.pageSize && res%tableOptions.pageSize > 0) {
          totalPage = Math.floor(res/tableOptions.pageSize) + 1; 
        }
        setTableOptions({
          ...tableOptions, 
          totalPage
        });
      }).catch(err => console.log("err", err))

    } else {
      getLength(chainId);
    }
  }

  useEffect(() => {
    if (networkSupport.supportedChainIds.includes(chainId)) {
      getTokens(chainId);
      // handleChangeSearch([]);
    } else {
      setTableOptions({
        current: 1,
        pageSize: isMobile ? 10 : 25,
        itemStart: 0,
        itemEnd: 0,
        totalPage: 1,
      })
      setDataSearch([])
    }
  }, [chainId]);

  useEffect(() => {
    if (networkSupport.supportedChainIds.includes(chainId)) {
      let order = sortName.value ? 'desc' : 'asc';
      callApi({ chainId, order, pagesSize: tableOptions.pageSize, ofset: tableOptions.pageSize * (tableOptions.current - 1), ...tokenSearch }, !!tokenSearch.token0);
      setNetworkLink(NETWORK_LINK[chainId]);
      const intervalId = setInterval(() => {
        let order = sortName.value ? 'desc' : 'asc';
        callApi({ chainId, order, pagesSize: tableOptions.pageSize, ofset: tableOptions.pageSize * (tableOptions.current - 1), ...tokenSearch }, !!tokenSearch.token0);
        setNetworkLink(NETWORK_LINK[chainId]);
      }, 5000);
      return () => clearInterval(intervalId);
     
    } else {
      setDataSource([])
    }
  }, [chainId, sortName, tableOptions.pageSize, tableOptions.current, tokenSearch.token0, tokenSearch.token1]);

  const reloadDataTimeOut = () => {
    // setTimeout(() => {callApi({ofset: 0})}, 10000);
  }

  const handleProvideSuccess = (value) => {
    setProvideSummary(value);
    // setTimeout(() => {callApi({ofset: 0})}, 10000);
  }

  const renderImages = (name, width?: number, height?: number) => {
    try {
      require(`../../../public/images/tokens/${name}-square.jpg`);
      return <Image className="rounded-full" width={width ? width : 40} height={height ? height : 40} src={`/images/tokens/${name}-square.jpg`} />;
    } catch (err) {
      return <Image className="rounded-full" width={width ? width : 40} height={height ? height : 40} src={`/images/tokens/error-images.svg`} />;
    }
  }

  const getPriceNetwork = useMemo(() => {
    let priceNetwork = 0;
    if (chainId === 56 || chainId === 97) {
      priceNetwork = price?.priceBNB;
    } else {
      priceNetwork = price?.priceETH;
    }

    localStorage.setItem("price", priceNetwork.toString())
    return priceNetwork;
  }, [price]);
    
  const getMyLiquidity = (it) => {
    
    const totalToken0 = parseFloat(it.userLiquidities?.[0]?.totalLiquidityToken0)
    const totalToken1 = parseFloat(it.userLiquidities?.[0]?.totalLiquidityToken1)
    
    const derivedToken0 = parseFloat(it.token0?.derivedETH)
    const derivedToken1 = parseFloat(it.token1?.derivedETH)

    const total = (totalToken0*derivedToken0 + totalToken1*derivedToken1) || 0;
    if (total === 0) return null;
    return total * getPriceNetwork;
  }
 
  useEffect(() => {
    (async () => {
      const data = await (async () => { 
        let priceNetwork = getPriceNetwork;
        const cloneData = dataSource?.map( (item) => {
          const liquidity =  item
          let volumeUSD = 0;
          let dailyFeeUSD = 0;
          const utcDayTime = dayjs.utc().hour(0).unix();
          const pairDayDataFirst = item?.pairDayData?.[0];
          if (pairDayDataFirst && dayjs(utcDayTime * 1000).format('DD/MM/YYYY') === dayjs(pairDayDataFirst?.date * 1000).format('DD/MM/YYYY')) {
            volumeUSD = parseFloat(pairDayDataFirst?.dailyVolume || '0') * priceNetwork;
            dailyFeeUSD = parseFloat(pairDayDataFirst?.dailyFee || '0') * priceNetwork;
          }
    
          return { key: item.id, liquidity, myLiquidity: getMyLiquidity(item), volumeUSD, dailyFeeUSD, ...item }
        })
        return cloneData;
      })()
      let getDataSource = await Promise.all(data)
      setGetDatatSource(getDataSource)
    })()
  },[dataSource])
 
  const columesObj = [
    {
      title: i18n._(t`Pool`),
      dataIndex: 'pool',
      key: 'pool',
      width: '50%',
      render: (text, record) => <div className="flex flex-row items-center cursor-pointer">
        <img width="40" height="40" src={"https://app.1inch.io/assets/images/liquidity-pool-parts.svg"} /> &nbsp;
        <div className="min-width-100 cursor-pointer "><LinkWhite href={`${networkLink}/address/${record?.id}`} target="_blank">{record?.id && shortenAddress(record.id)}</LinkWhite></div>
        <span className="ml-16">
          {
            renderImages(record?.token0?.symbol.toLowerCase())
          }
        </span>
        <div className="flex flex-col ml-4 min-width-60">
          <div className="cursor-pointer"><LinkWhite href={`${networkLink}/address/${record?.token0?.id}`} target="_blank">{record?.token0?.symbol}</LinkWhite></div>
          <div className="percent">50%</div>
        </div>
        <span className="ml-11">
          {
            renderImages(record?.token1?.symbol.toLowerCase())
          }
        </span>
        <div className="flex flex-col ml-4 mr-5 min-width-60">
          <div><LinkWhite href={`${networkLink}/address/${record?.token1?.id}`} target="_blank">{record?.token1?.symbol}</LinkWhite></div>
          <div className="percent">50%</div>
        </div>
        {record?.farming1 && <img className="ml-4" height="40" src={record?.farming1} />}
        {record?.farming2 && <img className="ml-4" height="40" src={record?.farming2} />}
      </div>
    },
    {
      title: () => {
        return (
          <div data-for={idTool} data-tip={"Click to Sort Order"}>
            {i18n._(t`Liquidity`)}
            <StyledReactTooltip id={idTool}></StyledReactTooltip>
          </div>
        )
      },
      dataIndex: 'liquidity',
      key: 'liquidity',
      onHeaderCell: () => {
        return {
          onClick: () => {
            document.getElementById('filter_liquidity').click();
          }
        };
      },
      width: '15%',
      render: (record) =>  <Liquidity it={record}/>
    },
    {
      title: () => {
        return (
          <div>{i18n._(t`Volume(24h)`)}</div> 
        )
      },
      dataIndex: 'volumeUSD',
      key: 'volumeUSD',
      onHeaderCell: () => {
        return {
          onClick: () => {
            document.getElementById('filter_volume').click();
          }
        };
      },
      width: '15%',
      render: record => <div className="inline-flex flex-row items-center">
       <div data-iscapture='true' data-for={idTool} data-tip={`$${Number(record)}`}>
          {'$' + handleTooltipValue(record)}
          {/* {`$${Number(record).toFixed(2)}`} */}
          <StyledReactTooltip id={idTool}></StyledReactTooltip>
        </div>
      </div>
    },
  ];

  const myLiquidity = {
    title: i18n._(t`My Liquidity`),
    dataIndex: 'myLiquidity',
    key: 'myLiquidity',
    sorter: {
      compare: (a, b) => a.volumeUSD - b.volumeUSD,
    },
    showSorterTooltip: false,
    sortDirections: ['ascend', 'descend', 'ascend'],
    width: '10%',
    render: (record) => <div className="inline-flex flex-row items-center">
      {
        pending.length ? <div className="loading-dots-three"><span>.</span><span>.</span><span>.</span></div> : <div data-iscapture='true' data-for={idTool} data-tip={record !== null ? `$${Number(record).toFixed(2)}` : '-'}>
        {record !== null ? formatNumber(record, true) : '-'}
        <StyledReactTooltip id={idTool}></StyledReactTooltip>
      </div>
      }
    </div>
  }

  const columes = useMemo(() => {
    let rs = columesObj;
    if (account) {
      rs.splice(1, 0, myLiquidity);
      rs.join();
    }
    return rs;
  }, [account, networkLink, pending]);

  const [isOpenPool, setIsOpenPool] = useState(false)
  const handleOpenAddPool = () => {
    setIsOpenPool(true)
  }

  const onDismissAddPool = () => {
    router.push("./pool");
    setIsOpenPool(false);
  }

  const childrenSearch = useMemo(() => {
    const rs = [];
    dataSearch?.map((it, index) => {
      rs.push(<Option key={index} value={`{"sympol":"${it?.symbol}","id":"${it?.id}"}`}>
        <div className="wrap-item-flex items-center">
          <div className="images flex items-center">
            {
              renderImages(it?.symbol.toLowerCase(), 28, 28)
            }
          </div>
          <div className="text">
            <h3>{it.symbol}</h3>
            {/* <p>{it.name}</p> */}
          </div>
        </div>
      </Option>)
    })
    return rs;

  }, [dataSearch]);

  const handleChangeSearch = (value) => {
    if (value.length === 0) {
      setTokenSearch({ token0: '', token1: '' })
    }
    else if (value.length === 1) {
      setTokenSearch({token0:JSON.parse(value[0])?.id.toString().toLocaleLowerCase(), token1: ''})
    } else if (value.length === 2) {
      setTokenSearch({token0:JSON.parse(value[0])?.id.toString().toLocaleLowerCase(), token1:JSON.parse(value[1])?.id.toString().toLocaleLowerCase()})
    } else {
      setDataSource([]);
    }
    setKeyState(Math.random());
    setDefaultFilter(value);
    setTableOptions({ ...tableOptions, current: 1 })
  }

  return (
    <Layout>
      <Head>
        <title>Pool | TokenStand</title>
        <meta
          name="description"
          content="TokenStand liquidity pools are markets for trades between the two tokens, you can provide these tokens and become a liquidity provider to earn 0.25% of fees from trades."
        />
      </Head>

      <PoolPage className="pb-10 w-full">

        <div className="font-bold title-pool-page">{i18n._(t`Filter`)}</div>
        <div id="filter_liquidity" className="hidden" onClick={() => setSortName({ name: 'liquidity', value: !sortName.value })}></div>
        <div className="flex-row items-center filter-pool flex">
          <WrapFilter key={keyState}>
            <Select mode="multiple" style={{ width: '100%' }} className="px-4 input-cell h-full"
              placeholder={i18n._(t`Enter Token Name...`)} onChange={handleChangeSearch}
              filterOption={(input, option) => {
               
                let value = option.value.split('0')[0]
                return value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              }
              defaultValue={defaultFilter} dropdownClassName="pool-dropdown-content" maxTagCount={isMobile ? 2 : 4}>
              {childrenSearch}
            </Select>
          </WrapFilter>
          <CreateButton
            className={["px-4 h-full hidden md:block", account ? "confirm-btn" : "disable-btn"]}
            disabled={!account}
            onClick={handleOpenAddPool}
          >
            {i18n._(t`+ Create Pool`)}
          </CreateButton>
          {/* Mobile button add */}
          <CreateButton
            className={["px-4 h-full btn-create-mobile md:hidden", account ? "confirm-btn" : "disable-btn"]}
            disabled={!account}
            onClick={handleOpenAddPool}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.883 0.00699997L9 0C9.24493 3.23106e-05 9.48134 0.0899562 9.66437 0.252715C9.84741 0.415475 9.96434 0.639749 9.993 0.883L10 1V8H17C17.2449 8.00003 17.4813 8.08996 17.6644 8.25272C17.8474 8.41547 17.9643 8.63975 17.993 8.883L18 9C18 9.24493 17.91 9.48134 17.7473 9.66437C17.5845 9.84741 17.3603 9.96434 17.117 9.993L17 10H10V17C9.99997 17.2449 9.91004 17.4813 9.74728 17.6644C9.58453 17.8474 9.36025 17.9643 9.117 17.993L9 18C8.75507 18 8.51866 17.91 8.33563 17.7473C8.15259 17.5845 8.03566 17.3603 8.007 17.117L8 17V10H1C0.755067 9.99997 0.518663 9.91004 0.335628 9.74728C0.152593 9.58453 0.0356572 9.36025 0.00699997 9.117L0 9C3.23106e-05 8.75507 0.0899562 8.51866 0.252715 8.33563C0.415475 8.15259 0.639749 8.03566 0.883 8.007L1 8H8V1C8.00003 0.755067 8.08996 0.518663 8.25272 0.335628C8.41547 0.152593 8.63975 0.0356572 8.883 0.00699997L9 0L8.883 0.00699997Z" />
            </svg>

          </CreateButton>
          {isOpenPool && <Add isOpenPool={isOpenPool} onDismissAddPool={onDismissAddPool} onCreateSuccess={() => reloadDataTimeOut()} onProvideSuccess={handleProvideSuccess} />}
        </div>
        {
          isMobile ? (
            <div className="flex space-y-3 flex-col items-center">
              { 
                getDataSource.map((data) => {
                  return <PoolItem data={data} key={data.id} networkLink={networkLink} onProvideSuccess={handleProvideSuccess} />
                })
              }
            </div>
          )
            : 
            <div className="table-container px-4">
             <Table
                className="w-full"
                columns={columes as ColumnsType}
                dataSource={getDataSource}
                pagination={false}
                expandRowByClick
                expandable={{
                  expandIconColumnIndex: account ? 4 : 3,
                  expandedRowRender: (record) => (
                    <PoolDetail dataDetail={record} price={price} networkLink={networkLink} onProvideSuccess={handleProvideSuccess} />
                  ),
                  expandIcon: ({ expanded, onExpand, record }) =>
                    expanded ? (
                      <div
                        onClick={(e) => onExpand(record, e)}
                        className="float-right cursor-pointer"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="stroke-svg"
                            d="M3.3335 7.5L10.0002 14.1667L16.6668 7.5"
                            stroke="#001C4E"
                            strokeOpacity="0.6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        onClick={(e) => onExpand(record, e)}
                        className="float-right cursor-pointer"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            className="stroke-svg"
                            d="M7.5 16.6667L14.1667 10L7.5 3.33336"
                            stroke="#001C4E"
                            strokeOpacity="0.6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ),
                }}
              />
            </div> 
        }

        <FooterTable
          dataSource={dataSource}
          tableOptions={tableOptions}
          setTableOptions={setTableOptions}
          dataTotal={dataTotal}
        />
      </PoolPage>
    </Layout>
  );
}