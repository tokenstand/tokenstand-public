import React, { FC, useCallback, useState,useEffect } from "react";

import { QuestionMarkCircleIcon as OutlineQuestionMarkCircleIcon } from "@heroicons/react/outline";
import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from "@heroicons/react/solid";
import Tooltip from "../Tooltip";
import styled from "styled-components";
import NewTooltip from "../../components/NewTooltip";
import ReactTooltip from "react-tooltip";



const LightQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;
const StyledReactTooltip = styled(ReactTooltip)`
background: #5C6A86 !important;
font-family: SF UI Display;
font-style: normal;
font-weight: 600 !important;
word-wrap: break-word;      /* IE 5.5-7 */
white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
white-space: pre-wrap;      /* current browsers */
line-height: 126.5%;
@media screen and (max-width:768px){
    max-width:250px !important;
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

const IconQuestion = styled.div`
svg path{
  fill: ${({ theme }) => theme.contentTitle};
}
`

const QuestionHelper: FC<{ text: any }> = ({ children, text }) => {
  const [show, setShow] = useState<boolean>(false);

  const crypto = require("crypto");

  const htmlId = crypto.randomBytes(16).toString("hex");
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (children) {
    return (
      <div
        className="flex items-center justify-center outline-none"
        onClick={open}
        onMouseEnter={open}
        onMouseLeave={close}
        data-tip={text}
        data-for={htmlId}
        data-iscapture="true"
      >
        {children}
        <StyledReactTooltip id={htmlId}></StyledReactTooltip>
      </div>
    );
  }

  return (
    <span className="ml-1">
      <IconQuestion
        className="flex items-center justify-center outline-none  hover:text-primary"
        onClick={open}
        onMouseEnter={open}
        onMouseLeave={close}
        data-tip={text}
        data-for={htmlId}
        data-iscapture="true"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 0C6.78793 -1.17411e-08 7.56815 0.155195 8.2961 0.456723C9.02405 0.758251 9.68549 1.20021 10.2426 1.75736C10.7998 2.31451 11.2417 2.97595 11.5433 3.7039C11.8448 4.43185 12 5.21207 12 6C12 6.78793 11.8448 7.56815 11.5433 8.2961C11.2417 9.02405 10.7998 9.68549 10.2426 10.2426C9.68549 10.7998 9.02405 11.2417 8.2961 11.5433C7.56815 11.8448 6.78793 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 2.37122e-08 6 0ZM6 1C4.67392 1 3.40215 1.52678 2.46447 2.46447C1.52678 3.40215 1 4.67392 1 6C1 7.32608 1.52678 8.59785 2.46447 9.53553C3.40215 10.4732 4.67392 11 6 11C7.32608 11 8.59785 10.4732 9.53553 9.53553C10.4732 8.59785 11 7.32608 11 6C11 4.67392 10.4732 3.40215 9.53553 2.46447C8.59785 1.52678 7.32608 1 6 1ZM6 8.5C6.19891 8.5 6.38968 8.57902 6.53033 8.71967C6.67098 8.86032 6.75 9.05109 6.75 9.25C6.75 9.44891 6.67098 9.63968 6.53033 9.78033C6.38968 9.92098 6.19891 10 6 10C5.80109 10 5.61032 9.92098 5.46967 9.78033C5.32902 9.63968 5.25 9.44891 5.25 9.25C5.25 9.05109 5.32902 8.86032 5.46967 8.71967C5.61032 8.57902 5.80109 8.5 6 8.5ZM6 2.5C6.53043 2.5 7.03914 2.71071 7.41421 3.08579C7.78929 3.46086 8 3.96957 8 4.5C8 5.23 7.788 5.64 7.246 6.208L6.982 6.478C6.605 6.87 6.5 7.082 6.5 7.5C6.5 7.63261 6.44732 7.75979 6.35355 7.85355C6.25979 7.94732 6.13261 8 6 8C5.86739 8 5.74021 7.94732 5.64645 7.85355C5.55268 7.75979 5.5 7.63261 5.5 7.5C5.5 6.77 5.712 6.36 6.254 5.792L6.518 5.522C6.895 5.13 7 4.918 7 4.5C7 4.23478 6.89464 3.98043 6.70711 3.79289C6.51957 3.60536 6.26522 3.5 6 3.5C5.73478 3.5 5.48043 3.60536 5.29289 3.79289C5.10536 3.98043 5 4.23478 5 4.5C5 4.63261 4.94732 4.75979 4.85355 4.85355C4.75979 4.94732 4.63261 5 4.5 5C4.36739 5 4.24021 4.94732 4.14645 4.85355C4.05268 4.75979 4 4.63261 4 4.5C4 3.96957 4.21071 3.46086 4.58579 3.08579C4.96086 2.71071 5.46957 2.5 6 2.5Z"
            fill="#001C4E"
            fillOpacity="0.6"
          />
        </svg>
        <StyledReactTooltip id={htmlId}></StyledReactTooltip>
      </IconQuestion>
    </span>
  );
};

export const LightQuestionHelper: FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span className="ml-1">
      <Tooltip text={text} show={show}>
        <LightQuestionWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <OutlineQuestionMarkCircleIcon>?</OutlineQuestionMarkCircleIcon>
        </LightQuestionWrapper>
      </Tooltip>
    </span>
  );
};

export default QuestionHelper;
