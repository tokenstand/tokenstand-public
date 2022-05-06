import { AutoRow, RowFixed } from "../../components/Row";
import { Currency, Token } from "@sushiswap/sdk";
import React, { useState } from "react";

import { AlertTriangle } from "react-feather";
import { AutoColumn } from "../Column";
import Button from "../Button";
import Card from "../Card";
import { Checkbox } from "./styleds";
import Image from "next/image";
import CurrencyLogo from "../CurrencyLogo";
import ExternalLink from "../ExternalLink";
import ListLogo from "../ListLogo";
import ModalHeader from "../ModalHeader";
import { classNames } from "../../functions";
import { getExplorerLink } from "../../functions/explorer";
import styled from "styled-components";
import { transparentize } from "polished";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useAddUserToken } from "../../state/user/hooks";
import { useCombinedInactiveList } from "../../state/lists/hooks";
import useTheme from "../../hooks/useTheme";
import { shortenAddress } from "../../functions";
import { isMobile } from "react-device-detect";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
const Wrapper = styled.div`
  // position: relative;
  // width: 100%;
  // overflow: auto;
  overflow: hidden;
  font-family: SF UI Display;
  max-width: 568px;
  .style-img{
    border-radius: 50%;
  }
  .style-header-import{
    h2{
      @media (max-width: 640px){
        font-size: 18px;
      }
    }
  }
`;

// const WarningWrapper = styled(Card) <{ highWarning: boolean }>`
//   // background-color: ${({ theme, highWarning }) =>
//     highWarning
//       ? transparentize(0.8, theme.red1)
//       : transparentize(0.8, theme.yellow2)};
//   //  width: fit-content;
// `;

const WarningWrapper = styled.div <{ highWarning: boolean }>`
  // background-color: ${({ theme, highWarning }) =>
    highWarning
      ? transparentize(0.8, theme.red1)
      : transparentize(0.8, theme.yellow2)};
  //  width: fit-content;
  padding-top : 24px;
  padding-bottom : 11px;
  @media (max-witdh : 767px) {
    padding-top : 12px;
    padding-bottom : 18px;
  }
`;

const AddressText = styled.div`
  // font-size: 12px;
  // color: blue;
 
      font-family: SF UI Display;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 126.5%;
      display: flex;
      align-items: center;
      letter-spacing: 0.015em;
      text-transform: capitalize;
      color:  ${({ theme }) => theme.primaryText2};
      @media (max-width : 767px) {
        font-size: 12px;
      }      
  `;

const DescriptionText = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: normal;
 
  font-size: 16px;
  line-height: 170%;

  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.015em;
  color:  ${({ theme }) => theme.text6};
  @media (max-width : 767px) {
    font-size: 12px;
  }
`
const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
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

const StyledButton = styled.div`
background: ${({ theme }) => theme.greenButton};
color:${({ theme }) => theme.white};
border-radius: 10px;
font-family: SF UI Display;
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 23px;
height: 63px;
align-items: center;
text-align: center;
text-transform: capitalize;
cursor:pointer;
display : flex;
justify-content : center;
margin-bottom : 13px;

@media (max-width: 640px) {
  padding: 11px 22px 12px 22px;
  font-size: 14px;
  line-height: 17px;
  margin-bottom : 7px;
  font-weight: 700;
}
`

const StyledLogo = styled.div`
  img {
    border-radius : 50%;
  }
`

interface ImportProps {
  tokens: Token[];
  onBack?: () => void;
  onDismiss?: () => void;
  handleCurrencySelect?: (currency: Currency) => void;
}

export function ImportToken({
  tokens,
  onBack,
  onDismiss,
  handleCurrencySelect,
}: ImportProps) {
  const theme = useTheme();

  const { chainId } = useActiveWeb3React();
  const { i18n } = useLingui();
  const [confirmed, setConfirmed] = useState(false);

  const addToken = useAddUserToken();


  const handleImportToken = (token: Token) => {
  
    addToken(token);
    if (localStorage.getItem("listToken") === null) {
      let listToken = [];
      listToken.push(token);
      localStorage.setItem('listToken', JSON.stringify(listToken));
    }
    else {
      let listToken = JSON.parse(localStorage.getItem("listToken"));
      let found = false
      for (let i = 0; i < listToken.length; i++) {
        if (token.address === listToken[i].address) {
          found = true;
          break;
        }
      }
      if (!found) {
        listToken.push(token);
      }
      localStorage.setItem('listToken', JSON.stringify(listToken))
    }
  }

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList();

  // higher warning severity if either is not on a list
  const fromLists =
    (chainId && inactiveTokenList?.[chainId]?.[tokens[0]?.address]?.list) ||
    (chainId && inactiveTokenList?.[chainId]?.[tokens[1]?.address]?.list);

  return (
    <Wrapper>
      <ModalHeader
        onBack={onBack}
        onClose={onDismiss}
        title={`Import ${tokens.length > 1 ? "Tokens" : "Token"}`}
        className="style-header-import"
      />
      <DescriptionText>
        {i18n._(t`This toke does not appear on the active token list(s). Make sure this is the token you want to trade`)}
      </DescriptionText>
      {tokens.map((token) => {
        const list =
          chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;
        return (
          <Card
            key={"import" + token.address}
            className=".token-warning-container"
          >
            <AutoColumn gap="10px">
              <AutoRow align="center" className="flex flex-col justify-center space-y-1 gap-y-1">
                <StyledLogo>
                  {  
                    token.symbol === 'STAND'
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
                      size={"43px"}
                      style={{ borderRadius: "50%" }}
                      className="rounded-2xl style-img"
                    />
                    }
                </StyledLogo>
                <SymbolOverFlow style={{ marginTop: "12px" }}>{token.symbol}</SymbolOverFlow>
                <NameOverflow >{token.name}</NameOverflow>
                {chainId && (
                  <ExternalLink
                    href={getExplorerLink(chainId, token.address, "address")}
                    style={{
                      padding: "0px",
                      marginTop: "0.25rem"
                    }}
                  >
                    <AddressText>
                      {shortenAddress(token.address)}
                    </AddressText>
                  </ExternalLink>
                )}
                {list !== undefined ? (
                  <RowFixed>
                    {/* {list.logoURI && (
                      <ListLogo logoURI={list.logoURI} size="12px" />
                    )} */}
                    <div className="ml-1">via {list.name}</div>
                  </RowFixed>
                ) : (
                  <WarningWrapper
                    borderRadius="4px"
                    padding="4px"
                    highWarning={true}
                  >
                    <RowFixed>
                      <AlertTriangle
                        className="stroke-current text-red style-svg"
                      />
                      <div className="ml-1 text-xs font-semibold text-red warning-text">
                        {i18n._(t`Unknown Source`)}
                      </div>
                    </RowFixed>
                  </WarningWrapper>
                )}
              </AutoRow>
            </AutoColumn>
          </Card>

        );
      })}

      <StyledButton
        color="green"
        size="xs"
        disabled={!confirmed}
        onClick={() => {
          tokens.map((token) => handleImportToken(token));
          handleCurrencySelect && handleCurrencySelect(tokens[0]);
        }}
        className="token-dismiss-button"
      >
        {i18n._(t`Import`)}
      </StyledButton>
    </Wrapper>
  );
}
