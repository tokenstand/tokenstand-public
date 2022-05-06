import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import ItemDetailDraw from "./ItemDetailDraw";

export const DetailBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.border1};
  border-radius: 20px;
  padding: 35px 32px;
  margin-top: 60px;

  .title-detail {
    color: ${({ theme }) => theme.primaryText3};
    font-weight: normal;
    font-size: 17px;
  }

  .row-detail {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media screen and (max-width: 768px) {
    padding: 0px;
    border: none;
    .row-detail {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .title-detail {
      font-size: 14px;
    }

    .line-div {
      border-top: 1px solid ${({ theme }) => theme.border1};
      margin-bottom: 32px;
    }
  }
`;

const DrawDetail = ({ dataDetail }) => {
  const rewardBrackets = [1,2,3,4,5,6,0]

  return (
    <DetailBlock>
      {isMobile && <div className="line-div"></div>}

      <div className="title-detail text-center capitalize">
        Match the winning number in the same order to share prizes. Current
        prizes up for grabs:
      </div>

      <div className="grid gap-5 mt-10 row-detail">
        {rewardBrackets.map((item, index) => (
          <ItemDetailDraw type={item} dataDetail={dataDetail}  key={index}/>
        ))}
      </div>
    </DetailBlock>
  );
};

export default DrawDetail;
