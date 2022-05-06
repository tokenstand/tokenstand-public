/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import styled from "styled-components";
import RoutingHeadItem from "./RoutingHeadItem";
import { BigNumber } from "@ethersproject/bignumber";
import { useActiveWeb3React, useChainId } from "../../hooks";
import { isMobile } from "react-device-detect";
import CurrencyLogo from "../../components/CurrencyLogo";
import { useCurrency, useCurrencyChain } from "../../hooks/Tokens";
import { ChainId } from "@sushiswap/sdk";
import { WRAP_NATIVE_TOKEN_ADDRESS } from "../../constants";

const dataRoutingHead = [
  {
    from: "20",
    data: [
      {
        id: "wom-square",
        name: "WETH",
        content: [
          {
            name: "WETH",
            value: "100",
          },
        ],
      },
      {
        id: "dai-square",
        name: "DAI",
        content: [
          {
            name: "UniswapV2",
            value: "30",
          },
          {
            name: "Balacer",
            value: "70",
          },
        ],
      },
    ],
  },
  {
    from: "80",
    data: [
      {
        id: "wom-square",
        name: "WETH",
        content: [
          {
            name: "WETH",
            value: "100",
          },
        ],
      },
      {
        id: "tusd-square",
        name: "TUSD",
        content: [
          {
            name: "PMM2",
            value: "20",
          },
          {
            name: "Uniswap",
            value: "30",
          },
          {
            name: "SHUSHI",
            value: "50",
          },
        ],
      },
      {
        id: "dai-square",
        name: "DAI",
        content: [
          {
            name: "DODO",
            value: "50",
          },
          {
            name: "PMM4",
            value: "50",
          },
        ],
      },
    ],
  },
];

const StyleLogo = styled.div`
  img {
    border-radius: 50%;
  }
  svg {
    @media (max-width: 767px) {
      width: 24px;
    }
  }
`;

let dataRouting: any = [];
const SubTitle = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
  position: relative;
  &:after,
  &:before {
    content: "";
    display: inline-block;
    width: 1px;
    top: 0px;
    right: 45px;
    bottom: 0px;
    background: ${({ theme }) => theme.rtBorder1};
    position: absolute;
  }
  &:before {
    right: inherit;
    left: 45px;
    @media (max-width: 640px) {
      left: 50px;
    }
  }
  &:after {
    @media (max-width: 640px) {
      right: 45px;
    }
  }
  @media (max-width: 767px) {
    padding: 20px 15px 0;
  }
  .flex-item {
    display: flex;
    flex: 1;
    align-items: center;
    & + .flex-item {
      margin-top: 20px;
    }
  }
  .item {
    padding: 9px 12px;
    background: ${({ theme }) => theme.rtBg1};
    border-radius: 15px;
    min-width: 130px;
    .title {
      color: ${({ theme }) => theme.text1};
      font-weight: 600;
      font-size: 16px;
      opacity: 0.87;
      img {
        border-radius: 50%;
      }
      .icon {
        display: inline-block;
        margin-right: 5px;
        vertical-align: -6px;
      }
    }
    .content {
      color: ${({ theme }) => theme.text1};
      font-weight: 500;
      opacity: 0.38;
      font-size: 16px;
    }
  }
  .border-right {
    height: 74px;
    // border-right: 1px solid ${({ theme }) => theme.border1};
    padding-right: 16px;
    img {
      border-radius: 50%;
    }
  }
  .border-left {
    height: 74px;
    // border-left: 1px solid ${({ theme }) => theme.border1};
    padding-left: 16px;
    img {
      border-radius: 50%;
    }
  }
  .icon-right {
    margin: 0 16px;
    display: inline-flex;
    align-items: center;
    b {
      margin-right: 10px;
      font-size: 16px;
      opacity: 0.6;
      font-weight: 500;
      color: ${({ theme }) => theme.text1};
    }
    svg path {
      stroke: ${({ theme }) => theme.text1};
      fill: rgba(0, 0, 0, 0);
    }
  }
  .wrap-flex {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
  }
`;

const Text = styled.div`
  color: ${({ theme }) => theme.title1};
  opacity: 0.6;
  font-size: 16px;
`;
let newChainId;
let count = 0;
export default function Routing({ routeData, currencies, unitPrice }) {
  const { chainId } = useChainId();
  const inputTokens = currencies?.INPUT;
  const outputTokens = currencies?.OUTPUT;
  // .name .symbol
  const srcInput = `/images/tokens/${inputTokens?.symbol.toLowerCase()}-square.jpg`;
  const srcOutput = outputTokens?.symbol
    ? `/images/tokens/${outputTokens?.symbol.toLowerCase()}-square.jpg`
    : "";
  const isEther = [1, 2, 3, 4, 5, 42, 42161].includes(chainId);

  const checkWrap = () => {
    try {
      if (inputTokens?.isNative) {
        if (outputTokens?.address == WRAP_NATIVE_TOKEN_ADDRESS[chainId]) {
          return "WRAP";
        } else {
          return null;
        }
      }
      if (outputTokens?.isNative) {
        if (inputTokens?.address == WRAP_NATIVE_TOKEN_ADDRESS[chainId]) {
          return "UNWRAP";
        } else {
          return null;
        }
      }
    } catch (e) {
      return null;
    }
  };
  const isWrap = checkWrap();
  const wrapPool = [1, 2, 3, 4, 5, 42, 42161].includes(chainId)

    ? isWrap == "WRAP"
      ? "WETH"
      : "ETH"
    : isWrap == "WRAP"
      ? "WBNB"
      : "BNB";
  const nativeToken = isEther ? "eth" : "bnb";

  // let totalDistribution =
  //   routeData?.distribution && Array.isArray(routeData?.distribution)
  //     ? routeData.distribution.reduce((a, b) => a + b, 0)
  //     : 1;
  let totalDistribution = 0, bestRoutes = [], distributions = []
  switch (chainId) {
    case ChainId.RINKEBY:
    case ChainId.MAINNET:
      distributions = [
        routeData?.distribution["helioswap"] || 0,
        routeData?.distribution["uniswapV3"] || 0,
        routeData?.distribution["kyperswap"] || 0,
        routeData?.distribution["cryptoswap"] || 0,
        routeData?.distribution["sushiswap"] || 0,
        routeData?.distribution["uniswapV2"] || 0,
        routeData?.distribution["balancer"] || 0,
      ];
      bestRoutes = [
        routeData?.bestRoutes["helioswap"],
        routeData?.bestRoutes["uniswapV3"],
        routeData?.bestRoutes["kyperswap"],
        routeData?.bestRoutes["cryptoswap"],
        routeData?.bestRoutes["sushiswap"],
        routeData?.bestRoutes["uniswapV2"],
        routeData?.bestRoutes["balancer"]
      ]
      break;
    case ChainId.BSC_TESTNET:
    case ChainId.BSC:
      distributions = [
        routeData?.distribution["pancakeV1"] || 0,
        routeData?.distribution["pancakeV2"] || 0,
        routeData?.distribution["helioswap"] || 0,
        routeData?.distribution["bakeryswap"] || 0,
        routeData?.distribution["biswap"] || 0,
        routeData?.distribution["apeswap"] || 0,
        routeData?.distribution["mdexswap"] || 0
      ];
      bestRoutes = [
        routeData?.bestRoutes["pancakeV1"],
        routeData?.bestRoutes["pancakeV2"],
        routeData?.bestRoutes["helioswap"],
        routeData?.bestRoutes["bakeryswap"],
        routeData?.bestRoutes["biswap"],
        routeData?.bestRoutes["apeswap"],
        routeData?.bestRoutes["mdexswap"]
      ];
      break;
    case ChainId.ARBITRUM:
      distributions = [
        routeData?.distribution["balancer"] || 0,
        routeData?.distribution["uniswapV3"] || 0,
        routeData?.distribution["sushiswap"] || 0,
      ];
      bestRoutes = [
        routeData?.bestRoutes["balancer"],
        routeData?.bestRoutes["uniswapV3"],
        routeData?.bestRoutes["sushiswap"],
      ];
      break;
    case ChainId.KOVAN:
      distributions = [
        routeData?.distribution["balancer"] || 0,
        routeData?.distribution["uniswapV3"] || 0,
        routeData?.distribution["sushiswap"] || 0,
      ];
      bestRoutes = [
        routeData?.bestRoutes["balancer"],
        routeData?.bestRoutes["uniswapV3"],
        routeData?.bestRoutes["sushiswap"],
      ];
      break;
  }
  distributions.map(e => {
    totalDistribution += e
  })

  if (isWrap) {
    dataRouting = [];
    dataRouting[0] = { from: BigNumber.from(100).toString() };
  } else {
    totalDistribution = !totalDistribution ? 1 : totalDistribution;
    dataRouting = distributions.map((distribution) => {
      return {
        from: BigNumber.from(distribution * (100 / totalDistribution)).toString(),
      };
    });
  }

  if (isWrap) {
    dataRouting[0].data = [
      {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        id: `${nativeToken}-square`,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        name: wrapPool,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        content: [{ name: wrapPool, value: "100" }],
      },
    ];
  } else {
    if (newChainId != chainId) {
      if (count < 4) {
        count++;
      } else {
        newChainId = chainId;
        count = 0;
      }
    } else if (
      outputTokens &&
      dataRouting?.length > 0 &&
      bestRoutes?.length > 0
    ) {
      if ([ChainId.RINKEBY, ChainId.MAINNET].includes(chainId)) {
        // Ethereum
        const pools = [
          "TokenStand pools",
          "Uniswap V3",
          "Kyper DMM",
          "CryptoDefi",
          "Sushiswap",
          "UniswapV2",
          "Balancer",
        ];
        dataRouting.forEach((element, key) => {
          dataRouting[key].data = bestRoutes[key]
            ?.filter((item, index) => index !== 0)
            .map((item, index) => {
              let token = useCurrencyChain(item, chainId);
              return {
                id: `${token?.symbol.toLowerCase()}-square`,
                name: token?.symbol,
                token,
                content: [{ name: pools[key], value: "100" }],
              };
            });
        })
      } else if (chainId === ChainId.BSC_TESTNET || chainId === ChainId.BSC) {
        const pools = [
          "PancakeSwapV1",
          "PancakeSwapV2",
          "TokenStand",
          "BakerySwap",
          "Biswap",
          "ApeSwap",
          "MDEX",
        ];

        dataRouting.forEach((element, key) => {
          dataRouting[key].data = bestRoutes[key]
            ?.filter((item, index) => index !== 0)
            .map((item, index) => {
              let token = useCurrencyChain(item, chainId);
              return {
                id: `${token?.symbol.toLowerCase()}-square`,
                name: token?.symbol,
                token,
                content: [{ name: pools[key], value: "100" }],
              };
            });
        })
        // if (dataRouting[2]) dataRouting[2].from = "0";
        // if (dataRouting[3]) dataRouting[3].from = "0";
      } else if ([ChainId.KOVAN, ChainId.ARBITRUM].includes(chainId)) {
        // Arbitrum
        const pools = ["Balancer", "Uniswap V3", "Sushiswap"];
        dataRouting.forEach((element, key) => {
          dataRouting[key].data = bestRoutes[key]
            ?.filter((item, index) => index !== 0)
            .map((item, index) => {
              let token = useCurrencyChain(item, chainId);
              return {
                id: `${token?.symbol.toLowerCase()}-square`,
                name: token?.symbol,
                token,
                content: [{ name: pools[key], value: "100" }],
              };
            });
        });
      }
    }
  }
  return (
    <SubTitle className="flex items-center justify-between">
      <span className="border-right flex items-center">
        {/* {isMobile ? (
          <Image
            src={srcInput}
            alt={inputTokens?.name}
            width="24px"
            height="24px"
          />
        ) : (
          <Image
            src={srcInput}
            alt={inputTokens?.name}
            width="32px"
            height="32px"
          />
        )} */}
        {
          <StyleLogo className="flex items-center">
            {isMobile ? (
              <CurrencyLogo currency={currencies.INPUT} size={"24px"} />
            ) : (
              <CurrencyLogo currency={currencies.INPUT} size={"32px"} />
            )}
          </StyleLogo>
        }
      </span>
      {outputTokens && (
        <>
          {unitPrice !== 0 ? (
            <div className="wrap-flex style-scroll-bar">
              {dataRouting?.map((item, index) => {
                if (item?.from !== "0") {
                  return (
                    <RoutingHeadItem
                      key={index}
                      data={item?.data}
                      from={item?.from}
                    />
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <Text className="wrap-flex style-scroll-bar flex items-center">
              Please enter swap amount to each currency to find the best swap
              rate
            </Text>
          )}
          <span className="border-left flex items-center">
            {/* {isMobile ? (
              <Image
                src={srcOutput}
                alt={outputTokens?.name}
                width="24px"
                height="24px"
              />
            ) : (
              <Image
                src={srcOutput}
                alt={outputTokens?.name}
                width="32px"
                height="32px"
              />
            )} */}
            {
              <StyleLogo className="flex items-center">
                {isMobile ? (
                  <CurrencyLogo currency={currencies.OUTPUT} size={"24px"} />
                ) : (
                  <CurrencyLogo currency={currencies.OUTPUT} size={"32px"} />
                )}
              </StyleLogo>
            }
          </span>
        </>
      )}
    </SubTitle>
  );
}
