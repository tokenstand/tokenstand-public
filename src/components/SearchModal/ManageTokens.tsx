import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { RowBetween, RowFixed } from "../Row";
import {
  useRemoveUserAddedToken,
  useUserAddedTokens,
} from "../../state/user/hooks";

import ButtonText from "../ButtonText";
import CurrencyLogo from "../CurrencyLogo";
import CurrencyModalView from "./CurrencyModalView";
import ExternalLink from "../ExternalLink";
import { ExternalLinkIcon } from "../ExternalLinkIcon";
import ImportRow from "./ImportRow";
import { Token } from "@sushiswap/sdk";
import TrashIcon from "../TrashIcon";
import { getExplorerLink } from "../../functions/explorer";
import { isAddress } from "../../functions/validate";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useToken } from "../../hooks/Tokens";
import styled from 'styled-components'

function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
}) {
  const { chainId } = useActiveWeb3React();

  const [searchQuery, setSearchQuery] = useState<string>("");

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);
  const NameStyle = styled.p`
    margin: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.primaryText2};
    font-family: "SF UI Display";
    
    @media (max-width: 640px){
      font-size: 14px;
    }
  `
  const RowFixedStyled = styled(RowFixed)`
  @media (min-width: 640px){
    margin-right: 10px;
  }
  `
  const removeTokenFromStorage = (address) => {
    let listToken = JSON.parse(localStorage.getItem("listToken"));
    if (listToken !== null) {
      let indexRemove;
      for (let i = 0; i < listToken.length; i++) {
        if (listToken[i].address === address) {
          indexRemove = i;
          break;
        }
      }
      listToken.splice(indexRemove, 1);
      localStorage.setItem('listToken', JSON.stringify(listToken));
    }
  }
  const tokenList = useMemo(() => {

    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%" className="mt-2">
          <RowFixed>
            <CurrencyLogo className="style-img" currency={token} size={"27px"} />
            <ExternalLink
              href={getExplorerLink(chainId, token.address, "address")}
            >
              <NameStyle className="ml-2.5 font-semibold">{token.symbol}</NameStyle>
            </ExternalLink>
          </RowFixed>
          <RowFixedStyled>
            <TrashIcon onClick={() => {
              removeToken(chainId, token.address)
              removeTokenFromStorage(token.address);
            }} />
            <ExternalLinkIcon
              href={getExplorerLink(chainId, token.address, "address")}
            />
          </RowFixedStyled>
        </RowBetween>
      ))
    );
  }, [userAddedTokens, chainId, removeToken]);

  return (
    <div className="relative flex-1 w-full h-full mt-4 space-y-4 overflow-y-hidden">
      <div className="space-y-3">
        <StyledInput>
          <input
            id="token-search-input"
            type="text"
            placeholder={"0x0000"}
            className=""
            value={searchQuery}
            autoComplete="off"
            onChange={handleInput}
            ref={inputRef as RefObject<HTMLInputElement>}
            autoCorrect="off"
          />
        </StyledInput>
        {searchQuery !== "" && !isAddressSearch && (
          <div className="text-red">Enter valid token address</div>
        )}
        <BoxToken>
          {searchToken && (
            <ImportRow
              token={searchToken}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              style={{ height: "fit-content" }}
            />
          )}
          <div className="flex justify-between items-center ">
            <CountTokens className="font-semibold">
              {userAddedTokens?.length} Custom{" "}
              {userAddedTokens.length === 1 ? "Token" : "Tokens"}
            </CountTokens>
            {userAddedTokens.length > 0 && (
              <ButtonText onClick={handleRemoveAll}>
                <div>Clear all</div>
              </ButtonText>
            )}
          </div>
          {tokenList}
        </BoxToken>
        <Tip className="absolute bottom-0 text-sm w-full">
          <div className=" flex justify-center w-full">
            Tip: Custom tokens are stored locally in your browser
          </div>
        </Tip>


      </div>

    </div>
  );
}

export default ManageTokens;
const BoxToken = styled.div`
  max-height: 383px;
  overflow: auto;
  @media (max-width: 640px){
    height: 275px;
  }
`

const StyledInput = styled.div`
  input{
    background: ${({ theme }) => theme.bg1};
    border: 1px solid ${({ theme }) => theme.border1};
    box-sizing: border-box;
    border-radius: 20px;
    padding: 22px 32px;
    width:100%;
    max-width: 462px;
    max-height: 63px;
    color: ${({ theme }) => theme.text1};
    @media (max-width: 640px){
      height: 40px;
      font-size: 12px;
      border-radius: 10px;
      padding: 22px 32px 22px 16px;
    }
  }
  margin-bottom: 20px;
  input:focus{
    border: 1px solid ${({ theme }) => theme.greenButton};
  }
 
`
const CountTokens = styled.div`
    
    font-family: SF UI Display;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 126.5%;
    /* identical to box height, or 23px */
    color: ${({ theme }) => theme.text1};
    display: flex;
    align-items: center;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    margin-bottom: 10px;
    @media (max-width:678px){
      font-size: 14px;
    }

`
const Tip = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-size: 14px;
  // left: 10px;
  bottom: 5px;
  @media (max-width: 640px){
    font-size: 12px;
  }
`