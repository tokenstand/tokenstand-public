import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
// interface PaginationProps {
//   sizePerPage: Number
// }

const menuData = [5, 10];

const Dropdown = styled.div`
  position: relative;
  cursor: pointer;
  path {
   
    fill: ${({ theme }) => theme.dropdownIcon} !important;

  }
  .menu-position-ab {
    position: absolute;
    right: 0px;
    bottom: 15px;
    z-index: 999;
    padding: 0 5px;
    display: none;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
      0 9px 28px 8px rgb(0 0 0 / 5%);
    &.active {
      display: block;
    }
  }
`;

const StylePagination = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
 
  span {
    display: inline-block;
    margin-left: 20px;
  }
  .per-page {
    path {
      fill: ${({ theme }) => theme.text1};
      stroke: rgba(0, 0, 0, 0.6);
    }
  }
  .page-number {
    opacity: 0.6;
    path {
      stroke: ${({ theme }) => theme.text1};
      fill: rgba(0, 0, 0, 0) ;
  
    }
    span {
      cursor: pointer;
      &.disable {
        opacity: 0.38;
      }
    }
  }
  .select-number-page {
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
  .ml-0 {
    margin-left: 5px;
  }
  @media (max-width: 767px) {
    padding: 0 15px 20px;
  }
  @media (max-width: 440px) {
    font-size: 12px;
  }
`;

const Pagination = (props: any) => {
  const [active, setActive] = useState(false);
  const { i18n } = useLingui();
  const [sizePage, setIsSizePage] = useState(5);
  const ref = useRef();
  useOnClickOutside(ref, () => setActive(false));
  const toogleActive = () => {
    setActive(!active);
  };

  return (
    <StylePagination className="flex item-center justify-between">
      <Dropdown
        ref={ref}
        className="ant-dropdown-link flex flex-row items-center"
        onClick={toogleActive}
      >
        <div style={{ opacity: "0.6"}}>{`${i18n._(t`Items per page:`)} ${sizePage}`}</div> &nbsp;
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          className="icon-dropdown"
          d="M5.24701 7.14L0.451011 1.658C-0.114989 1.013 0.345011 3.67706e-07 1.20401 3.67706e-07H10.796C10.9883 -0.000164459 11.1765 0.0550878 11.3381 0.159141C11.4998 0.263194 11.628 0.411637 11.7075 0.586693C11.7869 0.761749 11.8142 0.955998 11.7861 1.14618C11.758 1.33636 11.6757 1.51441 11.549 1.659L6.75301 7.139C6.65915 7.24641 6.5434 7.3325 6.41352 7.39148C6.28364 7.45046 6.14265 7.48098 6.00001 7.48098C5.85737 7.48098 5.71638 7.45046 5.5865 7.39148C5.45663 7.3325 5.34087 7.24641 5.24701 7.139V7.14Z" 
          fill="#667795"
        />
      </svg>
        <ul
          className={`menu-position-ab menu-dropdown ${active ? i18n._(t`active`) : ""}`}
        >
          {menuData?.map((item, index) => (
            <li
              className="ant-dropdown-menu-item"
              key={index}
              onClick={() => setIsSizePage(item)}
            >
              <span className="ant-dropdown-menu-title-content">{item}</span>
            </li>
          ))}
        </ul>
      </Dropdown>
      <div className="page-number">
        {props.sizePerPage
          ? `1 - ${props.sizePerPage} ${i18n._(t`of`)} ${props.sizePerPage}`
          : "0 - 0 of 0"}
        <span className="page-prev disable">
          <svg width="8" height="14" viewBox="0 0 8 14">
            <path
              d="M7 1.6665L1.66667 6.99984L7 12.3332"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="page-next disable">
          <svg width="8" height="14" viewBox="0 0 8 14">
            <path
              d="M1 12.3335L6.33333 7.00016L1 1.66683"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </StylePagination>
  );
};
export default Pagination;
