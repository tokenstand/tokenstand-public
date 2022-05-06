import React, {useState, useRef } from "react";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";

const Dropdown = (props) =>  {
  const { i18n } = useLingui();
  const { tableOptions, dataLength, setTableOptions } = props;
  const [active, setActive] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setActive(false));

  const setPageSize = (e) => {
    setTableOptions({
      current: 1, 
      pageSize: +e,
      itemStart: 1,
      itemEnd: e < dataLength ? e : dataLength,
      totalPage: Math.ceil(dataLength / e),
    })
  } 

  const menuData = isMobile ? [5]:[5,10,25];

  const toogleActive = () => {
    setActive(!active);
  }

  return (
    <DropdownContainer ref={ref} className=" flex flex-row items-center" onClick={toogleActive}>
      <div>{`${i18n._(t`Items per page:`)} ${tableOptions.pageSize}`}</div> &nbsp;
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          className="icon-dropdown"
          d="M5.24701 7.14L0.451011 1.658C-0.114989 1.013 0.345011 3.67706e-07 1.20401 3.67706e-07H10.796C10.9883 -0.000164459 11.1765 0.0550878 11.3381 0.159141C11.4998 0.263194 11.628 0.411637 11.7075 0.586693C11.7869 0.761749 11.8142 0.955998 11.7861 1.14618C11.758 1.33636 11.6757 1.51441 11.549 1.659L6.75301 7.139C6.65915 7.24641 6.5434 7.3325 6.41352 7.39148C6.28364 7.45046 6.14265 7.48098 6.00001 7.48098C5.85737 7.48098 5.71638 7.45046 5.5865 7.39148C5.45663 7.3325 5.34087 7.24641 5.24701 7.139V7.14Z" 
          fill="#667795"
        />
      </svg>
      <ul className={`menu-position-ab menu-dropdown ${active ? 'active' : ''}`}>
        {
          menuData?.map((item, index) => (
            <li className="ant-dropdown-menu-item" key={index} onClick={() => setPageSize(item)}><span className="ant-dropdown-menu-title-content">{item}</span></li>
          ))
        }
      </ul>
    </DropdownContainer>
  )
}

export default Dropdown;

const DropdownContainer = styled.div`
  position: relative;
  cursor: pointer;
  .menu-position-ab {
    position: absolute;
    right: 0px;
    bottom: 15px;
    z-index: 999;
    padding: 0 5px;
    display: none;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    &.active{
      display: block;
    }
  }
`;