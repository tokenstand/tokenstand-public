import { transparentize } from "polished";
import React, { useMemo } from "react";

import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme,
} from "styled-components";
import { useIsDarkMode } from "../state/user/hooks";
import { Colors } from "./styled";
import { isMobile } from "react-device-detect";

export * from "./components";

export const MEDIA_WIDTHS = {
  upToTheSmallest: 360,
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

const white = "#FFFFFF";
const black = "#000000";

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // border
    border1: darkMode
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(72, 110, 177, 0.15)",
    border2: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 28, 78, 0.15)",
    border3: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 28, 78, 0.1)",
    border4: darkMode ? "rgba(255, 255, 255, 0.15)" : "#DDE4F2",
    borderTable: darkMode ? "#FFFFFF" : "#E4E9F4",
    borderCell: darkMode ? "rgba(255, 255, 255, 0.15)" : "#E4E9F4",

    borderENSNamePopup: darkMode
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 28, 78, 0.15)",

    // text
    text1: darkMode ? "#FFFFFF" : "#001C4E", // No Edit
    text2: darkMode ? "#C3C5CB" : "#565A69",
    text3: darkMode ? "#6C7284" : "#888D9B",
    text4: darkMode ? "#565A69" : "#C3C5CB",
    text5: darkMode ? "#2C2F36" : "#EDEEF2",
    text6: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.38)",
    text7: darkMode ? "rgba(255, 255, 255, 0.78)" : "rgba(0, 28, 78, 0.78)",
    text8: "rgba(255, 255, 255, 0.6)",
    text9: "#72BF65",
    text10: darkMode ? "#FFFFFF" : "rgba(0, 28, 78, 0.78)",
    text11: darkMode ? "rgba(255, 255, 255, 0.6)" : " rgba(0, 28, 78, 0.6)",
    text12: darkMode ? " rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.78)",

    // backgrounds / greys
    bg1: darkMode ? "#0E1219" : "#FFFFFF", // No Edit
    bg2: darkMode ? "#181A1F" : "#FFFFFF", // No Edit
    bg3: darkMode ? "#2F3035" : "#F0F2F5", // No Edit

    bg4: darkMode ? "#565A69" : "#CED0D9",
    bg5: darkMode ? "#565A69" : "#888D9B",
    bg6: darkMode ? "#202326" : "#DBE2EF",

    bg7: darkMode ? "rgba(114, 191, 101, 0.15)" : "rgba(114, 191, 101, 0.15)",

    bgENSNamePopup: darkMode ? "#0E1013" : "#F5F9FF",
    bgTagsInput: darkMode ? "#0E1219" : "#f5f5f5",
    bgHoverItemTagsInput: darkMode ? "#181A1F" : "#f8f8f8",

    bgBtn: darkMode ? "#24262A" : "#EDF1F8",
    bgNoti: darkMode ? "#0E1013" : "#EDF1F8",
    bgBtn1: darkMode ? "#272F3B" : "rgba(31, 55, 100, 0.5)",
    bgBtn2: darkMode ? "#272F3B" : "rgba(31, 55, 100, 0.5)",
    borderColor1: darkMode
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(72, 110, 177, 0.15)",

    //specialty colors
    modalBG: darkMode ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.6)",
    advancedBG: darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.6)",

    //primary colors
    primary1: darkMode ? "#72BF65" : "#72BF65", // No Edit
    primary2: darkMode ? "#3680E7" : "#3680E7", // No Edit
    primary3: darkMode ? "#4D8FEA" : "#4D8FEA",
    primary4: darkMode ? "#376bad70" : "#376bad70",
    primary5: darkMode ? "#153d6f70" : "#e7e7e7",

    // color text
    primaryText1: darkMode ? "#6da8ff" : "#474747",
    primaryText2: darkMode
      ? "rgba(255, 255, 255, 0.87)"
      : "rgba(0, 28, 78, 0.87)",
    primaryText3: darkMode
      ? "rgba(255, 255, 255, 0.6)"
      : "rgba(0, 28, 78, 0.6)",

    // secondary colors
    secondary1: darkMode ? "#5773E7" : "#5773E7", // No Edit
    secondary2: darkMode ? "#17000b26" : "#F6DDE8",
    secondary3: darkMode ? "#17000b26" : "#FDEAF1",

    //title
    title1: darkMode ? "rgba(255, 255, 255, 0.87)" : "#001C4E",

    //label
    label1: darkMode ? "rgba(255, 255, 255, 0.38)" : "#93A0B8",

    // other
    red1: "#EC5656",
    red2: "#F82D3A",
    green1: "#27AE60",
    yellow1: "#FFBA33",
    yellow2: "#F3841E",
    horse: darkMode ? "#ffffff" : "#3A619D",
    iconDropdown: darkMode ? "rgba(255, 255, 255, 0.6)" : "#667795",
    borderDashColor: darkMode
      ? "rgba(255, 255, 255, 0.38)"
      : "rgba(102, 119, 149, 0.38)",
    bgFooter: darkMode ? "rgba(24, 26, 31, 0.38)" : "rgba(255, 255, 255, 0.6)",

    //page exchange Routing
    rtBg1: darkMode ? "#1E2026" : "#F6FAFF",
    rtBorder1: darkMode
      ? "linear-gradient(180deg,rgba(39,58,85,0),#273a55 50.65%,rgba(39,58,85,0))"
      : "linear-gradient(180deg,rgba(199,211,228,0),#c7d3e4 50.65%,rgba(199,211,228,0))",

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
    //farm
    colorTextTab: "rgba(0, 28, 78, 0.6)",
    colorTabActive: "rgba(0, 28, 78, 0.87)",
    spanFarm: "#0074DF",
    borderFlex: "rgba(72, 110, 177, 0.15)",
    borderColor: "rgba(72, 110, 177, 0.15)",
    shadowColor: "rgba(0, 28, 78, 0.05)",
    textActive: "#0074DF",
    greenButton: "#72BF65",
    greenLightButton: "rgba(114, 191, 101, 0.15)",
    bgrLinear: darkMode
      ? "linear-gradient(89.89deg, #243329 0.15%, #1E2539 99.97%)"
      : "linear-gradient(89.89deg, #EAF5E9 0.15%, #EBEFFE 99.97%) ",

    farmText: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.6) ",
    tabActive: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.87)",
    textSubFarm: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.6)",
    textJoin: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.87) ",
    bgrFlex: darkMode ? "rgb(24, 26, 31, 0.6)" : "rgba(255, 255, 255, 0.6)",
    titleToken: darkMode
      ? "rgba(255, 255, 255, 0.87)"
      : "rgba(0, 28, 78, 0.87)",
    bgrActive: darkMode ? "rgba(0, 116, 223, 0.2) " : "rgba(0, 116, 223, 0.1)",
    textTotal: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.87)",
    colorDate: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.6)  ",
    colorStart: darkMode
      ? "rgba(255, 255, 255, 0.87)"
      : "rgba(0, 28, 78, 0.87)",

    //exchange
    shadowExchange: darkMode ? "" : "0px 4px 30px rgba(0, 28, 78, 0.05)",
    textBold: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.87)",
    bgSetting: darkMode ? "#0E1013" : "#FAFCFF",
    bgInput: darkMode ? "#0E1013" : "#EDF1F8",
    bgSwitch: darkMode ? "#0E1013" : "#FFFFFF",
    borderSwitch: darkMode
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 28, 78, 0.15)",
    iconSwitch: darkMode ? "#FFFFFF" : "#667795",
    contentTitle: darkMode
      ? "rgba(255, 255, 255, 0.6)"
      : "rgba(0, 28, 78, 0.6)",
    smText: darkMode ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 28, 78, 0.38)",
    lblColor: darkMode ? "rgba(255, 255, 255, 0.6) " : "rgba(0, 28, 78, 0.6)",
    bgrToken: darkMode ? "rgba(14, 16, 19, 0.5) " : "rgba(237, 241, 248, 0.5)",
    iconSvg: darkMode ? "#FFFFFF" : "#5F7192",
    dropdownIcon: darkMode ? "rgba(255, 255, 255, 0.6)" : "#667795",
    connectError: darkMode ? "#ffffff" : "rgba(0, 0, 0, 0.85)",

    //pool
    addText: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.6)",
    priceAdd: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.87)",
    subText: darkMode ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 28, 78, 0.38)",
    lblToken: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.6)",

    colorSwitch: darkMode ? "#FFFFFF" : "#667795",
    bgrSwitch: darkMode ? "#46484C" : "rgba(224,228,234)",

    titleImport: darkMode
      ? "rgba(255, 255, 255, 0.87)"
      : "rgba(0, 28, 78, 0.87)",
    textList: darkMode ? "#FFFFFF" : "#213965",
    bgrList: darkMode ? "#0E1013" : "#EDF1F8",
    colorLogo: darkMode ? "#FFFFFF" : "#001C4E",
    bgMenuMobile: darkMode
      ? "linear-gradient(89.89deg, #243329 0.15%, #1E2539 99.97%)"
      : "linear-gradient(89.89deg, #EAF5E9 0.15%, #EBEFFE 99.97%)",
    borderMenu: darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.68)",
    buttonDisable: darkMode ? "#272F3B" : "rgba(31, 55, 100, 0.5)",

    //nft
    bgButtonClose: darkMode
      ? "rgba(236, 86, 86, 0.2)"
      : "rgba(236, 86, 86, 0.2)",
    borderNFT: darkMode ? "rgba(255, 255, 255, 0.15)" : "#D9DDE5",

    // bridge token
    bgCard: darkMode ? "rgba(24, 26, 31, 0.698)" : "#FFFFFF",
    bgInputPanel: darkMode ? "#0B0B0D" : "#EDF1F8",
    bgButton: darkMode ? "rgba(255, 255, 255, 0.05)" : "#DDE4F2",
    borderCard: darkMode
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(72, 110, 177, 0.15)",
    borderButton: darkMode ? "rgba(255, 255, 255, 0.15)" : "#BFCCE5",
    boxShadowCard: darkMode
      ? "rgba(73, 70, 70, 0.05)"
      : "rgba(0, 28, 78, 0.05)",
    textInput: darkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 28, 78, 0.6)",
    textInputPanel: darkMode
      ? "rgba(255, 255, 255, 0.38)"
      : "rgba(0, 28, 78, 0.6)",
    ButtonHistory: darkMode ? "#0B0B0D" : "#DDE4F2",
    bgCard1: darkMode ? "rgba(24, 26, 31, 0.698)" : "rgba(255, 255, 255, 0.4)",
    bgPaging: darkMode ? "#000000 " : "#FFFFFF",
    borderPaging: "#d9d9d9",
    linkPaging: darkMode ? "rgba(255, 255, 225, 0.7)" : "rgba(0, 0, 0, 0.85)",
    iconMenu: darkMode ? "#FFFFFF" : "rgba(0, 28, 78, 0.6)",

    bgSwap: darkMode ? "rgba(24, 26, 31, 0.8)" : "rgba(255, 255, 255, 0.9)",
    bgHeader: darkMode ? "#121419" : "#D6E2F7",

    //lottery
    bgLottery: darkMode
      ? "linear-gradient(199.53deg, rgba(3, 8, 10, 0.8) 14.37%, rgba(20, 40, 39, 0.8) 117.08%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 251, 255, 0.4) 100%)",
    bgNumber: darkMode ? "#323d3e" : "#EDF1F8",
    bgNextDraw: darkMode
      ? "rgba(24, 26, 31, 0.87)"
      : "rgba(255, 255, 255, 0.65)",
    textYourTicket: darkMode ? "#FFFFFF" : "#72BF65",

    bgChart: darkMode ? "rgba(24, 26, 31, 0.87)" : "rgba(255, 255, 255, 0.5)",
    textchart: darkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 28, 78, 0.87)",
    bgHowtoPlay: darkMode
      ? "rgba(3, 8, 10, 0.6)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 251, 255, 0.6) 100%)",

    bgItemBlock: darkMode
      ? "linear-gradient(180deg, rgba(18, 30, 24, 0.8) 0%, rgba(18, 30, 24, 0.4) 100%)"
      : "#EDF1F8",
    bgQuestion: darkMode
      ? "rgba(24, 26, 31, 0.87)"
      : "rgba(255, 255, 255, 0.6)",
    bgCheckNow: darkMode ? "rgba(3, 8, 10, 0.6)" : "rgba(255, 255, 255, 0.6)",
    bgDetail: darkMode ? "rgba(255, 255, 255, 0.05)" : "#EDF1F8",
    thinText: darkMode ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 28, 78, 0.6)",
    bgTab: darkMode ? "#2f3136" : "#EDF1F8",
    titleHistory: darkMode
      ? " rgba(255, 255, 255, 0.38)"
      : "rgba(0, 28, 78, 0.6)",
    balanceText: darkMode
      ? "rgba(255, 255, 255, 0.38)"
      : "rgba(0, 28, 78, 0.87)",
    bgNumberWinning: darkMode ? "#0E1013" : "rgba(114, 191, 101, 0.1)",
    
    //header 
    buttonNetWork: darkMode ? '#0D1422' : 'rgb(201,215,246)',
    buttonToggle: darkMode ? '#101B14' : '#D6E7EB',

    //referral
    bgReferralLink: darkMode ? "#101812" : "#FFFFFF",
    bgReferral: darkMode
      ? "linear-gradient(199.53deg, rgba(3, 8, 10, 0.8) 14.37%, rgba(20, 40, 39, 0.8) 117.08%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 251, 255, 0.6) 100%)",
    bgCardClaim: darkMode ? "#111111" : "#FFFFFF",
    bgHistory: darkMode ? "rgba(255, 255, 255, 0.08)" : "#EDF1F8",
    bgAboutCard: darkMode
      ? "rgba(17, 17, 17, 0.87)"
      : "rgba(255, 255, 255, 0.7)",
    textRef: darkMode ? "#FFFFFF" : "#001C4E",
    referalCardBg: darkMode
      ? "rgba(24, 26, 31, 0.87)"
      : "rgba(255, 255, 255, 0.8)",
    referralInputBg: darkMode ? "#181a1f" : "#fff",
    referralTableBg: darkMode
      ? "rgba(24, 26, 31, 0.7)"
      : "rgba(255, 255, 255, 0.7)",
    referralTableHeader: darkMode
      ? "rgba(255, 255, 255, 0.38)"
      : "rgba(0, 28, 78, 0.6)",
    referralTableBody: darkMode
      ? "rgba(255, 255, 255, 0.6)"
      : "rgba(0, 28, 78, 0.87)",
    boxShadow: darkMode ?'rgba(255, 255, 255, 0.15)' : 'rgba(72, 110, 177, 0.15)',
    textMyReferral: darkMode ? '#FFFFFF' : '#72BF65',
    borderItem : darkMode ? "rgba(255, 255, 255, 0.1)" : "#DDE4F2",
  };
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? "#000" : "#2F80ED",

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useIsDarkMode();

  const themeObject = useMemo(() => theme(darkMode), [darkMode]);

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

export const ThemedGlobalStyle = createGlobalStyle`
  body{
    background: ${({ theme }) => theme.bg1};
    &::-webkit-scrollbar {
      width: 6.6px;
      height: 6.6px;
      background-color: ${({ theme }) => theme.bg3};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: ${({ theme }) => theme.bg4};
    }
  }
  .loading-dots-three {
    font-size: 20px;
    line-height: 20px;
  }
  
  .loading-dots-three span {
    font-size: 30px;
    line-height: 9px;
    animation-name: blink;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
  }
  
  .loading-dots-three span:nth-child(2) {
    animation-delay: .2s;
  }
  
  .loading-dots-three span:nth-child(3) {
    animation-delay: .4s;
  }
  @keyframes blink {
    0% {
      opacity: .2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: .2;
    }
  }
  .ant-tooltip-inner {
    color: #fff;
    background-color: rgb(34, 61, 94);
    box-shadow: none;
    font-weight: 500;
    border-radius: 10px;
  }
  .ant-tooltip-arrow-content{
    background-color: rgb(34, 61, 94);
  }
  .btn-primary {
    background: ${({ theme }) => theme.primary1};
    border-color: ${({ theme }) => theme.primary1};
    color: #fff;
  }
  .btn-primary2 {
    background: rgba(114, 191, 101, 0.1);
    border-color: rgba(114, 191, 101, 0.1);
    color: ${({ theme }) => theme.primary1};
    border-radius: 30px;
    box-shadow: none;
    font-weight: 500;
  }
  .btn-secondary {
    background: ${({ theme }) => theme.buttonNetWork};
    border-color: rgba(87, 115, 231, 0.1);
    color: ${({ theme }) => theme.secondary1};
    border-radius: 30px;
    font-weight: 500;
  }
  .btn-primary3 {
    background: ${({ theme }) => theme.buttonToggle};
    border-color: rgba(114, 191, 101, 0.1);
    color: ${({ theme }) => theme.primary1};
    border-radius: 30px;
    box-shadow: none;
    font-weight: 500;
  }
  .btn-red2{
    background: rgba(236, 86, 86, 0.1);
    border-color: rgba(236, 86, 86, 0.1);
    color: ${({ theme }) => theme.red1}; 
    border-radius: 30px;
    box-shadow: none;
    font-weight: 500;
  }
  .btn-notActive{
    background: ${({ theme }) => theme.bgrSwitch};
    border-color:  ${({ theme }) => theme.bgrSwitch};
    color: ${({ theme }) => theme.colorSwitch};
    border-radius: 30px;
    box-shadow: none;
    font-weight: 500;
  }
  .btn-switch{
    background: ${({ theme }) => theme.colorSwitch};
    border-color: ${({ theme }) => theme.colorSwitch};
    color: #fff;
  }

  .radius-50{
    border-radius: 50%;
  }
  .toggle-svg-none svg{
    display: none;
  }
  .text-color{
    color: ${({ theme }) => theme.text1};
    font-weight: 500;
    margin-left: 5px;
  }
  .container{
    padding-left: ${isMobile ? "15px" : "5rem"};
    padding-right: ${isMobile ? "15px" : "5rem"};
    margin-left: auto;
    margin-right: auto;
  }
  .icon-color-theme{
    svg path{
      fill: rgba(0,0,0,0);
      stroke: ${({ theme }) => theme.text1};
    }
  }
  .text-general-popup {
    font-family: "SF UI Display";
    font-style: "normal";
    color : ${({ theme }) => theme.text1};
    opacity : 0.87;
    //display: flex;
    align-items: center;
    letter-spacing: 0.015em;
    text-transform: capitalize;
  } 
  .ant-select-item-option-content{
    .wrap-item-flex{
      display: flex;
    }
    .images{
      margin-right: 8px;
    }
    .text{
      h3, p{
        margin: 0;
        font-size: 12px;
      }
      p{
        color: ${({ theme }) => theme.text6};
      }
      h3{
        color: ${({ theme }) => theme.text1};
      }
    }
  }
  .pool-dropdown-content{
    padding: 0 !important;
    position: relative !important;
    top: 227px !important;
    @media (min-width: 767px){
    top: 274px !important;
   // top: 330px !important;
    }
    @media (max-width: 640px){
     // top: 245px !important;
     top: 230px !important;
    }
    .ant-select-item{
      background: ${({ theme }) => theme.bg1};
      &:hover{
        background: ${({ theme }) => theme.bgHoverItemTagsInput};
      }
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state{
      color: #72BF65;
    }
    .ant-select-item-empty{
      background: ${({ theme }) => theme.bg1};
      color: ${({ theme }) => theme.primaryText2};
      &:hover{
        background: ${({ theme }) => theme.bgHoverItemTagsInput};
      }
      > div{
        color: ${({ theme }) => theme.primaryText2};
      }
    }
    .rc-virtual-list-holder-inner, .rc-virtual-list-holder{
      position: static !important;
    }
  }
  .menu-dropdown {
    background-color: ${({ theme }) => theme.bg2};
    width: fit-content;
    float: right;

    .ant-dropdown-menu-title-content {
      color: ${({ theme }) => theme.primaryText2};
    }

    .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover {
      background: none;
    }
  }
  .style-scroll-bar{
    padding-bottom: 10px;
    &::-webkit-scrollbar {
      width: 6.6px;
      height: 6.6px;
      background-color: ${({ theme }) => theme.bg3};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: ${({ theme }) => theme.bg4};
    }
  }
`;
