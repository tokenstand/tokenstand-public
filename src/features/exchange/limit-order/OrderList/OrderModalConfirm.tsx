import React, { useState } from "react";
import Modal from "../../../../components/Modal";
import CloseIcon from "../../../../components/CloseIcon";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import {
  BoldText,
  BoldTextName,
  BoxToken,
  BoxToken1,
  StyledReactTooltip,
  StyleIcon,
  SvitchBox,
} from "../../../swap/SwapModalHeader";
import CurrencyLogo from "../../../../components/CurrencyLogo";
import TradePrice from "../../../swap/TradePrice";
import PriceTradeOrder from "../PriceTradeOrder";
import { ButtonError } from "../../../../components/Button";

interface Props {
  isOpen: boolean;
  onDismiss: any;
  currencyIn: any;
  currencyOut: any;
  amountOut: string;
  amountIn: string;
  valuePrice: any;
  tokenOuputPrice: any;
  handlePlaceOrder: () => void
}
const HeadModal = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
`;
const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const StyleButton = styled.div`
  width: 100%;
  .style-button {
    font-size: 18px;
    height: 63px;

    @media (max-width: 640px) {
      font-size: 14px;
      height: 40px;
      padding: 0;
    }
    font-weight: 700;
  }
`;

const Note = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 126.5%;
  color: ${({ theme }) => theme.colorDate};
  margin-top: 8px;
`;
export default function OrderModalConfirm({
  isOpen,
  onDismiss,
  currencyIn,
  currencyOut,
  amountOut,
  amountIn,
  valuePrice,
  tokenOuputPrice,
  handlePlaceOrder
}: Props) {
  const crypto = require("crypto");

  const idTooltip = crypto.randomBytes(16).toString("hex");
  return (
    <div>
      <Modal isOpen={isOpen} onDismiss={onDismiss} className="modal-style">
        <HeadModal className="flex justify-between">
          <TitleStyle className="text-lg font-bold"> Verify Order </TitleStyle>
          <CloseIcon onClick={onDismiss} />
        </HeadModal>

        <Note>Please verify your limit order!</Note>
        <div className="sm:grid pt-3 pb-4">
          <div className="sm:grid gap-2 relative">
            <BoxToken className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StyleIcon>
                  {isMobile ? (
                    <CurrencyLogo
                      currency={currencyIn || null}
                      squared
                      size={35}
                    />
                  ) : (
                    <CurrencyLogo
                      currency={currencyIn || null}
                      squared
                      size={48}
                    />
                  )}
                </StyleIcon>
                <BoldText
                  className="overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl"
                  data-tip={amountIn}
                  data-for={idTooltip + "amountIn"}
                  data-iscapture="true"
                >
                  {amountIn}
                  <StyledReactTooltip
                    id={idTooltip + "amountIn"}
                  ></StyledReactTooltip>
                </BoldText>
              </div>
              <BoldTextName className="ml-3 text-2xl font-medium">
                {/* {trade.inputAmount.currency.symbol} */}
                {currencyIn?.symbol}
              </BoldTextName>
            </BoxToken>
            <SvitchBox className="ml-3 mr-3 z-10 flex">
              {isMobile ? (
                <img src="/icons/icon-downMobile.svg" />
              ) : (
                <img src="/icons/icon-swapdown.svg" />
              )}
            </SvitchBox>
            <BoxToken1 className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StyleIcon>
                  {isMobile ? (
                    <CurrencyLogo
                      currency={currencyOut || null}
                      squared
                      size={35}
                    />
                  ) : (
                    <CurrencyLogo
                      currency={currencyOut || null}
                      squared
                      size={48}
                    />
                  )}
                </StyleIcon>
                <BoldText
                  className="overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl"
                  data-tip={amountOut}
                  data-for={"amountOut"}
                  data-iscapture="true"
                >
                  {amountOut}
                  <StyledReactTooltip
                    id={"amountOut"}
                  ></StyledReactTooltip>
                </BoldText>
              </div>
              {/* <BoldText className="ml-3 text-2xl font-medium">
            {trade.outputAmount.currency.symbol}
          </BoldText> */}
              <BoldTextName className="ml-3 text-2xl font-medium">
                {currencyOut?.symbol}
              </BoldTextName>
            </BoxToken1>
          </div>

          <PriceTradeOrder
            inputName={currencyIn?.symbol}
            outputName={currencyOut?.symbol}
            valuePrice={valuePrice}
            tokenOuputPrice={tokenOuputPrice}
          />
        </div>
        <StyleButton className=" mt-0 rounded">
          <ButtonError
            size="lg"
            disabled={false}
            className="text-xl font-semibold w-full style-button mt-5"
            onClick={handlePlaceOrder}
          >
            Verify Order
          </ButtonError>
        </StyleButton>
      </Modal>
    </div>
  );
}
