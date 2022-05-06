import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ChainId, Currency, NATIVE, Token } from "@sushiswap/sdk";
import React, {
  KeyboardEvent, useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import ReactGA from "react-ga";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import styled from "styled-components";
import { STAND } from "../../constants/tokens";
import { isAddress } from "../../functions/validate";
import { useChainId } from "../../hooks";
import {
  useAllTokens,
  useIsUserAddedToken,
  useSearchInactiveTokenLists
} from "../../hooks/Tokens";
import { useTokenDisconnected } from "../../hooks/TokensDisconnect";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import useDebounce from "../../hooks/useDebounce";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import useToggle from "../../hooks/useToggle";
import { useAddUserToken } from "../../state/user/hooks";
import Button from "../Button";
import Column from "../Column";
import ModalHeader from "../ModalHeader";
import CommonBases from "./CommonBases";
import CurrencyList from "./CurrencyList";
import { filterTokens, useSortedTokensByQuery } from "./filtering";
import ImportRow from "./ImportRow";
import { useTokenComparator } from "./sorting";

const ContentWrapper = styled(Column)`
  height: 100%;
  width: 100%;
  flex: 1 1;
  position: relative;
  overflow-y: hidden;
  .style-select{
    h2{
      @media (max-width: 767px){
        font-size: 18px !important;
      }
    }
  }

  .not-found {
    color: ${ ( { theme }) => theme.text1};
  }
  
`;

const InputSyle = styled.input`
  border: 1px solid ${({ theme }) => theme.border1};
  font-size : 16px;
  color : ${({ theme }) => theme.primaryText2};
  background: transparent;
  font-weigth: 400;
  height: 63px;
   & :focus {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  ::placeholder {
    font-weight: 500;
    color: ${({ theme }) => theme.subText} ;
  }
  border-radius : 20px;
  @media (max-width : 767px) {
    font-size : 12px;
    height: 40px;
    border: 1px solid rgba(72, 110, 177, 0.15);
    box-sizing: border-box;
    border-radius: 10px;
  }
`
const ModalHeaderSelect = styled(ModalHeader)`
  border-bottom: 1px dashed ${({ theme }) => theme.border1};
  padding-bottom: 20px;
  
  @media (max-width: 640px){
    font-size: 18px;
  }
`
const ButtonManage = styled(Button)`
@media (max-width: 640px){
  font-size: 14px;
  height: 40px;
  padding: 0;
}
`

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showManageView: () => void;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
}: CurrencySearchProps) {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const { chainId } = useChainId();
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [invertSearchOrder] = useState<boolean>(false);
  let allTokens = useAllTokens();
  const addToken = useAddUserToken();
    
  useEffect(() => {
    // if (account) {
    //   let TokenStorage = JSON.parse(localStorage.getItem("listToken"));
    //   if (TokenStorage !== null) {
    //     TokenStorage.map((token) => {
    //       if (!allTokens.hasOwnProperty(token.address)) {
    //         let newToken = new Token(
    //           token.chainId,
    //           token.address,
    //           token.decimals,
    //           token.symbol,
    //           token.name,
    //         )
    //         addToken(newToken);
    //       }
    //     })
    //   }
    // }
  }, [])

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery);
  const searchToken = useTokenDisconnected(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: "Currency Select",
        action: "Search by address",
        label: isAddressSearch,
      });
    }
  }, [isAddressSearch]);

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);
  const sortedTokens: Token[] = useMemo(() => {
   
    return filteredTokens.sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)
  const ether = useMemo(() => chainId && ![ChainId.CELO].includes(chainId) && NATIVE[chainId], [chainId])

  const isLimitOrder = localStorage.getItem("isLimitOrder")

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    const filterNotStand = filteredSortedTokens.filter(item => item.symbol !== "STAND")  
    if (s === '' || s === 'e' || s === 'et' || s === 'eth') {   
      return ether && (chainId !== ChainId.KOVAN && chainId !== ChainId.ARBITRUM) ? isLimitOrder=='true' ? [STAND[chainId] , ...filterNotStand]: [ether,STAND[chainId] , ...filterNotStand]: filterNotStand
    }
    return filterNotStand
  }, [debouncedQuery, ether, filteredSortedTokens, chainId])
  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("");
  }, [isOpen]);

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === "eth" && ether) {
          handleCurrencySelect(ether);
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() ===
            debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0]);
          }
        }
      }
    },
    [debouncedQuery, ether, filteredSortedTokensWithETH, handleCurrencySelect]
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  // const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )
  return (
    <ContentWrapper>
      <ModalHeaderSelect onClose={onDismiss} title="Select a token" className="style-select" />
      <div className="mt-3">
        <InputSyle
          type="text"
          id="token-search-input"
          placeholder={i18n._(t`Search Name Or Paste Address`)}
          autoComplete="off"
          value={searchQuery}
          // ref={inputRef}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className="w-full bg-transparent border rounded text-base px-6 py-3.5"
        />
      </div>
      {/* {showCommonBases && ( */}
        <div className="mt-4">
          <CommonBases
            chainId={chainId}
            onSelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
          />
        </div>
      {/* )} */}

      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: "20px 0", height: "100%", justifyContent: "start" }}>
          <ImportRow
            token={searchToken}
            showImportView={showImportView}
            setImportToken={setImportToken}
          />
        </Column>
      ) : filteredSortedTokens?.length > 0 ||
        filteredInactiveTokens?.length > 0 ? (
        <div className="flex-1 h-full mt-4">
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                currencies={filteredSortedTokensWithETH}
                otherListTokens={filteredInactiveTokens}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: "20px", height: "100%" }}>
          <div className="mb-8 text-center not-found">{i18n._(t`No results found`)}</div>
        </Column>
      )}
      <div className="mt-3">
        <ButtonManage
          id="list-token-manage-button"
          onClick={showManageView}
          color="gray"
          className="text-lg"
        >
          {i18n._(t`Manage`)}
        </ButtonManage>
      </div>
    </ContentWrapper>
  );
}
