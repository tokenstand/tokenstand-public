import React from "react";
import NewTooltip from "../../../components/NewTooltip";
import { formatAmount } from "../../../utils";
import { BlockItem } from "../NextDraw/ItemDetailDraw";

const RoundItemDtail = ({ type, dataDetail, priceSTAND }) => {
  let data = "";

  switch (type) {
    case 1:
      data = dataDetail?.match_1;
      break;
    case 2:
      data = dataDetail?.match_2;
      break;
    case 3:
      data = dataDetail?.match_3;
      break;
    case 4:
      data = dataDetail?.match_4;
      break;
    case 5:
      data = dataDetail?.match_5;
      break;
    case 6:
      data = dataDetail?.match_6;
      break;
    case 0:
      data = dataDetail?.burn;
      break;
  }

  return type === 0 ? (
    <BlockItem>
      <div className="text-first text-burn">Burn</div>
      <div className="text-second">
        <div className="text-second-child">
          <NewTooltip
            dataTip={formatAmount("" + JSON.parse(data), 0, 4)}
            dataValue={formatAmount("" + JSON.parse(data), 0, 4)}
          ></NewTooltip>
        </div>
        <span>STAND</span>
      </div>
      <div className="text-third">
        ${formatAmount(String(priceSTAND * JSON.parse(data)), 0, 4)}
      </div>
    </BlockItem>
  ) : (
    <BlockItem>
      <div className="text-first">
        {type === 1 && type + " Number Matched"}
        {type !== 1 && type + " Numbers Matched"}
      </div>
      <div className="text-second">
        <div className="text-second-child">
          <NewTooltip
            dataTip={formatAmount(JSON.parse(data)?.standAmount, 0, 4)}
            dataValue={formatAmount(JSON.parse(data)?.standAmount, 0, 4)}
          ></NewTooltip>
        </div>
        <span>STAND</span>
      </div>
      <div className="text-third">
        $
        {formatAmount(String(priceSTAND * JSON.parse(data)?.standAmount), 0, 4)}
      </div>
      <div className="text-third">
        {formatAmount(JSON.parse(data)?.standPerWinner, 0, 4)} STAND Each
      </div>

      <div className="text-third">
        {JSON.parse(data)?.winners || 0}{" "}
        {JSON.parse(data)?.winners > 1 ? "Winners" : "Winner"}
      </div>
    </BlockItem>
  );
};

export default RoundItemDtail;
