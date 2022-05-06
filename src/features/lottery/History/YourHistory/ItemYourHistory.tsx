import React from "react";
import { useIsDarkMode } from "../../../../state/user/hooks";
import { isMobile } from "react-device-detect";
import moment from "moment";

const ItemYourHistory = ({
  setShowDetail,
  itemRound,
  setRoundCheck,
}): JSX.Element => {
  const darkMode = useIsDarkMode();

  const amountTicketWinning = () => {
    let count = 0;
    for (let i = 0; i < itemRound?.ticket_status?.length; ++i) {
      if (itemRound?.ticket_status[i] === true) count++;
    }
    return count;
  };

  return (
    <>
      <div className="value">{itemRound?.round}</div>
      {!isMobile && (
        <div className="value">
          {moment(itemRound?.lottery_round?.endRoundTime * 1000).format(" MMM DD, YYYY HH:mm ")}
        </div>
      )}

      <div className="value">{itemRound?.ticket_detail.length} </div>
      <div className="value">{amountTicketWinning() === 0 ? "No" : "Yes"}</div>
      <div
        className="mt-2 cursor-pointer"
        onClick={() => {
          setRoundCheck(itemRound?.round);
          setShowDetail(true);
        }}
      >
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.788594 2.11973L4.66859 5.99973L0.788594 9.87973C0.398594 10.2697 0.398594 10.8997 0.788594 11.2897C1.17859 11.6797 1.80859 11.6797 2.19859 11.2897L6.78859 6.69973C7.17859 6.30973 7.17859 5.67973 6.78859 5.28973L2.19859 0.699727C1.80859 0.309727 1.17859 0.309727 0.788594 0.699727C0.408594 1.08973 0.398594 1.72973 0.788594 2.11973Z"
            fill={darkMode ? "rgba(255, 255, 255)" : "#001C4E"}
            fillOpacity="0.6"
          />
        </svg>
      </div>
    </>
  );
};
export default ItemYourHistory;
