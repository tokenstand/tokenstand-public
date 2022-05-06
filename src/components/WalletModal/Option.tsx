import Image from "next/image";
import React from "react";
import styled from "styled-components";

const SubHeader = styled.div`
  color: ${({ theme }) => theme.text1};
  margin-top: 10px;
  font-size: 12px;
`;
const OptionBox = styled.div`
  font-family: SF UI Display;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 126.5%;
  /* identical to box height, or 23px */
  color:${({ theme }) => theme.text1 };
  letter-spacing: 0.015em;
  text-transform: capitalize;
  
  border:1px solid ${({ theme }) => theme.border3 };
  box-sizing: border-box;
  border-radius: 10px;
  background : ${({ theme }) => theme.bg2 };
  &:hover{
    background :${({ theme }) => theme.bg3 };
  }
  &.active-content{
      border: 1px solid #72BF65;

      &:hover{
        background :transparent;
      }    
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
  `};
`;

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  icon: string;
  active?: boolean;
  id: string;
}) {
  const content = (
    <OptionBox
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3 rounded cursor-pointer ${
        !active ? "bg-dark-800 hover:bg-dark-700" : "active-content"
      }`}
    >
      <div>
        <div className="flex items-center">
          {active && (
            <div
              className="w-4 h-4 mr-4 rounded-full"
              style={{ background: "#72BF65" }}
            />
          )}
          {header}
        </div>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </div>
      <Image src={icon} alt={"Icon"} width="32px" height="32px" />
    </OptionBox>
  );
  if (link) {
    return <a href={link}>{content}</a>;
  }

  return content;
}
