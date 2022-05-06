import { ChainId, Currency, currencyEquals } from "@sushiswap/sdk";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useActiveWeb3React } from "../../../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/router";
import Modal from "../../../components/Modal";
import styled from "styled-components";
import CloseIcon from "../../../components/CloseIcon";
import { Dropdown, Menu, Table, Tooltip,InputNumber,Button } from "antd";



export default function UnlockPopup({
  isOpenUnlockPopup,
  onDismissUnlockPopup,
}: {
  isOpenUnlockPopup: boolean;
  onDismissUnlockPopup: () => void;
}) {
  const { i18n } = useLingui();
  const { account, chainId, library } = useActiveWeb3React();
  const router = useRouter();
  const tokens = router.query;

  const [countValue, setCountValue] = useState();
  const redirectIcon =()=>{
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M14.5648 0.863459C14.5253 0.768181 14.4675 0.681576 14.3946 0.608542L14.3915 0.605375C14.2433 0.457646 14.0426 0.374784 13.8333 0.375H9.08333C8.87337 0.375 8.67201 0.458408 8.52354 0.606874C8.37507 0.75534 8.29167 0.956704 8.29167 1.16667C8.29167 1.37663 8.37507 1.57799 8.52354 1.72646C8.67201 1.87493 8.87337 1.95833 9.08333 1.95833H11.9223L6.14863 7.73196C6.07301 7.80499 6.0127 7.89234 5.97121 7.98893C5.92972 8.08552 5.90788 8.1894 5.90697 8.29452C5.90605 8.39963 5.92609 8.50388 5.96589 8.60117C6.0057 8.69847 6.06448 8.78686 6.13881 8.86119C6.21314 8.93552 6.30154 8.9943 6.39883 9.03411C6.49612 9.07392 6.60037 9.09395 6.70548 9.09303C6.8106 9.09212 6.91448 9.07028 7.01107 9.02879C7.10766 8.9873 7.19501 8.92699 7.26804 8.85138L13.0417 3.07775V5.91667C13.0417 6.12663 13.1251 6.32799 13.2735 6.47646C13.422 6.62493 13.6234 6.70833 13.8333 6.70833C14.0433 6.70833 14.2447 6.62493 14.3931 6.47646C14.5416 6.32799 14.625 6.12663 14.625 5.91667V1.16667V1.16429C14.625 1.06138 14.6044 0.960042 14.5648 0.863459ZM0.375 4.33333C0.375 3.28352 0.792037 2.2767 1.53437 1.53437C2.2767 0.792038 3.28352 0.375 4.33333 0.375H5.125C5.33496 0.375 5.53633 0.458408 5.68479 0.606874C5.83326 0.75534 5.91667 0.956704 5.91667 1.16667C5.91667 1.37663 5.83326 1.57799 5.68479 1.72646C5.53633 1.87493 5.33496 1.95833 5.125 1.95833H4.33333C3.70344 1.95833 3.09935 2.20856 2.65395 2.65396C2.20856 3.09935 1.95833 3.70344 1.95833 4.33333V10.6667C1.95833 11.2966 2.20856 11.9006 2.65395 12.346C3.09935 12.7914 3.70344 13.0417 4.33333 13.0417H10.6667C11.2966 13.0417 11.9006 12.7914 12.346 12.346C12.7914 11.9006 13.0417 11.2966 13.0417 10.6667V9.875C13.0417 9.66504 13.1251 9.46367 13.2735 9.31521C13.422 9.16674 13.6234 9.08333 13.8333 9.08333C14.0433 9.08333 14.2447 9.16674 14.3931 9.31521C14.5416 9.46367 14.625 9.66504 14.625 9.875V10.6667C14.625 11.7165 14.208 12.7233 13.4656 13.4656C12.7233 14.208 11.7165 14.625 10.6667 14.625H4.33333C3.28352 14.625 2.2767 14.208 1.53437 13.4656C0.792037 12.7233 0.375 11.7165 0.375 10.6667V4.33333Z" fill="#72BF65"/>
        </svg>
      );    
  }

  const handleSubmitUnlockPopup = (e) => {
    e.preventDefault();
    alert(chainId);

  };
  const maxValue = 10000;
  const [value,setValue] = useState(0);

  function onChange(value) {
    setValue(value)
  }
  return (
    <Modal isOpen={isOpenUnlockPopup} onDismiss={onDismissUnlockPopup} maxWidth={480}>
      <HeadModal className="flex justify-between">
        <TitleStyle className="text-lg font-bold">Contribute STAND-BNB </TitleStyle>
        <CloseIcon onClick={onDismissUnlockPopup} />
      </HeadModal>
      <BodyModal>
        <form onSubmit={handleSubmitUnlockPopup}>
            <div className="text-body">
                    127890765435678909 STAND-BNB  Available
            </div>
            <div className="input-box">

                <InputBox>
                    <InputNumber
                        defaultValue={0}
                        min={0}
                        value={value}
                        formatter={value => `${value}`}
                        
                        onChange={onChange}
                        />
                </InputBox>
                <div className="max-box">
                    <div className="max-text">STAND-BNB </div>
                    <Button className="max-button" onClick={() => {setValue(maxValue)}}>Max</Button>  
                </div>
              </div>
            <div className ="button-box">
                <CancelButton  type="button" onClick={handleSubmitUnlockPopup}>Cancel</CancelButton>
                <ConfirmButton type="submit">Confirm</ConfirmButton>                
            </div>
        </form>
      </BodyModal>
      <FooterModal>
            <a href={`javascript:void(0)`}>
                    <span>Get STAND-BNB</span> {redirectIcon()}
            </a>
      </FooterModal>
    </Modal>
  );
}

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  @media screen and (max-width:768px){
    font-size:18px;
  }
`;
const HeadModal = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
`;
const BodyModal = styled.div`
  .head-title {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-between;
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    @media screen and (max-width:768px){
      font-size:12px;
    }
    line-height: 126.5%;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.text6};
    margin: 10px 0;
  }
  .detail-depo {
    & > div {
      padding: 15px 0;
      border-bottom: 1px solid ${({ theme }) => theme.border1};
    }
  }
  form{
      margin-top:26px;
      .text-body{
        font-family: SF UI Display;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 126.5%;
        /* identical to box height, or 18px */

        display: flex;
        align-items: center;
        letter-spacing: 0.015em;
        text-transform: capitalize;
        color: ${({ theme }) => theme.text1};
        @media screen and (max-width:768px){
            font-size:12px;
          }
      }
      .input-box{
          margin-top:14px;
          background:${({ theme }) => theme.bgNoti};
          border-radius: 10px;
          display:flex;
          align-items:center;
          padding:21px;
          justify-content:space-between;
          @media screen and (max-width:768px){
            padding:12px;
          }

      }
      .max-box{

        display: flex;
        align-items: center;
          .max-text{
            font-family: SF UI Display;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 126.5%;
            /* or 20px */
            color: ${({ theme }) => theme.text1};
            display: flex;
            align-items: center;
            text-align: right;
            letter-spacing: 0.015em;
            text-transform: capitalize;
            @media screen and (max-width:768px){
                font-size:12px;
              }
          }
          .max-button{
            border-radius: 30px;
            padding:10px 21px;
            margin-left:14px;
            display: flex;
            text-align: center;
            align-items: center;
            justify-content: center;
            border:0 !important;
            background: ${({ theme }) => theme.greenButton};
            color: ${({ theme }) => theme.white};
            font-family: SF UI Display;
            font-style: normal;
            font-weight: bold;
            font-size: 16px;
            line-height: 126.5%;
          
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.015em;
            text-transform: capitalize;
            @media screen and (max-width:768px){
                font-size:12px;
              }
          }

      }
      .button-box{
        display:flex;
        align-items: center;
        justify-content: space-between;
        margin-top:38px;
      }

  }
`;
const FooterModal = styled.div`
  >a{
    display:flex;
    justify-content:center;
    align-items:center;
    color: ${({ theme }) => theme.text1};
    margin-top:25px;
    span{
        font-family: SF UI Display;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        /* identical to box height */
    
        display: flex;
        align-items: center;
        text-align: center;
        text-transform: capitalize;
        margin-right:5px;
        @media screen and (max-width:768px){
            font-size:12px;
          }
    }
  }
`

const ConfirmButton = styled.button`
width:50%;
    margin-left:20px;
  border-radius: 10px;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:63px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 126.5%;
  background: ${({ theme }) => theme.greenButton};
  color: ${({ theme }) => theme.white};
  text-align: center;
  letter-spacing: 0.015em;
  text-transform: capitalize;
  @media screen and (max-width:768px){
    font-size:14px;
  }
`
const CancelButton =styled.button`
    width:50%;
   
  border-radius: 10px;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:63px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 126.5%;
    border:1px solid ${({ theme }) => theme.text1};
    color: ${({ theme }) => theme.text1};
    background: ${({ theme }) => theme.bg1};
    text-align: center;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    @media screen and (max-width:768px){
      font-size:14px;
    }
`
const InputBox = styled.div`
    width:50%;
    @media screen and (max-width:768px){
        width:40%;
      }
    .ant-input-number{
        width:100%;
        background:none;
        border:0 !important;
        input{
            color: ${({ theme }) => theme.text1};
            font-family: SF UI Display;
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 126.5%;

            background-color: transparent;
            font-weight: bold;
    
            letter-spacing: 0.015em;
            text-transform: capitalize;
            @media screen and (max-width:768px){
                font-size:16px;

              }
        }
    }

    


    .ant-input-number-handler-wrap{
        display:none;
        
    }

`