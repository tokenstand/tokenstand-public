import { Token } from "@sushiswap/sdk";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import CurrencyLogo from "../../../../components/CurrencyLogo";
import { useIsDarkMode } from "../../../../state/user/hooks";
import { TextWarning } from "../../SwapHistory";
import OrderDetailMobile from "./OrderDetailMobile";
import NewTooltip from "../../../../components/NewTooltip";
import { toFixed, toFixedNumber } from "../../../../utils/decimalAdjust";
import { LimitOrderStatusEnum, LimitOrderStatusLabels } from "../../../../constants/limit-order-status";
import { FixedNumber } from "ethers";

const TableOrderActive = styled.div<{ tabTitle }>`
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.5fr 2fr 0.7fr 0.9fr 0.3fr;
  font-weight: 600;
  grid-gap: 28px 16px;
  font-size: 16px;
  margin-bottom: 20px;
  align-items: center;
`;

const YouPay = styled.div`
  display: grid;
  grid-template-columns: 0.2fr 1fr 0.1fr;
  align-items: center;
  grid-gap: 8px;
`;

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

const ContentPay = styled.div`
  .token-name {
    font-weight: 500;
    font-size: 12px;
    color: ${({ theme }) => theme.text6};
  }

  .token-amount {
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme.tabActive};
  }
`;

const Rate = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.text6};

  > div {
    display: flex;
  }
`;

const Filled = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText2};
`;

const Delete = styled.img`
  cursor: pointer;
`;

const Status = styled.div`
  color: ${({ status }) => (
    status === LimitOrderStatusEnum.COMPLETED
      ? '#72BF65'
      : status === LimitOrderStatusEnum.CANCELED
      ?'#EC5656'
      : '#FFD700'
  )};
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  > span {
    margin-right: 8px;
    white-space: nowrap;
  }
`;


const Expiration = styled(Filled)``;

export default function OrderDetail({ tabTitle, data, onOpenCancel }) {
  const { chainId } = useWeb3React();
  const darkMode = useIsDarkMode();

  const handleToken = (address, symbol) => {
    const token = new Token(chainId, address, 18, symbol);

    return (
      <StyleLogo className="flex items-center">
        <CurrencyLogo currency={token} size={"24px"} />
      </StyleLogo>
    );
  };
  const openCancelModal = (id) => {
    onOpenCancel(id);
  };

  const exclamationMark = () => {
    return (
      <svg
        style={{ marginLeft: '-6px' }}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-svg"
          d="M8 0.5C8.98491 0.5 9.96018 0.693993 10.8701 1.0709C11.7801 1.44781 12.6069 2.00026 13.3033 2.6967C13.9997 3.39314 14.5522 4.21993 14.9291 5.12987C15.306 6.03982 15.5 7.01509 15.5 8C15.5 8.98491 15.306 9.96018 14.9291 10.8701C14.5522 11.7801 13.9997 12.6069 13.3033 13.3033C12.6069 13.9997 11.7801 14.5522 10.8701 14.9291C9.96018 15.306 8.98491 15.5 8 15.5C6.01088 15.5 4.10322 14.7098 2.6967 13.3033C1.29018 11.8968 0.5 9.98912 0.5 8C0.5 6.01088 1.29018 4.10322 2.6967 2.6967C4.10322 1.29018 6.01088 0.5 8 0.5ZM8 1.75C6.3424 1.75 4.75269 2.40848 3.58058 3.58058C2.40848 4.75269 1.75 6.3424 1.75 8C1.75 9.6576 2.40848 11.2473 3.58058 12.4194C4.75269 13.5915 6.3424 14.25 8 14.25C9.6576 14.25 11.2473 13.5915 12.4194 12.4194C13.5915 11.2473 14.25 9.6576 14.25 8C14.25 6.3424 13.5915 4.75269 12.4194 3.58058C11.2473 2.40848 9.6576 1.75 8 1.75ZM8 10.5C8.24864 10.5 8.4871 10.5988 8.66291 10.7746C8.83873 10.9504 8.9375 11.1889 8.9375 11.4375C8.9375 11.6861 8.83873 11.9246 8.66291 12.1004C8.4871 12.2762 8.24864 12.375 8 12.375C7.75136 12.375 7.5129 12.2762 7.33709 12.1004C7.16127 11.9246 7.0625 11.6861 7.0625 11.4375C7.0625 11.1889 7.16127 10.9504 7.33709 10.7746C7.5129 10.5988 7.75136 10.5 8 10.5ZM8 3.625C8.14628 3.62495 8.28795 3.67621 8.40032 3.76986C8.5127 3.86351 8.58867 3.99361 8.615 4.1375L8.625 4.25V8.625C8.62529 8.78118 8.56709 8.93181 8.46186 9.04723C8.35664 9.16264 8.21202 9.23448 8.05647 9.24859C7.90093 9.26271 7.74574 9.21807 7.62146 9.12348C7.49718 9.02888 7.41283 8.89118 7.385 8.7375L7.375 8.625V4.25C7.375 4.08424 7.44085 3.92527 7.55806 3.80806C7.67527 3.69085 7.83424 3.625 8 3.625Z"
          fill="#667795"
        />
      </svg>
    );
  };

  return data.length > 0 ? (
    isMobile ? (
      <OrderDetailMobile data={data} tabTitle={tabTitle} onOpenCancel={onOpenCancel} />
    ) : (
      <>
        <TableOrderActive tabTitle={tabTitle}>
          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
            You Pay
          </div>
          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
          </div>
          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
            You Receive
          </div>
          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
            Rate
          </div>
          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
            Filled
          </div>
          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
            Expiration
          </div>

          <div className="text-left color-gray cursor-pointer flex items-center opacity-60">
            {tabTitle === "Active" ? "" : "Status"}
          </div>
          {data.map((order) => (
            <>
              <YouPay>
                {handleToken(
                  order.maker_asset_address,
                  order.maker_symbol_token.toUpperCase()
                )}

                <ContentPay>
                  <div className="token-name">
                    {order.maker_symbol_token.toUpperCase()}
                  </div>
                  <div className="token-amount">
                    <NewTooltip
                      dataValue={toFixedNumber(Number(order.maker_amount), 8)}
                      dataTip={Number(order.maker_amount)}
                    />
                  </div>
                </ContentPay>
              </YouPay>

              <img src={`/order-${darkMode}.png`} alt="" />

              <YouPay>
                {handleToken(
                  order.taker_asset_address,
                  order.taker_symbol_token.toUpperCase()
                )}

                <ContentPay>
                  <div className="token-name">
                    {order.taker_symbol_token.toUpperCase()}
                  </div>
                  <div className="token-amount">
                    <NewTooltip
                      dataValue={toFixedNumber(Number(order.taker_amount), 8)}
                      dataTip={Number(order.taker_amount)}
                    />
                  </div>
                </ContentPay>
              </YouPay>

              <Rate>
                <div>
                  <span>{" "}</span>
                  <span>1&nbsp;</span>
                  {order.maker_symbol_token.toUpperCase()}
                  <span>&nbsp;=&nbsp;</span>
                  <NewTooltip
                    dataValue={toFixedNumber(Number(order.maker_rate), 8)}
                    dataTip={FixedNumber.from(order.maker_rate).toString()}
                  />
                  <span>&nbsp;{order.taker_symbol_token.toUpperCase()}</span>
                </div>
                <div>
                  <span>{" "}</span>
                  <span>1&nbsp;</span>
                  {order.taker_symbol_token.toUpperCase()}
                  <span>&nbsp;=&nbsp;</span>
                  <NewTooltip
                    dataValue={toFixedNumber(Number(order.taker_rate), 8)}
                    dataTip={FixedNumber.from(order.taker_rate).toString()}
                  />
                  <span>&nbsp;{order.maker_symbol_token.toUpperCase()}</span>
                </div>
              </Rate>

              <Filled>{Number(order.filled || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 5})}%</Filled>

              <Expiration>
                <div>
                  {moment(Number(order.expires_in)).format(
                    "DD/MM/YYYY hh:mm:ss A"
                  )}
                </div>
              </Expiration>
              {tabTitle === "Active" ? (
                <Delete
                  src="/delete.png"
                  onClick={() => {
                    openCancelModal(order?.id);
                  }}
                />
              ) : (
                <Status status={order.status}>
                  <span>{LimitOrderStatusLabels[order.status]}</span>
                  {(moment().isBefore(moment(Number(order.expires_in))) ||
                    order.status !== LimitOrderStatusEnum.CANCELED) && (
                    <NewTooltip
                      dataTip={`\nSubmitted Date\n\n${moment(
                        order.updated_at
                      ).format('DD/MM/YYYY')}\n\n${moment(
                        order.updated_at
                      ).format('hh:mm:ss A')}\n`}
                      dataValue={exclamationMark()}
                    />
                  )}
                </Status>
              )}
            </>
          ))}
        </TableOrderActive>
      </>
    )
  ) : (
    <div className="flex flex-col items-center justify-center py-12">
      <TextWarning>
        Can&apos;t find {tabTitle === "Active" ? "active" : "history"} orders
      </TextWarning>
    </div>
  );
}
