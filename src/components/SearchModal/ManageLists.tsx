import { AppDispatch, AppState } from "../../state";
import { CheckCircle, Settings } from "react-feather";
import Column, { AutoColumn } from "../Column";
import { PaddedColumn, SeparatorDark } from "./styleds";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Row, { RowBetween, RowFixed } from "../Row";
import {
  acceptListUpdate,
  disableList,
  enableList,
  removeList,
} from "../../state/lists/actions";
import {
  useActiveListUrls,
  useAllLists,
  useIsListActive,
} from "../../state/lists/hooks";
import { useDispatch, useSelector } from "react-redux";

import AutoSizer from "react-virtualized-auto-sizer";
import Button from "../Button";
import CurrencyModalView from "./CurrencyModalView";
import ExternalLink from "../ExternalLink";
import IconWrapper from "../IconWrapper";
import LinkStyledButton from "../LinkStyledButton";
import ListLogo from "../ListLogo";
import ListToggle from "../Toggle/ListToggle";
import ReactGA from "react-ga";
import { TokenList } from "@uniswap/token-lists";
import { UNSUPPORTED_LIST_URLS } from "../../constants/token-lists";
import { listVersionLabel } from "../../functions/list";
import { parseENSAddress } from "../../functions/ens";
import styled from "styled-components";
import { uriToHttp } from "../../functions/convert";
import { useFetchListCallback } from "../../hooks/useFetchListCallback";
import { useListColor } from "../../hooks/useColor";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { usePopper } from "react-popper";
import useTheme from "../../hooks/useTheme";
import useToggle from "../../hooks/useToggle";
import Switch from "../../components/Toggle/Switch";

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;
`;

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0 0 0 12px;
  font-size: 16px;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color: ${({ theme }) => theme.textList};
  height: 55px;
  display: flex;
  font-weight: normal;
  align-items: center;
  &:hover{
    background: ${({ theme }) => theme.bgrList};
    color: ${({ theme }) => theme.textList};
    text-decoration: none;
  }
  @media (max-width: 767px){
    font-size: 12px;
    height: 35px;
    padding-left: 15px;
  }
  opacity: ${({ disabled }) => (disabled ? "0.4" : "1")};
  :hover {
    text-decoration: none;
  }

  :focus {
    outline: none;
    text-decoration: none;
  }
`;

const PopoverContainer = styled.div<{ show: boolean }>`
 
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  // color: ${({ theme }) => theme.text2};
  // border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem 0;
  display: grid;
  grid-template-rows: 1fr;
  font-size: 1rem;
  text-align: left;
  width: 178px;
  height: 146px;
  top: 52px;
  left: 19%;
  border-radius: 20px;

  @media(max-width: 767px){
    width: 133px;
    height: 101px;
    top: 35px;
    left: 29%;
  })
  
`;

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
`;

const StyledTitleText = styled.div<{ active: boolean }>`
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${({ theme, active }) => (active ? theme.primaryText2 : theme.primaryText2)};
  @media (max-width: 767px){
    font-size: 10px;
  }
`;
const SettingsIcon = styled(Settings)`
  width: 18px;
  stroke: #667795;
  margin-left: 7px;
`
const StyledListUrlText = styled.div<{ active: boolean }>`
  font-size: 14px;
  color: ${({ theme, active }) => (active ? theme.primaryText3 : theme.primaryText3)};
  @media (max-width: 767px){
    font-size: 12px;
  }
`;

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
  background-color: ${({ bgColor, active, theme }) =>
    active ?  theme.bg7 :  "transparent"};
  
  transition: 200ms;
  align-items: center;
  grid-gap: 10px;
  padding: 15px 16px;
  border-radius: 10px;
  border: 1px solid  ${({ theme }) => theme.borderColor1};
  position: relative;
  > div{
    overflow: visible;
    position: relative !important;
  }
  margin-top: 15px;
  @media (max-width: 414px){
    padding: 10px;
  }
`;
const RowFixedLogo = styled(RowFixed)`
  > div{
    overflow: hidden;
    position: relative !important;
  }
`
const ExternalLinkList = styled(ExternalLink)`
  font-size: 16px;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color: ${({ theme }) => theme.textList};
  height: 55px;
  display: flex;
  align-items: center;
  &:hover{
    background: ${({ theme }) => theme.bgrList};
    color: ${({ theme }) => theme.textList};
  }
  @media (max-width: 767px){
    font-size: 12px;
    height: 35px;
    padding-left: 15px;
  }
`
const RowBetweenImport = styled(RowBetween)`
  display: flex;
  align-items: center;
  // border: 1px solid rgba(0, 28, 78, 0.15);
  // padding: 20px;
  // box-sizing: border-box;
border-radius: 10px;

`
const ColName = styled.div`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.primaryText2};
  font-family: "SF UI Display";

  @media (max-width: 640px){
    font-size: 14px;
  }
`
const NameToken = styled.div`
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
`
const StyleButton = styled.div`
background: ${({ theme }) => theme.greenButton};
color:${({ theme }) => theme.white};
border-radius: 30px;
font-family: SF UI Display;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 23px;
height: 33px;
align-items: center;
text-align: center;
cursor:pointer;
display : flex;
justify-content : center;
width: 92px;

@media (max-width: 640px) {
  padding: 11px 22px 12px 22px;
  font-size: 12px;
  line-height: 17px;
  width: 70px;
  margin-bottom : 7px;
}
`
const ListContainer = styled.div`
  // padding: 1rem;
  // // height: 100%;
  // // overflow-y: auto;

  // padding-bottom: 80px;
`;

const TextNote = styled.div`
  color : ${({ theme }) => theme.title1};
  padding-left: 8px;
  a{
    color: #72BF65;
    font-weight: 700;
  }
`
function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, "-")}`;
}

const ListRow = memo(({ listUrl }: { listUrl: string }) => {
  const listsByUrl = useSelector<AppState, AppState["lists"]["byUrl"]>(
    (state) => state.lists.byUrl
  );
  const dispatch = useDispatch<AppDispatch>();
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];

  const theme = useTheme();
  const listColor = useListColor(list?.logoURI);
  const isActive = useIsListActive(listUrl);

  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement>();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "auto",
    strategy: "fixed",
    modifiers: [{ name: "offset", options: { offset: [8, 8] } }],
  });

  useOnClickOutside(node, open ? toggle : undefined);

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return;
    ReactGA.event({
      category: "Lists",
      action: "Update List from List Select",
      label: listUrl,
    });
    dispatch(acceptListUpdate(listUrl));
  }, [dispatch, listUrl, pending]);

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: "Lists",
      action: "Start Remove List",
      label: listUrl,
    });
    if (
      window.prompt(
        `Please confirm you would like to remove this list by typing REMOVE`
      ) === `REMOVE`
    ) {
      ReactGA.event({
        category: "Lists",
        action: "Confirm Remove List",
        label: listUrl,
      });
      dispatch(removeList(listUrl));
    }
  }, [dispatch, listUrl]);

  const handleEnableList = useCallback(() => {
    ReactGA.event({
      category: "Lists",
      action: "Enable List",
      label: listUrl,
    });
    dispatch(enableList(listUrl));
  }, [dispatch, listUrl]);

  const handleDisableList = useCallback(() => {
    ReactGA.event({
      category: "Lists",
      action: "Disable List",
      label: listUrl,
    });
    dispatch(disableList(listUrl));
  }, [dispatch, listUrl]);

  if (!list) return null;
  
  return (
    <RowWrapper
      id={listUrlRowHTMLId(listUrl)}
      active={isActive}
      bgColor={listColor}
      key={listUrl}
      className={`${
        isActive ? "text-high-emphesis " : "text-primary bg-dark-700"
      }`}
    >
      {list.logoURI ? (
        <ListLogo
          size="40px"
          style={{ marginRight: "1rem" }}
          logoURI={list.logoURI}
          alt={`${list.name} list logo`}
        />
      ) : (
        <div style={{ width: "24px", height: "24px", marginRight: "1rem" }} />
      )}
      <Column style={{ flex: "1" }}>
        <Row>
          <StyledTitleText active={isActive}>{list.name}</StyledTitleText>
        </Row>
        <RowFixed mt="4px">
          <StyledListUrlText active={isActive} mr="6px">
            {list.tokens.length} tokens
          </StyledListUrlText>
          <StyledMenu ref={node as any}>
            <Button
              variant="empty"
              onClick={toggle}
              ref={setReferenceElement}
              style={{ padding: "0", outline: "none", position: "relative" }}
            >
              <SettingsIcon size={18} className="ml-1 stroke-current" />
            </Button>
            {open && (
              <PopoverContainer
                show={true}
                className={`absolute top-12 z-50`}
                // ref={setPopperElement as any}
                // style={styles.popper}
                // {...attributes.popper}
              >
                {/* <div>{list && listVersionLabel(list.version)}</div> */}
                {/* <SeparatorDark /> */}
            
                <ExternalLinkList
                  href={`https://tokenlists.org/token-list?url=${listUrl}`}
                >
                  View list
                </ExternalLinkList>
                <UnpaddedLinkStyledButton
                  onClick={handleRemoveList}
                  // disabled={Object.keys(listsByUrl).length === 1}
                >
                  Remove list
                </UnpaddedLinkStyledButton>
                {pending && (
                  <UnpaddedLinkStyledButton onClick={handleAcceptListUpdate}>
                    Update list
                  </UnpaddedLinkStyledButton>
                )}
              </PopoverContainer>
            )}
          </StyledMenu>
        </RowFixed>
      </Column>
      <Switch
        isActive={isActive}
        bgColor={listColor}
        toggle={() => {
          isActive ? handleDisableList() : handleEnableList();
        }}
      />
    </RowWrapper>
  );
});


function ManageLists({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const [listUrlInput, setListUrlInput] = useState<string>("");

  const lists = useAllLists();

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls();
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>();
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls);
    }
  }, [activeCopy, activeListUrls]);

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value);
  }, []);

  const fetchList = useFetchListCallback();

  const validUrl: boolean = useMemo(() => {
    return (
      uriToHttp(listUrlInput).length > 0 ||
      Boolean(parseENSAddress(listUrlInput))
    );
  }, [listUrlInput]);

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists);
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return (
          Boolean(lists[listUrl].current) &&
          !UNSUPPORTED_LIST_URLS.includes(listUrl)
        );
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1];
        const { current: l2 } = lists[u2];

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1;
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1;
        }

        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1;
        }
        if (l1) return -1;
        if (l2) return 1;
        return 0;
      });
  }, [lists, activeCopy]);

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>();
  const [addError, setAddError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError("Error importing list"));
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList();
      setAddError('')
    } else {
      setTempList(undefined);
      listUrlInput !== "" && setAddError("Enter valid list location");
    }

    // reset error
    if (listUrlInput === "") {
      setAddError(undefined);
    }
  }, [fetchList, listUrlInput, validUrl]);

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput);

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return;
    setImportList(tempList);
    setModalView(CurrencyModalView.importList);
    setListUrl(listUrlInput);
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList]);

  return (
    <div className="relative flex-1 w-full h-full space-y-4 overflow-y-hidden">
      <TextNote>You can  click <a href="https://tokenlists.org/" target="_blank" rel="noreferrer">here</a> to get token list and paste in this textbox</TextNote>
      <StyledInput>
        <input
          id="list-add-input"
          type="text"
          placeholder="https:// or ipfs:// or ENS name"
          className=""
          value={listUrlInput}
          onChange={handleInput}
          title="List URI"
          autoComplete="off"
          autoCorrect="off"
        />
      </StyledInput>
      {addError ? (
        <TextWarning
          title={addError}
          className="overflow-hidden text-red text-ellipsis"
        >
          {addError}
        </TextWarning>
      ) : null}
      <BoxLists>
      {tempList && (
        <PaddedColumn >
          <RowBetweenImport>
            <RowFixedLogo>
              {tempList.logoURI && (
                <ListLogo logoURI={tempList.logoURI} size="40px"/>
              )}
              <AutoColumn className="flex flex-col" gap="4px" style={{ marginLeft: "12px" }}>
                <ColName className="font-semibold ">{tempList.name}</ColName>
                <NameToken className="text-xs">{tempList.tokens.length} tokens</NameToken>
              </AutoColumn>
            </RowFixedLogo>
            {isImported ? (
              <RowFixed>
                <IconWrapper size="16px" marginRight={"10px"}>
                  <CheckCircle />
                </IconWrapper>
                <div>Loaded</div>
              </RowFixed>
            ) : (
              <StyleButton
                color="gradient"
                onClick={handleImport}
              >
                Import
              </StyleButton>
            )}
          </RowBetweenImport>
        </PaddedColumn>
      )}
      <ListContainer>
        {/* <div className="h-full">
          <AutoSizer disableWidth>
            {({ height }) => (
              <div style={{ height }} className="space-y-4"> */}
                {sortedLists.map((listUrl) => (
                  <ListRow key={listUrl} listUrl={listUrl} />
                ))}
              {/* </div>
            )}
          </AutoSizer>
        </div> */}
      </ListContainer>
      {/* <Tip className="absolute bottom-0 text-sm w-full">
          <div className=" flex justify-center w-full">
             Tip: Custom tokens are stored locally in your browser
          </div>
        </Tip> */}
      </BoxLists>
    </div>
  );
}

export default ManageLists;
const BoxLists = styled.div`
  max-height: 44vh;
  overflow: auto;
  margin-top: 5px !important;
  
  @media (max-width: 640px){
    height: 270px;
    
  }
`
const StyledInput = styled.div`
  margin-bottom: 10px;
  margin-top: 8px !important;
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
  }
  }
  input:focus{
    border: 1px solid ${({ theme }) => theme.greenButton};
  }
`
const TextWarning = styled.div`
  margin-top: 5px !important;
`
