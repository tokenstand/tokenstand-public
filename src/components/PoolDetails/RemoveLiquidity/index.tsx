import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Input, Slider } from "antd";
import { BigNumber } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import ReactGA from "react-ga";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import CloseIcon from "../../../components/CloseIcon";
import Modal from "../../../components/Modal";
import { useWithdraw } from "../../../features/liquidity/withdraw";
import { calculateGasMargin, tryParseAmount } from "../../../functions";
import { ApprovalState, useApproveCallback, usePairContract } from "../../../hooks";
import { useCurrencyDisconnect } from "../../../hooks/TokensDisconnect";
import { useActiveWeb3React } from "../../../hooks/useActiveWeb3React";
import { useTransactionAdder } from "../../../state/transactions/hooks";
import { convertToNumber } from "../../../utils/convertNumber";
import { decimalAdjust } from "../../../utils/decimalAdjust";
import { ButtonConfirmed } from "../../Button";
import CurrencyLogo from "../../CurrencyLogo";
import TransactionConfirmationModal from "../../TransactionConfirmationModal";
import TransactionFailedModal from "../../TransactionFailedModal";
import ModalRemove from '../PopupApproveRemove/ApproveRemoveLiquidity';

export default function RemoveLiquidity({
  isOpenRemoveLiquidity,
  onDismissRemoveLiquidity,
  dataDetails,
}: {
  isOpenRemoveLiquidity: boolean;
  onDismissRemoveLiquidity: () => void;
  dataDetails: any;
}) {
  const { i18n } = useLingui();
  const { account, chainId, library } = useActiveWeb3React();
  // const router = useRouter();

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm
  const [showPending, setShowPending] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);

  const [txHash, setTxHash] = useState<string>("");
  const addTransaction = useTransactionAdder();

  const [currencyIdA, currencyIdB] = [
    dataDetails?.token0.id,
    dataDetails?.token1.id,
  ] || [undefined, undefined];

  const currencyA = useCurrencyDisconnect(currencyIdA);
  const currencyB = useCurrencyDisconnect(currencyIdB);
  const currencyPool = useCurrencyDisconnect(dataDetails?.id || undefined);

  const [inputSlider, setInputSlider] = useState(0);
  const [inputValue, setInputValue] = useState("0")
  const onChangeSlider = (inputSlider) => {
    if (inputSlider === ".") return "0.";
    let input = inputSlider.toString().replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, '$1');

    if (input.includes(".")) {
      const numString = input.toString().split(".");
      if (numString[1].length > 2) return;
    }
    if (Number(input) > 100) {
      input = 100;
    }
    setInputValue(input);
    setInputSlider(Number(input));
    
    const pixelDensity = window.devicePixelRatio;
    let width;
    if (isMobile) {
      if (Math.round(pixelDensity) === 1) {
        width = !input.toString().includes(".") ? input.toString().length * 13 || 13 : (input.toString().length - 1) * 13 + 10;
      } else if (Math.round(pixelDensity) === 2) {
        width = !input.toString().includes(".") ? input.toString().length * 25 || 25 : (input.toString().length - 1) * 25 + 10;
      } else if (Math.round(pixelDensity) === 3) {
        width = !input.toString().includes(".") ? input.toString().length * 30 || 30 : (input.toString().length - 1) * 30 + 10;
      } else {
        width = !input.toString().includes(".") ? input.toString().length * 35 || 35 : (input.toString().length - 1) * 35 + 10;
      }
    } else {
      width = !input.toString().includes(".") ? input.toString().length * 35 || 35 : (input.toString().length - 1) * 35 + 10;
    }
    
    document.getElementById("auto-resize").style.width = `${width}px`;
  }

  const pairContract = usePairContract(dataDetails?.id)
  const { lpWithdraw, 
    valueA, 
    valueB, 
    decimalPool, 
    aMax, 
    bMax, 
    balanceOf,
    balanceA,
    balanceB
  } = useWithdraw(inputSlider, currencyA, currencyB, dataDetails?.id, account);

  const [approvalPool, approvePoolCallback] = useApproveCallback(currencyPool && tryParseAmount(lpWithdraw?.toString() || '0', currencyPool), dataDetails?.id);


  const [isOpenRemove, setIsOpenRemove] = useState(false)
  const onOpenRemove = () => {
    setIsOpenRemove(true)
  }

  const onDismissRemove = () => {
    setIsOpenRemove(false)
  }

  const handleApprove = async () => {
    if (approvalPool !== ApprovalState.APPROVED) {
      await approvePoolCallback();
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!chainId || !library || !account || !pairContract) return

    const estimate = pairContract.estimateGas.withdraw;
    let method = pairContract.withdraw,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    args = [
      lpWithdraw,
      [
        valueA,
        valueB
      ]
    ]

    setShowPending(true);
    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);
          addTransaction(response, {
            summary: i18n._(
              t`You received ${decimalAdjust("floor", convertToNumber(valueA, currencyA?.decimals), -8)} ${currencyA?.symbol} 
              and ${decimalAdjust("floor", convertToNumber(valueB, currencyB?.decimals), -8)} ${currencyB?.symbol}`
            ),
          })
          setTxHash(response.hash);
          ReactGA.event({
            category: 'Liquidity',
            action: 'Remove',
            label: [currencyA?.symbol, currencyB?.symbol].join('/'),
          })
        })
      )
      .catch((error) => {
        setShowPending(false);
        setAttemptingTxn(false);
        setShowReject(true);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  };

  const styleMarks = {
    background: 'rgba(114, 191, 101, 0.15)',
    color: '#72BF65',
    borderRadius: '30px',
    fontSize: '${(props) => (props.isMobile ? "12px" : "16px")}',
    lineHeight: '126.5%',
    position: 'static',
    transform: 'none',
  }

  const markActive = {
    color: '#ffffff',
    background: '#72BF65',
    borderRadius: '30px',
    fontSize: '${(props) => (props.isMobile ? "12px" : "16px")}',
    lineHeight: '126.5%',
    position: 'static',
    transform: 'none',
  }

  const marks = {
    25: {
      style: inputSlider == 25 ? markActive : styleMarks,
      label: <strong>25%</strong>,
    },
    50: {
      style:  inputSlider == 50 ? markActive : styleMarks,
      label: <strong>50%</strong>,
    },
    75: {
      style:  inputSlider == 75 ? markActive : styleMarks,
      label: <strong>75%</strong>,
    },
    100: {
      style:  inputSlider == 100 ? markActive : styleMarks,
      label: <strong>MAX</strong>,
    },
  };

  const pendingText = i18n._(
    t`You will receive ${decimalAdjust("floor", convertToNumber(valueA, currencyA?.decimals), -8)} ${currencyA?.symbol} 
    and ${decimalAdjust("floor", convertToNumber(valueB, currencyB?.decimals), -8)} ${currencyB?.symbol}`
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowPending(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      setInputSlider(0);
      setInputValue("0");
      onDismissRemoveLiquidity();
    }
    setTxHash("");
  }, [txHash]);

  const handleDismisReject = () => {
    setShowReject(false);
    setIsOpenRemove(false);
    setInputSlider(0);
    setInputValue("0");
  }

  const crypto = require("crypto");

  const idTooltip = crypto.randomBytes(16).toString("hex");
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <Modal
      isOpen={isOpenRemoveLiquidity}
      onDismiss={onDismissRemoveLiquidity}
      maxWidth={568}
    >
      <HeadModal className="flex justify-between">
        <TitleStyle className="text-lg font-bold">{i18n._(t`Remove Liquidity`)}</TitleStyle>
        <CloseIcon onClick={onDismissRemoveLiquidity} />
      </HeadModal>
      <ContentModal>
        <SliderContent>
          <div className="amount-text">{i18n._(t`Amount`)}</div>
          <StyledInputNumber>
            <Input
              id="auto-resize"
              value={inputValue}
              onChange={e => onChangeSlider(e.target.value)}
              type="text"
            />
            <span>%</span>
          </StyledInputNumber>
          <StyledSlider
            tooltipVisible={false}
            dots={false}
            defaultValue={30}
            min={0}
            marks={marks}
            max={100}
            onChange={onChangeSlider}
            value={typeof inputSlider === 'number' ? inputSlider : 0}
          />
        </SliderContent>
        <MainContent>
          <div className="i">
            <div
              data-tip={convertToNumber(valueA, currencyA?.decimals) || 0}
              data-for={idTooltip+"valueA"}
              data-iscapture="true"
            >
              {valueA ? decimalAdjust("floor", convertToNumber(valueA, currencyA?.decimals), -8) : "-"}
            </div>
            <StyledReactTooltip type="dark" id={idTooltip+"valueA"}/>
            <div className="flex items-center gap-2">
              <CurrencyLogo currency={currencyA} size={24} className="round" />
              {currencyA?.symbol}
            </div>
          </div>
          <div className="i">
            <div
              data-tip={convertToNumber(valueB, currencyB?.decimals) || 0}
              data-for={idTooltip+"valueB"}
              data-iscapture="true"
            >
              {valueB ? decimalAdjust("floor", convertToNumber(valueB, currencyB?.decimals), -8) : "-"}
            </div>
            <StyledReactTooltip type="dark" id={idTooltip+"valueB"}/>
            <div className="flex items-center gap-2">
              <CurrencyLogo currency={currencyB} size={24} className="round" />
              {currencyB?.symbol}
            </div>
          </div>
        </MainContent>
        <PriceResult>
          <div>Price</div>
          <div>
            <div>
              <div>
                {`${Number(balanceA) && Number(balanceB) ? 1 : 0} ${currencyA?.symbol || "-"} = `}
                <span
                  data-tip={Number(BigNumber.from(balanceB || "0"))/Number(BigNumber.from(balanceA || "0")) || 0}
                  data-for={idTooltip}
                  data-iscapture="true"
                >
                  {decimalAdjust("floor", Number(BigNumber.from(balanceB || "0"))/Number(BigNumber.from(balanceA || "0")), -8) || 0} 
                </span>
                {` ${currencyB?.symbol || "-"}`}
              </div>
              <StyledReactTooltip type="dark" id={idTooltip}/>
              <div>
                {`${Number(balanceA) && Number(balanceB) ? 1 : 0} ${currencyB?.symbol || "-"} = `}
                <span
                  data-tip={Number(BigNumber.from(balanceA || "0"))/Number(BigNumber.from(balanceB || "0")) || 0}
                  data-for={idTooltip + "reverse"}
                  data-iscapture="true"
                >
                  {decimalAdjust("floor", Number(BigNumber.from(balanceA || "0"))/Number(BigNumber.from(balanceB || "0")), -8) || 0} 
                </span>
                {` ${currencyA?.symbol || "-"}`}
              </div>
              <StyledReactTooltip type="dark" id={idTooltip + "reverse"}/>
            </div>
          </div>
        </PriceResult>
        <ButtonBox className="flex  justify-between flex-row items-center btn-container gap-3">
          <ButtonConfirmed
            className="btn-approve"
            onClick={handleApprove}
            disabled={approvalPool !== ApprovalState.NOT_APPROVED || !inputSlider}
          >
            {i18n._(t`Approve`)}
          </ButtonConfirmed>
          <ButtonConfirmed
            className="btn-approve"
            onClick={onOpenRemove}
            disabled={!inputSlider || approvalPool !== ApprovalState.APPROVED}
          >
            {!inputSlider ? i18n._(t`Enter An Amount`) : i18n._(t`Remove`)}
          </ButtonConfirmed>
          {isOpenRemove && <ModalRemove
            isOpenRemove={isOpenRemove}
            onDismissRemove={onDismissRemove}
            values={{ lpWithdraw, valueA, valueB, balanceA, balanceB, currencyA, currencyB, decimalPool }}
            handleRemoveLiquidity={handleRemoveLiquidity}
          />}
        </ButtonBox>
        <FooterStyle>
          <div>{i18n._(t`LP TOKENS IN YOUR WALLET`)}</div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <CurrencyLogo currency={currencyA} size={24} className="round" />
              <CurrencyLogo currency={currencyB} size={24} className="round" />
              <div className="ml-2">{t`${currencyA?.symbol}/${currencyB?.symbol}`}</div>
            </div>
            <div>{decimalAdjust("floor", convertToNumber(balanceOf, decimalPool), -8)}</div>
          </div>
          <div className="flex flex-row justify-between">
            <div>{t`${currencyA?.symbol}`}</div>
            <div>{decimalAdjust("floor", convertToNumber(aMax, currencyA?.decimals), -8)}</div>
          </div>
          <div className="flex flex-row justify-between">
            <div>{t`${currencyB?.symbol}`}</div>
            <div>{decimalAdjust("floor", convertToNumber(bMax, currencyB?.decimals), -8)}</div>
          </div>
        </FooterStyle>
      </ContentModal>
      {showPending && <TransactionConfirmationModal
        isOpen={showPending}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => null}
        pendingText={pendingText}
      />}
      {showReject && <TransactionFailedModal
        isOpen={showReject}
        onDismiss={handleDismisReject}
      />}
    </Modal>
  )
}

const TitleStyle = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
  font-size: 20px;
`;
const HeadModal = styled.div`
  color: ${({ theme }) => theme.primaryText2};
  font-weight: 600;
`
const ContentModal = styled.div`

`
const PriceResult = styled.div`
  display: flex;
  margin-top: 23px;
  justify-content: space-between;
  padding: 0 20px;
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 126.5%;
  color: ${({ theme }) => theme.text1};
  letter-spacing: 0.015em;
  text-transform: capitalize;

  div:nth-child(2) {
    text-align: right;
  }

  @media (max-width: 767px) {
    padding: 0px;
    font-size: 14px;
  }
`
const StyledSlider = styled(Slider)`
  &:hover {
    .ant-slider-track {
      background: #72BF65;
      
    }
    .ant-slider-rail {
      background: ${({ theme }) => theme.bg6};
    }
  }
  .ant-tooltip{
    .ant-tooltip-content{
      background: #5C6A86 !important;
      margin: 0 15px !important;
      font-weight: 600 !important;
    }
  }
  .ant-slider-step {
    display: none;
  }

  .ant-slider-mark-text {
    padding: 7px 30px;

    &:hover{
      color:#ffffff !important;
      background: #72BF65 !important;
    }
    @media(max-width: 600px) {
      font-size: 12px;
      max-width: 60px;
      padding: 7px 16px;
    }
  }

  .ant-slider-mark{
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
    @media(max-width: 600px) {
      grid-gap: 10px;
    }
  }

  .ant-slider-handle {
    width: 24px;
    height: 24px;
    margin-top: -10px;
    border: 0;
    background: #72BF65;

    @media(max-width: 600px) {
      width: 16px;
      height: 16px;
      margin-top: -7px;
    }
  }

  .ant-slider-track {
    background: #72BF65;
  }

  .ant-slider-rail {
    background: ${({ theme }) => theme.bg6};
  }
`

const StyledInputNumber = styled.div`

  .ant-input, .ant-input-number-focused {
    border: none !important;
    box-shadow: none !important;
  }

  .ant-input, .ant-input-number, span {
    background: transparent;
    border: none;
    outline: none;
    width: 35px;
    padding: 0;
    color: ${({ theme }) => theme.text1};
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 48px;
    height: auto;
    line-height: 126.5%;
    text-align:left;
    background-color: transparent;
    font-weight: bold;
    outline: none;
    letter-spacing: 0.015em;
    text-transform: capitalize;

    @media(max-width: 768px) {
      font-size: 36px;
    }
  }

  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button,
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -moz-appearance: none;
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    display: none;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
  }

/* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  .ant-input-number-handler-wrap {
    display:none;
  }
`

const ButtonBox = styled.div`
  margin-top: 30px;
  .btn-enter-an-amount, .btn-approve {
    box-sizing: border-box;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    text-transform: capitalize;
    border-radius: 15px;
    height: 63px;
    color: ${({ theme }) => theme.white};
    background: ${({ theme }) => theme.greenButton};
    padding: 10px;
    opacity: 1;
    width: 50%;
    display:flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 1024px) {
      font-size:16px;
    }

    @media(max-width: 767px) {
      font-size: 14px;
      height: 40px;
    }
  }

  .btn-approve :disabled {
    color: rgba(255, 255, 255, 0.5);
    background: ${({ theme }) => theme.bgBtn1} !important;
  }

  .disable-btn {
    opacity: 0.5;
  }
`

const SliderContent = styled.div`
  background-color: ${({ theme }) => theme.bgBtn};
  padding: 32px 32px 60px 32px;
  border-radius: 10px;
  margin-top: 24px;

  @media(max-width: 600px) {
    padding: 20px 16px 40px 16px;
    border-radius: 15px;
    max-height: 173px;
  }

  .amount-text {
    color: ${({ theme }) => theme.label1};
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 126.5%;
    /* or 20px */
    display: flex;
    align-items: center;
    letter-spacing: 0.015em;
    text-transform: capitalize;
  }
`

const MainContent = styled.div`
  & > div {
    margin-bottom: 10px;
  }

  margin-top: 24px;
  padding: 36px 30px 26px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bgBtn};
  
  @media (max-width: 768px) {
    border-radius: 15px;
    padding: 20px 30px;
    max-height: 131px;
  }
  .receive-box {
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 126.5%;
    /* or 20px */

    text-align: right;
    letter-spacing: 0.015em;
    text-transform: capitalize;
    
    color: #72BF65;
    text-align:right;

    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
  .i {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: SF UI Display;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 126.5%;
    /* or 20px */

    letter-spacing: 0.015em;
    text-transform: capitalize;

    color: ${({ theme }) => theme.text1};
    
    @media (max-width: 767px) {
      font-size: 14px;
    }

    img {
      width: 24px;
    }
  }

  .round {
    border-radius: 50%;
  }
`

const FooterStyle = styled.div`
  margin-top: 30px;
  padding: 36px 30px 26px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bgBtn};
  color: ${({ theme }) => theme.text1};
  font-family: "SF UI Display";
  font-size: 16px;
  line-height: 160%;
  font-weight: 500;

  > div:first-child {
    font-weight: 700;
  }

  .round {
    border-radius: 50%;
  }
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

