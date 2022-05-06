import React, {useRef} from "react";
import styled from "styled-components";
import { ApplicationModal } from "../../state/application/actions";
import { useModalOpen, useToggleModal } from "../../state/application/hooks";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { Field } from "../../state/swap/actions";

interface SortProps {
  textSort: string;
  onSort: any,
  currencyA: string,
  currencyB: string
}

export default function SortETH({textSort, onSort, currencyA, currencyB }: SortProps) {
  const node = useRef<HTMLDivElement>(null);
  const open = useModalOpen(ApplicationModal.ROUTING_HEAH);
  const toggle = useToggleModal(ApplicationModal.ROUTING_HEAH);
  useOnClickOutside(node, open ? toggle : undefined);
  const StyleSort = styled.div`
    position: relative;
    opacity: 1 !important;
    // cursor: pointer;
    >span{
      opacity: 0.6;
    }
    p{
      margin-bottom: 0;
      cursor: pointer;
      &:hover{
        opacity: 0.6;
      }
    }
    .bg-dropdown{
      background: ${({ theme }) => theme.bg2};
      border: 1px solid ${({ theme }) => theme.border1};
      padding: 5px 0;
    }
  `;

  return(
    <StyleSort className="color-gray" ref={node}> 
      <span onClick={toggle}>
        { `${currencyA}/${currencyB}`} 
        {/* <b className="inline-block icon-color-theme">
          <svg width="14" height="8" viewBox="0 0 14 8">
            <path d="M1.66667 1L7 6.33333L12.3333 1" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </b> */}
      </span>
      
      {/* {open && (
        <div className="min-w-[10rem] max-h-[232px] md:max-h-[unset] bg-dropdown absolute flex flex-col z-50 rounded top-[2rem] left-0 md:overflow-hidden overflow-scroll">
          <div onClick={toggle}><p className="px-3 py-1.5" onClick={() => onSort('USD Value')}>USD Value</p></div>
          <div onClick={toggle}><p className="px-3 py-1.5" onClick={() => onSort('Amount')}>Amount</p></div>
          <div onClick={toggle}><p className="px-3 py-1.5" onClick={() => onSort(`${currencyA}/${currencyB}`)}>{currencyA}/{currencyB}</p></div>
          <div onClick={toggle}><p className="px-3 py-1.5" onClick={() => onSort(`${currencyB}/${currencyA}`)}>{currencyB}/{currencyA}</p></div>
        </div>
      )} */}
    </StyleSort>
  )
}