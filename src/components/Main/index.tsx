import styled from "styled-components";
import { isMobile } from "react-device-detect";

const StyleMain = styled.main`
  padding-top: ${(props) => (props.path !== "/referral" &&  props.path !== "/lottery")&& (props.isMobile ? '120px' : '160px')};
  min-height: 100vh;
  // padding-top: ${ props => props.isMobile ? '226px' : '210px'};
`;

const Main = ({ path, children }) => (
  <StyleMain
    className={`flex flex-col items-center justify-start flex-grow w-full h-full ${
      (path !== "/referral" && path !== "/lottery" )&& "container"
    }`}
    style={{ height: "max-content" }}
    isMobile={isMobile}
    path={path}
  >
    {children}
  </StyleMain>
);

export default Main;