import { X } from "react-feather";
import styled from "styled-components";

const IconX = styled(X)`
  cursor: pointer;
  stroke: ${({ theme }) => theme.text6};
`;

const CloseIcon = ({ onClick }) => {
  const handleUnsetBody = () => {
    onClick();
    document.body.style.overflow = "unset";
  };
  return <IconX onClick={handleUnsetBody} />;
};

export default CloseIcon;
