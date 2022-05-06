import { AutoRow, RowFixed } from "../Row";
import React, { CSSProperties } from "react";
import { useIsTokenActive, useIsUserAddedToken } from "../../hooks/Tokens";

import { AutoColumn } from "../Column";
import Image from "next/image";
import Button from "../Button";
import { CheckCircle } from "react-feather";
import CurrencyLogo from "../CurrencyLogo";
import ListLogo from "../ListLogo";
import { Token } from "@sushiswap/sdk";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCombinedInactiveList } from "../../state/lists/hooks";
import useTheme from "../../hooks/useTheme";
import { isMobile } from "react-device-detect";
const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 20px 0px;
  height: fit-content;
  display: flex;
  justify-content : space-between;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;
  // border: 1px solid ${({ theme }) => theme.borderSwitch};
  box-sizing: border-box;
  border-radius: 10px;
  @media (max-width : 767px) {
    padding: 12px 12px;
  }

  opacity: ${({ dim }) => (dim ? "0.4" : "1")};
  .first-box{
    
    display:flex;
    align-items: center;
    img{
        border-radius:100%;
      
    }
    .text-box{
      margin-left:14px;
      display:flex;
      align-items:center;
      .first-text{
        font-family: SF UI Display;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 126.5%;
        /* identical to box height, or 23px */
        color: ${({ theme }) => theme.text1};
        display: flex;
        align-items: center;
        letter-spacing: 0.015em;
        text-transform: capitalize;
        margin-right:14px;
      }
      .second-text{
        font-family: SF UI Display;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 126.5%;
        /* identical to box height, or 18px */
        color: ${({ theme }) => theme.text1};
        display: flex;
        align-items: center;
        text-align: center;
        letter-spacing: 0.015em;
      }
    }
  }
`;

const CheckIcon = styled(CheckCircle)`
  height: 20px;
  width: 20px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.primary1};
  // @media (max-width: 640px){
  //   width: 15px;
  //   width: 15px;
  // }
`;

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 126.5%;
  color : ${({ theme }) => theme.smText};
  @media (max-width : 767px) {
    font-size: 10px;
  }
`;

const SymbolOverFlow = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 126.5%;
  color : ${({ theme }) => theme.textBold};
  @media (max-width : 767px) {
    font-size: 16px;
  }
`;

const Text = styled.div`
  color : ${({ theme }) => theme.title1}
`
export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  // gloabls
  const { chainId } = useActiveWeb3React();
  const theme = useTheme();

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList();
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);
  
  return (
    <TokenSection style={style}>
      <div className="first-box">
        {  token.symbol === 'STAND' 
        ?
        <Image
          className="rounded-full"
          src={'/icons/tokenstand_circle_logo.png'}
          alt={token.symbol}
          width="40px"
          height="40px"
        />
        :
          <CurrencyLogo
            currency={token}
            size={"37px"}

            style={{ opacity: dim ? "0.6" : "1" }}
          />
        }


        <AutoColumn gap="4px" style={{ opacity: dim ? "0.6" : "1" }}>
          {/* <AutoRow>
          <div className="font-semibold">{token.symbol}</div>
          <div className="ml-2 font-light">
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </div>
        </AutoRow> */}
          <div style={{ marginLeft: isMobile ? "0.75rem" : "1rem" }} >
            <SymbolOverFlow className="font-semibold">{token.symbol}</SymbolOverFlow>
            <div>
              <NameOverflow title={token.name}>{token.name}</NameOverflow>
            </div>
          </div>
          {list && list.logoURI && (
            <RowFixed >
              <Text className="ml-4">via {list.name}</Text>
              {/* <ListLogo logoURI={list.logoURI} size="12px" /> */}
            </RowFixed>
          )}
        </AutoColumn>
      </div>
      {!isActive && !isAdded ? (
        <StyledButton
          color="green"
          size="xs"
          // style={{
          //   width: "fit-content",
          //   padding: "6px 22px",
          //   backgroundColor: "#72BF65",
          //   borderRadius: "20px",
          //   fontSize: "16px",
          // }}
          onClick={() => {
            setImportToken && setImportToken(token);
            showImportView();
          }}
        >
          Import
        </StyledButton>
      ) : (
        <RowFixed style={{ minWidth: "fit-content" }}>
          <CheckIcon />
          <div className="text-green style-active">Active</div>
        </RowFixed>
      )}
    </TokenSection>
  );
}
const StyledButton = styled.div`
background: ${({ theme }) => theme.greenButton};
color:${({ theme }) => theme.white};
border-radius: 20px;
font-family: SF UI Display;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 126.5%;

padding:6px 22px;
display: flex;
align-items: center;
text-align: center;
text-transform: capitalize;
cursor:pointer;
@media (max-width: 767px){
  font-size: 12px;
  font-weight: 700;
}
`