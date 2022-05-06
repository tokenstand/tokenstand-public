import "@reach/dialog/styles.css";

import { DialogContent, DialogOverlay } from "@reach/dialog";
import { animated, useSpring, useTransition } from "react-spring";
import styled, { css } from "styled-components";

import React,{useRef} from "react";
import { isMobile } from "react-device-detect";
import { transparentize } from "polished";
import { useGesture } from "react-use-gesture";
import { theme } from "../../theme";

const AnimatedDialogOverlay = animated(DialogOverlay);

const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 99999;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    // width : 100%;
   background-color: rgba(0, 0, 0, 0.425);
   background: ${({ nftLength }) => nftLength > 3 ? 'hsl(0deg 0% 0% / 6%)' : 'hsla(0, 0%, 0%, 0.5)'};
  }
`;
const StyledBackGroundColor = styled.div`
    background-color : ${({ theme }) => theme.bg2};
    padding: ${({ isModalNFTJackpot }) => isModalNFTJackpot ? '15px 30px' : '30px'};
    max-height:${({ isModalNFTJackpot }) => isModalNFTJackpot ? '90vh' : '83vh'};
    height: 100%;

    @media screen and (max-width: 640px) {
      padding: 20px;
    }
`

const AnimatedDialogContent = animated(DialogContent);
// destructure to not pass custom props to Dialog DOM element

const StyledDialogContent = styled(
  ({ height, width, minHeight, maxHeyight, maxWidth, mobile, isOpen, ...rest }) => (
    <AnimatedDialogContent {...rest} />
  )
).attrs({
  "aria-label": "dialog",
})`
  overflow-y: ${({ mobile }) => (mobile ? "scroll" : "hidden")};
  &[data-reach-dialog-content] {
    display: flex;
    // align-self: ${({ mobile }) => (mobile ? "flex-end" : "center")};
    margin: 4rem 0.5rem;
    padding: 0;
    background-color: transparent;
    box-shadow: 0 4px 8px 0 ${() => transparentize(0.95, "#000")};
    // width: 100vw;
    border-radius: 20px;
    overflow-y: ${({ mobile }) => (mobile ? "scroll" : "hidden")};
    overflow-x: hidden;
    // width : 100%;
    ${({ maxWidth }) =>
    maxWidth &&
    css`
        max-width: ${maxWidth}px;
      `}

    ${({ maxHeight }) =>
    maxHeight &&
    css`
        max-height: ${maxHeight}vh;
      `}

    ${({ minHeight }) =>
    minHeight &&
    css`
        min-height: ${minHeight}vh;
      `}

    ${({ width }) =>
    width &&
    css`
        width: ${width};
      `} 
      
    @media (min-width: 640px) {
      width: 65vw;
      margin: 0;
    }

    @media (max-width: 630px){
      min-width: 343px;
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  minHeight?: number | false;
  maxHeight?: number;
  initialFocusRef?: React.RefObject<any>;
  children?: React.ReactNode;
  padding?: number;
  maxWidth?: number;
  className?: string;
  width?: string;
  isModalNFTJackpot?: boolean
  nftLength?: any
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  // maxHeight = 90,
  maxHeight = 350,
  initialFocusRef,
  children,
  padding = 5,
  // maxWidth = 420,
  maxWidth = 523,
  width,
  isModalNFTJackpot,
  nftLength
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 5 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // const [{ y }, set] = useSpring(() => ({
  //   y: 0,
  //   config: { mass: 1, tension: 210, friction: 20 },
  // }));
  // const bind = useGesture({
  //   onDrag: (state) => {
  //     set({
  //       y: state.down ? state.movement[1] : 0,
  //     });
  //     if (
  //       state.movement[1] > 300 ||
  //       (state.velocity > 3 && state.direction[1] > 0)
  //     ) {
  //       onDismiss();
  //     }
  //   },
  // });
  const buttonRef = useRef()
  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay
              key={key}
              style={props}
              onDismiss={onDismiss}
              initialFocusRef={buttonRef}
              nftLength={nftLength}
            >
              <StyledDialogContent

                // {...(isMobile
                //   ? {
                //     ...bind(),
                //     style: {
                //       transform: y?.interpolate(
                //         (y) => `translateY(${y > 0 ? y : 0}px)`
                //       ),
                //     },
                //   }
                //   : {})}
                
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                mobile={isMobile}
                width={width}
              > 
                {/* button for set autofocus */}
                {/* -------------------------------- */}
                <button ref={buttonRef}></button>
                {/* -------------------------------- */}
                <div className="w-full p-0 rounded">
                
                  <StyledBackGroundColor
                    className={`flex flex-col w-full rounded overflow-y-auto`}
                    isModalNFTJackpot={isModalNFTJackpot}
                  >
                    {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                    {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                    {children}
                  </StyledBackGroundColor>
                </div>
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  );
}