
import { AlertTriangle, ArrowLeft } from "react-feather";
import { AutoRow, RowBetween, RowFixed } from "../Row";
import { Checkbox, PaddedColumn, TextDot } from "./styleds";
import React, { useCallback, useState } from "react";
import { enableList, removeList } from "../../state/lists/actions";

import { AppDispatch } from "../../state";
import { AutoColumn } from "../Column";
import Button from "../Button";
import Card from "../Card";
import CloseIcon from "../CloseIcon";
import CurrencyModalView from "./CurrencyModalView";
import ExternalLink from "../ExternalLink";
import ListLogo from "../ListLogo";
import ReactGA from "react-ga";
import { TokenList } from "@uniswap/token-lists";
import styled from "styled-components";
import { useAllLists } from "../../state/lists/hooks";
import { useDispatch } from "react-redux";
import { useFetchListCallback } from "../../hooks/useFetchListCallback";
import useTheme from "../../hooks/useTheme";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`;
const RowFixedLogo = styled(RowFixed)`
display: flex;
align-items: flex-start;
> div{
  overflow: visible !important;
  position: relative !important;
}
`
const ExternalLinkImport = styled(ExternalLink)`
  white-space: pre-line	;	
  width: 100%;
  padding: 5px 0px;
`
const StyleLink = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #0074DF;
  letter-spacing: 0.015em;
  @media (max-width: 767px){
    font-size: 10px;
  }
`
const RowBetweenLogo = styled(RowBetween)`
 width: 100% !important;
 img{
   width: 40px !important;
   max-width: 40px !important;
 }

`
const AutoRowCheck = styled(AutoRow)`
input[type="checkbox"] {
  position: relative;
  width: 16px;
  height: 16px;
  color: #000;
  border: 1px solid #ECE9F1;
  border-radius: 4px;
  appearance: none;
  outline: 0;
  cursor: pointer;
  transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1);

  &::before {
    position: absolute;
    content: '';
    display: block;
    top: 0px;
    left: 5px;
    width: 6px;
    height: 11px;
    border-style: solid;
    border-color: #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
  }
  &:checked {
    color: #fff;
    border-color: #72BF65;
    background: #72BF65;
    &::before {
      opacity: 1;
    }
    ~ label::before {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  }
  @media (max-width: 767px){
    width: 15px;
    height: 15px;
  }
}
`
const StyledText = styled.div`
  color:${({ theme }) => theme.primaryText2};
  font-size: 16px;
  line-height: 126.5%;
  @media (max-width: 767px){
    font-size: 12px;
  }
`
const ButtonImport = styled(Button)`
background: #72BF65;
border-radius: 10px;
height: 63px;
font-weight: bold;
font-size: 18px;
line-height: 126.5%;
letter-spacing: 0.015em;
color: #FFFFFF;
margin: 15px 0 0;
@media (max-width: 767px){
  font-size: 14px;
  height: 40px;
}
:disabled {
  background-color: rgba(31, 55, 100, 0.5);
  color: rgba(255, 255, 255, 0.5);
  border: none;
}
`
const TilteStyle = styled.div`
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  color:${({ theme }) => theme.titleImport};
  @media (max-width: 767px){
    font-size: 18px;
  }
`
const PaddedColumnImport = styled(AutoColumn)``
const ColName = styled.div`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.primaryText2};
  font-family: "SF UI Display";

  @media (max-width: 640px){
    font-size: 12px;
  }
`
const NameToken = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 140px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 126.5%;
  margin-top: 3px;
  color : ${({ theme }) => theme.primaryText3};
  @media (max-width : 767px) {
    font-size: 10px;
    margin-top: 0px;
  }
`
const TextRed = styled.div`
  color: #EC5656;
  font-size: 16px;
  @media (max-width : 767px) {
    font-size: 12px;
  }
`
interface ImportProps {
  listURL: string;
  list: TokenList;
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
}

function ImportList({ listURL, list, setModalView, onDismiss }: ImportProps) {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  // user must accept
  const [confirmed, setConfirmed] = useState(false);

  const lists = useAllLists();
  const fetchList = useFetchListCallback();

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddList = useCallback(() => {
    if (adding) return;
    setAddError(null);
    fetchList(listURL)
      .then(() => {
        ReactGA.event({
          category: "Lists",
          action: "Add List",
          label: listURL,
        });

        // turn list on
        dispatch(enableList(listURL));
        // go back to lists
        setModalView(CurrencyModalView.manage);
      })
      .catch((error) => {
        ReactGA.event({
          category: "Lists",
          action: "Add List Failed",
          label: listURL,
        });
        setAddError(error.message);
        dispatch(removeList(listURL));
      });
  }, [adding, dispatch, fetchList, listURL, setModalView]);

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ width: "100%", flex: "1 1" }}>
        <RowBetween>
          <ArrowLeft
            style={{ cursor: "pointer" }}
            onClick={() => setModalView(CurrencyModalView.manage)}
          />
          <TilteStyle>Import List</TilteStyle>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <PaddedColumnImport gap="md">
        <AutoColumn>
          <div style={{ padding: "12px 0" }}>
            <RowBetweenLogo>
              <RowFixedLogo >
                {list.logoURI && (
                  <ListLogo logoURI={list.logoURI} size="40px" />
                )}
                <AutoColumn className="flex flex-col"  gap="sm" style={{ marginLeft: "10px" }}>
                  <RowFixed>
                    <ColName className="mr-1.5 font-semibold">{list.name}</ColName>
                    <TextDot />
                    <NameToken className="ml-1.5">{list.tokens.length} tokens</NameToken>
                  </RowFixed>
                  <ExternalLinkImport
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    <StyleLink className="font-sm text-blue">{listURL}</StyleLink>
                  </ExternalLinkImport>
                </AutoColumn>
              </RowFixedLogo>
            </RowBetweenLogo>
          </div>
          <div>
            <AutoColumn
             className="justify-center"
              style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
            >
              <AlertTriangle
                className="text-red"
                stroke="currentColor"
                size={32}
              />
              
            </AutoColumn>

            <AutoColumn className="flex-col"
              style={{ gap: "5px", marginBottom: "12px", textAlign: "center" }}
            >
              <TextRed>
                Import at your own risk{" "}
              </TextRed>
              <TextRed >
                By adding this list you are implicitly trusting that the data is
                correct. Anyone can create a list, including creating fake
                versions of existing lists and lists that claim to represent
                projects that do not have one.
              </TextRed>
              <TextRed >
                If you purchase a token from this list, you may not be able to
                sell it back.
              </TextRed>
            </AutoColumn>
            <AutoRowCheck
              style={{ cursor: "pointer", padding: "10px 0" }}
              onClick={() => setConfirmed(!confirmed)}
            > 
            <input name="confirmed"  type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} />
              {/* <Checkbox
                type="checkbox"
              /> */}
              <StyledText className=" ml-2.5 font-medium">I understand</StyledText>
            </AutoRowCheck>
          </div>

          <ButtonImport
            color="gradient"
            size="xs"
            disabled={!confirmed}
            onClick={handleAddList}
          >
            Import
          </ButtonImport>
          {addError ? (
            <div
              title={addError}
              style={{ textOverflow: "ellipsis", overflow: "hidden" }}
              className="text-red"
            >
              {addError}
            </div>
          ) : null}
        </AutoColumn>
      </PaddedColumnImport>
    </Wrapper>
  );
}

export default ImportList;
