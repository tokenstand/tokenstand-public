import React, { useEffect, useRef, useState } from "react";
import { useSetUserSlippageTolerance, useUserSlippageTolerance, useUserTransactionTTL } from '../../state/user/hooks'
import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants'

import { AutoColumn } from "../Column";
import { Percent } from "@sushiswap/sdk";
import QuestionHelper from "../QuestionHelper";
import { RowFixed } from "../Row";
import Typography from "../Typography";
import { classNames } from "../../functions";
import styled from "styled-components";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Input as NumericalInput } from "../NumericalInput";
import CloseIcon from "../../components/CloseIcon";

enum SlippageError {
  InvalidInput = "InvalidInput",
  RiskyLow = "RiskyLow",
  RiskyHigh = "RiskyHigh",
}

enum DeadlineError {
  InvalidInput = "InvalidInput",
}

const FancyButton = styled.button`
  color: #bfbfbf;
  align-items: center;
  height: 2rem;
  border-radius: 10px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  outline: none;
  @media (max-width: 767px){
    font-size: 12px;
  }
`;

const Option = styled(FancyButton) <{ active: boolean }>`
  
  :hover {
    cursor: pointer;
  }
  background-color: ${({ active, theme }) => (active ? "#72BF65" : theme.bgInput)};
  color: ${({ active, theme }) => (active ? "#FFFFFF" : theme.tabActive)};
  border: 1px solid ${({ theme }) => theme.border2};
  width: 4.063rem;
  height: 3.125rem;
  border-radius: 5px;
  margin-right: 11px;
  @media (max-width: 767px){
    width: 3.75rem;
    height: 2.5rem;
  }
`;

const Input = styled.input`
  background: transparent;
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ color }) => (color === "red" ? "#FF3838" : "#BFBFBF")};
  text-align: left;
  ::placeholder {
    color: ${({ value }) => (value !== "" ? "transparent" : "currentColor")};
  }
  @media (max-width: 767px){
    font-size: 12px;
  }
`;

const OptionCustom = styled(FancyButton) <{
  active?: boolean;
  warning?: boolean;
}>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;
  input {
    width: 100%;
    height: 100%;
    border: 0px;
    color: ${({ active, theme }) => (active ? "#FFFFFF" : theme.tabActive)};
  }
  background-color: ${({ active, theme }) => (active ? "#72BF65" : theme.bgInput)};
  color: ${({ active, theme }) => (active ? "#FFFFFF" : theme.tabActive)};
  border: 1px solid ${({ theme }) => theme.border2};
  border-radius: 5px;
  // width: 130px !important;
  height: 3.125rem;
  @media (max-width: 767px){
    width: 3.75rem;
    height: 2.5rem;
  }
`;

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  //     ${({ theme }) => theme.mediaWidth.upToSmall`
//     display: none;  
//   `}
`;

const TypographyStyle = styled(Typography)`
  color: ${({ theme }) => theme.primaryText2}
`

const TypographyMedium = styled(TypographyStyle)`
  font-size: 16px;
  font-weight: 400;
  @media (max-width: 767px){
    font-size: 14px;
  }
`

export interface SlippageTabsProps {
  placeholderSlippage?: Percent // varies according to the context in which the settings dialog is placed
  showPopupSetting?: boolean
}

export default function SlippageTabs({
  placeholderSlippage,
  showPopupSetting,

}: SlippageTabsProps) {
  const { i18n } = useLingui()

  const inputRef = useRef<HTMLInputElement>()

  const userSlippageTolerance = useUserSlippageTolerance()
  const setUserSlippageTolerance = useSetUserSlippageTolerance()

  const [deadline, setDeadline] = useUserTransactionTTL()

  const [slippageInput, setSlippageInput] = useState('')
  const [slippageError, setSlippageError] = useState<SlippageError | false>(false)

  const [deadlineInput, setDeadlineInput] = useState('')
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(false)
  // const [isEmpty, setIsEmpty] = useState(false);
  function parseSlippageInput(input: string) {
    // populate what the user typed and clear the error
    let value = input.toString().replace(/[^0-9.]/g, "").replace(/(\..?)\../g, '$1');
    if (value.includes('.')) {
      const arrValue = value.split('.')
      value = arrValue[0] + '.' + arrValue[1]
    }
    if(parseFloat(value) >= 10 ){
      value = value.substring(0, 5);
    }
    else value = value.substring(0, 4);
    
    setSlippageInput(value)
    setSlippageError(false)

    if (value.length === 0) {
      setUserSlippageTolerance('auto')
      setSlippageError(SlippageError.InvalidInput)
      // setIsEmpty(true);
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100)
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setUserSlippageTolerance(new Percent(50, 10_000))
        if (value !== '.') {
          setSlippageError(SlippageError.InvalidInput)
        }
      }
      else if (parsed > 0 && parsed < 50) {
        setSlippageError(SlippageError.RiskyLow)
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }

      else if (parsed >= 500 || parsed === 0) {
        setSlippageError(SlippageError.RiskyHigh)
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }
      else {
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }

    }
  }

  const tooLow = userSlippageTolerance !== 'auto' && userSlippageTolerance.lessThan(new Percent(5, 10_000))
  const tooHigh = userSlippageTolerance !== 'auto' && userSlippageTolerance.greaterThan(new Percent(1, 100))

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value)
    setDeadlineError(false)

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW)
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60)
        if (!Number.isInteger(parsed) || parsed < 60 || parsed > 180 * 60) {
          setDeadlineError(DeadlineError.InvalidInput)
        } else {
          setDeadline(parsed)
        }
      } catch (error) {
        console.error(error)
        setDeadlineError(DeadlineError.InvalidInput)
      }
    }
  }
  useEffect(() => {
    if (showPopupSetting && slippageInput === '' && userSlippageTolerance === 'auto') {
      setSlippageInput('0.50');
    }
  }, [showPopupSetting])

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed>
          <TypographyMedium>
            {i18n._(t`Slippage tolerance`)}
          </TypographyMedium>

          <QuestionHelper
            text={i18n._(
              t`Your transaction will revert if the price changes unfavorably by more than this percentage.`
            )}
          />
        </RowFixed>
        <div className="flex items-center">
          <Option
            onClick={() => {
              setSlippageInput("");
              parseSlippageInput("0.1");
            }}
            active={slippageInput === "0.1"}
          >
            0.1%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput("");
              parseSlippageInput("0.5");
            }}
            active={slippageInput === "0.5"}
          >
            0.5%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput("");
              parseSlippageInput("1");
            }}
            active={slippageInput === "1"}
          >
            1%
          </Option>
          <OptionCustom
            active={(userSlippageTolerance !== 'auto' && slippageError !== SlippageError.InvalidInput) || (slippageInput === '0.50')}
            warning={!!slippageError}
            tabIndex={-1}
          >
            <div className="flex items-center justify-center">
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                placeholder={placeholderSlippage}
                value={
                  slippageInput.length > 0
                    ? slippageInput
                    : userSlippageTolerance === 'auto'
                      ? ''
                      : userSlippageTolerance.toFixed(2)
                }
                pattern="^[0-9]*[.]?[0-9]*$"
                type="text"
                inputMode="decimal"
                onChange={(e) => parseSlippageInput(e.target.value)}
                onBlur={() => {
                  setSlippageInput('')
                  setSlippageError(false)
                }}
                color={slippageError ? "red" : ""}
                style={{
                  height: "24px",
                  textAlign: "center",
                  borderRadius: 0,
                }}
              />
              <div>%</div>
            </div>
          </OptionCustom>
        </div>
        {(slippageError || tooLow || tooHigh) && (
          <Typography
            className={classNames(
              slippageError === SlippageError.InvalidInput
                ? "text-red"
                : "text-yellow",
              "font-medium flex items-center space-x-2"
            )}
            variant="sm"
          >
            <div>
              {slippageError === SlippageError.InvalidInput
                ? i18n._(t`Enter a valid slippage percentage`)
                : slippageError === SlippageError.RiskyLow
                  ? i18n._(t`Your transaction may fail`)
                  : i18n._(t`Your transaction may be frontrun.`)}
            </div>
          </Typography>
        )}
      </AutoColumn>

      {/* <AutoColumn gap="sm">
        <RowFixed>
          <TypographyMedium>
            {i18n._(t`Transaction deadline`)}
          </TypographyMedium>

          <QuestionHelper
            text={i18n._(
              t`Your transaction will revert if it is pending for more than this long.`
            )}
          />
        </RowFixed> */}
      {/* <div className="flex items-center">
          <OptionCustom
            style={{ maxWidth: "40px", marginRight: "8px" }}
            tabIndex={-1}
          >
            <Input
              color={deadlineError ? "red" : undefined}
              placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
              value={
                deadlineInput.length > 0
                  ? deadlineInput
                  : deadline === DEFAULT_DEADLINE_FROM_NOW
                  ? ''
                  : (deadline / 60).toString()
              }
              onChange={(e) => parseCustomDeadline(e.target.value)}
              onBlur={() => {
                setDeadlineInput('')
                setDeadlineError(false)
              }}
              style={{
                borderRadius: 0,
              }}
            />
          </OptionCustom>
          <Typography variant="sm">{i18n._(t`minutes`)}</Typography>
        </div>
      </AutoColumn> */}
    </AutoColumn>
  );
}
