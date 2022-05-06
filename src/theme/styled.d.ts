import {
  FlattenSimpleInterpolation,
  ThemedCssFunction,
} from "styled-components";

export type Color = string;
export interface Colors {
  // base
  white: Color;
  black: Color;

  // border
  border1: Color;
  border2: Color;
  border3: Color;
  border4: Color;
  borderTable: Color;
  borderCell: Color;

  borderENSNamePopup: Color;

  // text
  text1: Color;
  text2: Color;
  text3: Color;
  text4: Color;
  text5: Color;
  text6: Color;
  text7: Color;
  text8: Color;
  text9: Color;
  text10: Color;
  text11: Color;
  text12: Color;
  // backgrounds / greys
  bg1: Color;
  bg2: Color;
  bg3: Color;
  bg4: Color;
  bg5: Color;
  bg6: Color;
  bg7: Color;
  bgBtn: Color;
  bgENSNamePopup: Color;
  bgNoti: Color;
  bgBtn1: Color;
  borderColor1: Color;
  bgTagsInput: Color;
  bgHoverItemTagsInput: Color;

  modalBG: Color;
  advancedBG: Color;

  //blues
  primary1: Color;
  primary2: Color;
  primary3: Color;
  primary4: Color;
  primary5: Color;

  primaryText1: Color;
  primaryText2: Color;
  primaryText3: Color;

  //title
  title1: Color;

  //label
  label1: Color;

  // rtBg1: Color
  rtBg1: Color;
  rtBorder1: Color;

  // pinks
  secondary1: Color;
  secondary2: Color;
  secondary3: Color;

  // other
  red1: Color;
  red2: Color;
  green1: Color;
  yellow1: Color;
  yellow2: Color;
  horse: Color;
  borderDashColor: Color;
  bgFooter: Color;

  //farm
  colorTextTab: Color;
  colorTabActive: Color;
  borderColor: Color;
  shadowColor: Color;

  farmText: Color;
  tabActive: Color;
  textSubFarm: Color;
  spanFarm: Color;
  textJoin: Color;
  bgrFlex: Color;
  borderFlex: Color;
  titleToken: Color;
  bgrActive: Color;
  textActive: Color;
  textTotal: Color;
  bgrLinear: Color;
  colorDate: Color;
  colorStart: Color;
  greenButton: Color;
  iconDropdown: Color;
  greenLightButton: Color;

  // exchange
  shadowExchange: Color;
  textBold: Color;
  bgSetting: Color;
  bgInput: Color;
  bgSwitch: Color;
  borderSwitch: Color;
  iconSwitch: Color;
  contentTitle: Color;
  smText: Color;

  lblColor: Color;
  bgrToken: Color;

  dropdownIcon: Color;
  connectError: Color;

  //pool
  addText: Color;
  priceAdd: Color;
  subText: Color;
  lblToken: Color;
  iconSvg: Color;
  colorSwitch: Color;

  bgBtn2: Color;
  bgrSwitch: Color;
  titleImport: Color;

  textList: Color;
  bgrList: Color;
  colorLogo: Color;
  bgMenuMobile: Color;
  borderMenu: Color;
  buttonDisable: Color;

  //nft
  bgButtonClose: Color;
  borderNFT: Color;

  // bridge token
  bgCard: Color;
  bgInputPanel: Color;
  bgButton: Color;
  borderCard: Color;
  borderButton: Color;
  boxShadowCard: Color;
  textInput: Color;
  textInputPanel: Color;
  ButtonHistory: Color;
  bgCard1: Color;
  bgPaging: Color;
  borderPaging: Color;
  linkPaging: Color;

  //lottery
  bgLottery: Color;
  bgNumber: Color;
  bgNextDraw: Color;
  textYourTicket: Color;
  bgChart: Color;
  textchart: Color;
  bgHowtoPlay: Color;
  bgItemBlock: Color;
  bgDetail: Color;
  thinText: Color;
  bgTab: Color;
  titleHistory: Color;
  balanceText: Color;
  bgNumberWinning: Color;
  bgQuestion: Color;
  bgCheckNow: Color

  iconMenu: Color

  bgSwap: Color
  bgHeader: Color

  //header
  buttonNetWork: Color
  buttonToggle: Color
  //referral
  bgReferralLink: Color;
  bgReferral: Color;
  bgCardClaim: Color;
  bgHistory: Color;
  bgAboutCard: Color;
  textRef: Color;
  referalCardBg: Color;
  referralInputBg: Color;
  referralTableBg: Color;
  referralTableHeader: Color;
  referralTableBody: Color;
  boxShadow: Color;
  textMyReferral: Color;
  borderItem: Color;
}

export interface Grids {
  sm: number;
  md: number;
  lg: number;
}

declare module "styled-components" {
  export interface DefaultTheme extends Colors {
    grids: Grids;

    // shadows
    shadow1: string;

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>;
      upToSmall: ThemedCssFunction<DefaultTheme>;
      upToMedium: ThemedCssFunction<DefaultTheme>;
      upToLarge: ThemedCssFunction<DefaultTheme>;
    };

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation;
    flexRowNoWrap: FlattenSimpleInterpolation;
  }
}
