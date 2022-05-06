import { Trash } from "react-feather";
import styled from "styled-components";

export const TrashIcon = styled(Trash)`
  height: 15.62px;
  width: 15px;
  margin-left: 10px;
  stroke: currentColor;

  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;
  color: #EC5656;

  :hover {
    opacity: 0.7;
  }
  
`;

export default TrashIcon;
