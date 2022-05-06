import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import React from "react";
import styled from "styled-components";
import DropdownFooter from "./dropdown";

const FooterTableStyle = styled.div`
    color: ${({ theme }) => theme.primaryText3};
    font-family: "SF UI Display";
    font-weight: 600;
    font-size: 0.875rem;

      .stroke-svg {
        stroke: ${({ theme }) => theme.text1};
      }

      .fill-svg {
        fill: ${({ theme }) => theme.text1};
      }

      .icon-dropdown {
        fill: ${({ theme }) => theme.iconDropdown};
      }
  `

const FooterTable = (props) =>  {
  const { i18n } = useLingui();
  const { tableOptions, dataSource, setTableOptions, dataTotal } = props;
  var dataLength = dataSource?.length;
  if(dataTotal){
    dataLength = dataTotal
  }
  
  return (
    <FooterTableStyle className="flex flex-row justify-between items-center w-full h-16 footer-table">
      <DropdownFooter tableOptions={tableOptions} dataLength={dataLength} setTableOptions={setTableOptions} isBridge={props.isBridge ? props.isBridge : false}/>
      <div className="flex flex-row items-center">
        <div>{`${dataLength ? tableOptions.itemStart : "0"} - ${dataLength < tableOptions.itemEnd ? dataLength : tableOptions.itemEnd} ${i18n._(t`Of`)} ${dataLength}`}</div>
        {
          tableOptions.current === 1 
          ? <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" 
            className="sm:ml-4 ml-2 cursor-not-allowed"
          >
            <path
              className="stroke-svg"
              d="M7 1.66663L1.66667 6.99996L7 12.3333" 
              stroke="#001C4E" 
              strokeOpacity="0.38" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          : <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="sm:ml-4 ml-1 cursor-pointer"
            onClick={() => {
              if(tableOptions.current > 1) {
                setTableOptions({
                  ...tableOptions,
                  current: tableOptions.current - 1,
                  itemStart: tableOptions.pageSize * (tableOptions.current - 2) + 1,
                  itemEnd: tableOptions.pageSize * (tableOptions.current - 1),
                })
              }
            }}
          >
            <path 
              className="stroke-svg"
              d="M7 1.66663L1.66667 6.99996L7 12.3333" 
              stroke="#001C4E" 
              strokeOpacity="0.6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        }
        {
          tableOptions.current === tableOptions.totalPage
          ? <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:ml-4 ml-2 cursor-not-allowed">
            <path 
              className="stroke-svg"
              d="M1 12.3334L6.33333 7.00004L1 1.66671" 
              stroke="#001C4E" 
              strokeOpacity="0.38" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          : <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="sm:ml-4 ml-1 cursor-pointer" 
            onClick={() => {
              if (tableOptions.current < tableOptions.totalPage) {
                setTableOptions({
                  ...tableOptions,
                  current: tableOptions.current + 1,
                  itemStart: tableOptions.pageSize * tableOptions.current + 1,
                  itemEnd: ((tableOptions.current + 1) * tableOptions.pageSize) < dataLength ? (tableOptions.current + 1) * tableOptions.pageSize : dataLength,
                })
              }
            }}
          >
            <path 
              className="stroke-svg"
              d="M1 12.3334L6.33333 7.00004L1 1.66671" 
              stroke="#001C4E" 
              strokeOpacity="0.6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg> 
        }
      </div>
    </FooterTableStyle>
  )
}

export default FooterTable;
