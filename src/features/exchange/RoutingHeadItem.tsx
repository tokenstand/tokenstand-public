import React from "react";
import Image from "next/image";
import styled from "styled-components";
import CurrencyLogo from "../../components/CurrencyLogo";
interface RoutingHeadProps {
  data: any;
  from: string;
}
const StyleLogo = styled.div`
  img {
    border-radius: 50%;
  }
  svg {
    @media (max-width: 767px) {
      width: 24px;
    }
  }
`;
export const renderImages = ( name, nameOrigin, currency, width?: number, height?: number) => {
  try {
    require(`../../../public/images/tokens/${name}.jpg`);
    return <Image className="rounded-full" width={width ? width : 24} height={height ? height : 24} src={`/images/tokens/${name}.jpg`} />;
  } catch (err) {
    if(currency?.symbol === nameOrigin){
      return <StyleLogo className="flex items-center"><CurrencyLogo currency={currency} size={height ? height : 24} /></StyleLogo>
    }
    else 
    return <Image className="rounded-full" width={width ? width : 24} height={height ? height : 24} src={`/images/tokens/error-images.svg`} />;
  }
}
export default function RoutingHeadItem({ data, from }: RoutingHeadProps) {
  
  return (
    <div className="flex-item">
      <span className="icon-right">
        {from !== '100' && <b>{Number(from ? from : 0)}%</b>}
        <svg width="8" height="14" viewBox="0 0 8 14">
          <path d="M1 12.3333L6.33333 6.99998L1 1.66665" stroke="#001C4E" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {
        data?.map(it => (
          <>
            <div className="flex-1 item">
              <div className="title">
                <span className="icon">
                  {/* <Image
                    src={`/images/tokens/${it.id}.jpg`}
                    alt="Sushi"
                    width="24px"
                    height="24px"
                  /> */}
                  {
                    renderImages(it.id, it.name, it?.token)
                  }
                </span> {it.name}
              </div>
              {
                it?.content?.map((item, key) => (
                  <div key={key} className="content">{item.name} {item.value}%</div>
                ))
              }
            </div>
            <span className="icon-right">
              <svg width="8" height="14" viewBox="0 0 8 14">
                <path d="M1 12.3333L6.33333 6.99998L1 1.66665" stroke="#001C4E" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </>
        ))
      }
    </div>
  )
}