import React, { memo, useRef } from "react";
import { useModalOpen, useToggleModal } from "../../state/application/hooks";

import { ApplicationModal } from "../../state/application/actions";
import Image from "next/image";
import Link from "next/link";
import { StyledMenu } from "../StyledMenu";
import getConfig from "next/config";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useRouter } from "next/router";
import styled from 'styled-components'

const { publicRuntimeConfig } = getConfig();
const { locales } = publicRuntimeConfig;

// Use https://onlineunicodetools.com/convert-unicode-to-image to convert
// Unicode flags (https://emojipedia.org/flags/) to png as Windows does not support Unicode flags
// Use 24px as unicode characters font size
const LANGUAGES: {
  [x: string]: { flag: string; language: string; dialect?: string; shortLang?: string };
} = {
  en: {
    flag: "/images/flags/en-flag.png",
    language: "English",
    shortLang: "EN",
  },
  // ja: {
  //   flag: "/images/flags/ja-flag.png",
  //   language: "Japanese",
  //   shortLang: "JA",
  // },
  // "zh-CN": {
  //   flag: "/images/flags/ch-flag.png",
  //   language: "Chinese",
  //   shortLang: "CN",
  // }
};

function LanguageSwitch() {
  const { locale, pathname } = useRouter();
  const node = useRef<HTMLDivElement>(null);
  const open = useModalOpen(ApplicationModal.LANGUAGE);
  const toggle = useToggleModal(ApplicationModal.LANGUAGE);
  useOnClickOutside(node, open ? toggle : undefined);
  
  return (
    <StyledMenu ref={node}>
      <div
        className="cursor-pointer flex items-center justify-center text-language"
        onClick={toggle}
        title={LANGUAGES[locale].language}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fillRule="evenodd" clipRule="evenodd" d="M9 0.25C4.425 0.25 0.75 3.925 0.75 8.5C0.75 13.075 4.425 16.75 9 16.75C13.575 16.75 17.25 13.075 17.25 8.5C17.25 3.925 13.575 0.25 9 0.25ZM15.675 7.75H12.675C12.525 5.65 11.85 3.7 10.65 1.975C13.35 2.65 15.375 4.975 15.675 7.75ZM11.25 9.25H6.82498C6.97498 11.275 7.72498 13.225 9.07498 14.8C10.275 13.225 11.025 11.275 11.25 9.25ZM6.82498 7.75001C7.04998 5.72501 7.79998 3.77501 8.99998 2.20001C10.275 3.85001 11.025 5.80001 11.175 7.75001H6.82498ZM5.32498 7.75C5.47498 5.65 6.14998 3.7 7.27498 1.975C4.64998 2.65 2.62498 4.975 2.32498 7.75H5.32498ZM2.32498 9.25H5.32498C5.47498 11.35 6.14997 13.3 7.34998 15.025C4.64998 14.35 2.62498 12.025 2.32498 9.25ZM12.75 9.25C12.525 11.35 11.85 13.3 10.725 15.025C13.35 14.35 15.375 12.025 15.75 9.25H12.75Z"/>
        </svg>
        <span>{LANGUAGES[locale]?.shortLang}</span>
      </div>
      {open && (
        <LangList className="min-w-[10rem] max-h-[232px] md:max-h-[unset] absolute flex flex-col z-50 bg-dark-850 shadow-sm rounded sm:top-[3rem] md:overflow-hidden overflow-scroll top-[-5rem]">
          {locales.map((key) => {
            const { flag, language, dialect } = LANGUAGES[key];
            return (
              <Link href={pathname} locale={key} key={key}>
                <a
                  className="cursor-pointer flex items-center px-3 py-1.5 hover:bg-dark-800 hover:text-high-emphesis font-bold"
                  onClick={toggle}
                >
                  <Image
                    className="inline w-3 h-3 mr-1 align-middle"
                    src={flag}
                    width={20}
                    height={20}
                    alt={language}
                  />
                  <span className="ml-4">{language}</span>
                  {dialect && (
                    <sup>
                      <small>{dialect}</small>
                    </sup>
                  )}
                </a>
              </Link>
            );
          })}
        </LangList>
      )}
    </StyledMenu>
  );
}

export default memo(LanguageSwitch);
const LangList = styled.div`
    background: ${({ theme }) => theme.bg1 };
    border: 1px solid ${({ theme }) => theme.border2 };
    box-sizing: border-box;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    color:${({ theme }) => theme.text1 };
`