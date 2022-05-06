import styled from "styled-components";

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 16px;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
  background-image: url('/settings.svg');
  background-size: 100%;
  background-repeat: no-repeat;
`;

export const StyledMenu = styled.div`
  // margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  >.text-language{
    margin: 0 15px;
    font-weight: 500;
    font-size: 17px;
    color: ${({theme}) => theme.text1};
    svg path{
      fill: ${({theme}) => theme.text1};
    }
    span{
      margin-left: 8px;
    }
  }
  @media(max-width: 767px){
    >.text-language{
      margin: 0 5px;
    }
  }
`;

export const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: #161522;
  border-radius: 10px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`;
