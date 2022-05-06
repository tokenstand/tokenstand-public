import React from "react";
import { isMobile } from "react-device-detect";
import { DetailBlock } from "../NextDraw/DetailDraw";
import RoundItemDtail from "./RoundItemDtail";

const RoundDetail = ({ dataHistory, priceSTAND }) => {
  const rewardBrackets = [1, 2, 3, 4, 5, 6, 0];

  return (
    <DetailBlock>
      {isMobile && <div className="line-div"></div>}

      <div className="title-detail text-center capitalize">
        Match the winning number in the same order to share prizes. Current
        prizes up for grabs:
      </div>

      <div className="grid gap-5 mt-10 row-detail">
        {rewardBrackets.map((item, index) => (
          <RoundItemDtail
            type={item}
            dataDetail={dataHistory}
            key={index}
            priceSTAND={priceSTAND}
          />
        ))}
      </div>
    </DetailBlock>
  );
};

export default RoundDetail;
