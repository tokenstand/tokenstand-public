import styled from "styled-components";

const ButtonText = styled.button`
  outline: none;
  border: none;
  font-size: inherit;
  padding: 0;
  margin: 0;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryText3};
  font-family: "SF UI Display";
  @media (min-width: 640px){
    margin-right: 10px;
  }
  :hover {
    opacity: 0.7;
  }

  :focus {
    text-decoration: underline;
  }
`;

export default ButtonText;
