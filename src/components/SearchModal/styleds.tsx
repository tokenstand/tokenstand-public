import { RowBetween, RowFixed } from "../Row";

import { AutoColumn } from "../Column";
import styled from "styled-components";

export const ModalInfo = styled.div`
  // ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`;
export const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`;

export const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  // background: ${({ theme }) => theme.bg2};
  // border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  // color: ${({ theme }) => theme.text2};
  // border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
  top: 80px;
`;

export const TextDot = styled.div`
  height: 3px;
  width: 3px;
  // background-color: ${({ theme }) => theme.text2};
  border-radius: 50%;
`;

export const FadedSpan = styled(RowFixed)`
  // color: ${({ theme }) => theme.primary1};
  font-size: 14px;
`;
export const Checkbox = styled.input`
 
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
    margin-right: 10px;
    &::before {
      position: absolute;
      content: '';
      display: block;
      top: 0px;
      left: 4px;
      width: 7px;
      height: 11px;
      border-style: solid;
      border-color: #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
    }
    &:checked {
      color: #fff;
      border-color: #3ADA81;
      background: #3ADA81;
      &::before {
        opacity: 1;
      }
      ~ label::before {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
    }
  }
`;

export const PaddedColumn = styled(AutoColumn)`
  padding: 0px 0px 5px;
  display: flex;
  align-items: center;
`;

export const MenuItem = styled(RowBetween)`
  
`;

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 10px;
  // color: ${({ theme }) => theme.text1};
  // border-style: solid;
  // border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    // color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    // border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`;
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  // background-color: ${({ theme }) => theme.bg2};
`;

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  // background-color: ${({ theme }) => theme.bg3};
`;
