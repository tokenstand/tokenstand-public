import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../../Modal";
import styled from "styled-components";
import CloseIcon from "../../CloseIcon";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import CurrencyLogo from "../../CurrencyLogo";
import DoubleCurrencyLogo from "../../DoubleLogo";
import { convertToNumber } from "../../../utils/convertNumber";
import { decimalAdjust, toFixed } from "../../../utils/decimalAdjust";
import { useUserSlippageToleranceWithDefault } from "../../../state/user/hooks";
import { Percent } from "@sushiswap/sdk";
import ReactTooltip from "react-tooltip";
import { BigNumber } from "ethers";
import { isMobile } from "react-device-detect";


export default function ModalRemove({
    isOpenRemove,
    onDismissRemove,
    values,
    handleRemoveLiquidity
}: {
    isOpenRemove: boolean;
    onDismissRemove: () => void;
    values: any;
    handleRemoveLiquidity: () => void;
}) {
    const { i18n } = useLingui();
    const { lpWithdraw, valueA, valueB, balanceA, balanceB, currencyA, currencyB, decimalPool } = values;
    const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
    const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE);

    const crypto = require("crypto");
    const idTooltip = crypto.randomBytes(16).toString("hex");
    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const handleValueNumber = (value) => {
        let text = value?.toString();
        if (text.includes('.')) {
            if (text.length > 9) {
                text = text.substring(0, 9);
            }
        }
        return text;
    }

    return (
        <Modal
            isOpen={isOpenRemove}
            onDismiss={onDismissRemove}
            maxWidth={480}
            maxHeight={353}
            className="modal-style"
        >
            <div className="flex justify-between">
                <TitleStyle className="text-lg font-bold">{i18n._(t`You will receive`)}</TitleStyle>
                <CloseIcon onClick={onDismissRemove} />
            </div>
            <WrapToken className="w-full py-3">
                <div className="flex justify-between items-center py-1 gap-4">
                    <PriceToken
                        data-tip={toFixed(convertToNumber(valueA, currencyA?.decimals))}
                        data-for={idTooltip + "TokenAreceive"}
                        data-iscapture="true"
                    >
                        {/* {toFixed(decimalAdjust("floor", convertToNumber(valueA, currencyA?.decimals), -8))} */}
                        {handleValueNumber(toFixed(decimalAdjust("floor", convertToNumber(valueA, currencyA?.decimals), -8)))}
                    </PriceToken>
                    <StyledReactTooltip type="dark" id={idTooltip + "TokenAreceive"} />
                    <div className="flex items-center group-token">
                        {isMobile ?
                            <CurrencyLogo currency={currencyA} size={26} className="round-img" />
                            :
                            <CurrencyLogo currency={currencyA} size={38} className="round-img" />
                        }
                        <span className="token-name">{currencyA?.symbol}</span>
                    </div>
                </div>
                <span className='plus'>+</span>
                <div className="flex justify-between items-center py-1 gap-4">
                    <PriceToken
                        data-tip={toFixed(convertToNumber(valueB, currencyB?.decimals))}
                        data-for={idTooltip + "TokenBreceive"}
                        data-iscapture="true"
                    >
                        {/* {toFixed(decimalAdjust("floor", convertToNumber(valueB, currencyB?.decimals), -8))} */}
                        {handleValueNumber(toFixed(decimalAdjust("floor", convertToNumber(valueB, currencyB?.decimals), -8)))}
                    </PriceToken>
                    <StyledReactTooltip type="dark" id={idTooltip + "TokenBreceive"} />
                    <div className="flex items-center group-token">
                        {isMobile ?
                            <CurrencyLogo currency={currencyB} size={26} className="round-img" />
                            :
                            <CurrencyLogo currency={currencyB} size={38} className="round-img" />
                        }
                        <span className="token-name">{currencyB?.symbol}</span>
                    </div>
                </div>
                <div className="pt-1 text-sm text-secondary sub-token">
                    {`${i18n._(t`Output is estimated. If the price changes by more than`)} ${allowedSlippage.toSignificant(4)}% ${i18n._(t`your transaction will revert.`)}`}
                </div>
                <div className="flex justify-between items-center py-3">
                    <NameLabel>FLIP BNB/BUSD Burned</NameLabel>
                    <div className="flex items-center token-box">
                        <div className="group-icon-token flex">
                            <CurrencyLogo currency={currencyA} size={16} className="round-icon" />
                            <CurrencyLogo currency={currencyB} size={16} className="round-icon" />
                        </div>
                        <CountToken
                            data-tip={toFixed(convertToNumber(lpWithdraw, decimalPool))}
                            data-for={idTooltip + "lpReceive"}
                            data-iscapture="true"
                        >
                            {toFixed(decimalAdjust("floor", convertToNumber(lpWithdraw, decimalPool), -8))}
                        </CountToken>
                        <StyledReactTooltip type="dark" id={idTooltip + "lpReceive"} />
                    </div>
                </div>
                <div className="grid gap-1">
                    <div className="flex items-center justify-between py-1">
                        <div className="text-sm text-high-emphesis lbl-price">{i18n._(t`Price`)}</div>
                        <div className="text-sm font-bold right-align pl-1.5 text-high-emphesis exchange-token">
                            {`1 ${currencyA?.symbol} = `}
                            <span
                                data-tip={toFixed(Number(BigNumber.from(balanceB || "0")) / Number(BigNumber.from(balanceA || "0")))}
                                data-for={idTooltip}
                                data-iscapture="true"
                            >
                                {toFixed(decimalAdjust("floor", Number(BigNumber.from(balanceB || "0")) / Number(BigNumber.from(balanceA || "0")), -8)) || 0}
                            </span>
                            {` ${currencyB?.symbol}`}
                        </div>
                        <StyledReactTooltip type="dark" id={idTooltip} />
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="text-sm font-bold right-align pl-1.5 text-high-emphesis exchange-token">
                            {`1 ${currencyB?.symbol} = `}
                            <span
                                data-tip={toFixed(Number(BigNumber.from(balanceA || "0")) / Number(BigNumber.from(balanceB || "0")))}
                                data-for={idTooltip + "reverse"}
                                data-iscapture="true"
                            >
                                {toFixed(decimalAdjust("floor", Number(BigNumber.from(balanceA || "0")) / Number(BigNumber.from(balanceB || "0")), -8)) || 0}
                            </span>
                            {` ${currencyA?.symbol}`}
                        </div>
                        <StyledReactTooltip type="dark" id={idTooltip + "reverse"} />
                    </div>
                </div>
            </WrapToken>
            <ButtonSupply onClick={handleRemoveLiquidity}>{i18n._(t`Confirm Supply`)}</ButtonSupply>
        </Modal>
    );
}

const TitleStyle = styled.div`
color: ${({ theme }) => theme.primaryText2};
font-weight: 600;
font-size: 20px;
${({ theme }) => theme.mediaWidth.upToExtraSmall`
font-size: 18px;
`};
`;

const PriceToken = styled.p`
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
margin: 0;
font-size: 30px;
line-height: 126.5%;
font-family: "SF UI Display";
letter-spacing: 1px;
max-width: 161px;
word-break: break-word;
color: ${({ theme }) => theme.primaryText2};
${({ theme }) => theme.mediaWidth.upToSmall`
font-size: 24px;
max-width: 135px;
`};
`

const WrapToken = styled.div`
font-family: "SF UI Display";
.token-name{
    color: ${({ theme }) => theme.primaryText2};
    font-size: 30px;
    letter-spacing: 1px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 24px;
    `};
}

.group-token{
    grid-gap: 3px;
    @media (max-width: 640px){
        grid-gap: 7px;
    }
}
.plus{
    font-size: 24px;
    color: ${({ theme }) => theme.primaryText2};
}
.sub-token{
    color: ${({ theme }) => theme.subText};
    font-size: 14px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 10px;
    `};
}
.token-box{
    grid-gap: 5px;
    @media (max-width: 640px){
        grid-gap: 5px;
    }
}
.left-icon{
    position: relative;
    margin-right: -3px;
    z-index: 10;
}
.lbl-price{
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    display: flex;
    align-items: center;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.primaryText3};
    ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 12px;
    `};
}
.exchange-token{
    color: ${({ theme }) => theme.primaryText2};
    font-weight: 500;
    font-size: 16px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 12px;
    `};
}
.round-img{
    border-radius: 50%;
    height: 38px;
    width: 38px;
    stroke: ${({ theme }) => theme.primaryText2};
    @media (max-width: 640px){
        height: 26px;
        width: 26px;
    }
    // img{
    //     @media (max-width: 640px){
    //         height: 24px !important;
    //         width: 24px !important;
    //     }
    // }
}
.round {
    border-radius: 50%;
    height: 16px;
    width: 16px;
    stroke: ${({ theme }) => theme.primaryText2};
    @media (max-width: 640px){
        height: 16px;
        width: 16px;
    }
}
.round-icon{
    border-radius: 50%;
    height: 16px;
    width: 16px;
    stroke: ${({ theme }) => theme.primaryText2};
    @media (max-width: 640px){
        height: 16px;
        width: 16px;
    }
}

`
const NameLabel = styled.p`
color: ${({ theme }) => theme.primaryText3};
font-weight: 500;
font-size: 16px;
line-height: 130%;
letter-spacing: 0.015em;
text-transform: capitalize;
margin: 0;
${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
`};
`
const CountToken = styled.p`
margin: 0;
color: ${({ theme }) => theme.primaryText2};
font-weight: 500;
font-size: 16px;
line-height: 130%;
letter-spacing: 0.015em;
${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
`};
`
const ButtonSupply = styled.button`
background: ${({ theme }) => theme.greenButton};
width: 100%;
border-radius: 15px;
font-size: 18px;
display: flex;
align-items: center;
text-align: center;
justify-content: center;
text-transform: capitalize;
color: #FFFFFF;
font-family: "SF UI Display";
font-weight: bold;
margin: 26px 0 10px;
line-height: 21px;
padding: 21px 0;
${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
    line-height: 14px;
    padding: 13px;
    border-radius: 10px;
`};
`

const StyledReactTooltip = styled(ReactTooltip)`
background: #5C6A86 !important;
font-family: SF UI Display;
font-style: normal;
font-weight: 600 !important;

line-height: 126.5%;
@media screen and (max-width:768px) {
    max-width:250 !important;
}
&.place-top {
    padding: 0.3rem 1rem;
    &:after{
        border-top-color: #5C6A86 !important;
    }
}
&.place-left {
    padding: 0.3rem 1rem;
    &:after{
        border-left-color: #5C6A86 !important;
    }
}
&.place-right {
    padding: 0.3rem 1rem;
    &:after{
        border-right-color: #5C6A86 !important;
    }
}
&.place-bottom {
    padding: 0.3rem 1rem;
    &:after{
        border-bottom-color: #5C6A86 !important;
    }
} 
`