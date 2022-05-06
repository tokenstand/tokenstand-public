import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";

const StyledIdenticonContainer = styled.div`
border-radius: 50%;
// background-color: ${({ theme }) => theme.bg4};
 div {
  margin-top: auto !important;
  margin-bottom: auto !important;
  display: block !important;
 }
`;

export default function Identicon({size = 30, classNames = ""}) {
  const ref = useRef<HTMLDivElement>();

  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account && ref.current) {
      import("jazzicon")
      .then((Jazzicon) => {
        ref.current && (ref.current.innerHTML = "");
        let elm = Jazzicon.default(size, parseInt(account.slice(2, 10), 16))
        ref.current && ref.current.appendChild(elm);
      })
    }
  }, [account, size]);

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <StyledIdenticonContainer className={classNames} ref={ref as any} />;
}
