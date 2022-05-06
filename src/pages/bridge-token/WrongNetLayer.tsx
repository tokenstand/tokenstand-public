import React from 'react'
import styled from 'styled-components'
import { chains } from "../../functions/explorer"
import {
    useNetworkModalToggle,
  } from "../../state/application/hooks";

const LayerContainer = styled.div`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 10000;
    opacity: 0.9;
    backdrop-filter: blur(10px);
    color: #FFF;
    @media only screen and (max-width: 800px) {
        padding: 10px
    }
    .alert {
        text-align: center;
        font-size: 38px;
        line-height: 58px;
        font-weight: 500;
        margin-top: 30vh;
        @media only screen and (max-width: 800px) {
            font-size: 30px;
            margin-top: 25vh;
        }
    }
    .sub-alert {
        font-size: 22px;
        line-height: 40px;
        text-align: center;
        padding: 20px 0;
    }
    .avail-network {
        font-weight: 500;
        font-size: 22px;
        text-align: center;
        padding: 20px 0;

        .networks-group {
            display: flex;
            justify-content: center;
            align-items: center;
            .network {
                font-size: 16px;
                font-weight: 400;
                margin: 40px 30px;
                cursor: pointer;
                img {
                    width: 70px;
                    height: 70px;
                    border-radius: 15px;
                    margin: auto;
                }
            }
        }
    }
`
export default function WrongNetLayer({chainId, supportedNets}) {

    const supportedChains = process.env.NEXT_PUBLIC_NETWORK === "TESTNET" ? [
        {
            name: "Rinkeby",
            symbol: "ETH",
            image: "/images/networks/rinkeby-network.jpg"
        },
        {
            name: "BSC Testnet",
            symbol: "BNB",
            image: "/images/networks/bsc-network.jpg"
        }
    ] : [ {
            name: "Ethereum",
            symbol: "ETH",
            image: "/images/networks/mainnet-network.jpg"
        },
        {
            name: "BSC",
            symbol: "BNB",
            image: "/images/networks/bsc-network.jpg"
        } ]
    
  const toggleNetworkModal = useNetworkModalToggle();

    return (
        <LayerContainer>
            <div className="alert">
                Roll it back - this feature is not yet supported on {chains[chainId]?.chainName}.
            </div>
            <div className="sub-alert">
                Either return to the &nbsp;
                <a href="/">
                    home page
                </a>
                , or change to an available network.
            </div>
            <div className="avail-network">
                AVAILABLE NETWORKS
                <div className="networks-group">
                    {supportedChains.map((item, index) =>  
                        (<div key={index} className="network" onClick={toggleNetworkModal}>
                            <img alt="" src={item.image} />
                            <div className="chain-name">
                                {item.name} ({item.symbol})
                            </div>
                        </div>))}
                </div>
            </div>
        </LayerContainer>
    )
}
