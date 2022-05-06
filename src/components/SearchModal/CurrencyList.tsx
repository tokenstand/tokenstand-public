import {
  ChainId,
  Currency,
  CurrencyAmount,
  Token,
  currencyEquals,
} from "@sushiswap/sdk";
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from "react";
import { RowBetween, RowFixed } from "../Row";
import {
  WrappedTokenInfo,
  useCombinedActiveList,
} from "../../state/lists/hooks";
import { useIsUserAddedToken } from "../../hooks/Tokens";

import Column from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import { FixedSizeList } from "react-window";
import ImportRow from "./ImportRow";
import Loader from "../Loader";
import { MenuItem } from "./styleds";
import { MouseoverTooltip } from "../Tooltip";
import QuestionHelper from "../QuestionHelper";
import { isTokenOnList } from "../../functions/validate";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { isMobile } from "react-device-detect";
import {
  useRemoveUserAddedToken,
  useUserAddedTokens
} from "../../state/user/hooks";
function currencyKey(currency: Currency): string {
  return currency && currency.isToken ? currency.address : 'ETHER'
}



const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  // color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
  
`;

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <BalanceText
      className="whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis"
      title={balance.toExact()}
    >
      {balance.toExact().length > 6 ? `${balance.toExact().substring(0,6)}...` : balance.toExact()}
    </BalanceText>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TokenListLogoWrapper = styled.img`
  height: 20px;
`;

const TokenName = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 18px;
  @media (max-width: 640px){
    font-size: 14px;
  }
`

const ActionToken = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-size: 14px;
  @media (max-width: 640px){
    font-size: 10px;
  }
`

const BalanceText = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 18px;
  @media (max-width: 640px){
    font-size: 14px;
  }
`

const FixedSizeListStyle = styled(FixedSizeList)`
`

const ButtonRemoveToken = styled.button`
  color: red;
  :hover {
    text-decoration : underline;
  }
  `
const BoxToken = styled.div`
border: 1px solid ${({ theme }) => theme.borderSwitch};
padding: 4px 20px;
width: 100%;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  :hover {
    // background-color: ${({ theme, disabled }) => !disabled && theme.bg2};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
 
  box-sizing: border-box;
  border-radius: 10px;
  margin-bottom: 16px;
  height: 81px;
  position: none !important;
  img{
    border-radius: 50%;
  }
`
function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join("; \n")}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  );
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency | any;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { account, chainId } = useActiveWeb3React();
  const key = currencyKey(currency);
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency && currency.isToken ? currency : undefined);
  const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(account ?? undefined, currency);
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();
  // only show add or remove buttons if not on selected list

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

  return (
    // userAddedTokens.map((token) => (
    <MenuItem
      id={`token-item-${key}`}
      className={`hover:opacity-60 rounded pt-2 ${isSelected ? "hover:cursor-auto" : ""}`}
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <BoxToken className={isSelected ? "hover:cursor-default" : ""}>
        <div className="flex items-center">
          <CurrencyLogo currency={currency} size={40} />
        </div>
        <Column>
          <TokenName title={currency?.name} >
            {currency?.symbol}
          </TokenName>
          <ActionToken className="text-sm font-thin">
            {/* {currency.name}{" "}
          {!isOnSelectedList && customAdded && "• Added by user"} */}
            {!isOnSelectedList && customAdded &&
              (<div>
                <span>Add by user </span>{
                  (otherSelected || isSelected) ?
                    <button style={{ color: "red", cursor: "auto" }}
                      onClick={() => { }}>(Remove)
                    </button> :
                    <ButtonRemoveToken style={{ color: "red" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeToken(chainId, (currency as any)?.address)
                        removeTokenFromStorage((currency as any)?.address)
                      }}>(Remove)
                    </ButtonRemoveToken>
                }
              </div>)
            }
          </ActionToken>
        </Column>
        <TokenTags currency={currency} />
        <div className="flex items-center justify-end">
          {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
        </div>
      </BoxToken>
    </MenuItem>
    // ))
  );
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

export default function CurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showImportView,
  setImportToken,
}: {
  height: number
  currencies: Currency[]
  otherListTokens?: WrappedTokenInfo[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  const itemData: (Currency | BreakLine)[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, BREAK_LINE, ...otherListTokens]
    }
    return currencies
  }, [currencies, otherListTokens])
  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index];
      const isSelected = Boolean(
        selectedCurrency && currencyEquals(selectedCurrency, currency)
      );
      const otherSelected = Boolean(
        otherCurrency && currencyEquals(otherCurrency, currency)
      );
      const handleSelect = () => onCurrencySelect(currency);

      const token = currency?.wrapped;

      const showImport = index > currencies.length;

      if (!data) {
        return (
          <FixedContentRow style={style}>
            <div className="rounded bg-dark-700">
              <RowBetween>
                <RowFixed>
                  <TokenListLogoWrapper src="/tokenlist.svg" />
                  <div>Expanded results from inactive Token Lists</div>
                </RowFixed>
                <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
              </RowBetween>
            </div>
          </FixedContentRow>
        );
      }

      if (showImport && token) {
        return (
          <ImportRow
            style={style}
            token={token}
            showImportView={showImportView}
            setImportToken={setImportToken}
            dim={true}
          />
        );
      } else {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
          />
        );
      }
    },
    [currencies.length, onCurrencySelect, otherCurrency, selectedCurrency, setImportToken, showImportView]
  );

  const itemKey = useCallback(
    (index: number, data: any) => currencyKey(data[index]),
    []
  );

  return (
    <FixedSizeListStyle
      height={height}
      ref={fixedListRef as any}
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={100}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeListStyle>
  );
}
